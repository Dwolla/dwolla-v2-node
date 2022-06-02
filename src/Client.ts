import { ClassConstructor } from "class-transformer";
import { AccountsApi } from "./api/AccountsApi";
import { BeneficialOwnersApi } from "./api/BeneficialOwnersApi";
import { BusinessClassificationsApi } from "./api/BusinessClassificationsApi";
import { CustomersApi } from "./api/CustomersApi";
import { DocumentsApi } from "./api/DocumentsApi";
import { RootApi } from "./api/RootApi";
import { Auth } from "./Auth";
import getEnvironment, { Environment } from "./environment";
import { HalResource } from "./models/HalResource";
import { PathLike, RequestHeaders, RequestQuery, Response } from "./Token";
import { TokenManager } from "./TokenManager";
import { RequireAtLeastOne } from "./types/RequireAtLeastOne";

interface BaseClientOptions {
    environment?: "production" | "sandbox";
    id?: string;
    key?: string;
    secret: string;
}

export type ClientOptions = RequireAtLeastOne<BaseClientOptions, "id" | "key">;

export class Client {
    readonly api = {
        accounts: new AccountsApi(this),
        beneficialOwners: new BeneficialOwnersApi(this),
        businessClassifications: new BusinessClassificationsApi(this),
        customers: new CustomersApi(this),
        documents: new DocumentsApi(this),
        root: new RootApi(this)
    } as const;

    readonly auth: Auth;
    readonly options: ClientOptions;
    private readonly tokenManager: TokenManager;

    constructor(options: ClientOptions) {
        this.auth = new Auth(this);
        this.options = options;
        this.tokenManager = new TokenManager(this);
    }

    async delete(path: PathLike, query?: RequestQuery, headers?: RequestHeaders): Promise<Response> {
        return (await this.tokenManager.getToken()).delete(path, query, headers);
    }

    async deleteMapped<TResult extends HalResource>(
        deserializeAs: ClassConstructor<TResult>,
        path: PathLike,
        query?: RequestQuery,
        headers?: RequestHeaders
    ): Promise<Response<TResult>> {
        return (await this.tokenManager.getToken()).delete(path, query, headers, deserializeAs);
    }

    async get(path: PathLike, query?: RequestQuery, headers?: RequestHeaders): Promise<Response> {
        return (await this.tokenManager.getToken()).get(path, query, headers);
    }

    get environment(): Environment {
        return getEnvironment(this.options.environment);
    }

    async getMapped<TResult extends HalResource>(
        deserializeAs: ClassConstructor<TResult>,
        path: PathLike,
        query?: RequestQuery,
        headers?: RequestHeaders
    ): Promise<Response<TResult>> {
        return (await this.tokenManager.getToken()).get(path, query, headers, deserializeAs);
    }

    async post<TBody>(path: PathLike, body?: TBody, headers?: RequestHeaders): Promise<Response> {
        return (await this.tokenManager.getToken()).post(path, body, headers);
    }

    async postFollow<TBody>(path: PathLike, body?: TBody, headers?: RequestHeaders): Promise<Response> {
        return (await this.tokenManager.getToken()).postFollow(path, body, headers);
    }

    async postFollowMapped<TBody, TResult extends HalResource = any>(
        deserializeAs: ClassConstructor<TResult>,
        path: PathLike,
        body?: TBody,
        headers?: RequestHeaders
    ): Promise<Response<TResult>> {
        return (await this.tokenManager.getToken()).postFollow(path, body, headers, deserializeAs);
    }

    async postMapped<TBody, TResult extends HalResource = any>(
        deserializeAs: ClassConstructor<TResult>,
        path: PathLike,
        body?: TBody,
        headers?: RequestHeaders
    ): Promise<Response<TResult>> {
        return (await this.tokenManager.getToken()).post(path, body, headers, deserializeAs);
    }
}
