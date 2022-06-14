import {
    ClassConstructor,
    ClassTransformOptions,
    plainToClassFromExist,
    plainToInstance,
    TargetMap
} from "class-transformer";
import FormData from "form-data";
import formUrlEncoded from "form-urlencoded";
import fetch, { Headers, Response as FetchResponse } from "node-fetch";
import { AuthResponse } from "./Auth";
import { Client } from "./Client";
import { HEADERS } from "./constants";
import { DwollaError, ResponseError } from "./errors";
import { TokenState } from "./TokenManager";
import { rejectEmptyKeys, userAgent } from "./utils";

export interface DeserializeOptions<ResultType> {
    deserializeAs?: Deserializable<ResultType>;
    targetMaps?: TargetMap[];
}

export interface Response<BodyType = any> {
    body: BodyType;
    headers: Headers;
    status: number;
}

export type Deserializable<ResultType> = ClassConstructor<ResultType> | ResultType;

export type PathLike<PathType extends { _links: { self: { href: string } } } = any> = PathType | string;

export type RequestHeaders = { "Idempotency-Key"?: string } & { [key: string]: string };

export type RequestQuery = { [key: string]: any };

export class Token {
    constructor(private readonly client: Client, private readonly tokenState: TokenState) {}

    async delete<ResultType>(
        path: PathLike,
        query?: RequestQuery,
        headers?: RequestHeaders,
        deserializeOptions?: DeserializeOptions<ResultType>
    ): Promise<Response<ResultType>> {
        const rawResponse: FetchResponse = await fetch(this.getUrl(path, query), {
            method: "DELETE",
            headers: this.getHeaders(headers)
        });

        const { parsedResponse, unmappedResponse } = await this.parseResponse(rawResponse, deserializeOptions);

        if (parsedResponse.status >= 400) {
            throw new ResponseError(unmappedResponse ?? parsedResponse);
        }
        return parsedResponse;
    }

    private follow<ResultType>(
        response: Response,
        deserializeOptions?: DeserializeOptions<ResultType>
    ): Promise<Response<ResultType>> {
        const location: string | null = response.headers.get(HEADERS.LOCATION);
        if (!location) throw new DwollaError("Cannot follow URL, Location header is missing");
        return this.get(location, undefined, undefined, deserializeOptions);
    }

    static fromResponse(client: Client, response: AuthResponse): Token {
        return new Token(client, {
            accessToken: response.accessToken,
            expiresIn: response.expiresIn,
            tokenType: response.tokenType
        });
    }

    async get<ResultType>(
        path: PathLike,
        query?: RequestQuery,
        headers?: RequestHeaders,
        deserializeOptions?: DeserializeOptions<ResultType>
    ): Promise<Response<ResultType>> {
        const rawResponse: FetchResponse = await fetch(this.getUrl(path, query), {
            headers: this.getHeaders(headers)
        });

        const { parsedResponse, unmappedResponse } = await this.parseResponse(rawResponse, deserializeOptions);

        if (parsedResponse.status >= 400) {
            throw new ResponseError(unmappedResponse ?? parsedResponse);
        }
        return parsedResponse;
    }

    private getHeaders(
        additionalHeaders?: RequestHeaders
    ): { Authorization: string; Accept: string; "User-Agent": string } & RequestHeaders {
        return {
            Authorization: ["Bearer", this.tokenState.accessToken].join(" "),
            Accept: "application/vnd.dwolla.v1.hal+json",
            "User-Agent": userAgent(),
            ...additionalHeaders
        };
    }

    get state(): TokenState {
        return this.tokenState;
    }

    private getUrl(suppliedPath: PathLike, suppliedQuery?: RequestQuery): string {
        let url: string;

        if (typeof suppliedPath === "object") {
            url = suppliedPath._links.self.href;
        } else if (suppliedPath.indexOf(this.client.environment.apiUrl) === 0) {
            url = suppliedPath;
        } else if (suppliedPath.indexOf("/") === 0) {
            url = [this.client.environment.apiUrl, suppliedPath].join("");
        } else {
            url = [this.client.environment.apiUrl, suppliedPath.replace(/^https?:\/\/[^/]*\//, "")].join("/");
        }

        const query: string = formUrlEncoded(rejectEmptyKeys(suppliedQuery || {}), {
            skipBracket: true,
            skipIndex: true
        });
        return query ? [url, query].join("?") : url;
    }

    /**
     * Parses {@link FetchResponse} from `node-fetch` into a Dwolla {@link Response}.
     *
     * This method may sometimes return more than one property. If {@link deserializeOptions.deserializeAs} is not
     * present, then only one property will ever return — {@link parsedResponse}; however, if
     * {@link deserializeOptions.deserializeAs} is present, then both {@link parsedResponse} and
     * {@link unmappedResponse} will return.
     *
     * When a mapped response returns with both properties, {@link parsedResponse}, which is the response mapped to the
     * specified class, should be used for successful response, whereas {@link unmappedResponse} should be used when an
     * error occurred.
     *
     * @param response - The raw response from `node-fetch` that will get parsed
     * @param deserializeOptions - The deserialization options for the response, such as what class the object should
     * get serialized to if not a plain JS object
     *
     * @returns The parsed response from `node-fetch` into a Dwolla response that can be inspected or manipulated
     */
    private async parseResponse<ResultType>(
        response: FetchResponse,
        deserializeOptions?: DeserializeOptions<ResultType>
    ): Promise<{ parsedResponse: Response<ResultType>; unmappedResponse?: Response<ResultType> }> {
        const rawBody: string = await response.text();
        let parsedBody: any;
        let unmappedBody: any;

        try {
            parsedBody = JSON.parse(rawBody);

            if (deserializeOptions?.deserializeAs) {
                unmappedBody = parsedBody;

                const parseOptions: ClassTransformOptions = {
                    enableImplicitConversion: true,
                    excludeExtraneousValues: true,
                    targetMaps: deserializeOptions.targetMaps
                };

                if (typeof deserializeOptions.deserializeAs === "object") {
                    parsedBody = plainToClassFromExist(deserializeOptions.deserializeAs, unmappedBody, parseOptions);
                } else {
                    parsedBody = plainToInstance(
                        deserializeOptions.deserializeAs as ClassConstructor<ResultType>,
                        unmappedBody,
                        parseOptions
                    );
                }
            }
        } catch (err) {
            parsedBody = rawBody;
        }

        const parsedResponse: Response<ResultType> = {
            body: parsedBody,
            headers: response.headers,
            status: response.status
        };

        let unmappedResponse: Response<ResultType> | undefined;

        if (deserializeOptions?.deserializeAs) {
            unmappedResponse = {
                body: unmappedBody,
                headers: response.headers,
                status: response.status
            };
        }
        return { parsedResponse, unmappedResponse };
    }

    async post<BodyType, ResultType>(
        path: PathLike,
        body?: BodyType,
        headers?: RequestHeaders,
        deserializeOptions?: DeserializeOptions<ResultType>
    ): Promise<Response<ResultType>> {
        const rawResponse: FetchResponse = await fetch(this.getUrl(path), {
            method: "POST",
            headers: {
                ...this.getHeaders(headers),
                ...(body instanceof FormData ? body.getHeaders() : { "Content-Type": "application/json" })
            },
            body: body instanceof FormData ? body : JSON.stringify(body)
        });

        const { parsedResponse, unmappedResponse } = await this.parseResponse(rawResponse, deserializeOptions);

        if (parsedResponse.status >= 400) {
            throw new ResponseError(unmappedResponse ?? parsedResponse);
        }
        return parsedResponse;
    }

    async postFollow<BodyType, ResultType>(
        path: PathLike,
        body?: BodyType,
        headers?: RequestHeaders,
        deserializeOptions?: DeserializeOptions<ResultType>
    ): Promise<Response<ResultType>> {
        // If we're testing, don't follow the location; tests will return 200 instead of 201
        if (process.env.NODE_ENV === "test") {
            return await this.post(path, body, headers, deserializeOptions);
        }
        return this.follow(await this.post(path, body, headers), deserializeOptions);
    }
}
