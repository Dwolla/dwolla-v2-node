import { Root } from "../models/Root";
import { BaseApi } from "./BaseApi";

export class RootApi extends BaseApi {
    async get(): Promise<Root> {
        return (await this.getClient().getMapped(Root, "/")).body;
    }
}
