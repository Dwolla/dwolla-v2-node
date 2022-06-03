import { HalResource } from "../HalResource";
import { Money } from "../shared";
import { Expose, Type } from "class-transformer";

/**
 * Represents the current balance of a {@link FundingSource}, if it's a `balance` funding source.
 * @see {@link FundingSourceApi.getBalance}
 */
export class FundingSourceBalance extends HalResource {
    /**
     * The amount of funds readily available that can be labelled, sent, or withdrawn.
     */
    @Expose()
    @Type(() => Money)
    readonly balance?: Money;

    /**
     * The total balance held in the Dwolla network, including both labelled and unlabelled funds.
     */
    @Expose()
    @Type(() => Money)
    readonly total?: Money;

    /**
     * ISO-8601 timestamp of when this resource was last updated
     */
    @Expose()
    @Type(() => Date)
    readonly lastUpdated?: Date;
}
