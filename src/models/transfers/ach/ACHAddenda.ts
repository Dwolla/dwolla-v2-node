import { Expose, Type } from "class-transformer";
import { ACHAddendaValues } from "./ACHAddendaValues";

export class ACHAddenda {
    @Expose()
    @Type(() => ACHAddendaValues)
    readonly addenda?: ACHAddendaValues;
}
