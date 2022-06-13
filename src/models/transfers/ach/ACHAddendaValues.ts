import { Expose } from "class-transformer";

export class ACHAddendaValues {
    @Expose()
    readonly values?: string[];
}
