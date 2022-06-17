import { Expose, Type } from "class-transformer";
import { HalResource } from "../HalResource";
import { Money } from "../shared";
import { TransferStatus } from "./TransferStatus";

export class FacilitatorFee extends HalResource {
    @Expose()
    readonly id!: string;

    @Expose()
    readonly status!: TransferStatus;

    @Expose()
    @Type(() => Money)
    readonly amount!: Money;

    @Expose()
    @Type(() => Date)
    readonly created!: Date;
}
