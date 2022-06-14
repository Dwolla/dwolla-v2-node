import { PartialNested } from "../../types";
import { FundingSource } from "./FundingSource";

/**
 * Defines the type of bank account that can be used in `bank` {@link FundingSource}s.
 */
export type BankAccountType = "checking" | "general-ledger" | "loan" | "savings";

/**
 * Defines the status of a {@link FundingSource} — either `unverified` or `verified`.
 */
export type FundingSourceStatus = "unverified" | "verified";

/**
 * Defines the type of {@link FundingSource}.
 */
export type FundingSourceType = "balance" | "bank" | "card" | "virtual";

/**
 * Defines the status of micro deposits that were initiated to a {@link FundingSource}.O
 */
export type MicroDepositsStatus = "failed" | "pending" | "processed";

/**
 * Defines the processing channels that a specific {@link FundingSource} accepts.
 */
export type ProcessingChannel = "ach" | "real-time-payments" | "wire";

/**
 * Defines a Dwolla {@link FundingSource} record that has recently been updated.
 */
export type UpdatedFundingSource = PartialNested<FundingSource>;
