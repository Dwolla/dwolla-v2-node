import { Client } from "../Client";
import { Root } from "../models/Root";

export class RootApi {
    constructor(private readonly client: Client) {}

    async get(): Promise<Root> {
        return (await this.client.getMapped(Root, "/")).body;
    }
}
