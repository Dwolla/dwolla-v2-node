import { Expose } from "class-transformer";
import { HalResource } from "../HalResource";
import { FailureCode } from "./FailureCode";

export class FailureReason extends HalResource {
    @Expose()
    readonly code!: FailureCode;

    @Expose()
    readonly description!: string;

    @Expose()
    readonly explanation!: string;
}
