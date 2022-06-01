import { Expose } from "class-transformer";

export class IndustryClassification {
    @Expose()
    readonly id!: string;

    @Expose()
    readonly name!: string;
}
