import { Client } from "../client";
import { RootApi } from "./root";

export class Api {
    readonly root: RootApi;

    constructor(client: Client) {
        this.root = new RootApi(client);
    }
}
