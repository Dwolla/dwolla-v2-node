import nock from "nock";
import { Client } from "../src";
import { Token } from "../src/Token";
import { userAgent } from "../src/utils";

export function getApiHeaders(token: Token): { Authorization: string; Accept: string; "User-Agent": string } {
    return {
        Authorization: ["Bearer", token.state.accessToken].join(" "),
        Accept: "application/vnd.dwolla.v1.hal+json",
        "User-Agent": userAgent()
    };
}

export function getClient(): Client {
    return new Client({
        environment: "sandbox",
        id: "client_id",
        secret: "client_secret"
    });
}

export function mockTokenRequest(
    client: Client,
    response: any = {
        access_token: "Default-Access-Token",
        expiresIn: 3600,
        token_type: "Bearer"
    }
): void {
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
