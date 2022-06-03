import { HalResource } from "../HalResource";
import { Expose } from "class-transformer";

/**
 * Represents a {@link FundingSource} token that can either be used for in `dwolla.js` or `dwolla-cards.js`.
 *
 * @see {@link FundingSourceApi.createCardTokenForCustomer}
 * @see {@link FundingSourceApi.createTokenForCustomer}
 */
export abstract class TokenBase extends HalResource {
    /**
     * The token that can be used when creating a funding source.
     */
    @Expose()
    token!: string;
}
