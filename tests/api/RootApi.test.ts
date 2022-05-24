import nock from "nock";
import "reflect-metadata";
import { Client } from "../../src";
import { Root } from "../../src/models/root";
import { Token } from "../../src/token";
import { getApiHeaders, getClient, mockTokenRequest } from "../utils";

describe("RootApi", () => {
    const client: Client = getClient();
    let token: Token;

    const rootResponse = {
        _links: {
            account: {
                href: "https://api.dwolla.com/accounts/1234",
                "resource-type": "account"
            },
            customers: {
                href: "https://api.dwolla.com/customers",
                "resource-type": "customer"
            }
        }
    } as const;

    beforeAll(async () => {
        mockTokenRequest(client);
        token = await client.auth.requestToken();

        nock(client.environment.apiUrl, { reqheaders: getApiHeaders(token) })
            .persist()
            .get("/")
            .reply(200, rootResponse);
    });

    test("should be instanceof Root", async () => {
        const response = await client.api.root.get();
        expect(response).toBeDefined();
        expect(response).toBeInstanceOf(Root);
    });

    test("should have `account` Link via hasLink()", async () => {
        const response = await client.api.root.get();
        expect(response).toBeDefined();
        expect(response.hasLink("account")).toEqual(true);
    });

    test("should get `customers` href via getHref()", async () => {
        const response = await client.api.root.get();
        expect(response).toBeDefined();
        expect(response.getHref("customers")).toEqual(rootResponse._links.customers.href);
    });

    afterAll(() => {
        nock.cleanAll();
    });
});
