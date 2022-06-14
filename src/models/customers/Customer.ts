import { Expose, Type } from "class-transformer";
import { HalResource } from "../HalResource";
import { USState } from "../shared";
import { BusinessType } from "./BusinessType";
import { CustomerController } from "./CustomerController";
import { CustomerStatus } from "./CustomerStatus";
import { CustomerType } from "./CustomerType";

/**
 * Represents a Dwolla customer record.
 *
 * @see {@link https://developers.dwolla.com/api-reference/customers#customer-resource|Customer Resource - Dwolla Documentation}
 */
export class Customer extends HalResource {
    /**
     * A unique account identifier assigned by Dwolla.
     */
    @Expose()
    readonly id!: string;

    /**
     * The customer's legal first name.
     */
    @Expose()
    readonly firstName!: string;

    /**
     * The customer's legal last name.
     */
    @Expose()
    readonly lastName!: string;

    /**
     * The customer's email address.
     */
    @Expose()
    readonly email?: string;

    /**
     * The customer's type — e.g., unverified, personal, business, receive-only, etc.
     */
    @Expose()
    readonly type!: CustomerType;

    /**
     * The customer's type — e.g., unverified, verified, suspended, deactivated, etc.
     */
    @Expose()
    readonly status!: CustomerStatus;

    /**
     * An ISO-8601 timestamp of when the customer was created.
     */
    @Expose()
    @Type(() => Date)
    readonly created!: Date;

    /**
     * Address line 1 of the customer or legal entity.
     */
    @Expose()
    readonly address1?: string;

    /**
     * Address line 2 of the customer or legal entity, if applicable.
     */
    @Expose()
    readonly address2?: string;

    /**
     * The city where the customer or legal entity is located.
     */
    @Expose()
    readonly city?: string;

    /**
     * The U.S. state where the customer or legal entity is located.
     */
    @Expose()
    readonly state?: USState;

    /**
     * The postal code assigned to the customer or legal entity's physical address.
     */
    @Expose()
    readonly postalCode?: string;

    /**
     * The customer or legal entity's 10-digit phone number.
     */
    @Expose()
    readonly phone?: string;

    /**
     * The customer's registered business name.
     */
    @Expose()
    readonly businessName?: string;

    /**
     * The customer's preferred business name — also known as assumed name or fictitious name.
     */
    @Expose()
    readonly doingBusinessAs?: string;

    /**
     * The business' website address.
     */
    @Expose()
    readonly website?: string;

    /**
     * A user-assigned ID. This can be used to "tag" a customer record from Dwolla with an internal record.
     */
    @Expose()
    readonly correlationId?: string;

    /**
     * The business' controller — a natural individual who holds significant responsibilities to control, manage, or
     * direct a company or other corporate entities (e.g., CEO, CFO, President, etc.)
     */
    @Expose()
    @Type(() => CustomerController)
    readonly controller?: CustomerController;

    /**
     * The business' type — e.g, corporation, llc, partnership, or sole proprietorship.
     */
    @Expose()
    readonly businessType?: BusinessType;

    /**
     * The business' classification ID. This value can be assigned after being fetched from Dwolla's API.
     *
     * @see {@link https://developers.dwolla.com/api-reference/customers/list-business-classifications|List Business Classifications - Dwolla Documentation}
     */
    @Expose()
    readonly businessClassification?: string;
}
