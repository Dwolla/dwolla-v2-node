import { Client } from "../Client";
import { PATHS } from "../constants";
import { BusinessType } from "../models/customers/BusinessType";
import { Customer } from "../models/customers/Customer";
import { Customers } from "../models/customers/Customers";
import { CustomerStatus } from "../models/customers/CustomerStatus";
import { CustomerType } from "../models/customers/CustomerType";
import { DateOfBirth } from "../models/shared/DateOfBirth";
import { InternationalAddress } from "../models/shared/InternationalAddress";
import { Passport } from "../models/shared/Passport";
import { USState } from "../models/shared/USState";
import { RequestHeaders } from "../Token";

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
    controller: WithController;
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

interface WithController {
    firstName: string;
    lastName: string;
    title: string;
    address: InternationalAddress;
    dateOfBirth: DateOfBirth;
    ssn?: string;
    passport?: Passport;
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

export class CustomersApi {
    constructor(private readonly client: Client) {}

    /**
     * Create a receive-only customer record. This customer type can receive money from a Dwolla master account or a
     * verified customer, cannot send money to any customer record, and cannot hold a Dwolla balance.
     *
     * @param {CreateUnverifiedOptions} body - The JSON request body (e.g., personal information) that is sent when
     * creating the customer record
     * @param {RequestHeaders} [headers] - The additional request headers (e.g., idempotency key), if any, that are
     * appended when creating the customer record
     * @return {Promise<Customer>} - The newly-created {@link Customer} record, if the request was successful
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
     * @param {CreateUnverifiedOptions} body - The JSON request body (e.g., personal information) that is sent when
     * creating the customer record
     * @param {RequestHeaders} [headers] - The additional request headers (e.g., idempotency key), if any, that are
     * appended when creating the customer record
     * @return {Promise<Customer>} - The newly-created {@link Customer} record, if the request was successful
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
     * To create a verified business customer record with a Dwolla balance, set {@link CreateVerifiedBusinessOptions.type}
     * to {@link CustomerType.BUSINESS}; otherwise, if you do not wish for this customer record to have a balance, set
     * it to {@link CustomerType.BUSINESS_NO_BALANCE}.
     *
     * @param {CreateVerifiedBusinessOptions} body - The JSON request body (e.g., business type/controller) that is sent
     * when creating the customer record
     * @param {RequestHeaders} [headers] - The additional request headers (e.g., idempotency key), if any, that are
     * appended when creating the customer record
     * @return {Promise<Customer>} - The newly-created {@link Customer} record, if the request was successful
     * @see {@link https://developers.dwolla.com/concepts/customer-types|Customer Types - Dwolla Documentation}
     */
    async createVerifiedBusiness(body: CreateVerifiedBusinessOptions, headers?: RequestHeaders): Promise<Customer> {
        return (await this.client.postFollowMapped(Customer, PATHS.CUSTOMERS, { ...body }, headers)).body;
    }

    /**
     * Create a verified personal customer record. This customer type can send and receive money to/from all other
     * customer types, and can hold a Dwolla balance (if specified). Additionally, this customer type can send up to
     * $5,000 USD per transfer.
     *
     * To create a verified personal customer record with a Dwolla balance, set {@link CreateVerifiedPersonalOptions.type}
     * to {@link CustomerType.PERSONAL}; otherwise, if you do not wish for this customer record to have a balance, set
     * it to {@link CustomerType.PERSONAL_NO_BALANCE}.
     *
     * @param {CreateVerifiedPersonalOptions} body - The JSON request body (e.g., personal information) that is sent
     * when creating the customer record
     * @param {RequestHeaders} [headers] - The additional request headers (e.g., idempotency key), if any, that are
     * appended when creating the customer record
     * @return {Promise<Customer>} - The newly-created {@link Customer} record, if the request was successful
     * @see {@link https://developers.dwolla.com/concepts/customer-types|Customer Types - Dwolla Documentation}
     */
    async createVerifiedPersonal(body: CreateVerifiedPersonalOptions, headers?: RequestHeaders): Promise<Customer> {
        return (await this.client.postFollowMapped(Customer, PATHS.CUSTOMERS, { ...body }, headers)).body;
    }

    /**
     * Create a verified business customer record (sole proprietorship only). This customer type can send and receive
     * money to/from all other customer types, and can hold a Dwolla balance (if specified). Additionally, this customer
     * type can send up to $10,000 USD per transfer.
     *
     * To create a verified business customer record with a Dwolla balance, set {@link CreateVerifiedBusinessOptions.type}
     * to {@link CustomerType.BUSINESS}; otherwise, if you do not wish for this customer record to have a balance, set
     * it to {@link CustomerType.BUSINESS_NO_BALANCE}.
     *
     * @param {CreateVerifiedSolePropOptions} body - The JSON request body (e.g. personal information) that is sent when
     * creating the customer record
     * @param {RequestHeaders} [headers] - The additional request headers (e.g., idempotency key), if any, that are
     * appended when creating the customer record
     * @return {Promise<Customer>} - The newly-created {@link Customer} record, if the request was successful
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
     * Get a {@link Customer} record by its unique, Dwolla-assigned ID.
     * @param {string} id - The ID of the {@link Customer} record that should be returned
     * @return {Promise<Customer>} - The {@link Customer} record, if the request was successful
     */
    async get(id: string): Promise<Customer> {
        return (await this.client.getMapped(Customer, `${PATHS.CUSTOMERS}/${id}`)).body;
    }

    /**
     * Get a list of {@link Customers} that have been created for this account.
     * @param {ListQueryParams} query - The query parameters that are sent with the HTTP request
     * @return {Promise<Customers>} - The list of {@link Customers}, if the request was successful
     */
    async list(query?: ListQueryParams): Promise<Customers> {
        return (await this.client.getMapped(Customers, PATHS.CUSTOMERS, query)).body;
    }
}
