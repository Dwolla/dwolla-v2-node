import FormData from "form-data";
import cases from "jest-in-case";
import nock from "nock";
import { Client, PathLike, RequestHeaders, RequestQuery, Response, ResponseError, Token, TokenState } from "../src";
import { toFormData, userAgent } from "../src/utils";
import { getClient } from "./utils";

interface BaseSDKOptions {
    headers?: RequestHeaders; // Defaults to only auth headers w/ token
    isError?: boolean; // If set to true, check for any error(s) thrown
    nockPath: string;
    nockReplyObj?: any; // Defaults to `responseBody`
    nockReplyStatus?: number; // Defaults to `200`
    sdkPath: PathLike;
    query?: RequestQuery; // Defaults to an empty object, `{}`
}

interface ConfigurationOptions {
    property: keyof TokenState;
}

type DeleteTestOptions = BaseSDKOptions;

type GetTestOptions = BaseSDKOptions;

type PostTestOptions = Omit<BaseSDKOptions, "query"> & {
    reqBody?: any;
};

describe("Token", () => {
    const client: Client = getClient();

    const additionalHeaders: RequestHeaders = { "Idempotency-Key": "An-Idempotency-Key" };
    const requestBody: any = { request: "Body" };
    const responseBody: any = { response: "Body" };
    const textResponseBody = "Text Response Body";
    const formDataRequestBody: FormData = toFormData(requestBody);

    const tokenState: TokenState = {
        accessToken: "An-Access-Token",
        expiresIn: 3600,
        tokenType: "Bearer"
    };

    cases("Configuration", testConfiguration, {
        "should set state access token": {
            property: "accessToken"
        },
        "should set state expiration (unix seconds)": {
            property: "expiresIn"
        },
        "should set state type (Bearer)": {
            property: "tokenType"
        }
    });

    cases("DELETE options", testDeleteCases, {
        "should DELETE using a resource object": {
            nockPath: "https://foo.bar/baz",
            sdkPath: { _links: { self: { href: "https://foo.bar/baz" } } }
        },
        "should DELETE using a leading slash": {
            nockPath: [client.environment.apiUrl, "/baz"].join(""),
            sdkPath: "/baz"
        },
        "should DELETE using the full URL": {
            nockPath: [client.environment.apiUrl, "baz"].join("/"),
            sdkPath: [client.environment.apiUrl, "baz"].join("/")
        },
        "should DELETE successful resource response (no leading slash)": {
            nockPath: [client.environment.apiUrl, "baz"].join("/"),
            sdkPath: "baz"
        },
        "should DELETE successful text response (no leading slash)": {
            nockPath: [client.environment.apiUrl, "baz"].join("/"),
            nockReplyObj: textResponseBody,
            sdkPath: "baz"
        },
        "should DELETE have thrown error response": {
            isError: true,
            nockPath: [client.environment.apiUrl, "baz"].join("/"),
            nockReplyStatus: 400,
            sdkPath: "baz"
        },
        "should DELETE using query parameter(s)": {
            nockPath: [client.environment.apiUrl, "baz"].join("/"),
            sdkPath: "baz",
            query: { foo: "bar" }
        },
        "should DELETE using additional header(s)": {
            headers: additionalHeaders,
            nockPath: [client.environment.apiUrl, "baz"].join("/"),
            query: { foo: "bar" },
            sdkPath: "baz"
        }
    });

    cases("GET operations", testGetCases, {
        "should GET using a resource object": {
            nockPath: "https://foo.bar/baz",
            sdkPath: { _links: { self: { href: "https://foo.bar/baz" } } }
        },
        "should GET using a leading slash": {
            nockPath: [client.environment.apiUrl, "/baz"].join(""),
            sdkPath: "/baz"
        },
        "should GET using the full URL": {
            nockPath: [client.environment.apiUrl, "baz"].join("/"),
            sdkPath: [client.environment.apiUrl, "baz"].join("/")
        },
        "should GET using other domain": {
            nockPath: [client.environment.apiUrl, "baz"].join("/"),
            sdkPath: ["https://foo.com", "baz"].join("/")
        },
        "should GET successful resource response (no leading slash)": {
            nockPath: [client.environment.apiUrl, "baz"].join("/"),
            sdkPath: "baz"
        },
        "should GET successful text response (no leading slash)": {
            nockPath: [client.environment.apiUrl, "baz"].join("/"),
            nockReplyObj: textResponseBody,
            sdkPath: "baz"
        },
        "should GET have thrown error response": {
            isError: true,
            nockPath: [client.environment.apiUrl, "baz"].join("/"),
            nockReplyStatus: 400,
            sdkPath: "baz"
        },
        "should GET using query parameter(s)": {
            nockPath: [client.environment.apiUrl, "baz"].join("/"),
            sdkPath: "baz",
            query: { foo: "bar" }
        },
        "should GET using additional header(s)": {
            headers: additionalHeaders,
            nockPath: [client.environment.apiUrl, "baz"].join("/"),
            query: { foo: "bar" },
            sdkPath: "baz"
        }
    });

    cases("POST operations", testPostCases, {
        "should POST using a resource object": {
            nockPath: "https://foo.bar/baz",
            reqBody: requestBody,
            sdkPath: { _links: { self: { href: "https://foo.bar/baz" } } }
        },
        "should POST using a leading slash": {
            nockPath: [client.environment.apiUrl, "/baz"].join(""),
            reqBody: requestBody,
            sdkPath: "/baz"
        },
        "should POST using the full URL": {
            nockPath: [client.environment.apiUrl, "/baz"].join(""),
            reqBody: requestBody,
            sdkPath: [client.environment.apiUrl, "/baz"].join("")
        },
        "should POST successful resource response (no leading slash)": {
            nockPath: [client.environment.apiUrl, "baz"].join("/"),
            reqBody: requestBody,
            sdkPath: "baz"
        },
        "should POST successful text response (no leading slash)": {
            nockPath: [client.environment.apiUrl, "baz"].join("/"),
            nockReplyObj: textResponseBody,
            reqBody: requestBody,
            sdkPath: "baz"
        },
        "should POST have thrown error response": {
            isError: true,
            nockPath: [client.environment.apiUrl, "baz"].join("/"),
            nockReplyStatus: 400,
            reqBody: requestBody,
            sdkPath: "baz"
        },
        "should POST using undefined body": {
            nockPath: [client.environment.apiUrl, "baz"].join("/"),
            reqBody: undefined,
            sdkPath: "baz"
        },
        "should POST using additional header(s)": {
            headers: additionalHeaders,
            nockPath: [client.environment.apiUrl, "baz"].join("/"),
            reqBody: undefined,
            sdkPath: "baz"
        },
        "should POST using form data": {
            nockPath: [client.environment.apiUrl, "baz"].join("/"),
            reqBody: formDataRequestBody,
            sdkPath: "baz"
        }
    });

    function getRequestHeadersWithToken(token: Token, additionalHeaders?: RequestHeaders): RequestHeaders {
        return Object.assign(
            {
                Accept: "application/vnd.dwolla.v1.hal+json",
                Authorization: ["Bearer", token.state.accessToken].join(" "),
                "User-Agent": userAgent()
            },
            additionalHeaders
        );
    }

    function testConfiguration(opts: ConfigurationOptions): void {
        const token: Token = new Token(client, tokenState);
        expect(token.state).toBeDefined();
        expect(token.state[opts.property]).toEqual(tokenState[opts.property]);
    }

    async function testDeleteCases(opts: DeleteTestOptions): Promise<void> {
        const token: Token = new Token(client, tokenState);

        nock(opts.nockPath, { reqheaders: Object.assign(getRequestHeadersWithToken(token), opts.headers) })
            .delete("")
            .query(opts.query ?? {})
            .reply(opts.nockReplyStatus ?? 200, opts.nockReplyObj ?? responseBody);

        if (opts.isError) {
            try {
                await token.delete(opts.sdkPath, opts.query, opts.headers);
            } catch (err) {
                expect(err).toBeInstanceOf(Error);
                expect((err as ResponseError).body).toEqual(opts.nockReplyObj ?? responseBody);
            }
        } else {
            const response: Response = await token.delete(opts.sdkPath, opts.query, opts.headers);
            expect(response).toBeDefined();
            expect(response.body).toEqual(opts.nockReplyObj ?? responseBody);
        }
    }

    async function testGetCases(opts: GetTestOptions): Promise<void> {
        const token: Token = new Token(client, tokenState);

        nock(opts.nockPath, { reqheaders: Object.assign(getRequestHeadersWithToken(token, opts.headers)) })
            .get("")
            .query(opts.query ?? {})
            .reply(opts.nockReplyStatus ?? 200, opts.nockReplyObj ?? responseBody);

        if (opts.isError) {
            try {
                await token.get(opts.sdkPath, opts.query, opts.headers);
            } catch (err) {
                expect(err).toBeInstanceOf(Error);
                expect((err as ResponseError).body).toEqual(opts.nockReplyObj ?? responseBody);
            }
        } else {
            const response: Response = await token.get(opts.sdkPath, opts.query, opts.headers);
            expect(response).toBeDefined();
            expect(response.body).toEqual(opts.nockReplyObj ?? responseBody);
        }
    }

    async function testPostCases(opts: PostTestOptions): Promise<void> {
        const formDataLength: number | undefined =
            opts.reqBody instanceof FormData ? formDataRequestBody.getLengthSync() : undefined;
        const token: Token = new Token(client, tokenState);

        nock(opts.nockPath, { reqheaders: Object.assign(getRequestHeadersWithToken(token, opts.headers)) })
            .post("", formDataLength ? (body) => body.length === formDataLength : opts.reqBody)
            .reply(opts.nockReplyStatus ?? 200, opts.nockReplyObj ?? responseBody);

        if (opts.isError) {
            try {
                await token.post(opts.sdkPath, opts.reqBody, opts.headers);
            } catch (err) {
                expect(err).toBeInstanceOf(Error);
                expect((err as ResponseError).body).toEqual(opts.nockReplyObj ?? responseBody);
            }
        } else {
            const response: Response = await token.post(opts.sdkPath, opts.reqBody, opts.headers);
            expect(response).toBeDefined();
            expect(response.body).toEqual(opts.nockReplyObj ?? responseBody);
        }
    }
});
