import { Expose } from "class-transformer";
import { Currency } from "./Currency";

export class Money {
    @Expose()
    readonly value!: string;

    @Expose()
    readonly currency: Currency = Currency.USD;
}
