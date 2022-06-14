import { PATHS } from "../constants";
import { BusinessClassification, BusinessClassifications } from "../models";
import { BaseApi } from "./BaseApi";

export class BusinessClassificationsApi extends BaseApi {
    /**
     * Get a single business classification that contains an embedded list of industry classifications that can be used
     * when {@link CustomersApi.createVerifiedBusiness|creating a verified business customer record}.
     * @param id - The ID of the business classification that should be returned
     * @returns - The business classification, if the request was successful
     * @see {@link https://developers.dwolla.com/api-reference/customers/retrieve-business-classification|Retrieve Business Classification - Dwolla Documentation}
     */
    async get(id: string): Promise<BusinessClassification> {
        return (await this.client.getMapped(BusinessClassification, this.buildUrl(PATHS.BUSINESS_CLASSIFICATIONS, id)))
            .body;
    }

    /**
     * Get a list of business classifications that contains an embedded list of industry classifications that can be
     * used when {@link CustomersApi.createVerifiedBusiness|creating a verified business customer record}.
     * @returns - A list of business classifications, with further embedded industry classifications
     * @see {@link https://developers.dwolla.com/api-reference/customers/list-business-classifications|List Business Classifications - Dwolla Documentation}
     */
    async list(): Promise<BusinessClassifications> {
        return (await this.client.getMapped(BusinessClassifications, PATHS.BUSINESS_CLASSIFICATIONS)).body;
    }
}
