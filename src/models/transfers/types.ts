export type ClearingDestination = "next-available";

export type ClearingSource = "standard" | "next-available";

export type FailureCode =
    | "R01"
    | "R02"
    | "R03"
    | "R04"
    | "R05"
    | "R07"
    | "R08"
    | "R09"
    | "R10"
    | "R11"
    | "R16"
    | "R20"
    | "R29";

export type TransferStatus = "cancelled" | "failed" | "pending" | "processed";
