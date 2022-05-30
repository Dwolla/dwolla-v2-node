import { Expose, Type } from "class-transformer";
import { Customer } from "./Customer";

/**
 * Represents an array of embedded Dwolla customers.
 */
export class EmbeddedCustomers {
    /**
     * The array of {@link Customer} records.
     */
    @Expose()
    @Type(() => Customer)
    readonly customers!: Customer[];
}
