# DwollaV2 Node

Dwolla V2 Node client.

[API Documentation](https://docsv2.dwolla.com)

## Installation

`dwolla-v2` is available on [NPM](https://www.npmjs.com/package/dwolla-v2).

```
npm install dwolla-v2 --save
```

## Getting started

```javascript
var Client = require("dwolla-v2").Client;

var dwolla = new Client({
  key: process.env.DWOLLA_APP_KEY,
  secret: process.env.DWOLLA_APP_SECRET,
  environment: "sandbox", // defaults to 'production'
});
```

### Integrations Authorization

Check out our [Integrations Authorization Guide](https://developers.dwolla.com/integrations/authorization).

## Making requests

Once you've created a `Client`, you can make requests using the `#get`, `#post`,
and `#delete` methods. These methods return promises containing a response object
detailed in the [Responses section](#responses).

```javascript
// GET api.dwolla.com/customers?limit=10&offset=20
dwolla
  .get("customers", { limit: 10, offset: 20 })
  .then((res) => console.log(res.body.total));

// POST api.dwolla.com/resource {"foo":"bar"}
dwolla
  .post("customers", {
    firstName: "Jane",
    lastName: "Doe",
    email: "jane@doe.com",
  })
  .then((res) => console.log(res.headers.get("location")));

// POST api.dwolla.com/resource multipart/form-data foo=...
var body = new FormData();
body.append("file", fs.createReadStream("mclovin.jpg"), {
  filename: "mclovin.jpg",
  contentType: "image/jpeg",
  knownLength: fs.statSync("mclovin.jpg").size,
});
body.append("documentType", "license");
dwolla.post(`${customerUrl}/documents`, body);

// DELETE api.dwolla.com/resource
dwolla.delete("resource");
```

#### Setting headers

To set additional headers on a request you can pass an `object` as the 3rd argument.

For example:

```javascript
dwolla.post(
  "customers",
  { firstName: "John", lastName: "Doe", email: "john@doe.com" },
  { "Idempotency-Key": "a52fcf63-0730-41c3-96e8-7147b5d1fb01" }
);
```

## Responses

```javascript
dwolla.get("customers").then(
  function(res) {
    // res.status   => 200
    // res.headers  => Headers { ... }
    // res.body     => Object or String depending on response type
  },
  function(error) {
    // when the server return a status >= 400
    // error.status   => 400
    // error.headers  => Headers { ... }
    // error.body     => Object or String depending on response type
  }
);
```

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/Dwolla/dwolla-v2-node.

## License

The package is available as open source under the terms of the [MIT License](https://github.com/Dwolla/dwolla-v2-node).

## Changelog

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
