import { Auth } from "./auth";
import getEnvironment, { Environment } from "./environment";
import { TokenManager } from "./token-manager";
import { RequestHeaders, RequestPath, RequestQuery, Response } from "./token";

interface BaseClientOptions {
    environment?: "production" | "sandbox";
    id?: string;
    key?: string;
    secret: string;
}

export type ClientOptions = RequireAtLeastOne<BaseClientOptions, "id" | "key">;

export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
    { [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>> }[Keys];

export class Client {
    readonly #auth: Auth;
    readonly #options: ClientOptions;
    readonly #tokenManager: TokenManager;

    constructor(options: ClientOptions) {
        this.#auth = new Auth(this);
        this.#options = options;
        this.#tokenManager = new TokenManager(this);
    }

    async delete(path: RequestPath, query?: RequestQuery, headers?: RequestHeaders): Promise<Response> {
        return (await this.#tokenManager.getToken()).delete(path, query, headers);
    }

    async get(path: RequestPath, query?: RequestQuery, headers?: RequestHeaders): Promise<Response> {
        return (await this.#tokenManager.getToken()).get(path, query, headers);
    }

    get auth(): Auth {
        return this.#auth;
    }

    get environment(): Environment {
        return getEnvironment(this.#options.environment);
    }

    get options(): ClientOptions {
        return this.#options;
    }

    async post(path: RequestPath, body?: any, headers?: RequestHeaders): Promise<Response> {
        return (await this.#tokenManager.getToken()).post(path, body, headers);
    }
}
