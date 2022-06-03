import { Expose } from "class-transformer";

/**
 * Represents a failure for Dwolla to send micro deposits to a {@link FundingSource}.
 */
export class MicroDepositsFailure {
    /**
     * The ACH return code that caused the micro deposits failure to occur.
     */
    @Expose()
    readonly code!: string;

    /**
     * The description of the ACH return that caused the micro deposits to fail.
     */
    @Expose()
    readonly description!: string;
}
