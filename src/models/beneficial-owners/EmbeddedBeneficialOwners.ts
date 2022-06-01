import { Expose, Type } from "class-transformer";
import { BeneficialOwner } from "./BeneficialOwner";

/**
 * Represents an `_embedded` array of beneficial owners.
 */
export class EmbeddedBeneficialOwners {
    /**
     * The array of {@link BeneficialOwner} record(s).
     */
    @Expose()
    @Type(() => BeneficialOwner)
    readonly "beneficial-owners"!: BeneficialOwner[];
}
