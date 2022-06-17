import { Expose } from "class-transformer";
import { HalResource } from "../HalResource";
import { MicroDepositsFailure } from "./MicroDepositsFailure";
import { MicroDepositsStatus } from "./MicroDepositsStatus";

/**
 * Represents the current state of micro deposits that were sent to a customer's {@link FundingSource}.
 */
export class MicroDeposits extends HalResource {
    /**
     * ISO-8601 timestamp of when the resource was created.
     */
    @Expose()
    readonly created!: Date;

    /**
     * The current status of the micro deposits — e.g., whether the micro deposits are currently en route (pending),
     * failed, or were successfully delivered.
     */
    @Expose()
    readonly status!: MicroDepositsStatus;

    /**
     * The reason that the micro deposits failed to deliver to the customer's bank account.
     */
    @Expose()
    readonly failure?: MicroDepositsFailure;
}
