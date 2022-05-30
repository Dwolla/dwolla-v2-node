import { Expose, Type } from "class-transformer";
import { InternationalAddress } from "../shared/InternationalAddress";

/**
 * Represents a Dwolla customer controller that is assigned to verified business customers (not required for sole
 * proprietorship's).
 *
 * @see {@link https://developers.dwolla.com/api-reference/customers/create#controller-json-object|Verified Business Customer - Dwolla Documentation}
 */
export class CustomerController {
    /**
     * The controller's legal first name.
     */
    @Expose()
    readonly firstName!: string;

    /**
     * The controller's legal last name.
     */
    @Expose()
    readonly lastName!: string;

    /**
     * The controller's business title — e.g., Chief Executive Officer.
     */
    @Expose()
    readonly title!: string;

    /**
     * The full physical address of the controller. This can an international address.
     */
    @Expose()
    @Type(() => InternationalAddress)
    readonly address!: InternationalAddress;
}
