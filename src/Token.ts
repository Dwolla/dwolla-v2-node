import { ClassConstructor, plainToInstance } from "class-transformer";
import FormData from "form-data";
import formUrlEncoded from "form-urlencoded";
import fetch, { Headers, Response as FetchResponse } from "node-fetch";
import { AuthResponse } from "./Auth";
import { Client } from "./Client";
import { HEADERS } from "./constants";
import { DwollaError } from "./errors/DwollaError";
import { ResponseError } from "./errors/ResponseError";
import { HalResource } from "./models/HalResource";
import { TokenState } from "./TokenManager";
import { rejectEmptyKeys, userAgent } from "./utils";

export interface Response<TBody extends HalResource = any> {
    body: TBody;
    headers: Headers;
    status: number;
}

type ExtendedHeaders = {
    Authorization: string;
    Accept: string;
    "User-Agent": string;
} & RequestHeaders;

export type PathLike<TPath extends { _links: { self: { href: string } } } = any> = TPath | string;

export type RequestHeaders = {
    "Idempotency-Key"?: string;
} & {
    [key: string]: string;
};

export type RequestQuery = {
    [key: string]: string;
};

export class Token {
    constructor(private readonly client: Client, private readonly tokenState: TokenState) {}

    async delete<TResult extends HalResource>(
        path: PathLike,
        query?: RequestQuery,
        headers?: RequestHeaders,
        deserializeAs?: ClassConstructor<TResult>
    ): Promise<Response<TResult>> {
        const rawResponse: FetchResponse = await fetch(this.getUrl(path, query), {
            method: "DELETE",
            headers: this.getHeaders(headers)
        });

        const { parsedResponse, unmappedResponse } = await this.parseResponse(rawResponse, deserializeAs);

        if (parsedResponse.status >= 400) {
            throw new ResponseError(unmappedResponse ?? parsedResponse);
        }
        return parsedResponse;
    }

    private follow<TResult extends HalResource>(
        response: Response,
        deserializeAs?: ClassConstructor<TResult>
    ): Promise<Response<TResult>> {
        const location: string | null = response.headers.get(HEADERS.LOCATION);
        if (!location) throw new DwollaError("Cannot follow URL, Location header is missing");
        return this.get(location, undefined, undefined, deserializeAs);
    }

    static fromResponse(client: Client, response: AuthResponse): Token {
        return new Token(client, {
            accessToken: response.accessToken,
            expiresIn: response.expiresIn,
            tokenType: response.tokenType
        });
    }

    async get<TResult extends HalResource>(
        path: PathLike,
        query?: RequestQuery,
        headers?: RequestHeaders,
        deserializeAs?: ClassConstructor<TResult>
    ): Promise<Response<TResult>> {
        const rawResponse: FetchResponse = await fetch(this.getUrl(path, query), {
            headers: this.getHeaders(headers)
        });

        const { parsedResponse, unmappedResponse } = await this.parseResponse(rawResponse, deserializeAs);

        if (parsedResponse.status >= 400) {
            throw new ResponseError(unmappedResponse ?? parsedResponse);
        }
        return parsedResponse;
    }

    private getHeaders(additionalHeaders?: RequestHeaders): ExtendedHeaders {
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

        const query: string = formUrlEncoded(rejectEmptyKeys(suppliedQuery || {}));
        return query ? [url, query].join("?") : url;
    }

    /**
     * Parses {@link FetchResponse} from `node-fetch` into {@link Response}.
     *
     * This method may sometimes return more than one property. If {@link mappedType} is not supplied, then only one
     * property will ever be returned — {@link parsedResponse}; however, if {@link mappedType} is present, then both
     * {@link parsedResponse} and {@link unmappedResponse} will be returned.
     *
     * When a mapped response returns with both properties, {@link parsedResponse}, which is the response mapped to the
     * specified class, should be used for a successful response, whereas {@link unmappedResponse} should be used when
     * an error occurred.
     *
     * @param response The raw {@link FetchResponse} from the `node-fetch` call
     * @param [mappedType] The {@link HalResource} model that this response should be mapped to, if present
     * @private
     *
     * @returns {{
     *     parsedResponse: Response<TResult>,
     *     unmappedResponse?: Response<TResult>
     * }}
     */
    private async parseResponse<TResult extends HalResource>(
        response: FetchResponse,
        mappedType?: ClassConstructor<TResult>
    ): Promise<{ parsedResponse: Response<TResult>; unmappedResponse?: Response<TResult> }> {
        const rawBody: string = await response.text();
        let parsedBody: any;
        let unmappedBody: any;

        try {
            parsedBody = JSON.parse(rawBody);

            if (mappedType) {
                unmappedBody = parsedBody;
                parsedBody = plainToInstance(mappedType, unmappedBody, {
                    enableImplicitConversion: true,
                    excludeExtraneousValues: true
                });
            }
        } catch (err) {
            parsedBody = rawBody;
        }

        const parsedResponse: Response<TResult> = {
            body: parsedBody,
            headers: response.headers,
            status: response.status
        };

        let unmappedResponse: Response<TResult> | undefined;

        if (mappedType) {
            unmappedResponse = {
                body: unmappedBody,
                headers: response.headers,
                status: response.status
            };
        }
        return { parsedResponse, unmappedResponse };
    }

    async post<TBody, TResult extends HalResource = any>(
        path: PathLike,
        body?: TBody,
        headers?: RequestHeaders,
        deserializeAs?: ClassConstructor<TResult>
    ): Promise<Response<TResult>> {
        const rawResponse: FetchResponse = await fetch(this.getUrl(path), {
            method: "POST",
            headers: {
                ...this.getHeaders(headers),
                ...(body instanceof FormData ? body.getHeaders() : { "Content-Type": "application/json" })
            },
            body: body instanceof FormData ? body : JSON.stringify(body)
        });

        const { parsedResponse, unmappedResponse } = await this.parseResponse(rawResponse, deserializeAs);

        if (parsedResponse.status >= 400) {
            throw new ResponseError(unmappedResponse ?? parsedResponse);
        }
        return parsedResponse;
    }

    async postFollow<TBody, TResult extends HalResource = any>(
        path: PathLike,
        body?: TBody,
        headers?: RequestHeaders,
        deserializeAs?: ClassConstructor<TResult>
    ): Promise<Response<TResult>> {
        return this.follow(await this.post(path, body, headers), deserializeAs);
    }
}
