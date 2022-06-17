import formUrlEncoded from "form-urlencoded";
import fetch, { Headers, Response as FetchResponse } from "node-fetch";
import { Client } from "./client";
import { isFormData, rejectEmptyKeys, userAgent } from "./utils";
import { AuthResponse } from "./auth";
import { TokenState } from "./token-manager";

export interface Response {
    body: any;
    headers: Headers;
    status: number;
}

type DwollaResponse = Response;

type ExtendedHeaders = {
    Authorization: string;
    Accept: string;
    "User-Agent": string;
} & RequestHeaders;

export type ResponseError = Error & Response;

export type RequestHeaders = {
    "Idempotency-Key"?: string;
} & {
    [key: string]: string;
};

export type RequestPath<T extends { _links: { self: { href: string } } } = any> = T | string;

export type RequestQuery = {
    [key: string]: string;
};

export class Token {
    readonly #client: Client;
    readonly #state: TokenState;

    constructor(client: Client, state: TokenState) {
        this.#client = client;
        this.#state = state;
    }

    async delete(path: RequestPath, query?: RequestQuery, headers?: RequestHeaders): Promise<DwollaResponse> {
        const rawResponse: FetchResponse = await fetch(this.#getUrl(path, query), {
            method: "DELETE",
            headers: this.#getHeaders(headers)
        });

        const parsedResponse: Response = await this.#parseResponse(rawResponse);

        if (parsedResponse.status >= 400) {
            throw this.#errorFrom(parsedResponse);
        }
        return parsedResponse;
    }

    #errorFrom(parsedResponse: DwollaResponse): ResponseError {
        const error: ResponseError = new Error(parsedResponse.body) as ResponseError;
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
        return this.#state;
    }

    #getHeaders(additionalHeaders?: RequestHeaders): ExtendedHeaders {
        return Object.assign(
            {
                Authorization: ["Bearer", this.#state.accessToken].join(" "),
                Accept: "application/vnd.dwolla.v1.hal+json",
                "User-Agent": userAgent()
            } as ExtendedHeaders,
            additionalHeaders
        );
    }

    async get(path: RequestPath, query?: RequestQuery, headers?: RequestHeaders): Promise<DwollaResponse> {
        const rawResponse: FetchResponse = await fetch(this.#getUrl(path, query), {
            headers: this.#getHeaders(headers)
        });

        const parsedResponse: Response = await this.#parseResponse(rawResponse);

        if (parsedResponse.status >= 400) {
            throw this.#errorFrom(parsedResponse);
        }
        return parsedResponse;
    }

    #getUrl(suppliedPath: RequestPath, suppliedQuery?: RequestQuery): string {
        let url: string;

        if (typeof suppliedPath === "object") {
            url = suppliedPath._links.self.href;
        } else if (suppliedPath.startsWith(this.#client.environment.apiUrl)) {
            url = suppliedPath;
        } else if (suppliedPath.startsWith("/")) {
            url = [this.#client.environment.apiUrl, suppliedPath].join("");
        } else {
            url = [this.#client.environment.apiUrl, suppliedPath.replace(/^https?:\/\/[^/]*\//, "")].join("/");
        }

        const query: string = formUrlEncoded(rejectEmptyKeys(suppliedQuery), {
            skipBracket: true,
            skipIndex: true
        });
        return query ? [url, query].join("?") : url;
    }

    async #parseResponse(response: FetchResponse): Promise<DwollaResponse> {
        const rawBody: string = await response.text();
        let parsedBody: any;

        try {
            parsedBody = JSON.parse(rawBody);
        } catch (err) {
            parsedBody = rawBody;
        }

        return {
            body: parsedBody,
            headers: response.headers,
            status: response.status
        };
    }

    async post(path: RequestPath, body?: any, headers?: RequestHeaders): Promise<DwollaResponse> {
        const rawResponse: FetchResponse = await fetch(this.#getUrl(path), {
            method: "POST",
            headers: Object.assign(
                this.#getHeaders(headers),
                isFormData(body) ? body.getHeaders() : { "Content-Type": "application/json" }
            ),
            body: isFormData(body) ? body : JSON.stringify(body)
        });

        const parsedResponse: Response = await this.#parseResponse(rawResponse);

        if (parsedResponse.status >= 400) {
            throw this.#errorFrom(parsedResponse);
        }
        return parsedResponse;
    }
}
