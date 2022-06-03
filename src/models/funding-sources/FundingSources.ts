import { HalResource } from "../HalResource";
import { EmbeddedFundingSources } from "./EmbeddedFundingSources";
import { Expose, Type } from "class-transformer";

/**
 * Represents an array of {@link FundingSource}s that are accessed via {@link EmbeddedFundingSources}.
 * @see {@link FundingSourceApi.listForCustomer}
 */
export class FundingSources extends HalResource {
    /**
     * The {@link EmbeddedFundingSources}, which contains an array of {@link FundingSource} record(s).
     */
    @Expose()
    @Type(() => EmbeddedFundingSources)
    readonly _embedded!: EmbeddedFundingSources;
}
