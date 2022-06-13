import { Expose } from "class-transformer";
import type { ClearingDestination, ClearingSource } from "./types";

export class Clearing {
    @Expose()
    source?: ClearingSource;

    @Expose()
    destination?: ClearingDestination;
}
