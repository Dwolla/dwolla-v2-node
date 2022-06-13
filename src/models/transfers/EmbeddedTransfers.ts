import { Expose, Type } from "class-transformer";
import { ACHDestination, ACHSource } from "./ach";
import { RTPDestination } from "./rtp";
import { Transfer } from "./Transfer";

export class EmbeddedTransfers<
    ACHSourceType extends ACHSource,
    ACHDestinationType extends ACHDestination,
    RTPDestinationType extends RTPDestination
> {
    @Expose()
    @Type(() => Transfer)
    readonly transfers!: Transfer<ACHSourceType, ACHDestinationType, RTPDestinationType>[];
}
