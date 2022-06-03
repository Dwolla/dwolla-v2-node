import { Expose } from "class-transformer";

/**
 * Represents the debit card information that is in use with Dwolla's push-to-debit feature.
 * @see {@link https://developers.dwolla.com/concepts/debit-cards|Debit Cards - Dwolla Documentation}
 */
export class CardDetails {
    /**
     * The debit card's brand — e.g., VISA, Mastercard, etc.
     */
    @Expose()
    readonly brand!: string;

    /**
     * The debit card's last four digits.
     */
    @Expose()
    readonly lastFour!: string;

    /**
     * The debit card's expiration month.
     */
    @Expose()
    readonly expirationMonth!: number;

    /**
     * The debit card's expiration year.
     */
    @Expose()
    readonly expirationYear!: number;

    /**
     * The name that is listed on the debit card.
     */
    @Expose()
    readonly nameOnCard!: string;
}
