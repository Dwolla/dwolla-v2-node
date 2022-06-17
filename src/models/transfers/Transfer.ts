import { Expose, Type } from "class-transformer";
import { HalResource } from "../HalResource";
import { Money } from "../shared";
import { ACHDestination, ACHDetails, ACHSource } from "./ach";
import { Clearing } from "./Clearing";
import { Metadata } from "./Metadata";
import { RTPDestination, RTPDetails } from "./rtp";
import { TransferStatus } from "./TransferStatus";

export class Transfer<
    ACHSourceType extends ACHSource,
    ACHDestinationType extends ACHDestination,
    MetadataType extends Metadata,
    RTPDestinationType extends RTPDestination
> extends HalResource {
    @Expose()
    readonly id!: string;

    @Expose()
    readonly status!: TransferStatus;

    @Expose()
    @Type(() => Money)
    readonly amount!: Money;

    @Expose()
    readonly created!: Date;

    @Expose()
    readonly metadata?: MetadataType; // -> The `Type()` for this is handled by `targetMaps`

    @Expose()
    @Type(() => Clearing)
    readonly clearing?: Clearing;

    @Expose()
    readonly achDetails?: ACHDetails<ACHSourceType, ACHDestinationType>; // -> The `Type()` for this is handled by `targetMaps`

    @Expose()
    readonly rtpDetails?: RTPDetails<RTPDestinationType>; // -> The `Type()` for this is handled by `targetMaps`

    @Expose()
    readonly correlationId?: string;

    @Expose()
    readonly individualAchId?: string;

    @Expose()
    readonly processingChannel?: {
        destination?: "real-time-payments";
    };
}
