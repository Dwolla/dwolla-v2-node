import nock from "nock";
import "reflect-metadata";
import { Client, Token } from "../../src";
import { PATHS } from "../../src/constants";
import { getApiHeaders, getClient, mockTokenRequest } from "../utils";

describe("Accounts API", () => {
    const client: Client = getClient();
    let token: Token;

    beforeAll(async () => {
        mockTokenRequest(client);
        token = await client.auth.requestToken();
    });

    test("should get account", async () => {
        const responseBody = {
            id: "1234",
            name: "Dwolla, Inc.",
            address: {
                address1: "123 Main Street",
                address2: "Apt. 101",
                city: "Des Moines",
                state: "IA",
                postalCode: "50047"
            },
            timezoneOffset: -6.0,
            type: "Commercial",
            phone: "1234567890",
            website: "https://dwolla.com",
            authorizedRep: "John Doe",
            created: "2022-05-25T02:58:03Z"
        };

        nock([client.environment.apiUrl, PATHS.ACCOUNTS, responseBody.id].join("/"), {
            reqheaders: getApiHeaders(token)
        })
            .get("")
            .reply(200, responseBody);

        expect(responseBody).toEqual(
            expect.objectContaining({
                id: responseBody.id,
                name: responseBody.name,
                address: expect.objectContaining({
                    address1: responseBody.address.address1,
                    address2: responseBody.address.address2,
                    city: responseBody.address.city,
                    state: responseBody.address.state,
                    postalCode: responseBody.address.postalCode
                }),
                timezoneOffset: responseBody.timezoneOffset,
                type: responseBody.type,
                phone: responseBody.phone,
                website: responseBody.website,
                authorizedRep: responseBody.authorizedRep,
                created: responseBody.created
            })
        );
    });

    afterAll(() => {
        nock.cleanAll();
    });
});
