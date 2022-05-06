import nock from "nock";
import { Client } from "../src";
import { Token } from "../src/token";
import { TokenManager } from "../src/token-manager";
import { unixSeconds } from "../src/utils";
import { getClient, mockTokenRequest } from "./utils";

describe("TokenManager", () => {
    const client: Client = getClient();

    const accessToken = "An-Access-Token";
    const existingToken = "An-Existing-Token";

    beforeAll(() => {
        mockTokenRequest(client, {
            access_token: accessToken,
            expires_in: 3600,
            token_type: "Bearer"
        });
    });

    it("should return new token when no other exists", async () => {
        const tokenManager: TokenManager = new TokenManager(client);
        const token: Token = await tokenManager.getToken();

        expect(token).toBeDefined();
        expect(token.state).toBeDefined();
        expect(token.state.accessToken).toEqual(accessToken);
    });

    it("should return existing token if fresh", async () => {
        const tokenManager: TokenManager = new TokenManager(client, {
            expiresIn: 3600,
            instance: new Token(client, {
                accessToken: existingToken,
                expiresIn: 3600,
                tokenType: "Bearer"
            }),
            updatedAt: unixSeconds()
        });

        const token: Token = await tokenManager.getToken();
        expect(token).toBeDefined();
        expect(token.state).toBeDefined();
        expect(token.state.accessToken).toEqual(existingToken);
    });

    it("should return a new token if stale", async () => {
        const tokenManager: TokenManager = new TokenManager(client, {
            expiresIn: 30,
            instance: new Token(client, {
                accessToken: existingToken,
                expiresIn: 30,
                tokenType: "Bearer"
            }),
            updatedAt: unixSeconds()
        });

        const token: Token = await tokenManager.getToken();
        expect(token).toBeDefined();
        expect(token.state).toBeDefined();
        expect(token.state.accessToken).toEqual(accessToken);
    });

    afterAll(() => {
        nock.cleanAll();
    });
});
