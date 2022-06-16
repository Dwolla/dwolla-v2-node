import { PATHS } from "../constants";
import { OnDemandAuthorization } from "../models";
import { BaseApi } from "./BaseApi";

export class OnDemandAuthorizations extends BaseApi {
    async create(): Promise<OnDemandAuthorization> {
        return (await this.client.postMapped(OnDemandAuthorization, this.buildUrl(PATHS.ON_DEMAND_AUTHORIZATIONS)))
            .body;
    }
}
