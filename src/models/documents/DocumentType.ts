/**
 * Represents an acceptable document that can be uploaded for verification.
 *
 * @see {@link https://developers.dwolla.com/api-reference/documents/create-document-for-customer#acceptable-documents|Acceptable Documents - Dwolla Documentation}
 */
export const enum DocumentType {
    /**
     * ID Card
     */
    ID_CARD = "idCard",

    /**
     * License
     */
    LICENSE = "license",

    /**
     * Other
     */
    OTHER = "other",

    /**
     * Passport
     */
    PASSPORT = "passport"
}
