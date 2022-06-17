/**
 * Defines the type of {@link FundingSource}.
 */
export const enum FundingSourceType {
    /**
     * Balance
     */
    BALANCE = "balance",

    /**
     * Bank
     */
    BANK = "bank",

    /**
     * Debit Card
     */
    CARD = "card",

    /**
     * Virtual Account Number (VAN)
     */
    VIRTUAL = "virtual"
}
