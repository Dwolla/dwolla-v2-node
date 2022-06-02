import { Expose, Type } from "class-transformer";
import { Document } from "./Document";

/**
 * Represents an `_embedded` array of documents.
 */
export class EmbeddedDocuments {
    /**
     * The array of {@link Document} record(s).
     */
    @Expose()
    @Type(() => Document)
    readonly documents!: Document[];
}
