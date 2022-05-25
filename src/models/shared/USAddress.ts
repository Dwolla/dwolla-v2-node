import { Expose, Transform } from "class-transformer";
import { USState } from "../../shared/USState";
import { stringToEnum } from "../../utils";

export class USAddress {
    @Expose()
    readonly address1!: string;

    @Expose()
    readonly address2?: string;

    @Expose()
    readonly city!: string;

    @Expose()
    @Transform(({ value }) => stringToEnum(USState, value), { toClassOnly: true })
    readonly state!: USState;

    @Expose()
    readonly postalCode!: string;
}
