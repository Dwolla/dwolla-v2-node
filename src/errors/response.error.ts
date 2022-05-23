import { Headers } from "node-fetch";
import { HalResource } from "../models/base-hal";
import { Response } from "../token";
import { DwollaError } from "./dwolla.error";

export class ResponseError<TResult extends HalResource = any> extends DwollaError {
    readonly body: TResult;
    readonly headers: Headers;
    readonly status: number;

    constructor(response: Response<TResult>) {
        super(JSON.stringify(response.body));

        this.body = response.body;
        this.headers = response.headers;
        this.status = response.status;
    }
}