declare module "dwolla-v2" {
  export class Client {
    auth: Auth;
    get: (
      resource: string,
      parameters?: { [prop: string]: string },
      headers?: { "Idempotency-Key": string } & { [prop: string]: string },
    ) => Promise<Response>;
    post: (
      resource: string,
      parameters?: { [prop: string]: string },
      headers?: { "Idempotency-Key": string } & { [prop: string]: string },
    ) => Promise<Response>;
    delete: (resource: string) => Promise<Response>;
    constructor(options: {
      key: string;
      secret: string;
      environment?: "production" | "sandbox";
      onGrant?: (token: string) => {};
    });
  }

  interface Auth {
    client: () => Promise<Client>;
    refresh: () => Promise<Client>;
  }

  interface Response {
    status: string;
    headers: any;
    body: any | string;
  }
}
