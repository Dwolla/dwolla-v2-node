import nock from "nock";
import { Client, Token, TokenState } from "../src";
import { getClient, mockTokenRequest } from "./utils";

describe("Auth", () => {
    const client: Client = getClient();

    const accessToken = "An-Access-Token";
    const expiresIn = 3600;

    beforeAll(() => {
        mockTokenRequest(client, {
            access_token: accessToken,
            expires_in: expiresIn,
            token_type: "Bearer"
        });
    });

    it("should generate successful token", async () => {
        const token: Token = await client.auth.requestToken();
        expect(token).toBeDefined();
        expect(token.state).toBeDefined();

        const state: TokenState = token.state;
        expect(state.accessToken).toEqual(accessToken);
        expect(state.expiresIn).toEqual(expiresIn);
    });

    afterAll(() => {
        nock.cleanAll();
    });
});
