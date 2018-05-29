# DwollaV2 Node

![Build Status](https://travis-ci.org/Dwolla/dwolla-v2-node.svg)

Dwolla V2 Node client.

[API Documentation](https://docsv2.dwolla.com)

## Installation

`dwolla-v2` is available on [NPM](https://www.npmjs.com/package/dwolla-v2).

```
npm install dwolla-v2
```

## `dwolla.Client`

### Basic usage

```javascript
var dwolla = require('dwolla-v2');

var client = new dwolla.Client({
  key: process.env.DWOLLA_APP_KEY,
  secret: process.env.DWOLLA_APP_SECRET,
});
```

### Using the sandbox environment (optional)

```javascript
var dwolla = require('dwolla-v2');

var client = new dwolla.Client({
  key: process.env.DWOLLA_APP_KEY,
  secret: process.env.DWOLLA_APP_SECRET,
  environment: 'sandbox',
});
```

*Note: `environment` defaults to `production`.*

### Configuring an onGrant callback (optional)

An `onGrant` callback is useful for storing new tokens when they are granted. The `onGrant`
callback is called with the `Token` that was just granted by the server and must return a `Promise`.

```javascript
var dwolla = require('dwolla-v2');

var client = new dwolla.Client({
  key: process.env.DWOLLA_APP_KEY,
  secret: process.env.DWOLLA_APP_SECRET,
  onGrant: function(token) {
    return new Promise(...); // here you can return a Promise that saves a token to your database
  },
});
```

## `client.Token`

Tokens can be used to make requests to the Dwolla V2 API.

### Application tokens

Application access tokens are used to authenticate against the API on behalf of a consumer application. Application tokens can be used to access resources in the API that either belong to the application itself (`webhooks`, `events`, `webhook-subscriptions`) or the partner Account that owns the consumer application (`accounts`, `customers`, `funding-sources`, etc.). Application tokens are obtained by using the [`client_credentials`][client_credentials] OAuth grant type:

[client_credentials]: https://tools.ietf.org/html/rfc6749#section-4.4

```javascript
client.auth.client()
  .then(function(appToken) {
    return appToken.get('/');
  })
  .then(function(res) {
    console.log(JSON.stringify(res.body));
  });
```

*Application tokens do not include a `refresh_token`. When an application token expires, generate
a new one using `client.auth.client()`.*

### Initializing pre-existing tokens:

`Token`s can be initialized with the following attributes:

```javascript
new client.Token({
  access_token: "...",
  expires_in: 123
});
```

## Requests

`Token`s can make requests using the `#get`, `#post`, and `#delete` methods. These methods return
promises containing a response object detailed in the [next section](#responses).

```javascript
// GET api.dwolla.com/resource?foo=bar
token.get('resource', { foo: 'bar' });

// POST api.dwolla.com/resource {"foo":"bar"}
token.post('resource', { foo: 'bar' });

// POST api.dwolla.com/resource multipart/form-data foo=...
var body = new FormData();
body.append('file', fs.createReadStream('mclovin.jpg'), {
  filename: 'mclovin.jpg',
  contentType: 'image/jpeg',
  knownLength: fs.statSync('mclovin.jpg').size
});
body.append('documentType', 'license')
token.post('resource', body);

// PUT api.dwolla.com/resource {"foo":"bar"}
token.put('resource', { foo: 'bar' });

// DELETE api.dwolla.com/resource
token.delete('resource');
```

#### Setting headers

To set additional headers on a request you can pass an `object` as the 3rd argument.

For example:

```javascript
token.post('customers',
           { firstName: 'John', lastName: 'Doe', email: 'jd@doe.com' },
           { 'Idempotency-Key': 'a52fcf63-0730-41c3-96e8-7147b5d1fb01' });
```

## Responses

```javascript
token.get('customers').then(function(res) {
  // res.status   => 200
  // res.headers  => Headers { ... }
  // res.body     => Object or String depending on response type
}, function(error) {
  // when the server return a status >= 400
});
```

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/Dwolla/dwolla-v2-node.

## License

The gem is available as open source under the terms of the [MIT License](https://github.com/Dwolla/dwolla-v2-node).

## Changelog

- **1.3.3** Update lodash to avoid security vulnerability ([#25](/Dwolla/dwolla-v2-node/issues/25) - Thanks @bold-d!).
- **1.3.2** Strip domain from URLs provided to `token.*` methods.
- **1.3.1** Update sandbox URLs from uat => sandbox.
- **1.3.0** Refer to Client id as key.
- **1.2.3** Use Bluebird Promise in Auth to prevent Promise undefined error.
- **1.2.2** Upgrade `node-fetch` dependency to fix `form-data` compatibility ([#15][/Dwolla/dwolla-v2-node/issues/15])
- **1.2.1** Add support for `verified_account` and `dwolla_landing` auth flags
- **1.2.0** Reject promises with Errors instead of plain objects ([#8](/Dwolla/dwolla-v2-node/issues/8))
- **1.1.2** Fix issue uploading files ([#4](/Dwolla/dwolla-v2-node/issues/4))
- **1.1.1** Handle promises differently to allow all rejections to be handled ([#5](/Dwolla/dwolla-v2-node/issues/5))
