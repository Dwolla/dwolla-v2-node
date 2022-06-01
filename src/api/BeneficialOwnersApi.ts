import { PATHS } from "../constants";
import { BeneficialOwner } from "../models/beneficial-owners/BeneficialOwner";
import { BeneficialOwners } from "../models/beneficial-owners/BeneficialOwners";
import { Country } from "../models/shared/Country";
import { DateOfBirth } from "../models/shared/DateOfBirth";
import { RequestHeaders } from "../Token";
import { PartialNested } from "../types/PartialNested";
import { BaseApi } from "./BaseApi";

/**
 * Request options that are sent when a beneficial owner is created.
 * @see {@link BeneficialOwnersApi.createForCustomer}
 */
export interface CreateForCustomerOptions {
    firstName: string;
    lastName: string;
    ssn?: string;
    dateOfBirth: DateOfBirth;
    address: {
        address1: string;
        address2?: string;
        address3?: string;
        city: string;
        stateProvinceRegion: string;
        country: Country;
        postalCode?: string;
    };
    passport?: {
        number?: string;
        country?: Country;
    };
}

/**
 * Request options that are sent when a beneficial owner is updated.
 * @see {@link BeneficialOwnersApi.update}
 */
export type UpdateOptions = PartialNested<CreateForCustomerOptions>;

export class BeneficialOwnersApi extends BaseApi {
    /**
     * Create a beneficial owner for a verified business customer.
     * @param customerId - The ID of the verified business customer to which the beneficial owner will be assigned
     * @param body - The JSON request body that is sent when creating the beneficial owner
     * @param headers - The additional headers, if any, that are appended to the request
     * @returns - The newly-create beneficial owner
     * @see {@link https://developers.dwolla.com/api-reference/beneficial-owners/create|Create a Beneficial Owner - Dwolla Documentation}
     */
    async createForCustomer(
        customerId: string,
        body: CreateForCustomerOptions,
        headers?: RequestHeaders
    ): Promise<BeneficialOwner> {
        return (
            await this.getClient().postFollowMapped(
                BeneficialOwner,
                `${PATHS.CUSTOMERS}/${customerId}/${PATHS.BENEFICIAL_OWNERS}`,
                body,
                headers
            )
        ).body;
    }

    /**
     * Get a single beneficial owner by its ID.
     * @param id - The ID of the beneficial owner that will be returned
     * @returns - The beneficial owner
     * @see {@link https://developers.dwolla.com/api-reference/beneficial-owners/retrieve|Retrieve a Beneficial Owner - Dwolla Documentation}
     */
    async get(id: string): Promise<BeneficialOwner> {
        return (await this.getClient().getMapped(BeneficialOwner, `${PATHS.BENEFICIAL_OWNERS}/${id}`)).body;
    }

    /**
     * Get a list of beneficial owners that are assigned to a specific customer by its ID.
     * @param customerId - The ID of the customer to which the beneficial owners are assigned
     * @returns - A list of beneficial owners assigned to the specified customer
     * @see {@link https://developers.dwolla.com/api-reference/beneficial-owners/list|List Beneficial Owners - Dwolla Documentation}
     */
    async listForCustomer(customerId: string): Promise<BeneficialOwners> {
        return (
            await this.getClient().getMapped(
                BeneficialOwners,
                `${PATHS.CUSTOMERS}/${customerId}/${PATHS.BENEFICIAL_OWNERS}`
            )
        ).body;
    }

    /**
     * Remove a beneficial owner. Once removed it cannot be retrieved.
     * @param id - The ID of the beneficial owner to remove
     * @returns - The beneficial owner that was removed
     * @see {@link https://developers.dwolla.com/api-reference/beneficial-owners/remove|Remove a Beneficial Owner - Dwolla Documentation}
     */
    async remove(id: string): Promise<BeneficialOwner> {
        return (await this.getClient().deleteMapped(BeneficialOwner, `${PATHS.BENEFICIAL_OWNERS}/${id}`)).body;
    }

    /**
     * Update a beneficial owner to retry verification. A beneficial owner's information can only be updated if their
     * current `verificationStatus` is {@link VerificationStatus.INCOMPLETE|`incomplete`}.
     * @param id - The ID of the beneficial owner to update
     * @param body - The JSON request body that is sent when updating the beneficial owner
     * @returns - The updated beneficial owner
     * @see {@link https://developers.dwolla.com/api-reference/beneficial-owners/update|Update a Beneficial Owner - Dwolla Documentation}
     */
    async update(id: string, body: UpdateOptions): Promise<BeneficialOwner> {
        return (await this.getClient().postMapped(BeneficialOwner, `${PATHS.BENEFICIAL_OWNERS}/${id}`, body)).body;
    }
}
