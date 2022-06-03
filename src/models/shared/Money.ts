import { Currency } from "./Currency";

export class Money {
    readonly value!: string;
    readonly currency: Currency = Currency.USD;
}
