import { Expose } from "class-transformer";
import { ClearingDestination } from "./ClearingDestination";
import { ClearingSource } from "./ClearingSource";

export class Clearing {
    @Expose()
    source?: ClearingSource;

    @Expose()
    destination?: ClearingDestination;
}
