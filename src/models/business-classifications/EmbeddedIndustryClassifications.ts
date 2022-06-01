import { Expose, Type } from "class-transformer";
import { IndustryClassification } from "./IndustryClassification";

export class EmbeddedIndustryClassifications {
    @Expose()
    @Type(() => IndustryClassification)
    readonly "industry-classifications"!: IndustryClassification[];
}
