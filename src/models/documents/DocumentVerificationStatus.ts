/**
 * Represents the final status of an uploaded document after being reviewed by Dwolla.
 */
export enum DocumentVerificationStatus {
    /**
     * Accepted
     */
    ACCEPTED = "accepted",

    /**
     * Pending
     */
    PENDING = "pending",

    /**
     * Rejected
     */
    REJECTED = "rejected"
}
