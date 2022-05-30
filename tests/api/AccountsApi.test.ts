import nock from "nock";
import "reflect-metadata";
import { Account, Client, Token, USAddress } from "../../src";
import { getApiHeaders, getClient, mockTokenRequest } from "../utils";

describe("AccountsApi", () => {
    const client: Client = getClient();
    let token: Token;

    const accountsResponse = {
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
    } as const;

    beforeAll(async () => {
        mockTokenRequest(client);
        token = await client.auth.requestToken();

        nock([client.environment.apiUrl, "/accounts", `/${accountsResponse.id}`].join(""), {
            reqheaders: getApiHeaders(token)
        })
            .persist()
            .get("")
            .reply(200, accountsResponse);
    });

    test("should be instanceof Account", async () => {
        const response = await client.api.accounts.get(accountsResponse.id);
        expect(response).toBeInstanceOf(Account);
    });

    test("should match Account schema", async () => {
        const response = await client.api.accounts.get(accountsResponse.id);

        expect(response).toEqual(
            expect.objectContaining({
                id: expect.any(String),
                name: expect.any(String),
                address: expect.any(USAddress),
                timezoneOffset: expect.any(Number),
                type: expect.any(String), // AccountType is compiled to String
                phone: expect.any(String),
                website: expect.any(String),
                authorizedRep: expect.any(String),
                created: expect.any(Date)
            })
        );
    });

    test("should have address match USAddress schema", async () => {
        const response = await client.api.accounts.get(accountsResponse.id);
        expect(response.address).toBeDefined();
        expect(response.address).toBeInstanceOf(USAddress);
        expect(response.address).toEqual(
            expect.objectContaining({
                address1: expect.any(String),
                address2: expect.any(String),
                city: expect.any(String),
                state: expect.any(String), // USState is compiled to String
                postalCode: expect.any(String)
            })
        );
    });

    test("should have created as instanceof Date & match parsed Date", async () => {
        const response = await client.api.accounts.get(accountsResponse.id);
        expect(response.created).toBeDefined();
        expect(response.created).toBeInstanceOf(Date);

        const parsedDate: Date = new Date(accountsResponse.created);
        expect(response.created).toEqual(parsedDate);
    });

    afterAll(() => {
        nock.cleanAll();
    });
});
