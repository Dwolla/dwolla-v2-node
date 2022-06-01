import { Expose } from "class-transformer";
import { USState } from "./USState";

/**
 * Represents the customer's permanent residence address.
 */
export class USAddress {
    /**
     * The first line of the customer's physical address — e.g., `123 Main Street`.
     */
    @Expose()
    readonly address1!: string;

    /**
     * The second line, if applicable, of the customer's physical address — e.g., `Apartment 101`.
     */
    @Expose()
    readonly address2?: string;

    /**
     * The customer's city of residence — e.g., `Los Angeles`.
     */
    @Expose()
    readonly city!: string;

    /**
     * The customer's two-letter U.S. state — e.g., `CA`.
     */
    @Expose()
    readonly state!: USState;

    /**
     * The customer's USPS-assigned ZIP or ZIP+4 postal code — e.g., `90048`.
     */
    @Expose()
    readonly postalCode!: string;
}
