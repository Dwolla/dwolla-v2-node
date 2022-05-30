import { Expose } from "class-transformer";

/**
 * Represents the date of birth of a customer. When this class is marshalled to JSON, it will return in `YYYY-MM-DD`
 * format, with `MM` and `DD` zero padded. Customer must be between 18 and 125 years of age.
 */
export class DateOfBirth {
    @Expose()
    readonly year!: number;

    @Expose()
    readonly month!: number;

    @Expose()
    readonly day!: number;

    constructor(year: number, month: number, day: number) {
        this.year = year;
        this.month = month;
        this.day = day;
    }

    toJSON(): string {
        return `${this.year}-${this.zeroPadded(this.month)}-${this.zeroPadded(this.day)}`;
    }

    private zeroPadded(num: number): string {
        return String(num).padStart(2, "0");
    }
}
