import { Client } from "../src";

describe("Dwolla Environment", () => {
    test("should allow custom environment", () => {
        const client = new Client({
            environment: {
                apiUrl: "https://mydomain.com",
                tokenUrl: "https://mydomain.com/token"
            },
            key: "client_key",
            secret: "client_secret"
        });

        expect(client.environment.apiUrl).toEqual("https://mydomain.com");
        expect(client.environment.tokenUrl).toEqual("https://mydomain.com/token");
    });

    test("should default to production if none provided", () => {
        const client = new Client({
            key: "client_key",
            secret: "client_secret"
        });

        expect(client.environment.apiUrl).toEqual("https://api.dwolla.com");
        expect(client.environment.tokenUrl).toEqual("https://api.dwolla.com/token");
    });

    test("should set sandbox environment", () => {
        const client = new Client({
            environment: "sandbox",
            key: "client_key",
            secret: "client_secret"
        });

        expect(client.environment.apiUrl).toEqual("https://api-sandbox.dwolla.com");
        expect(client.environment.tokenUrl).toEqual("https://api-sandbox.dwolla.com/token");
    });

    test("should set production environment", () => {
        const client = new Client({
            environment: "production",
            key: "client_key",
            secret: "client_secret"
        });

        expect(client.environment.apiUrl).toEqual("https://api.dwolla.com");
        expect(client.environment.tokenUrl).toEqual("https://api.dwolla.com/token");
    });
});
