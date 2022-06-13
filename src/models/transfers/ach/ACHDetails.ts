import { Expose } from "class-transformer";
import { ACHDestination } from "./ACHDestination";
import { ACHSource } from "./ACHSource";

export class ACHDetails<SourceType extends ACHSource, DestinationType extends ACHDestination> {
    @Expose()
    readonly source?: SourceType; // -> The `Type()` for this is handled by `targetMaps`

    @Expose()
    readonly destination?: DestinationType; // -> The `Type()` for this is handled by `targetMaps`
}
