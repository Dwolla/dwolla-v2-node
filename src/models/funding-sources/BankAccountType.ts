/**
 * Defines the type of bank account that can be used in `bank` {@link FundingSource}s.
 */
export const enum BankAccountType {
    /**
     * Checking
     */
    CHECKING = "checking",

    /**
     * General Ledger
     */
    GENERAL_LEDGER = "general-ledger",

    /**
     * Loan
     */
    LOAN = "loan",

    /**
     * Savings
     */
    SAVINGS = "savings"
}
