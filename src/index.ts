import "reflect-metadata";

/**
 * API Methods
 */
export { AccountsApi } from "./api/AccountsApi";
export { BeneficialOwnersApi } from "./api/BeneficialOwnersApi";
export type { CreateForCustomerOptions, UpdateOptions } from "./api/BeneficialOwnersApi";
export { BusinessClassificationsApi } from "./api/BusinessClassificationsApi";
export { CustomersApi } from "./api/CustomersApi";
export type {
    CreateUnverifiedOptions,
    CreateVerifiedBusinessOptions,
    CreateVerifiedPersonalOptions,
    CreateVerifiedSolePropOptions,
    ListQueryParams
} from "./api/CustomersApi";
export { DocumentsApi } from "./api/DocumentsApi";
export type { CreateOptions } from "./api/DocumentsApi";
export { RootApi } from "./api/RootApi";

/**
 * Errors
 */
export { AuthError } from "./errors/AuthError";
export { DwollaError } from "./errors/DwollaError";
export { ResponseError } from "./errors/ResponseError";

/**
 * Models
 */
export { HalResource } from "./models/HalResource";
export { Link } from "./models/Link";
export { Root } from "./models/Root";

/**
 * Models — Accounts
 */
export { Account } from "./models/accounts/Account";
export { AccountType } from "./models/accounts/AccountType";
export { BusinessType } from "./models/customers/BusinessType";

/**
 * Models — Beneficial Owners
 */
export { BeneficialOwner } from "./models/beneficial-owners/BeneficialOwner";
export { BeneficialOwners } from "./models/beneficial-owners/BeneficialOwners";
export { EmbeddedBeneficialOwners } from "./models/beneficial-owners/EmbeddedBeneficialOwners";
export { VerificationStatus } from "./models/beneficial-owners/VerificationStatus";

/**
 * Models — Business Classifications
 */
export { BusinessClassification } from "./models/business-classifications/BusinessClassification";
export { BusinessClassifications } from "./models/business-classifications/BusinessClassifications";
export { EmbeddedBusinessClassifications } from "./models/business-classifications/EmbeddedBusinessClassifications";
export { EmbeddedIndustryClassifications } from "./models/business-classifications/EmbeddedIndustryClassifications";
export { IndustryClassification } from "./models/business-classifications/IndustryClassification";

/**
 * Models — Customers
 */
export { Customer } from "./models/customers/Customer";
export { CustomerController } from "./models/customers/CustomerController";
export { Customers } from "./models/customers/Customers";
export { CustomerStatus } from "./models/customers/CustomerStatus";
export { CustomerType } from "./models/customers/CustomerType";
export { EmbeddedCustomers } from "./models/customers/EmbeddedCustomers";

export * from "./models/documents";
export * from "./models/shared";

/**
 * Types
 */
export type { PartialNested } from "./types/PartialNested";
export type { RequireAtLeastOne } from "./types/RequireAtLeastOne";

/**
 * Utilities
 */
export { isAuthError, isDwollaError, isResponseError } from "./utils";

/**
 * Core
 */
export { Auth } from "./Auth";
export type { AuthResponse, AuthRequestParams } from "./Auth";
export { Client } from "./Client";
export type { ClientOptions } from "./Client";
export { Token } from "./Token";
export type { PathLike, Response, RequestHeaders, RequestQuery } from "./Token";
export { TokenManager } from "./TokenManager";
export type { TokenState, TokenManagerState } from "./TokenManager";
