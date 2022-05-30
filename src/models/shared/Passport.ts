import { Expose } from "class-transformer";
import { Country } from "./Country";

/**
 * Represents a passport that is assigned to a business controller. This is only required if the business controller is
 * a non-U.S. person; otherwise, they will provide their social security number instead.
 */
export class Passport {
    /**
     * The passport's number assigned by the issuing country.
     */
    @Expose()
    readonly number!: string;

    /**
     * The country in which the passport was issued.
     */
    @Expose()
    readonly country!: Country;
}
