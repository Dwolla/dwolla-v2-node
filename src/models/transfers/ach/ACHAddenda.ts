import { Expose } from "class-transformer";
import { ACHAddendaValues } from "./ACHAddendaValues";

export class ACHAddenda {
    @Expose()
    readonly addenda?: ACHAddendaValues;
}
