import nock from "nock";
import { Client } from "../src";
import { userAgent } from "../src/utils";

export function getClient(): Client {
    return new Client({
        environment: "sandbox",
        id: "client_id",
        secret: "client_secret"
    });
}

export function mockTokenRequest(client: Client, response: any): void {
    nock(client.environment.tokenUrl, {
        reqheaders: {
            "Content-Type": "application/x-www-form-urlencoded",
            "User-Agent": userAgent()
        }
    })
        .persist()
        .post("", {
            client_id: client.options.id,
            client_secret: client.options.secret,
            grant_type: "client_credentials"
        })
        .reply(200, response);
}
