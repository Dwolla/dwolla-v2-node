import { Expose, Type } from "class-transformer";
import { HalResource } from "../HalResource";
import { EmbeddedCustomers } from "./EmbeddedCustomers";

/**
 * Represents an embedded array of Dwolla customers.
 */
export class Customers extends HalResource {
    /**
     * The {@link EmbeddedCustomers}, which contains an array of {@link Customer} records.
     */
    @Expose()
    @Type(() => EmbeddedCustomers)
    readonly _embedded!: EmbeddedCustomers;

    /**
     * The total number of customers.
     */
    @Expose()
    readonly total!: number;
}
