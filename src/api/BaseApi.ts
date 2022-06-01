import { Client } from "../Client";

export abstract class BaseApi {
    constructor(private client: Client) {}

    protected getClient(): Client {
        return this.client;
    }
}
