import { HalResource } from "../HalResource";
import { Expose } from "class-transformer";

/**
 * Represents the account and routing number for a virtual (VAN) {@link FundingSource} which can be used to externally
 * (outside of Dwolla's platform) route ACH payments either to or from a Dwolla Balance.
 * @see {@link FundingSourceApi.getAchRouting}
 */
export class ACHRouting extends HalResource {
    /**
     * The funding source's account number
     */
    @Expose()
    readonly accountNumber!: string;

    /**
     * The funding source's routing number
     */
    @Expose()
    readonly routingNumber!: string;
}
