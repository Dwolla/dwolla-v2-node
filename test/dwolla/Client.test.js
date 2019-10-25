var assign = require("lodash/assign");
var chai = require("chai");
var assert = chai.assert;
var expect = chai.expect;
var nock = require("nock");

describe("Client", function() {
  var Client;
  var clientOpts;
  var clientOptsWithKey;

  var requestHeaders = function(additionalHeaders) {
    return assign(
      {
        accept: "application/vnd.dwolla.v1.hal+json",
        "User-Agent": require("../../src/dwolla/userAgent")
      },
      additionalHeaders
    );
  };

  var responseBody = { response: "body" };

  beforeEach(function() {
    Client = require("../../src/dwolla/Client");
    clientOpts = { id: "id", secret: "secret" };
    clientOptsWithKey = { key: "key", secret: "secret" };
    nock(new Client(clientOpts).tokenUrl)
      .post({
        client_id: clientOpts.id,
        client_secret: clientOpts.secret,
        grant_type: "client_credentials"
      })
      .reply(200, {});
  });

  it("throws error opts is not an object", function() {
    assert.throws(function() {
      new Client();
    }, "First argument must be an object.");
  });

  it("sets id and key", function() {
    var client = new Client(clientOpts);
    assert.equal(clientOpts.id, client.id);
    assert.equal(clientOpts.id, client.key);
  });

  it("sets id and key when key provided", function() {
    var client = new Client(clientOptsWithKey);
    assert.equal(clientOptsWithKey.key, client.id);
    assert.equal(clientOptsWithKey.key, client.key);
  });

  it("sets secret", function() {
    var client = new Client(clientOpts);
    assert.equal(clientOpts.secret, client.secret);
  });

  it("defaults environment to production", function() {
    var client = new Client(clientOpts);
    assert.equal("production", client.environment);
  });

  it("sets environment if provided", function() {
    var environment = "sandbox";
    var client = new Client(assign(clientOpts, { environment: environment }));
    assert.equal(environment, client.environment);
  });

  it("sets onGrant", function() {
    var onGrant = function() {};
    var client = new Client(assign(clientOpts, { onGrant: onGrant }));
    assert.equal(clientOpts.onGrant, client.onGrant);
  });

  it("throws error if id is not a string", function() {
    assert.throws(function() {
      new Client({ secret: clientOpts.secret });
    }, "key is required.");
  });

  it("throws error if secret is not a string", function() {
    assert.throws(function() {
      new Client({ id: clientOpts.id });
    }, "secret is required.");
  });

  it("throws error if invalid environment", function() {
    assert.throws(function() {
      new Client(assign(clientOpts, { environment: "invalid" }));
    }, "Invalid environment.");
  });

  it("throws error if invalid onGrant", function() {
    assert.throws(function() {
      new Client(assign(clientOpts, { onGrant: "invalid" }));
    }, "Invalid onGrant.");
  });

  it("has Auth", function() {
    var client = new Client(clientOpts);
    assert.isDefined(client.Auth);
  });

  it("has auth", function() {
    var client = new Client(clientOpts);
    assert.isDefined(client.auth);
  });

  it("authUrl", function() {
    var client = new Client(clientOpts);
    assert.equal(
      Client.ENVIRONMENTS[client.environment].authUrl,
      client.authUrl
    );
  });

  it("tokenUrl", function() {
    var client = new Client(clientOpts);
    assert.equal(
      Client.ENVIRONMENTS[client.environment].tokenUrl,
      client.tokenUrl
    );
  });

  it("apiUrl", function() {
    var client = new Client(clientOpts);
    assert.equal(Client.ENVIRONMENTS[client.environment].apiUrl, client.apiUrl);
  });

  it("get", function() {
    var client = new Client(clientOpts);
    assert.equal(typeof client.get, "function");
  });

  it("post", function() {
    var client = new Client(clientOpts);
    assert.equal(typeof client.post, "function");
  });

  it("delete", function() {
    var client = new Client(clientOpts);
    assert.equal(typeof client.delete, "function");
  });

  it("auth", function() {
    var redirectUri = "redirect-uri";
    var client = new Client(clientOpts);
    var auth = client.auth({ redirectUri: redirectUri });
    assert.equal(
      "https://accounts.dwolla.com/auth?response_type=code&client_id=id&redirect_uri=" +
        redirectUri,
      auth.url
    );
  });

  it("auth.refresh successful response", function(done) {
    var client = new Client(clientOpts);
    var opts = { refreshToken: "refresh token" };
    nock(client.tokenUrl, { reqheaders: requestHeaders })
      .post("", {
        client_id: client.id,
        client_secret: client.secret,
        grant_type: "refresh_token",
        refresh_token: opts.refreshToken
      })
      .reply(200, {});
    expect(client.refreshToken(opts)).to.be.fulfilled.and.notify(done);
  });

  it("auth.refresh error response", function(done) {
    var client = new Client(clientOpts);
    var error = { error: "error" };
    var opts = { refreshToken: "refresh token" };
    nock(client.tokenUrl, { reqheaders: requestHeaders })
      .post("", {
        client_id: client.id,
        client_secret: client.secret,
        grant_type: "refresh_token",
        refresh_token: opts.refreshToken
      })
      .reply(200, error);
    expect(client.refreshToken(opts))
      .to.be.rejectedWith(error)
      .and.notify(done);
  });

  it("token", function() {
    var accessToken = "access-token";
    var client = new Client(clientOpts);
    var token = client.token({ accessToken: accessToken });
    assert.equal(accessToken, token.access_token);
  });
});
