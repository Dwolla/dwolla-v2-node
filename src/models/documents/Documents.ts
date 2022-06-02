import { Expose, Type } from "class-transformer";
import { HalResource } from "../HalResource";
import { EmbeddedDocuments } from "./EmbeddedDocuments";

/**
 * Represents a response of documents.
 */
export class Documents extends HalResource {
    /**
     * The {@link EmbeddedDocuments}, which contains an array of {@link Document} record(s).
     */
    @Expose()
    @Type(() => EmbeddedDocuments)
    readonly _embedded!: EmbeddedDocuments;

    /**
     * The total number of documents.
     */
    @Expose()
    readonly total!: number;
}
