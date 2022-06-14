import { Expose } from "class-transformer";
import { ClearingDestination, ClearingSource } from "./types";

export class Clearing {
    @Expose()
    source?: ClearingSource;

    @Expose()
    destination?: ClearingDestination;
}
