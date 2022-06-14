import { PATHS } from "../constants";
import {
    ACHRouting,
    BankAccountType,
    CardFundingSourceToken,
    FundingSource,
    FundingSourceBalance,
    FundingSources,
    FundingSourceToken,
    MicroDeposits,
    MicroDepositsVerified,
    Money,
    ProcessingChannel,
    UpdatedFundingSource
} from "../models";
import { RequestHeaders } from "../Token";
import { BaseApi } from "./BaseApi";

/**
 * Request body that is sent when creating a `bank` {@link FundingSource}.
 * @see {@link FundingSourceApi.createBankForCustomer}
 */
export interface CreateBankFundingSourceBody {
    _links?: {
        "on-demand-authorization": string;
    };
    routingNumber: string;
    accountNumber: string;
    bankAccountType: BankAccountType;
    name: string;
    plaidToken?: string;
    channels?: ProcessingChannel[];
}

/**
 * Request body that is sent when creating a `virtual` {@link FundingSource}.
 * @see {@link FundingSourceApi.createVirtualForCustomer}
 */
export interface CreateVirtualFundingSourceBody {
    name: string;
}

/**
 * Query parameters that can be used to filter {@link FundingSources}.
 * @see {@link FundingSourceApi.listForCustomer}
 */
export interface ListFundingSourcesQueryParams {
    removed?: boolean;
}

/**
 * Request body that is sent when updating a {@link FundingSource}.
 * @see {@link FundingSourceApi.update}
 */
export interface UpdateFundingSourceBody {
    id: string;
    name: string;
    bankAccountType?: BankAccountType;
    routingNumber?: string;
    accountNumber?: string;
}

/**
 * Request body that is sent when verify {@link FundingSource} micro deposits.
 * @see {@link FundingSourceApi.verifyMicroDeposits}
 */
export interface VerifyMicroDepositsBody {
    amount1: Money;
    amount2: Money;
}

export class FundingSourcesApi extends BaseApi {
    /**
     * Create a `bank` {@link FundingSource} that is assigned to a {@link Customer}.
     *
     * @param customerId - The ID of the customer to whom the funding source is assigned
     * @param body - The JSON request body that is sent when creating the funding source
     * @param headers - The additional headers, if any, that are appended to the request
     *
     * @returns - The newly-created `bank` funding source
     *
     * @see {@link https://developers.dwolla.com/api-reference/funding-sources/create-funding-source-for-customer#http-request---bank-funding-source|Create a Bank Funding Source for a Customer - Dwolla Documentation}
     */
    async createBankForCustomer(
        customerId: string,
        body: CreateBankFundingSourceBody,
        headers?: RequestHeaders
    ): Promise<FundingSource> {
        return (
            await this.client.postFollowMapped(
                FundingSource,
                this.buildUrl(PATHS.CUSTOMERS, customerId, PATHS.FUNDING_SOURCES),
                body,
                headers
            )
        ).body;
    }

    /**
     * Create a single-use {@link CardFundingSourceToken} for use with `dwolla-cards.js`, which will allow the
     * {@link Customer} to create a `card` {@link FundingSource} using Dwolla's client-side library.
     *
     * @param customerId - The ID of the customer to whom this funding source will be assigned
     * @returns - A one-time, single-use token that can be used in `dwolla-cards.js`
     * @see {@link https://developers.dwolla.com/api-reference/funding-sources/create-a-card-funding-sources-token#http-request|Create a Card Funding Source Token for dwolla-cards.js - Dwolla Documentation}
     */
    async createCardTokenForCustomer(customerId: string): Promise<CardFundingSourceToken> {
        return (
            await this.client.postFollowMapped(
                CardFundingSourceToken,
                this.buildUrl(PATHS.CUSTOMERS, customerId, PATHS.CARD_FUNDING_SOURCES_TOKEN)
            )
        ).body;
    }

    /**
     * Create a single-use {@link FundingSourceToken} for use with `dwolla.js`, which will allow the {@link Customer}
     * to create a `bank` {@link FundingSource} using Dwolla's client-side library.
     *
     * @param customerId - The ID of the customer to whom this funding source will be assigned
     * @returns - A one-time, single-use token that can be used in `dwolla.js`
     * @see {@link https://developers.dwolla.com/api-reference/funding-sources/create-a-funding-sources-token-for-dwolla-js#http-request|Create a Funding Source Token for dwolla.js - Dwolla Documentation}
     */
    async createTokenForCustomer(customerId: string): Promise<FundingSourceToken> {
        return (
            await this.client.postFollowMapped(
                FundingSourceToken,
                this.buildUrl(PATHS.CUSTOMERS, customerId, PATHS.FUNDING_SOURCES_TOKEN)
            )
        ).body;
    }

    /**
     * Create a `virtual` (or VAN) {@link FundingSource} that is assigned to a {@link Customer}.
     *
     * @param customerId - The ID of the customer to whom this funding source is assigned
     * @param body - The JSON request body that is sent when creating the funding source
     * @param headers - The additional headers, if any, that are appended to the request
     *
     * @returns - The newly-created `virtual` funding source
     *
     * @see {@link https://developers.dwolla.com/api-reference/funding-sources/create-funding-source-for-customer#http-request---van-funding-source|Create a VAN Funding Source for a Customer - Dwolla Documentation}
     */
    async createVirtualForCustomer(
        customerId: string,
        body: CreateVirtualFundingSourceBody,
        headers?: RequestHeaders
    ): Promise<FundingSource> {
        return (
            await this.client.postFollowMapped(
                FundingSource,
                this.buildUrl(PATHS.CUSTOMERS, customerId, PATHS.FUNDING_SOURCES),
                { bankAccountType: "checking", type: "virtual", ...body },
                headers
            )
        ).body;
    }

    /**
     * Get a single {@link FundingSource} by its ID.
     *
     *  @param id - The ID of the funding source that will be returned
     * @returns - The found funding source
     * @see {@link https://developers.dwolla.com/api-reference/funding-sources/retrieve#retrieve-a-funding-source|Retrieve a Funding Source - Dwolla Documentation}
     */
    async get(id: string): Promise<FundingSource> {
        return (await this.client.getMapped(FundingSource, this.buildUrl(PATHS.FUNDING_SOURCES, id))).body;
    }

    /**
     * Get the {@link ACHRouting} details that is associated with a `virtual` {@link FundingSource}, such as the account
     * and routing number for use sending funds to/from the associated Dwolla balance.
     *
     * @param id - The ID of the `virtual` funding source to look up
     * @returns - The account and routing number of the found funding source
     * @see {@link https://developers.dwolla.com/api-reference/funding-sources/retrieve-a-van-account-and-routing-number#http-request|Retrieve a VAN Account and Routing Number - Dwolla Documentation}
     */
    async getAchRouting(id: string): Promise<ACHRouting> {
        return (await this.client.getMapped(ACHRouting, this.buildUrl(PATHS.FUNDING_SOURCES, id, PATHS.ACH_ROUTING)))
            .body;
    }

    /**
     * Get the current {@link FundingSourceBalance} that is retrieved from a `balance` {@link FundingSource}.
     *
     * @param id - The ID of the `balance` funding source to look up
     * @returns - The current funding source balance (both labelled and unlabelled)
     * @see {@link https://developers.dwolla.com/api-reference/funding-sources/retrieve-funding-source-balance#http-request|Retrieve a Funding Source Balance - Dwolla Documentation}
     */
    async getBalance(id: string): Promise<FundingSourceBalance> {
        return (
            await this.client.getMapped(FundingSourceBalance, this.buildUrl(PATHS.FUNDING_SOURCES, id, PATHS.BALANCE))
        ).body;
    }

    /**
     * Get detailed information regarding {@link MicroDeposits} that were sent out by Dwolla to verify a `bank`
     * {@link FundingSource}. If micro deposits have not yet been initiated, see {@link initiateMicroDeposits}.
     *
     * @param id - The ID of the funding source that had micro deposits initiated
     * @returns - The current micro deposits information for the specified funding source, which includes the status of
     * the micro deposits as well as if a failure occurred
     * @see {@link https://developers.dwolla.com/api-reference/funding-sources/retrieve-micro-deposits-details#http-request|Retrieve Micro Deposit Details - Dwolla Documentation}
     */
    async getMicroDeposits(id: string): Promise<MicroDeposits> {
        return (
            await this.client.getMapped(MicroDeposits, this.buildUrl(PATHS.FUNDING_SOURCES, id, PATHS.MICRO_DEPOSITS))
        ).body;
    }

    /**
     * Initiate {@link MicroDeposits} to verify a `bank` {@link FundingSource}. Once micro deposits are initiated for a
     * funding source, and the {@link Customer} has received the two amounts in their bank account (may take 1-3 days),
     * your application can call {@link verifyMicroDeposits} to verify the amounts.
     *
     * @param id - The ID of the funding source for which micro deposits will be initiated
     * @returns - The micro deposits that were initiated that includes the current status and if a failure occurred
     * @see {@link https://developers.dwolla.com/api-reference/funding-sources/initiate-micro-deposits#http-request|Initiate Micro Deposits - Dwolla Documentation}
     */
    async initiateMicroDeposits(id: string): Promise<MicroDeposits> {
        return (
            await this.client.postFollowMapped(
                MicroDeposits,
                this.buildUrl(PATHS.FUNDING_SOURCES, id, PATHS.MICRO_DEPOSITS)
            )
        ).body;
    }

    /**
     * Get a list of {@link FundingSources} that are assigned to a specific {@link Customer} by their ID.
     *
     * @param customerId - The ID of the customer in which funding sources will be searched
     * @param query - An additional query that can be used to filter the list of funding sources that are returned
     *
     * @returns - A list of funding sources that are assigned to the specified customer
     *
     * @see {@link https://developers.dwolla.com/api-reference/funding-sources/list-funding-sources-for-a-customer#http-request|List Funding Sources for a Customer - Dwolla Documentation}
     */
    async listForCustomer(customerId: string, query?: ListFundingSourcesQueryParams): Promise<FundingSources> {
        return (
            await this.client.getMapped(
                FundingSources,
                this.buildUrl(PATHS.CUSTOMERS, customerId, PATHS.FUNDING_SOURCES),
                query
            )
        ).body;
    }

    /**
     * Remove a {@link FundingSource} by its ID.
     *
     * @param id - The ID of the funding source to remove
     * @param headers - The additional headers, if any, that are appended to the request
     *
     * @returns - The removed funding source
     *
     * @see {@link https://developers.dwolla.com/api-reference/funding-sources/remove#http-request|Remove a Funding Source - Dwolla Documentation}
     */
    async remove(id: string, headers?: RequestHeaders): Promise<FundingSource> {
        return (
            await this.client.postMapped(
                FundingSource,
                this.buildUrl(PATHS.FUNDING_SOURCES, id),
                { removed: true },
                headers
            )
        ).body;
    }

    /**
     * Update properties in a `bank` {@link FundingSource}.
     *
     * @param id - The ID of the funding source to update
     * @param body - The JSON request body that is sent when updating the funding source
     * @param headers - The additional headers, if any, that are appended to the request
     *
     * @returns - The newly-updated funding source
     *
     * @see {@link https://developers.dwolla.com/api-reference/funding-sources/update#http-request|Update a Funding Source - Dwolla Documentation}
     */
    async update(id: string, body: UpdateFundingSourceBody, headers?: RequestHeaders): Promise<UpdatedFundingSource> {
        return (await this.client.postMapped(FundingSource, this.buildUrl(PATHS.FUNDING_SOURCES, id), body, headers))
            .body;
    }

    /**
     * Verify the two micro deposit amounts that were sent to a `bank` {@link FundingSource}.
     *
     * @param id - The ID of the funding source to verify with micro deposits
     * @param body - The JSON request body that is sent when verify the funding source via micro deposits
     * @param headers - The additional headers, if any,  that are appended to the request
     *
     * @returns - The verified micro deposit HAL links
     *
     * @see {@link https://developers.dwolla.com/api-reference/funding-sources/verify-micro-deposits#http-request|Verify Micro Deposits - Dwolla Documentation}
     */
    async verifyMicroDeposits(
        id: string,
        body: VerifyMicroDepositsBody,
        headers?: RequestHeaders
    ): Promise<MicroDepositsVerified> {
        return (
            await this.client.postFollowMapped(
                MicroDepositsVerified,
                this.buildUrl(PATHS.FUNDING_SOURCES, id, PATHS.MICRO_DEPOSITS),
                body,
                headers
            )
        ).body;
    }
}
