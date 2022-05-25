import { Client } from "../Client";
import { AccountsApi } from "./AccountsApi";
import { RootApi } from "./RootApi";

export class Api {
    readonly accounts: AccountsApi;
    readonly root: RootApi;

    constructor(client: Client) {
        this.accounts = new AccountsApi(client);
        this.root = new RootApi(client);
    }
}
