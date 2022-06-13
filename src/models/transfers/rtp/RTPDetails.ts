import { Expose } from "class-transformer";
import { RTPDestination } from "./RTPDestination";

export class RTPDetails<DestinationType extends RTPDestination> {
    @Expose()
    readonly destination?: DestinationType; // -> The `@Type()` for this is handled by `targetMaps`
}
