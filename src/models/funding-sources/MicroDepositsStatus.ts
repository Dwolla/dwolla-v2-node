/**
 * Defines the status of micro deposits that were initiated to a {@link FundingSource}.
 */
export const enum MicroDepositsStatus {
    /**
     * Failed
     */
    FAILED = "failed",

    /**
     * Pending
     */
    PENDING = "pending",

    /**
     * Processed
     */
    PROCESSED = "processed"
}
