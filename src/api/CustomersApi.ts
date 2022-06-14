import { PATHS } from "../constants";
import {
    BusinessType,
    Customer,
    Customers,
    CustomerStatus,
    CustomerType,
    DateOfBirth,
    InternationalAddress,
    Passport,
    USState
} from "../models";
import { RequestHeaders } from "../Token";
import { BaseApi } from "./BaseApi";

/**
 * Request options that can be sent when creating a receive-only or unverified customer.
 * @see {@link CustomersApi.createReceiveOnly}
 * @see {@link CustomersApi.createUnverified}
 */
export interface CreateUnverifiedOptions extends WithPersonalInformation {
    businessName?: string;
    ipAddress?: string;
}

/**
 * Request options that can be sent when creating a verified business customer.
 * @see {@link CustomersApi.createVerifiedBusiness}
 */
export interface CreateVerifiedBusinessOptions extends WithPersonalInformation, WithUSAddress, WithVerifiedBusiness {
    businessType: BusinessType;
    controller: {
        firstName: string;
        lastName: string;
        title: string;
        address: InternationalAddress;
        dateOfBirth: DateOfBirth;
        ssn?: string;
        passport?: Passport;
    };
    ein: string;
    type: CustomerType.BUSINESS | CustomerType.BUSINESS_NO_BALANCE;
}

/**
 * Request options that can be sent when creating a personal verified customer.
 * @see {@link CustomersApi.createVerifiedPersonal}
 */
export interface CreateVerifiedPersonalOptions extends WithPersonalInformation, WithUSAddress {
    dateOfBirth: DateOfBirth;
    ipAddress?: string;
    phone?: string;
    ssn: string;
    type: CustomerType.PERSONAL | CustomerType.PERSONAL_NO_BALANCE;
}

/**
 * Request options that can be sent when creating a verified business customer — specifically, a sole proprietorship.
 * @see {@link CustomersApi.createVerifiedSoleProp}
 */
export interface CreateVerifiedSolePropOptions extends WithPersonalInformation, WithUSAddress, WithVerifiedBusiness {
    dateOfBirth: DateOfBirth;
    ein?: string;
    ssn: string;
}

/**
 * Query options that can be sent to filter the resulting array of {@link Customers}.
 * @see {@link CustomersApi.list}
 */
export interface ListQueryParams {
    limit?: number;
    offset?: number;
    search?: string;
    status?: CustomerStatus | CustomerStatus[];
}

interface WithPersonalInformation {
    firstName: string;
    lastName: string;
    email: string;
}

interface WithUSAddress {
    address1: string;
    address2?: string;
    city: string;
    state: USState;
    postalCode: string;
}

interface WithVerifiedBusiness {
    businessClassification: string;
    businessName: string;
    doingBusinessAs?: string;
    ipAddress?: string;
    phone?: string;
    website?: string;
}

/**
 * Request options that are sent when updating an unverified customer record
 * @see {@link CustomersApi.updateUnverified}
 */
export type UpdateUnverifiedOptions = Partial<Omit<CreateUnverifiedOptions, "ipAddress">>;

/**
 * Request options that are sent when updating a verified business customer record
 * @see {@link CustomersApi.updateVerifiedBusiness}
 */
export type UpdateVerifiedBusinessOptions = UpdateVerifiedPersonalOptions &
    Partial<Pick<CreateVerifiedBusinessOptions, "doingBusinessAs" | "website">>;

/**
 * Request options that are sent when updating a verified personal customer record
 * @see {@link CustomersApi.updateVerifiedPersonal}
 */
export type UpdateVerifiedPersonalOptions = Partial<WithUSAddress> &
    Partial<Pick<CreateVerifiedPersonalOptions, "email" | "ipAddress" | "phone">>;

export class CustomersApi extends BaseApi {
    /**
     * Create a receive-only customer record. This customer type can receive money from a Dwolla master account or a
     * verified customer, cannot send money to any customer record, and cannot hold a Dwolla balance.
     *
     * @param body - The JSON request body (e.g., personal information) that is sent when creating the customer record
     * @param headers - The additional request headers, if any, that are appended to the request
     * @return - The newly-created customer record, if the request was successful
     * @see {@link https://developers.dwolla.com/api-reference/customers/create#receive-only-user---request-parameters|Create Receive-Only Customer - Dwolla Documentation}
     * @see {@link https://developers.dwolla.com/concepts/customer-types|Customer Types - Dwolla Documentation}
     */
    async createReceiveOnly(body: CreateUnverifiedOptions, headers?: RequestHeaders): Promise<Customer> {
        return (
            await this.client.postFollowMapped(
                Customer,
                PATHS.CUSTOMERS,
                { type: CustomerType.RECEIVE_ONLY, ...body },
                headers
            )
        ).body;
    }

    /**
     * Create an unverified customer record. This customer type can receive money from a Dwolla master account or a
     * verified customer, can send money to a Dwolla master account or verified customer, and cannot hold a Dwolla
     * balance. Additionally, this customer type can send up to $5,000 USD per week.
     *
     * @param body - The JSON request body (e.g., personal information) that is sent when creating the customer record
     * @param headers - The additional request headers, if any, that are appended to the request
     * @return - The newly-created customer record, if the request was successful
     * @see {@link https://developers.dwolla.com/api-reference/customers/create#unverified-customer---request-parameters|Create Unverified Customer - Dwolla Documentation}
     * @see {@link https://developers.dwolla.com/concepts/customer-types|Customer Types - Dwolla Documentation}
     */
    async createUnverified(body: CreateUnverifiedOptions, headers?: RequestHeaders): Promise<Customer> {
        return (await this.client.postFollowMapped(Customer, PATHS.CUSTOMERS, body, headers)).body;
    }

    /**
     * Create a verified business customer record. This customer type can send and receive money to/from all other
     * customer types, and can hold a Dwolla balance (if specified). Additionally, this customer type can send up to
     * $10,000 USD per transfer.
     *
     * To create a verified business customer record with a Dwolla balance, set `body.type` to {@link CustomerType.BUSINESS};
     * otherwise, if you do not wish for this customer record to have a balance, set it to {@link CustomerType.BUSINESS_NO_BALANCE}.
     *
     * @param body - The JSON request body (e.g., business type/controller) that is sent when creating the customer record
     * @param headers - The additional request headers, if any, that are appended to the request
     * @return - The newly-created customer record, if the request was successful
     * @see {@link https://developers.dwolla.com/api-reference/customers/create#verified-business-customer-businesstypellc-corporation-or-partnership---request-parameters|Create Verified Business Customer - Dwolla Documentation}
     * @see {@link https://developers.dwolla.com/concepts/customer-types|Customer Types - Dwolla Documentation}
     */
    async createVerifiedBusiness(body: CreateVerifiedBusinessOptions, headers?: RequestHeaders): Promise<Customer> {
        return (await this.client.postFollowMapped(Customer, PATHS.CUSTOMERS, body, headers)).body;
    }

    /**
     * Create a verified personal customer record. This customer type can send and receive money to/from all other
     * customer types, and can hold a Dwolla balance (if specified). Additionally, this customer type can send up to
     * $5,000 USD per transfer.
     *
     * To create a verified personal customer record with a Dwolla balance, set `body.type` to {@link CustomerType.PERSONAL};
     * otherwise, if you do not wish for this customer record to have a balance, set it to {@link CustomerType.PERSONAL_NO_BALANCE}.
     *
     * @param body - The JSON request body (e.g., personal information) that is sent when creating the customer record
     * @param headers - The additional request headers, if any, that are appended to the request
     * @return - The newly-created {@link Customer} record, if the request was successful
     * @see {@link https://developers.dwolla.com/api-reference/customers/create#verified-personal-customer---request-parameters|Create Verified Personal Customer - Dwolla Documentation}
     * @see {@link https://developers.dwolla.com/concepts/customer-types|Customer Types - Dwolla Documentation}
     */
    async createVerifiedPersonal(body: CreateVerifiedPersonalOptions, headers?: RequestHeaders): Promise<Customer> {
        return (await this.client.postFollowMapped(Customer, PATHS.CUSTOMERS, body, headers)).body;
    }

    /**
     * Create a verified business customer record (sole proprietorship only). This customer type can send and receive
     * money to/from all other customer types, and can hold a Dwolla balance (if specified). Additionally, this customer
     * type can send up to $10,000 USD per transfer.
     *
     * To create a verified business customer record with a Dwolla balance, set `body.type` to {@link CustomerType.BUSINESS};
     * otherwise, if you do not wish for this customer record to have a balance, set it to {@link CustomerType.BUSINESS_NO_BALANCE}.
     *
     * @param body - The JSON request body (e.g. personal information) that is sent when creating the customer record
     * @param headers - The additional request headers, if any, that are appended to the request
     * @return - The newly-created {@link Customer} record, if the request was successful
     * @see {@link https://developers.dwolla.com/api-reference/customers/create#verified-business-customer-sole-proprietorship-only---request-parameters|Create Verified Business Customer (Sole Proprietorship) - Dwolla Documentation}
     * @see {@link https://developers.dwolla.com/concepts/customer-types|Customer Types - Dwolla Documentation}
     */
    async createVerifiedSoleProp(body: CreateVerifiedSolePropOptions, headers?: RequestHeaders): Promise<Customer> {
        return (
            await this.client.postFollowMapped(
                Customer,
                PATHS.CUSTOMERS,
                { businessType: BusinessType.SOLE_PROPRIETORSHIP, ...body },
                headers
            )
        ).body;
    }

    /**
     * Deactivate a customer record. A customer cannot be deactivated if they are already have a `suspended`
     * verification status.
     * @param id - The ID of the customer record to deactivate
     * @return - The deactivated customer, if the request was successful
     * @see {@link https://developers.dwolla.com/api-reference/customers/update#deactivate-a-customer|Deactivate a Customer - Dwolla Documentation}
     */
    async deactivate(id: string): Promise<Customer> {
        return (await this.client.postMapped(Customer, this.buildUrl(PATHS.CUSTOMERS, id), { status: "deactivated" }))
            .body;
    }

    /**
     * Get a customer record by its unique, Dwolla-assigned ID.
     * @param id - The ID of the customer record that should be returned
     * @return - The customer record, if the request was successful
     * @see {@link https://developers.dwolla.com/api-reference/customers/retrieve|Retrieve a Customer - Dwolla Documentation}
     */
    async get(id: string): Promise<Customer> {
        return (await this.client.getMapped(Customer, this.buildUrl(PATHS.CUSTOMERS, id))).body;
    }

    /**
     * Get a list of customer that have been created for this account.
     * @param query - The query parameters that are sent with the HTTP request
     * @return - The list of customers, if the request was successful
     * @see {@link https://developers.dwolla.com/api-reference/customers/list-and-search|List and Search Customers - Dwolla Documentation}
     */
    async list(query?: ListQueryParams): Promise<Customers> {
        return (await this.client.getMapped(Customers, PATHS.CUSTOMERS, query)).body;
    }

    /**
     * Reactivate a previously-deactivated customer record. Once reactivated, the customer record will return to the
     * state it was in prior to being deactivated.
     * @param id - The ID of the deactivated customer record to reactivate
     * @return - The reactivated customer, if the request was successful
     * @see {@link https://developers.dwolla.com/api-reference/customers/update#reactivate-a-customer|Reactivate a Customer - Dwolla Documentation}
     */
    async reactivate(id: string): Promise<Customer> {
        return (await this.client.postMapped(Customer, this.buildUrl(PATHS.CUSTOMERS, id), { status: "reactivated" }))
            .body;
    }

    /**
     * Suspend an unverified or verified customer. If suspended, you will need to contact Dwolla support in order to
     * unsuspend a customer record.
     * @param id - The ID of the customer record to suspend
     * @return - The suspended customer record, if the request was successful
     * @see {@link https://developers.dwolla.com/api-reference/customers/update#suspend-a-customer|Suspend a Customer - Dwolla Documentation}
     */
    async suspend(id: string): Promise<Customer> {
        return (await this.client.postMapped(Customer, this.buildUrl(PATHS.CUSTOMERS, id), { status: "suspended" }))
            .body;
    }

    /**
     * Update an unverified customer record.
     * @param id - The ID of the customer record to update
     * @param body - The JSON request body that is sent when updating the customer record
     * @return - The updated unverified customer record, if the request was successful
     * @see {@link https://developers.dwolla.com/api-reference/customers/update#update-a-customers-information|Update a Customer - Dwolla Documentation}
     */
    async updateUnverified(id: string, body: UpdateUnverifiedOptions): Promise<Customer> {
        return (await this.client.postMapped(Customer, this.buildUrl(PATHS.CUSTOMERS, id), body)).body;
    }

    /**
     * Update a verified business customer record.
     * @param id - The ID of the customer record to update
     * @param body - The JSON request body that is sent when updating the customer record
     * @return - The updated business customer record, if the request was successful
     * @see {@link https://developers.dwolla.com/api-reference/customers/update#update-a-customers-information|Update a Customer - Dwolla Documentation}
     */
    async updateVerifiedBusiness(id: string, body: UpdateVerifiedBusinessOptions): Promise<Customer> {
        return (await this.client.postMapped(Customer, this.buildUrl(PATHS.CUSTOMERS, id), body)).body;
    }

    /**
     * Update a verified personal customer record.
     * @param id - The ID of the customer record to update
     * @param body - The JSON request body that is sent when updating the customer record
     * @return - The updated personal customer record, if the request was successful
     * @see {@link https://developers.dwolla.com/api-reference/customers/update#update-a-customers-information|Update a Customer - Dwolla Documentation}
     */
    async updateVerifiedPersonal(id: string, body: UpdateVerifiedPersonalOptions): Promise<Customer> {
        return (await this.client.postMapped(Customer, this.buildUrl(PATHS.CUSTOMERS, id), body)).body;
    }

    /**
     * Upgrade an unverified customer record to a verified personal customer record.
     * @param id - The ID of the unverified customer record to update
     * @param body - The JSON request body that is sent when upgrading the unverified customer record
     * @return - The upgraded personal customer record, if the request was successful
     * @see {@link https://developers.dwolla.com/api-reference/customers/update#upgrade-an-unverified-customer-to-verified-customer|Upgrade an Unverified Customer - Dwolla Documentation}
     */
    async upgradeToVerifiedPersonal(id: string, body: CreateVerifiedPersonalOptions): Promise<Customer> {
        return (await this.client.postMapped(Customer, this.buildUrl(PATHS.CUSTOMERS, id), body)).body;
    }
}
