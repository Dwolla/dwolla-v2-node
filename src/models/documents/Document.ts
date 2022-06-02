import { Expose, Type } from "class-transformer";
import { HalResource } from "../HalResource";
import { DocumentAllFailureReason } from "./DocumentAllFailureReason";
import { DocumentFailureReason } from "./DocumentFailureReason";
import { DocumentStatus } from "./DocumentStatus";
import { DocumentType } from "./DocumentType";
import { DocumentVerificationStatus } from "./DocumentVerificationStatus";

/**
 * Represents a Dwolla document record.
 *
 * @see {@link https://developers.dwolla.com/api-reference/documents|Document Resource - Dwolla Documentation}
 */
export class Document extends HalResource {
    /**
     * A unique resource identifier assigned by Dwolla.
     */
    @Expose()
    readonly id!: string;

    /**
     * The document's type — e.g., license, passport, etc.
     */
    @Expose()
    readonly type!: DocumentType;

    /**
     * The document's status — e.g., pending or reviewed.
     */
    @Expose()
    readonly status!: DocumentStatus;

    /**
     * The document's verification status — e.g., accepted, pending, or rejected.
     */
    @Expose()
    readonly documentVerificationStatus!: DocumentVerificationStatus;

    /**
     * ISO-8601 timestamp the resource was created.
     */
    @Expose()
    @Type(() => Date)
    readonly created!: Date;

    /**
     * The document's failure reason, if Dwolla rejected the document.
     */
    @Expose()
    readonly failureReason?: DocumentFailureReason;

    /**
     * An array of reasons and descriptions if the document was rejected for multiple reasons.
     */
    @Expose()
    @Type(() => DocumentAllFailureReason)
    readonly allFailureReasons?: DocumentAllFailureReason[];
}
