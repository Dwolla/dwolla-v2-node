# Dwolla SDK for JavaScript

This repository contains the source code for Dwolla's Node-based SDK, which allows developers to interact with Dwolla's [server-side API](https://developers.dwolla.com/api-reference) via a JavaScript API with automatic OAuth token management. Any action that can be performed via an HTTP request can be made using this SDK when executed within a server-side environment.

## Getting Started

### Installation
To begin using this SDK, you will first need to download it to your machine. We use [npm](https://www.npmjs.com/package/dwolla-v2) to distribute this package.

```shell
# npm
npm install --save dwolla-v2

# yarn
yarn add dwolla-v2

# pnpm
pnpm add dwolla-v2
```

### Initialization
Before any API requests can be made, you must first determine which environment you will be using, as well as fetch the application key and secret. To fetch your application key and secret, please visit one of the following links:

* Production: https://dashboard.dwolla.com/applications
* Sandbox: https://dashboard-sandbox.dwolla.com/applications

Finally, you can create an instance of `Client` with `key` and `secret` replaced with the application key and secret, respectively, that you fetched from one of the aforementioned links.

```javascript
const Client = require("dwolla-v2").Client;

const dwolla = new Client({ 
    environment: "sandbox", // Defaults to "production"
    key: process.env.DWOLLA_APP_KEY,
    secret: process.env.DWOLLA_APP_SECRET
})
```

## Making Requests

Once you've created a `Client`, you can make requests using the `get()`, `post()`, and `delete()` methods. These methods will return a `Promise` containing the response object.

The following snippet defines Dwolla's response object, both with a successful and error response. Although we are using `try`/`catch`, you can also use `.then()`/`.catch()` as well.

An errored response is returned when Dwolla's servers respond with a status code that is greater than or equal to 400, whereas a successful response is when Dwolla's servers respond with a 200-level status code.

```javascript
try {
    const response = await dwolla.get("customers");
    // response.body      => Object or String depending on response type
    // response.headers   => Headers { ... }
    // response.status    => 200
} catch(error) {
    // error.body       => Object or String depending on response type
    // error.headers    => Headers { ... }
    // error.status     => 400
}
```

### Low-level Requests

#### `GET`

```javascript
// GET https://api.dwolla.com/customers?offset=20&limit=10
const response = await dwolla.get("customers", {
    offset: 20, 
    limit: 10
});

console.log("Response Total: ", response.body.total);
```

#### `POST`

```javascript
// POST https://api.dwolla.com/<resource> body={ ... }
const response = await dwolla.post("customers", {
    firstName: "Jane",
    lastName: "Doe",
    email: "jane.doe@example.com"
});

console.log("Created Resource: ", response.headers.get("Location"));

// POST https://api.dwolla.com/<resource> multipart/form-data ...
// Note: Requires form-data peer dependency to be downloaded and installed
const formData = new FormData();
formData.append("documentType", "license");
formData.append("file", ffs.createReadStream("mclovin.jpg", {
    contentType: "image/jpeg",
    filename: "mclovin.jpg",
    knownLength: fs.statSync("mclovin.jpg").size
}));

const response = await dwolla.post(`${customerUrl}/documents`, formData);
console.log("Created Resource: ", response.headers.get("Location"));
```

#### `DELETE`

```javascript
// DELETE https://api.dwolla.com/<resource>
await dwolla.delete("<resource>");
```

## Changelog

- **[3.4.0](https://github.com/Dwolla/dwolla-v2-node/releases/tag/v3.4.0)** Update `form-urlencoded` version to allow `{ skipIndex: true, skipBracket: true }` options to be passed in. Thanks, [@MarcMouallem](https://github.com/MarcMouallem)!
- **3.3.0** Remove `lodash` as a dependency in favor of `Object.assign`
- **3.2.3** Update version and changelog
- **3.2.2** Update unit test involving token. Thanks, [@philting](https://github.com/philting)!
- **3.2.1** Update dependencies. Remove `npm-check` package.
- **3.2.0** Add TypeScript definition. Thanks, [@rhuffy](https://github.com/rhuffy)!
- **3.1.1** Change `node-fetch` import style for better Webpack compatibility
- **3.1.0** Add integrations auth functionality
- **3.0.2** Don't cache token errors
- **3.0.1** Fix token leeway logic
- **3.0.0** Token management changes
- **2.1.0** Update dependencies
- **2.0.1** Update dependencies
- **2.0.0** Change token URLs, update dependencies, remove Node 0.x support.
- **1.3.3** Update lodash to avoid security vulnerability. Thanks, [@bold-d](https://github.com/bold-d)!
- **1.3.2** Strip domain from URLs provided to `token.*` methods.
- **1.3.1** Update sandbox URLs from uat => sandbox.
- **1.3.0** Refer to Client ID as key.
- **1.2.3** Use Bluebird Promise in Auth to prevent Promise undefined error.
- **1.2.2** Upgrade `node-fetch` dependency to fix `form-data` compatibility
- **1.2.1** Add support for `verified_account` and `dwolla_landing` auth flags
- **1.2.0** Reject promises with Errors instead of plain objects
- **1.1.2** Fix issue uploading files
- **1.1.1** Handle promises differently to allow all rejections to be handled

## Community
* If you have any feedback, please reach out to us on [our forums](https://discuss.dwolla.com/) or by [creating a GitHub issue](https://github.com/Dwolla/dwolla-v2-node/issues/new).
* If you would like to contribute to this library, please read the [contributing guide](https://github.com/Dwolla/dwolla-v2-node/blob/main/CONTRIBUTING.md) to learn more about how to build and test this SDK.

## Additional Resources

To learn more about Dwolla and how to integrate our product with your application, please consider visiting some of the following resources and becoming a member of our community!

* [Dwolla](https://www.dwolla.com/)
* [Dwolla Developers](https://developers.dwolla.com/)
* [SDKs and Tools](https://developers.dwolla.com/sdks-tools)
  * [Dwolla SDK for C#](https://github.com/Dwolla/dwolla-v2-csharp)
  * [Dwolla SDK for Kotlin](https://github.com/Dwolla/dwolla-v2-kotlin)
  * [Dwolla SDK for Python](https://github.com/Dwolla/dwolla-v2-python)
  * [Dwolla SDK for Ruby](https://github.com/Dwolla/dwolla-v2-ruby)
* [Developer Support Forum](https://discuss.dwolla.com/)