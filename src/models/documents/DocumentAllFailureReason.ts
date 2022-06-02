import { Expose } from "class-transformer";
import { DocumentFailureReason } from "./DocumentFailureReason";

/**
 * Represents a single instance in an array of reasons in which an uploaded document was rejected.
 *
 * @see {@link Document.allFailureReasons}
 */
export class DocumentAllFailureReason {
    /**
     * The reason the document was rejected.
     */
    @Expose()
    readonly reason!: DocumentFailureReason;

    /**
     * The description of why the document was rejected.
     */
    @Expose()
    readonly description!: string;
}
