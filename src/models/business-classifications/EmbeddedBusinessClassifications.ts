import { Expose, Type } from "class-transformer";
import { BusinessClassification } from "./BusinessClassification";

export class EmbeddedBusinessClassifications {
    @Expose()
    @Type(() => BusinessClassification)
    readonly "business-classifications"!: BusinessClassification[];
}
