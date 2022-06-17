# Dwolla Node SDK

Dwolla Node SDK is a thin Node-based wrapper written in TypeScript around our HTTP API. To learn more about our API,
check out our [developer documentation](https://developers.dwolla.com).

> ⚠️ You are currently viewing the version 4.0.0 candidate! ⚠️
>
> Although we tried to ensure backwards compatibility with
> earlier versions, please note that this not officially released and is subject to break. **It should not be used in a
production environment!**
>
> If you would still like to continue with this version, and you encounter any issues or unexpected behavior, please be
> sure to [open up a bug report](https://github.com/Dwolla/dwolla-v2-node/issues/new) for our team to investigate.

## Table of Contents

* [Installation](#installation)
* [Getting Started](#getting-started)
* [Making Requests](#making-requests)
    * [`GET`](#get)
    * [`POST`](#post)
    * [`DELETE`](#delete)
    * [Setting Headers](#setting-headers)
* [Responses](#responses)
* [Contributing](#contributing)
* [Changelog](#changelog)
* [License](#license)

## Installation

Our SDK is currently available on [npm](https://www.npmjs.com/package/dwolla-v2). It can be installed using `npm`,
`yarn`, or `pnpm` by executing one of the following commands:

```bash
# npm
npm install --save dwolla-v2

# yarn
yarn add dwolla-v2

# pnpm
pnpm add dwolla-v2
```

## Getting Started

Our SDK comes with support for both CommonJS (CJS) and ES Modules (ESM). All the examples shown in this document are
written using ESM syntax; however, you can also "convert" it to use CJS syntax if you do not wish to use ESM in your
project.

```javascript
import { Client } from "dwolla-v2";

const dwolla = new Client({
    environment: "sandbox", // Defaults to production
    key: process.env.DWOLLA_APP_KEY,
    secret: process.env.DWOLLA_APP_SECRET,
});
```

## Making Requests

Once you've created a Dwolla `Client`, you can now make requests using the `get`, `post`,
and `delete` methods. These methods return a `Promise` containing a response object
detailed in the [Responses section](#responses).

Since each method returns a `Promise`, you can either use `.then`/`.catch` or `async`/`await`. In the following
examples, we will be using `async`/`await`.

### `GET`

```javascript
// GET api.dwolla.com/customers?offset=20&limit=10
const response = await dwolla.get("/", {
    offset: 20,
    limit: 10
});

console.log("Response Body: ", response.body.total);
```

### `POST`

```javascript
// POST api.dwolla.com/resource {"foo":"bar"}
const response = await dwolla.post("customers", {
    firstName: "Jane",
    lastName: "Doe",
    email: "jane+doe@example.com"
});

console.log("Location: ", response.headers.get("Location"));

// POST api.dwolla.com/resource multipart/form-data foo=...
const body = new FormData();
body.append("documentType", "license");
body.append("file", fs.createReadStream("mclovin.jpg"), {
    filename: "mclovin.jpg",
    contentType: "image/jpeg",
    knownLength: fs.statSync("mclovin.jpg").size
});

const response = await dwolla.post(`${customerUrl}/documents`, body);
console.log("Location: ", response.headers.get("Location"));
```

### `DELETE`

```javascript
await dwolla.delete("resource");
```

### Setting Headers

To include additional request headers (e.g., an idempotency key), you can pass in an object as the third argument.

```javascript
await dwolla.post("customers", {
    firstName: "John",
    lastName: "Doe",
    email: "john+doe@example.com"
}, {
    "Idempotency-Key": "b1764e1c-f2ce-4ada-9dff-3a2665170a58"
});
```

## Responses

```javascript
try {
    const response = await dwolla.get("customers");

    // When the server returns a successful response (e.g., statusCode == 2xx)
    // response.status  => 200
    // response.headers => Headers { ... }
    // response.body    => Object or String depending on the response type
} catch (e) {
    // When the server returns a statusCode >= 400
    // e.status     => 400
    // e.headers    => Headers { ... }
    // e.body       => Object or String depending on the response type
}
```

## Contributing

Contributions to this repository are welcome! If you have a bug report, please submit it
by [clicking here](https://github.com/Dwolla/dwolla-v2-node/issues/new). Additionally, a pull request can be opened
by [clicking here](https://github.com/Dwolla/dwolla-v2-node/compare).

## Changelog

- **4.0.0** SDK is fully rewritten in TypeScript. Support is added for ES Modules.
- **3.4.0** Update `form-urlencoded` version to allow `{ skipIndex: true, skipBracket: true}` options to be passed in. Thanks [@MarcMouallem](https://github.com/MarcMouallem)!
- **3.3.0** Remove lodash as a dependency and replace with `Object.assign`
- **3.2.3** Update version and changelog
- **3.2.2** Update unit test involving token. Thanks [@philting](https://github.com/philting)!
- **3.2.1** Update dependencies. Remove `npm-check` package.
- **3.2.0** Add TypeScript definition (Thanks @rhuffy!)
- **3.1.1** Change node-fetch import style for better Webpack compatibility
- **3.1.0** Add integrations auth functionality
- **3.0.2** Don't cache token errors
- **3.0.1** Fix token leeway logic
- **3.0.0** Token management changes
- **2.1.0** Update dependencies
- **2.0.1** Update dependencies
- **2.0.0** Change token URLs, update dependencies, remove Node 0.x support.
- **1.3.3** Update lodash to avoid security vulnerability ([#25](/Dwolla/dwolla-v2-node/issues/25) - Thanks @bold-d!).
- **1.3.2** Strip domain from URLs provided to `token.*` methods.
- **1.3.1** Update sandbox URLs from uat => sandbox.
- **1.3.0** Refer to Client id as key.
- **1.2.3** Use Bluebird Promise in Auth to prevent Promise undefined error.
- **1.2.2** Upgrade `node-fetch` dependency to fix `form-data` compatibility ([#15][/dwolla/dwolla-v2-node/issues/15])
- **1.2.1** Add support for `verified_account` and `dwolla_landing` auth flags
- **1.2.0** Reject promises with Errors instead of plain objects ([#8](/Dwolla/dwolla-v2-node/issues/8))
- **1.1.2** Fix issue uploading files ([#4](/Dwolla/dwolla-v2-node/issues/4))
- **1.1.1** Handle promises differently to allow all rejections to be handled ([#5](/Dwolla/dwolla-v2-node/issues/5))

## License

[MIT](LICENSE)