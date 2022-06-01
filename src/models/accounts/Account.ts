import { Expose } from "class-transformer";
import { HalResource } from "../HalResource";
import { USAddress } from "../shared/USAddress";
import { AccountType } from "./AccountType";

export class Account extends HalResource {
    /**
     * Unique account identifier assigned by Dwolla
     */
    @Expose()
    readonly id!: string;

    /**
     * Preferred organization name if provided, otherwise the name on the account
     */
    @Expose()
    readonly name!: string;

    /**
     * Physical U.S. address assigned to the account
     */
    @Expose()
    readonly address?: USAddress;

    /**
     * UTC timezone offset for the account
     */
    @Expose()
    readonly timezoneOffset?: number;

    /**
     * Type of account — for example, personal, commercial, non-profit, or government
     */
    @Expose()
    readonly type?: AccountType;

    /**
     * Phone number that is assigned to the account
     */
    @Expose()
    readonly phone?: string;

    /**
     * Website address that is assigned to the account
     */
    @Expose()
    readonly website?: string;

    /**
     * First and last name of the authorized representative for the business assigned to the account
     */
    @Expose()
    readonly authorizedRep?: string;

    /**
     * Date and time that the account was created
     */
    @Expose()
    readonly created?: Date;
}
