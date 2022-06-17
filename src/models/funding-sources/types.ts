import { PartialNested } from "../../types";
import { FundingSource } from "./FundingSource";

/**
 * Defines a Dwolla {@link FundingSource} record that has recently been updated.
 */
export type UpdatedFundingSource = PartialNested<FundingSource>;
