import { PATHS } from "../constants";
import { BusinessClassification } from "../models/business-classifications/BusinessClassification";
import { BusinessClassifications } from "../models/business-classifications/BusinessClassifications";
import { BaseApi } from "./BaseApi";

export class BusinessClassificationsApi extends BaseApi {
    /**
     * Get a single business classification that contains an embedded list of industry classifications that can be used
     * when {@link CustomersApi.createVerifiedBusiness|creating a verified business customer record}.
     * @param id - The ID of the business classification that should be returned
     * @return - The business classification, if the request was successful
     * @see {@link https://developers.dwolla.com/api-reference/customers/retrieve-business-classification|Retrieve Business Classification - Dwolla Documentation}
     */
    async get(id: string): Promise<BusinessClassification> {
        return (await this.getClient().getMapped(BusinessClassification, `${PATHS.BUSINESS_CLASSIFICATIONS}/${id}`))
            .body;
    }

    /**
     * Get a list of business classifications that contains an embedded list of industry classifications that can be
     * used when {@link CustomersApi.createVerifiedBusiness|creating a verified business customer record}.
     * @return - A list of business classifications, with further embedded industry classifications
     * @see {@link https://developers.dwolla.com/api-reference/customers/list-business-classifications|List Business Classifications - Dwolla Documentation}
     */
    async list(): Promise<BusinessClassifications> {
        return (await this.getClient().getMapped(BusinessClassifications, PATHS.BUSINESS_CLASSIFICATIONS)).body;
    }
}
