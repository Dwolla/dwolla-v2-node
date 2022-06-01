import { Expose, Type } from "class-transformer";
import { HalResource } from "../HalResource";
import { InternationalAddress } from "../shared/InternationalAddress";
import { VerificationStatus } from "./VerificationStatus";

/**
 * Represents a Dwolla beneficial owner record.
 *
 * @see {@link https://developers.dwolla.com/api-reference/beneficial-owners#beneficial-owners-resource|Beneficial Owner Resource - Dwolla Documentation}
 */
export class BeneficialOwner extends HalResource {
    /**
     * A unique resource identifier assigned by Dwolla.
     */
    @Expose()
    readonly id!: string;

    /**
     * The beneficial owner's legal first name.
     */
    @Expose()
    readonly firstName!: string;

    /**
     * The beneficial owner's legal last name.
     */
    @Expose()
    readonly lastName!: string;

    /**
     * The beneficial owner's physical residence address (can be an international address).
     */
    @Expose()
    @Type(() => InternationalAddress)
    readonly address!: InternationalAddress;

    /**
     * The beneficial owner's current verification status — e.g., incomplete or verified.
     */
    @Expose()
    readonly verificationStatus!: VerificationStatus;
}
