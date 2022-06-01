import { Client } from "../Client";

export class BaseApi {
    constructor(private client: Client) {}

    protected getClient(): Client {
        return this.client;
    }
}
