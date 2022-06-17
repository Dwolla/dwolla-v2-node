/**
 * Represents the type of Dwolla customer, which may determine some Dwolla features — e.g., verified {@link PERSONAL}
 * customers can have a Dwolla balance, whereas verified {@link PERSONAL_NO_BALANCE} customers cannot.
 *
 * @see {@link https://developers.dwolla.com/concepts/customer-types|Customer Types - Dwolla Documentation}
 */
export const enum CustomerType {
    BUSINESS = "business",
    BUSINESS_NO_BALANCE = "business-no-balance",
    PERSONAL = "personal",
    PERSONAL_NO_BALANCE = "personal-no-balance",
    RECEIVE_ONLY = "receive-only",
    UNVERIFIED = "unverified"
}
