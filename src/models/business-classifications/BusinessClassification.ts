import { Expose, Type } from "class-transformer";
import { HalResource } from "../HalResource";
import { EmbeddedIndustryClassifications } from "./EmbeddedIndustryClassifications";

export class BusinessClassification extends HalResource {
    @Expose()
    @Type(() => EmbeddedIndustryClassifications)
    readonly _embedded!: EmbeddedIndustryClassifications;

    @Expose()
    readonly id!: string;

    @Expose()
    readonly name!: string;
}
