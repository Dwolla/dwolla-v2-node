import { Headers } from "node-fetch";
import { Response } from "../Token";
import { DwollaError } from "./DwollaError";

export class ResponseError<ResultType = unknown> extends DwollaError {
    readonly body: ResultType;
    readonly headers: Headers;
    readonly status: number;

    constructor(response: Response<ResultType>) {
        super(JSON.stringify(response.body));

        this.body = response.body;
        this.headers = response.headers;
        this.status = response.status;
    }
}
