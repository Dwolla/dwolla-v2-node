import { Root } from "../models";
import { BaseApi } from "./BaseApi";

export class RootApi extends BaseApi {
    async get(): Promise<Root> {
        return (await this.client.getMapped(Root, "/")).body;
    }
}
