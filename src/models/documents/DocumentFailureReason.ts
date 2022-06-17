/**
 * Represents the reason an uploaded document failed verification.
 */
export const enum DocumentFailureReason {
    /**
     * Business Document Not Supported
     */
    BUSINESS_DOC_NOT_SUPPORTED = "BusinessDocNotSupported",

    /**
     * Business Name Mismatch
     */
    BUSINESS_NAME_MISMATCH = "BusinessNameMismatch",

    /**
     * Business Type Mismatch
     */
    BUSINESS_TYPE_MISMATCH = "BusinessTypeMismatch",

    /**
     * Date of Birth (DOB) Mismatch
     */
    SCAN_DOB_MISMATCH = "ScanDobMismatch",

    /**
     * Failed for Other Reason
     */
    SCAN_FAILED_OTHER = "ScanFailedOther",

    /**
     * ID Expired
     */
    SCAN_ID_EXPIRED = "ScanIdExpired",

    /**
     * ID Type Not Supported
     */
    SCAN_ID_TYPE_NOT_SUPPORTED = "ScanIdTypeNotSupported",

    /**
     * ID Unrecognized
     */
    SCAN_ID_UNRECOGNIZED = "ScanIdUnrecognized",

    /**
     * Name Mismatch
     */
    SCAN_NAME_MISMATCH = "ScanNameMismatch",

    /**
     * Not Readable
     */
    SCAN_NOT_READABLE = "ScanNotReadable",

    /**
     * Not Uploaded
     */
    SCAN_NOT_UPLOADED = "ScanNotUploaded"
}
