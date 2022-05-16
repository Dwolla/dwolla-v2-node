import { ClassConstructor } from "class-transformer";
import "reflect-metadata";
import { Api } from "./api/api";
import { Auth } from "./auth";
import getEnvironment, { Environment } from "./environment";
import { HalResource } from "./models/base-hal";
import { PathLike, RequestHeaders, RequestQuery, Response } from "./token";
import { TokenManager } from "./token-manager";

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
    readonly api: Api;
    readonly auth: Auth;
    readonly options: ClientOptions;
    private readonly tokenManager: TokenManager;

    constructor(options: ClientOptions) {
        this.api = new Api(this);
        this.auth = new Auth(this);
        this.options = options;
        this.tokenManager = new TokenManager(this);
    }

    async delete(path: PathLike, query?: RequestQuery, headers?: RequestHeaders): Promise<Response> {
        return this.deleteMapped(path, query, headers);
    }

    async deleteMapped<TResult extends HalResource>(
        path: PathLike,
        query?: RequestQuery,
        headers?: RequestHeaders,
        mappedType?: ClassConstructor<TResult>
    ): Promise<Response<TResult>> {
        return (await this.tokenManager.getToken()).delete(path, query, headers, mappedType);
    }

    async get(path: PathLike, query?: RequestQuery, headers?: RequestHeaders): Promise<Response> {
        return this.getMapped(path, query, headers);
    }

    get environment(): Environment {
        return getEnvironment(this.options.environment);
    }

    async getMapped<TResult extends HalResource>(
        path: PathLike,
        query?: RequestQuery,
        headers?: RequestHeaders,
        mappedType?: ClassConstructor<TResult>
    ): Promise<Response<TResult>> {
        return (await this.tokenManager.getToken()).get(path, query, headers, mappedType);
    }

    async post<TBody>(path: PathLike, body?: TBody, headers?: RequestHeaders): Promise<Response> {
        return this.postMapped(path, body, headers);
    }

    async postMapped<TBody, TResult extends HalResource = any>(
        path: PathLike,
        body?: TBody,
        headers?: RequestHeaders,
        mappedType?: ClassConstructor<TResult>
    ): Promise<Response<TResult>> {
        return (await this.tokenManager.getToken()).post(path, body, headers, mappedType);
    }
}
