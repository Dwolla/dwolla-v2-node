import { Expose, Type } from "class-transformer";
import { HalResource } from "../HalResource";
import { EmbeddedBeneficialOwners } from "./EmbeddedBeneficialOwners";

/**
 * Represents a response of beneficial owners.
 */
export class BeneficialOwners extends HalResource {
    /**
     * The {@link EmbeddedBeneficialOwners}, which contains an array of {@link BeneficialOwner} record(s).
     */
    @Expose()
    @Type(() => EmbeddedBeneficialOwners)
    readonly _embedded!: EmbeddedBeneficialOwners;

    /**
     * The total number of beneficial owners.
     */
    @Expose()
    readonly total!: number;
}
