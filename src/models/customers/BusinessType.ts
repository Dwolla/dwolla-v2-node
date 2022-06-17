/**
 * Represents a business type that is assigned to business customers.
 * @see {@link CustomersApi.createVerifiedBusiness}
 * @see {@link CustomersApi.createVerifiedSoleProp}
 */
export const enum BusinessType {
    CORPORATION = "CORPORATION",
    LLC = "LLC",
    PARTNERSHIP = "PARTNERSHIP",
    SOLE_PROPRIETORSHIP = "SOLE_PROPRIETORSHIP"
}
