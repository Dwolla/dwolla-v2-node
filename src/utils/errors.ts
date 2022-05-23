import { DwollaError } from "../errors/dwolla.error";
import { ResponseError } from "../errors/response.error";

export const isDwollaError = (obj: any): obj is DwollaError => obj instanceof DwollaError;

export const isResponseError = (obj: any): obj is ResponseError => obj instanceof ResponseError;
