import { Expose } from "class-transformer";
import { Country } from "./Country";

/**
 * Represents a business controller's physical address.
 *
 * **NOTE**: PO Boxes are not allowed.
 */
export class InternationalAddress {
    /**
     * The street number and street name of controller's physical address.
     */
    @Expose()
    readonly address1!: string;

    /**
     * The apartment, floor, suite, or building number of controller's physical address.
     */
    @Expose()
    readonly address2?: string;

    /**
     * The third line of the street address of the controller's physical address.
     */
    @Expose()
    readonly address3?: string;

    /**
     * The controller's city of residence.
     */
    @Expose()
    readonly city!: string;

    /**
     * The controller's state, province, or region.
     *
     * For U.S. persons, the two-letter U.S. state abbreviation of controller's physical address.
     *
     * For non-U.S. persons, the two-letter state, province, or region ISO abbreviation of controller's physical address.
     */
    @Expose()
    readonly stateProvinceRegion!: string;

    /**
     * The controller's five-digit U.S. ZIP or ZIP+4 code. Optional if controller is a non-U.S. person.
     */
    @Expose()
    readonly postalCode?: string;

    /**
     * The controller's two-character ISO country code — e.g., `US`.
     */
    @Expose()
    readonly country!: Country;
}
