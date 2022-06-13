import { Expose } from "class-transformer";

export class RTPDestination {
    @Expose()
    readonly remittanceData?: string;
}
