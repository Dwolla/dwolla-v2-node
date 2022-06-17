/**
 * Represents the status of a Dwolla customer.
 */
export const enum CustomerStatus {
    DEACTIVATED = "deactivated",
    DOCUMENT = "document",
    RETRY = "retry",
    SUSPENDED = "suspended",
    UNVERIFIED = "unverified",
    VERIFIED = "verified"
}
