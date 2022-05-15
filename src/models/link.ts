import { Expose } from "class-transformer";

export class Link {
    @Expose()
    readonly href!: string;

    @Expose()
    readonly "resource-type"!: string;
}
