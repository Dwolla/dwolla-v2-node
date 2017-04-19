# DwollaV2 Node

![Build Status](https://travis-ci.org/Dwolla/dwolla-v2-node.svg)

Dwolla V2 Node client. For the V1 Node client see [Dwolla/dwolla-node](https://github.com/Dwolla/dwolla-node).

[API Documentation](https://docsv2.dwolla.com)

## Installation

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

Tokens can be used to make requests to the Dwolla V2 API. There are two types of tokens:

### Application tokens

Application tokens are used to access the API on behalf of a consumer application. API resources that
belong to an application include: `webhook-subscriptions`, `events`, and `webhooks`. Application
tokens can be created using the [`client_credentials`][client_credentials] OAuth grant type:

[client_credentials]: https://tools.ietf.org/html/rfc6749#section-4.4

**Note:** If an application has the `ManageCustomers` scope enabled, it can also be used to access
the API for White Label Customer related endpoints. Keep in mind, the application must belong to
same Dwolla account that will be used when creating and managing White Label Customers in the API.

```javascript
client.auth.client()
  .then(function(appToken) {
    return appToken.get('webhook-subscriptions');
  })
  .then(function(res) {
    console.log(JSON.stringify(res.body));
  });
```

*Application tokens do not include a `refresh_token`. When an application token expires, generate
a new one using `client.auth.client()`.*

### Account tokens

Account tokens are used to access the API on behalf of a Dwolla account. API resources that belong
to an account include `customers`, `funding-sources`, `documents`, `mass-payments`, `mass-payment-items`,
`transfers`, and `on-demand-authorizations`.

There are two ways to get an account token. One is by generating a token at
https://sandbox.dwolla.com/applications (Sandbox) or https://www.dwolla.com/applications (Production).

You can instantiate a generated token by doing the following:

```javascript
var accountToken = new client.Token({ access_token: "...", refresh_token: "..." });
```

The other way to get an account token is using the [`authorization_code`][authorization_code]
OAuth grant type. This flow works by redirecting a user to dwolla.com in order to get authorization
and sending them back to your website with an authorization code which can be exchanged for a token.
For example:

[authorization_code]: https://tools.ietf.org/html/rfc6749#section-4.1

```javascript
var auth = new client.Auth({
  redirect_uri: 'http://yoursite.com/callback',
  scope: 'ManageCustomers',
  state: getRandomHex(), // optional - https://tools.ietf.org/html/rfc6749#section-10.12
  verified_account: true, // optional
  dwolla_landing: 'register', // optional
});

// redirect to `auth.url`

auth.callback(req.query) // pass the code and optional state to the callback
  .then(function(token) {
    return token.get('customers');
  })
  .then(function(res) {
    console.log(JSON.stringify(res.body));
  });
```

### Refreshing tokens

Tokens with `refresh_token`s can be refreshed using `client.auth.refresh(token)`, which takes a
`Token` as its first argument and returns a promise containing a new token.

```javascript
var oldToken = new client.Token({ refresh_token: 'sHzEauv7FVpga2BSHVecKqFmCUfuhbBa4JRuClFuYa5vUSUdhL' });
client.auth.refresh(oldToken)
  .then(function(token) {
    return token.get('customers');
  })
  .then(function(res) {
    console.log(JSON.stringify(res.body));
  });
```

### Initializing pre-existing tokens:

`Token`s can be initialized with the following attributes:

```javascript
new client.Token({
  access_token: "...",
  refresh_token: "...",
  expires_in: 123,
  scope: "...",
  account_id: "..."
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

- **1.3.2** Strip domain from URLs provided to `token.*` methods.
- **1.3.1** Update sandbox URLs from uat => sandbox.
- **1.3.0** Refer to Client id as key.
- **1.2.3** Use Bluebird Promise in Auth to prevent Promise undefined error.
- **1.2.2** Upgrade `node-fetch` dependency to fix `form-data` compatibility ([#15][/Dwolla/dwolla-v2-node/issues/15])
- **1.2.1** Add support for `verified_account` and `dwolla_landing` auth flags
- **1.2.0** Reject promises with Errors instead of plain objects ([#8](/Dwolla/dwolla-v2-node/issues/8))
- **1.1.2** Fix issue uploading files ([#4](/Dwolla/dwolla-v2-node/issues/4))
- **1.1.1** Handle promises differently to allow all rejections to be handled ([#5](/Dwolla/dwolla-v2-node/issues/5))
