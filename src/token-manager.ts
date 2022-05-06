import { Client } from "./client";
import { Token } from "./token";
import { unixSeconds } from "./utils";

export interface TokenState {
    accessToken: string;
    expiresIn: number;
    tokenType: string;
}

export interface TokenManagerState {
    expiresIn: number | null;
    instance?: Token;
    updatedAt: number;
}

export class TokenManager {
    static #EXPIRES_IN_DELTA = 60;

    readonly #client: Client;
    #state?: TokenManagerState;

    constructor(client: Client, state?: TokenManagerState) {
        this.#client = client;
        this.#state = state;

        // If we're currently testing, don't automatically update token
        if (process.env.NODE_ENV !== "test") {
            this.#updateToken().catch((err) => console.error(err));
        }
    }

    async getToken(): Promise<Token> {
        if (!this.#state?.instance || !this.#isTokenFresh()) {
            return await this.#updateToken();
        }
        return this.#state.instance;
    }

    #isTokenFresh(): boolean {
        if (!this.#state) return false;
        return (
            this.#state.expiresIn === null ||
            this.#state.expiresIn + this.#state.updatedAt > unixSeconds() + TokenManager.#EXPIRES_IN_DELTA
        );
    }

    async #updateToken(): Promise<Token> {
        const instance: Token = await this.#client.auth.requestToken();

        this.#state = {
            expiresIn: instance.state.expiresIn,
            instance,
            updatedAt: unixSeconds()
        };
        return instance;
    }
}
