declare module "dwolla-v2" {
  export class Client {
    get: (
      path: string,
      query?: { [prop: string]: string },
      headers?: { "Idempotency-Key"?: string } & { [prop: string]: string }
    ) => Promise<Response>;
    post: (
      path: string,
      body?: object,
      headers?: { "Idempotency-Key"?: string } & { [prop: string]: string }
    ) => Promise<Response>;
    delete: (path: string) => Promise<Response>;
    constructor(options: {
      key: string;
      secret: string;
      environment?: "production" | "sandbox";
    });
  }

  interface Response {
    status: number;
    headers: Headers;
    body: any;
  }
}
