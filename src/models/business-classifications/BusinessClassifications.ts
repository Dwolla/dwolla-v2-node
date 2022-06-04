import { Expose, Type } from "class-transformer";
import { HalResource } from "../HalResource";
import { EmbeddedBusinessClassifications } from "./EmbeddedBusinessClassifications";

export class BusinessClassifications extends HalResource {
    @Expose()
    @Type(() => EmbeddedBusinessClassifications)
    readonly _embedded!: EmbeddedBusinessClassifications;

    /**
     * The total number of business classifications.
     */
    @Expose()
    readonly total!: number;
}
