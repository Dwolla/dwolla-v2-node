import { ClassConstructor, plainToInstance } from "class-transformer";
import FormData from "form-data";
import formUrlEncoded from "form-urlencoded";
import fetch, { Headers, Response as FetchResponse } from "node-fetch";
import { AuthResponse } from "./auth";
import { Client } from "./client";
import { HalResource } from "./models/base-hal";
import { TokenState } from "./token-manager";
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

export type ResponseError<TResult extends HalResource = any> = Error & Response<TResult>;

export type RequestQuery = {
    [key: string]: string;
};

export class Token {
    constructor(private readonly client: Client, private readonly tokenState: TokenState) {}

    async delete<TResult extends HalResource>(
        path: PathLike,
        query?: RequestQuery,
        headers?: RequestHeaders,
        mappedType?: ClassConstructor<TResult>
    ): Promise<Response<TResult>> {
        const rawResponse: FetchResponse = await fetch(this.getUrl(path, query), {
            method: "DELETE",
            headers: this.getHeaders(headers)
        });

        const parsedResponse: Response<TResult> = await this.parseResponse(rawResponse, mappedType);

        if (parsedResponse.status >= 400) {
            throw this.errorFrom(parsedResponse);
        }
        return parsedResponse;
    }

    private errorFrom<TResult extends HalResource>(parsedResponse: Response<TResult>): ResponseError<TResult> {
        const error: ResponseError<TResult> = new Error(parsedResponse.body as any) as ResponseError<TResult>;
        error.body = parsedResponse.body;
        error.headers = parsedResponse.headers;
        error.status = parsedResponse.status;
        return error;
    }

    static fromResponse(client: Client, response: AuthResponse): Token {
        return new Token(client, {
            accessToken: response.accessToken,
            expiresIn: response.expiresIn,
            tokenType: response.tokenType
        });
    }

    get state(): TokenState {
        return this.tokenState;
    }

    private getHeaders(additionalHeaders?: RequestHeaders): ExtendedHeaders {
        return {
            Authorization: ["Bearer", this.tokenState.accessToken].join(" "),
            Accept: "application/vnd.dwolla.v1.hal+json",
            "User-Agent": userAgent(),
            ...additionalHeaders
        };
    }

    async get<TResult extends HalResource>(
        path: PathLike,
        query?: RequestQuery,
        headers?: RequestHeaders,
        mappedType?: ClassConstructor<TResult>
    ): Promise<Response<TResult>> {
        const rawResponse: FetchResponse = await fetch(this.getUrl(path, query), {
            headers: this.getHeaders(headers)
        });

        const parsedResponse: Response<TResult> = await this.parseResponse(rawResponse, mappedType);

        if (parsedResponse.status >= 400) {
            throw this.errorFrom(parsedResponse);
        }
        return parsedResponse;
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

    private async parseResponse<TResult extends HalResource>(
        response: FetchResponse,
        mappedType?: ClassConstructor<TResult>
    ): Promise<Response<TResult>> {
        const rawBody: string = await response.text();
        let parsedBody: any;

        try {
            parsedBody = JSON.parse(rawBody);
        } catch (err) {
            parsedBody = rawBody;
        }

        return {
            body: mappedType
                ? plainToInstance(mappedType, parsedBody, {
                      enableImplicitConversion: true,
                      excludeExtraneousValues: true
                  })
                : parsedBody,
            headers: response.headers,
            status: response.status
        };
    }

    async post<TBody, TResult extends HalResource = any>(
        path: PathLike,
        body?: TBody,
        headers?: RequestHeaders,
        mappedType?: ClassConstructor<TResult>
    ): Promise<Response<TResult>> {
        const rawResponse: FetchResponse = await fetch(this.getUrl(path), {
            method: "POST",
            headers: {
                ...this.getHeaders(headers),
                ...(body instanceof FormData ? body.getHeaders() : { "Content-Type": "application/json" })
            },
            body: body instanceof FormData ? body : JSON.stringify(body)
        });

        const parsedResponse: Response<TResult> = await this.parseResponse(rawResponse, mappedType);

        if (parsedResponse.status >= 400) {
            throw this.errorFrom(parsedResponse);
        }
        return parsedResponse;
    }
}
