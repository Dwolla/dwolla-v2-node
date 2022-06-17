/**
 * Defines the processing channels that a specific {@link FundingSource} accepts.
 */
export const enum ProcessingChannel {
    /**
     * ACH
     */
    ACH = "ach",

    /**
     * Real Time Payments
     */
    REAL_TIME_PAYMENTS = "real-time-payments",

    /**
     * Wire
     */
    WIRE = "wire"
}
