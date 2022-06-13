import { Expose, Type } from "class-transformer";
import { FacilitatorFee } from "./FacilitatorFee";

export class FacilitatorFees {
    @Expose()
    @Type(() => FacilitatorFee)
    readonly transactions!: FacilitatorFee[];
}
