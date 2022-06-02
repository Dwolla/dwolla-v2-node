import FormData from "form-data";
import { ReadStream } from "fs";
import { PATHS } from "../constants";
import { Document, Documents, DocumentType } from "../models/documents";
import { RequestHeaders } from "../Token";
import { BaseApi } from "./BaseApi";

/**
 * Request options that are sent when creating (uploading) a new document for a beneficial owner or customer.
 * @see {@link DocumentsApi.createForBeneficialOwner}
 * @see {@link DocumentsApi.createForCustomer}
 */
export interface CreateOptions {
    documentType: DocumentType;
    file: ReadStream;
    fileMetadata: {
        contentType: string;
        filename: string;
        knownLength: number;
    };
}

/**
 * **Warning**: This API makes use of {@link https://www.npmjs.com/package/form-data|`form-data`}. If that is not
 * installed as a peer dependency, then some exported API methods within this class will not work as expected.
 */
export class DocumentsApi extends BaseApi {
    /**
     * Create and upload a document for a beneficial owner.
     * @param beneficialOwnerId - The ID of the beneficial owner to which the document will be assigned
     * @param body - The JSON request body that is sent when creating the document
     * @param headers - The additional headers, if any, that are appended to the request
     * @returns - The newly-created  document assigned to the beneficial owner
     * @see {@link https://developers.dwolla.com/api-reference/documents/create-document-for-beneficial-owner|Create a Document for a Beneficial Owner - Dwolla Documentation}
     */
    async createForBeneficialOwner(
        beneficialOwnerId: string,
        body: CreateOptions,
        headers?: RequestHeaders
    ): Promise<Document> {
        return (
            await this.getClient().postFollowMapped(
                Document,
                this.buildUrl(PATHS.BENEFICIAL_OWNERS, beneficialOwnerId, PATHS.DOCUMENTS),
                this.getRequestBody(body),
                headers
            )
        ).body;
    }

    /**
     * Create and upload a document for a customer.
     * @param customerId - The ID of the customer to which the document will be assigned
     * @param body - The JSON request body that is sent when creating the document
     * @param headers - The additional headers, if any, that are appended to the request
     * @returns - The newly-created document assigned to the customer
     * @see {@link https://developers.dwolla.com/api-reference/documents/create-document-for-customer|Create a Document for a Customer - Dwolla Documentation}
     */
    async createForCustomer(customerId: string, body: CreateOptions, headers?: RequestHeaders): Promise<Document> {
        return (
            await this.getClient().postFollowMapped(
                Document,
                this.buildUrl(PATHS.CUSTOMERS, customerId, PATHS.DOCUMENTS),
                this.getRequestBody(body),
                headers
            )
        ).body;
    }

    /**
     * Get a single document by its ID.
     * @param id - The ID of the document that will be returned
     * @returns - The found document
     * @see {@link https://developers.dwolla.com/api-reference/documents/retrieve|Retrieve a Document - Dwolla Documentation}
     */
    async get(id: string): Promise<Document> {
        return (await this.getClient().getMapped(Document, this.buildUrl(PATHS.DOCUMENTS, id))).body;
    }

    private getRequestBody(options: CreateOptions): FormData {
        const requestBody = new FormData();
        requestBody.append("documentType", options.documentType);
        requestBody.append("file", options.file, {
            contentType: options.fileMetadata.contentType,
            filename: options.fileMetadata.filename,
            knownLength: options.fileMetadata.knownLength
        });
        return requestBody;
    }

    /**
     * Get a list of documents that are assigned to a specific beneficial owner by their ID.
     * @param beneficialOwnerId - The ID of the beneficial owner to which the documents are assigned
     * @returns - A list of documents assigned to the specified beneficial owner
     * @see {@link https://developers.dwolla.com/api-reference/documents/list-documents-for-beneficial-owner|List Documents for a Beneficial Owner - Dwolla Documentation}
     */
    async listForBeneficialOwner(beneficialOwnerId: string): Promise<Documents> {
        return (
            await this.getClient().getMapped(
                Documents,
                this.buildUrl(PATHS.BENEFICIAL_OWNERS, beneficialOwnerId, PATHS.DOCUMENTS)
            )
        ).body;
    }

    /**
     * Get a list of documents that are assigned to a specific customer by their ID.
     * @param customerId - The ID of the customer to which the documents are assigned
     * @returns - A list of documents assigned to the specified customer
     * @see {@link https://developers.dwolla.com/api-reference/documents/list-documents-for-customer|List Documents for a Customer - Dwolla Documentation}
     */
    async listForCustomer(customerId: string): Promise<Documents> {
        return (
            await this.getClient().getMapped(Documents, this.buildUrl(PATHS.CUSTOMERS, customerId, PATHS.DOCUMENTS))
        ).body;
    }
}
