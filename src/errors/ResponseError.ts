import { Headers } from "node-fetch";
import { HalResource } from "../models/HalResource";
import { Response } from "../Token";
import { DwollaError } from "./DwollaError";

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
