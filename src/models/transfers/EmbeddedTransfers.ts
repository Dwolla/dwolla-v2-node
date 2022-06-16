import { Expose, Type } from "class-transformer";
import { ACHDestination, ACHSource } from "./ach";
import { RTPDestination } from "./rtp";
import { Transfer } from "./Transfer";
import { Metadata } from "./Metadata";

export class EmbeddedTransfers<
    ACHSourceType extends ACHSource,
    ACHDestinationType extends ACHDestination,
    MetadataType extends Metadata,
    RTPDestinationType extends RTPDestination
> {
    @Expose()
    @Type(() => Transfer)
    readonly transfers!: Transfer<ACHSourceType, ACHDestinationType, MetadataType, RTPDestinationType>[];
}
