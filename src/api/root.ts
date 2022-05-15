import { Client } from "../client";
import { Root } from "../models/root";

export class RootApi {
    constructor(private readonly client: Client) {}

    async get(): Promise<Root> {
        return (await this.client.getMapped("/", undefined, undefined, Root)).body;
    }
}
