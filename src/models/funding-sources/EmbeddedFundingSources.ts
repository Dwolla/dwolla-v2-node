import { FundingSource } from "./FundingSource";
import { Expose, Type } from "class-transformer";

/**
 * Represents an `_embedded` array of {@link FundingSource}s.
 */
export class EmbeddedFundingSources {
    /**
     * The array of {@link FundingSource} record(s).
     */
    @Expose()
    @Type(() => FundingSource)
    readonly "funding-sources"!: FundingSource[];
}
