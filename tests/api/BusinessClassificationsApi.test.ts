import nock from "nock";
import { Client } from "../../src";
import { PATHS } from "../../src/constants";
import { Token } from "../../src/Token";
import { getApiHeaders, getClient, mockTokenRequest } from "../utils";

describe("Business Classifications API", () => {
    const client: Client = getClient();
    let token: Token;

    beforeEach(async () => {
        mockTokenRequest(client);
        token = await client.auth.requestToken();
    });

    test("should get business classification", async () => {
        const id = "123";

        const responseBody = {
            _embedded: {
                "industry-classifications": [
                    {
                        id: "1234567890",
                        name: "Industry Classification Test"
                    }
                ]
            },
            id: "0987654321",
            name: "Business Classification Test"
        };

        nock([client.environment.apiUrl, PATHS.BUSINESS_CLASSIFICATIONS, id].join("/"), {
            reqheaders: getApiHeaders(token)
        })
            .get("")
            .reply(200, responseBody);

        const response = await client.api.businessClassifications.get(id);

        expect(response).toEqual(
            expect.objectContaining({
                _embedded: expect.objectContaining({
                    "industry-classifications": expect.arrayContaining([
                        expect.objectContaining({
                            id: responseBody._embedded["industry-classifications"][0].id,
                            name: responseBody._embedded["industry-classifications"][0].name
                        })
                    ])
                }),
                id: responseBody.id,
                name: responseBody.name
            })
        );
    });

    test("should list business classifications", async () => {
        const responseBody = {
            _embedded: {
                "business-classifications": [
                    {
                        _embedded: {
                            "industry-classifications": [
                                {
                                    id: "1234567890",
                                    name: "Industry Classification Test"
                                }
                            ]
                        },
                        id: "0987654321",
                        name: "Business Classification Test"
                    }
                ]
            },
            total: 6
        };

        nock([client.environment.apiUrl, PATHS.BUSINESS_CLASSIFICATIONS].join("/"), {
            reqheaders: getApiHeaders(token)
        })
            .get("")
            .reply(200, responseBody);

        const response = await client.api.businessClassifications.list();

        expect(response).toEqual(
            expect.objectContaining({
                _embedded: expect.objectContaining({
                    "business-classifications": expect.arrayContaining([
                        expect.objectContaining({
                            _embedded: expect.objectContaining({
                                "industry-classifications": expect.arrayContaining([
                                    expect.objectContaining({
                                        id: responseBody._embedded["business-classifications"][0]._embedded[
                                            "industry-classifications"
                                        ][0].id,
                                        name: responseBody._embedded["business-classifications"][0]._embedded[
                                            "industry-classifications"
                                        ][0].name
                                    })
                                ])
                            }),
                            id: responseBody._embedded["business-classifications"][0].id,
                            name: responseBody._embedded["business-classifications"][0].name
                        })
                    ])
                }),
                total: responseBody.total
            })
        );
    });

    afterEach(() => {
        nock.cleanAll();
    });
});
