import { ClassConstructor, TargetMap } from "class-transformer";
import { PATHS } from "../constants";
import { Money } from "../models/shared";
import {
    ACHDestination,
    ACHDetails,
    ACHSource,
    ClearingDestination,
    ClearingSource,
    FacilitatorFees,
    FailureReason,
    RTPDestination,
    RTPDetails,
    Transfer,
    Transfers,
    TransferStatus
} from "../models/transfers";
import { RequestHeaders } from "../Token";
import { BaseApi } from "./BaseApi";

export interface InitiateTransferBody<
    ACHSourceType extends ACHSource,
    ACHDestinationType extends ACHDestination,
    RTPDestinationType extends RTPDestination
> {
    _links: { source: { href: string }; destination: { href: string } };
    amount: Required<Money>;
    metadata?: TransferMetadata;
    fees?: TransferFee;
    clearing?: TransferClearing;
    achDetails?: TransferACHDetails<ACHSourceType, ACHDestinationType>;
    rtpDetails?: TransferRTPDetails<RTPDestinationType>;
    correlationId?: string;
    processingChannel?: { destination: "real-time-payments" };
}

export interface ListForCustomerQueryParams {
    search?: string;
    startAmount?: string;
    endAmount?: string;
    startDate?: string;
    endDate?: string;
    status?: TransferStatus;
    correlationId?: string;
    limit?: number;
    offset?: number;
}

export interface TransferACHDetails<SourceType extends ACHSource, DestinationType extends ACHDestination> {
    source?: Partial<SourceType>;
    destination?: Partial<DestinationType>;
}

export interface TransferClearing {
    source?: ClearingSource;
    destination?: ClearingDestination;
}

export interface TransferFee {
    _links: {
        "charge-to": string;
    };
    amount: Required<Money>;
}

export interface TransferMetadata {
    [key: string]: string;
}

export interface TransferRTPDetails<DestinationType extends RTPDestination> {
    destination?: Partial<DestinationType>;
}

export type TransferTargetMaps<
    ACHSourceType extends ACHSource,
    ACHDestinationType extends ACHDestination,
    RTPDestinationType extends RTPDestination
> = {
    ach?: { source?: ClassConstructor<ACHSourceType>; destination?: ClassConstructor<ACHDestinationType> };
    rtp?: { destination?: ClassConstructor<RTPDestinationType> };
};

export class TransfersApi extends BaseApi {
    async cancel<
        ACHSourceType extends ACHSource,
        ACHDestinationType extends ACHDestination,
        RTPDestinationType extends RTPDestination
    >(
        id: string,
        targetMaps?: TransferTargetMaps<ACHSourceType, ACHDestinationType, RTPDestinationType>
    ): Promise<Transfer<ACHSourceType, ACHDestinationType, RTPDestinationType>> {
        return (
            await this.getClient().postMapped(
                new Transfer<ACHSourceType, ACHDestinationType, RTPDestinationType>(),
                this.buildUrl(PATHS.TRANSFERS, id),
                { status: "cancelled" },
                undefined,
                this.getTargetMaps(targetMaps)
            )
        ).body;
    }

    async get<
        ACHSourceType extends ACHSource,
        ACHDestinationType extends ACHDestination,
        RTPDestinationType extends RTPDestination
    >(
        id: string,
        targetMaps?: TransferTargetMaps<ACHSourceType, ACHDestinationType, RTPDestinationType>
    ): Promise<Transfer<ACHSourceType, ACHDestinationType, RTPDestinationType>> {
        return (
            await this.getClient().getMapped(
                new Transfer<ACHSourceType, ACHDestinationType, RTPDestinationType>(),
                this.buildUrl(PATHS.TRANSFERS, id),
                undefined,
                undefined,
                this.getTargetMaps(targetMaps)
            )
        ).body;
    }

    async getFailureReason(id: string): Promise<FailureReason> {
        return (await this.getClient().getMapped(FailureReason, this.buildUrl(PATHS.TRANSFERS, id, PATHS.FAILURE)))
            .body;
    }

    private getTargetMaps<
        ACHSourceType extends ACHSource,
        ACHDestinationType extends ACHDestination,
        RTPDestinationType extends RTPDestination
    >(targetMaps?: TransferTargetMaps<ACHSourceType, ACHDestinationType, RTPDestinationType>): TargetMap[] {
        return [
            {
                target: ACHDetails,
                properties: {
                    source: targetMaps?.ach?.source ?? ACHSource,
                    destination: targetMaps?.ach?.destination ?? ACHDestination
                }
            },
            {
                target: RTPDetails,
                properties: {
                    destination: targetMaps?.rtp?.destination ?? RTPDestination
                }
            }
        ];
    }

    async listFees(id: string): Promise<FacilitatorFees> {
        return (await this.getClient().getMapped(FacilitatorFees, this.buildUrl(PATHS.TRANSFERS, id, PATHS.FEES))).body;
    }

    async listForCustomer<
        ACHSourceType extends ACHSource,
        ACHDestinationType extends ACHDestination,
        RTPDestinationType extends RTPDestination
    >(
        customerId: string,
        query?: ListForCustomerQueryParams,
        targetMaps?: TransferTargetMaps<ACHSourceType, ACHDestinationType, RTPDestinationType>
    ): Promise<Transfers<ACHSourceType, ACHDestinationType, RTPDestinationType>> {
        return (
            await this.getClient().getMapped(
                new Transfers<ACHSourceType, ACHDestinationType, RTPDestinationType>(),
                this.buildUrl(PATHS.CUSTOMERS, customerId, PATHS.TRANSFERS),
                query,
                undefined,
                this.getTargetMaps(targetMaps)
            )
        ).body;
    }

    async initiateTransfer<
        ACHSourceType extends ACHSource,
        ACHDestinationType extends ACHDestination,
        RTPDestinationType extends RTPDestination
    >(
        body: InitiateTransferBody<ACHSourceType, ACHDestinationType, RTPDestinationType>,
        headers?: RequestHeaders,
        targetMaps?: TransferTargetMaps<ACHSourceType, ACHDestinationType, RTPDestinationType>
    ): Promise<Transfer<ACHSourceType, ACHDestinationType, RTPDestinationType>> {
        return (
            await this.getClient().postFollowMapped(
                new Transfer<ACHSourceType, ACHDestinationType, RTPDestinationType>(),
                PATHS.TRANSFERS,
                body,
                headers,
                this.getTargetMaps(targetMaps)
            )
        ).body;
    }
}
