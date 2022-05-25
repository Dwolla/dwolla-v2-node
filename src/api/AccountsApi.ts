import { Client } from "../Client";
import { PATHS } from "../constants";
import { Account } from "../models/accounts/Account";

export class AccountsApi {
    constructor(private readonly client: Client) {}

    /**
     * Get account information belonging to the authorized Dwolla Master Account.
     *
     * In order to call this function, you will first need to call the root of the API,
     * either by using our high-level or low-level function.
     */
    async get(id: string): Promise<Account> {
        return (await this.client.getMapped(Account, `${PATHS.ACCOUNTS}/${id}`)).body;
    }
}
