import { Expose, Type } from "class-transformer";
import { HalResource } from "../HalResource";
import { ACHDestination, ACHSource } from "./ach";
import { EmbeddedTransfers } from "./EmbeddedTransfers";
import { RTPDestination } from "./rtp";
import { Metadata } from "./Metadata";

export class Transfers<
    ACHSourceType extends ACHSource,
    ACHDestinationType extends ACHDestination,
    MetadataType extends Metadata,
    RTPDestinationType extends RTPDestination
> extends HalResource {
    @Expose()
    @Type(() => EmbeddedTransfers)
    readonly _embedded!: EmbeddedTransfers<ACHSourceType, ACHDestinationType, MetadataType, RTPDestinationType>;
}
