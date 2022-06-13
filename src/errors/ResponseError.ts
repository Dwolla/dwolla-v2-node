import { Headers } from "node-fetch";
import { Response } from "../Token";
import { DwollaError } from "./DwollaError";

export class ResponseError<TResult = any> extends DwollaError {
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
