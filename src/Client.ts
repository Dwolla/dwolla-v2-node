import { TargetMap } from "class-transformer";
import {
    AccountsApi,
    BeneficialOwnersApi,
    BusinessClassificationsApi,
    CustomersApi,
    DocumentsApi,
    FundingSourcesApi,
    RootApi,
    TransfersApi
} from "./api";
import { Auth } from "./Auth";
import getEnvironment, { Environment } from "./environment";
import { Deserializable, PathLike, RequestHeaders, RequestQuery, Response } from "./Token";
import { TokenManager } from "./TokenManager";
import { RequireAtLeastOne } from "./types";

interface BaseClientOptions {
    environment?: Environment | "production" | "sandbox";
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
        fundingSources: new FundingSourcesApi(this),
        root: new RootApi(this),
        transfers: new TransfersApi(this)
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

    async deleteMapped<ResultType>(
        deserializeAs: Deserializable<ResultType>,
        path: PathLike,
        query?: RequestQuery,
        headers?: RequestHeaders,
        targetMaps?: TargetMap[]
    ): Promise<Response<ResultType>> {
        return (await this.tokenManager.getToken()).delete(path, query, headers, { deserializeAs, targetMaps });
    }

    async get(path: PathLike, query?: RequestQuery, headers?: RequestHeaders): Promise<Response> {
        return (await this.tokenManager.getToken()).get(path, query, headers);
    }

    get environment(): Environment {
        return getEnvironment(this.options.environment);
    }

    async getMapped<ResultType>(
        deserializeAs: Deserializable<ResultType>,
        path: PathLike,
        query?: RequestQuery,
        headers?: RequestHeaders,
        targetMaps?: TargetMap[]
    ): Promise<Response<ResultType>> {
        return (await this.tokenManager.getToken()).get(path, query, headers, { deserializeAs, targetMaps });
    }

    async post<BodyType>(path: PathLike, body?: BodyType, headers?: RequestHeaders): Promise<Response> {
        return (await this.tokenManager.getToken()).post(path, body, headers);
    }

    async postFollow<BodyType>(path: PathLike, body?: BodyType, headers?: RequestHeaders): Promise<Response> {
        return (await this.tokenManager.getToken()).postFollow(path, body, headers);
    }

    async postFollowMapped<BodyType, ResultType>(
        deserializeAs: Deserializable<ResultType>,
        path: PathLike,
        body?: BodyType,
        headers?: RequestHeaders,
        targetMaps?: TargetMap[]
    ): Promise<Response<ResultType>> {
        return (await this.tokenManager.getToken()).postFollow(path, body, headers, { deserializeAs, targetMaps });
    }

    async postMapped<BodyType, ResultType>(
        deserializeAs: Deserializable<ResultType>,
        path: PathLike,
        body?: BodyType,
        headers?: RequestHeaders,
        targetMaps?: TargetMap[]
    ): Promise<Response<ResultType>> {
        return (await this.tokenManager.getToken()).post(path, body, headers, { deserializeAs, targetMaps });
    }
}
