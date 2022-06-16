import { Expose } from "class-transformer";
import { HalResource } from "../HalResource";

export class OnDemandAuthorization extends HalResource {
    @Expose()
    readonly bodyText!: string;

    @Expose()
    readonly buttonText!: string;
}
