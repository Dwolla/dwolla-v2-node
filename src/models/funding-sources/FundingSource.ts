import { Expose, Type } from "class-transformer";
import { HalResource } from "../HalResource";
import { Money } from "../shared";
import { BankAccountType } from "./BankAccountType";
import { CardDetails } from "./CardDetails";
import { FundingSourceStatus } from "./FundingSourceStatus";
import { FundingSourceType } from "./FundingSourceType";
import { ProcessingChannel } from "./ProcessingChannel";

/**
 * Represents a Dwolla funding source record.
 * @see {@link https://developers.dwolla.com/api-reference/funding-sources#funding-source-resource|Funding Source Resource - Dwolla Documentation}
 */
export class FundingSource extends HalResource {
    /**
     * A unique resource identifier assigned by Dwolla.
     */
    @Expose()
    readonly id!: string;

    /**
     * The funding source's status — e.g., unverified or verified.
     */
    @Expose()
    readonly status!: FundingSourceStatus;

    /**
     * The funding source's type — e.g., balance, bank, card, or virtual.
     */
    @Expose()
    readonly type!: FundingSourceType;

    /**
     * The funding's bank account type (if {@link type} is equal to `bank`) — e.g., checking, savings, etc.
     */
    @Expose()
    readonly bankAccountType?: BankAccountType;

    /**
     * The funding source's name (specified when the funding source is created)
     */
    @Expose()
    readonly name!: string;

    /**
     * ISO-8601 timestamp of when the resource was created.
     */
    @Expose()
    readonly created!: Date;

    /**
     * The funding source's current balance, if {@link type} is equal to `balance`.
     */
    @Expose()
    @Type(() => Money)
    readonly balance?: Money;

    /**
     * A boolean flag indicating if the funding source has been removed.
     */
    @Expose()
    readonly removed!: boolean;

    /**
     * Array of the funding source's available processing channels — e.g., ach, real-time-payments, or wire.
     */
    @Expose()
    readonly channels!: ProcessingChannel[];

    /**
     * The name of the financial institution assigned to this funding source.
     */
    @Expose()
    readonly bankName?: string;

    /**
     * An optional unique identifier returned for `bank` funding sources. This attribute can be used to check across all
     * Dwolla API Customers to determine if two banks share the same account and routing number.
     */
    @Expose()
    readonly fingerprint?: string;

    /**
     * The funding source's card details, if {@link type} is equal to `card`.
     */
    @Expose()
    @Type(() => CardDetails)
    readonly cardDetails?: CardDetails;
}
