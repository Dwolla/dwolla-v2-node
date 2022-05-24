import { Client } from "../Client";
import { RootApi } from "./RootApi";

export class Api {
    readonly root: RootApi;

    constructor(client: Client) {
        this.root = new RootApi(client);
    }
}
