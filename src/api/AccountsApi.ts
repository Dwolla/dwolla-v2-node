import { PATHS } from "../constants";
import { Account } from "../models/accounts";
import { BaseApi } from "./BaseApi";

export class AccountsApi extends BaseApi {
    /**
     * Get account information belonging to the authorized Dwolla Master Account.
     *
     * In order to call this function, you will first need to call the root of the API,
     * either by using our high-level or low-level function.
     */
    async get(id: string): Promise<Account> {
        return (await this.getClient().getMapped(Account, this.buildUrl(PATHS.ACCOUNTS, id))).body;
    }
}
