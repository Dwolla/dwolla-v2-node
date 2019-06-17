var chai = require("chai");
var expect = chai.expect;
var nock = require("nock");
var toFormData = require("../../src/util/toFormData");
var assign = require("lodash/assign");

var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

function toResponseBody(res) {
  return res.body;
}

function bodyLengthEquals(length, body) {
  return body.length === length;
}

describe("Token", function() {
  var Client = require("../../src/dwolla/Client");
  var client = new Client({ id: "id", secret: "secret" });
  var moreHeaders = { "Idempotency-Key": "foo" };
  var requestHeaders = function(token, additionalHeaders) {
    return assign(
      {
        accept: "application/vnd.dwolla.v1.hal+json",
        Authorization: ["Bearer", token.access_token].join(" "),
        "User-Agent": require("../../src/dwolla/userAgent")
      },
      additionalHeaders
    );
  };
  var requestBody = { request: "body" };
  var responseBody = { response: "body" };
  var textResponseBody = "text response body";
  var formDataRequestBody = toFormData(requestBody);

  it("sets access_token", function() {
    var access_token = "access token";
    var token = new client.Token({ access_token: access_token });
    expect(token.access_token).to.equal(access_token);
  });

  it("sets refresh_token", function() {
    var refresh_token = "refresh token";
    var token = new client.Token({ refresh_token: refresh_token });
    expect(token.refresh_token).to.equal(refresh_token);
  });

  it("sets expires_in", function() {
    var expires_in = 123;
    var token = new client.Token({ expires_in: expires_in });
    expect(token.expires_in).to.equal(expires_in);
  });

  it("sets scope", function() {
    var scope = "scope";
    var token = new client.Token({ scope: scope });
    expect(token.scope).to.equal(scope);
  });

  it("sets account_id", function() {
    var account_id = "account id";
    var token = new client.Token({ account_id: account_id });
    expect(token.account_id).to.equal(account_id);
  });

  it("#get resource object", function(done) {
    var resourceHref = "http://foo.bar/baz";
    var resource = { _links: { self: { href: resourceHref } } };
    var token = new client.Token({ access_token: "access token" });
    nock(resourceHref, { reqheaders: requestHeaders(token) })
      .get("")
      .reply(200, responseBody);
    expect(token.get(resource).then(toResponseBody))
      .to.eventually.deep.equal(responseBody)
      .and.notify(done);
  });

  it("#get leading slash", function(done) {
    var path = "/baz";
    var token = new client.Token({ access_token: "access token" });
    nock([client.apiUrl, path].join(""), { reqheaders: requestHeaders(token) })
      .get("")
      .reply(200, responseBody);
    expect(token.get(path).then(toResponseBody))
      .to.eventually.deep.equal(responseBody)
      .and.notify(done);
  });

  it("#get full url", function(done) {
    var fullUrl = [client.apiUrl, "baz"].join("/");
    var token = new client.Token({ access_token: "access token" });
    nock(fullUrl, { reqheaders: requestHeaders(token) })
      .get("")
      .reply(200, responseBody);
    expect(token.get(fullUrl).then(toResponseBody))
      .to.eventually.deep.equal(responseBody)
      .and.notify(done);
  });

  it("#get other domain", function(done) {
    var fullUrl = [client.apiUrl, "baz"].join("/");
    var otherUrl = ["https://foo.com", "baz"].join("/");
    var token = new client.Token({ access_token: "access token" });
    nock(fullUrl, { reqheaders: requestHeaders(token) })
      .get("")
      .reply(200, responseBody);
    expect(token.get(otherUrl).then(toResponseBody))
      .to.eventually.deep.equal(responseBody)
      .and.notify(done);
  });

  it("#get successful response", function(done) {
    var path = "baz";
    var token = new client.Token({ access_token: "access token" });
    nock([client.apiUrl, path].join("/"), { reqheaders: requestHeaders(token) })
      .get("")
      .reply(200, responseBody);
    expect(token.get(path).then(toResponseBody))
      .to.eventually.deep.equal(responseBody)
      .and.notify(done);
  });

  it("#get successful text response", function(done) {
    var path = "baz";
    var token = new client.Token({ access_token: "access token" });
    nock([client.apiUrl, path].join("/"), { reqheaders: requestHeaders(token) })
      .get("")
      .reply(200, textResponseBody);
    expect(token.get(path).then(toResponseBody))
      .to.eventually.deep.equal(textResponseBody)
      .and.notify(done);
  });

  it("#get error response", function(done) {
    var path = "baz";
    var token = new client.Token({ access_token: "access token" });
    nock([client.apiUrl, path].join("/"), { reqheaders: requestHeaders(token) })
      .get("")
      .reply(400, responseBody);
    expect(
      token.get(path).then(toResponseBody)
    ).to.eventually.be.rejected.and.notify(done);
  });

  it("#get query", function(done) {
    var path = "baz";
    var query = { foo: "bar" };
    var token = new client.Token({ access_token: "access token" });
    nock([client.apiUrl, path].join("/"), { reqheaders: requestHeaders(token) })
      .get("")
      .query(query)
      .reply(200, responseBody);
    expect(token.get(path, query).then(toResponseBody))
      .to.eventually.deep.equal(responseBody)
      .and.notify(done);
  });

  it("#get headers", function(done) {
    var path = "baz";
    var query = { foo: "bar" };
    var token = new client.Token({ access_token: "access token" });
    nock([client.apiUrl, path].join("/"), {
      reqheaders: requestHeaders(token, moreHeaders)
    })
      .get("")
      .query(query)
      .reply(200, responseBody);
    expect(token.get(path, query, moreHeaders).then(toResponseBody))
      .to.eventually.deep.equal(responseBody)
      .and.notify(done);
  });

  it("#post resource object", function(done) {
    var resourceHref = "http://foo.bar/baz";
    var resource = { _links: { self: { href: resourceHref } } };
    var token = new client.Token({ access_token: "access token" });
    nock(resourceHref, { reqheaders: requestHeaders(token) })
      .post("", requestBody)
      .reply(200, responseBody);
    expect(token.post(resource, requestBody).then(toResponseBody))
      .to.eventually.deep.equal(responseBody)
      .and.notify(done);
  });

  it("#post leading slash", function(done) {
    var path = "/baz";
    var token = new client.Token({ access_token: "access token" });
    nock([client.apiUrl, path].join(""), { reqheaders: requestHeaders(token) })
      .post("", requestBody)
      .reply(200, responseBody);
    expect(token.post(path, requestBody).then(toResponseBody))
      .to.eventually.deep.equal(responseBody)
      .and.notify(done);
  });

  it("#post full url", function(done) {
    var fullUrl = [client.apiUrl, "baz"].join("/");
    var token = new client.Token({ access_token: "access token" });
    nock(fullUrl, { reqheaders: requestHeaders(token) })
      .post("", requestBody)
      .reply(200, responseBody);
    expect(token.post(fullUrl, requestBody).then(toResponseBody))
      .to.eventually.deep.equal(responseBody)
      .and.notify(done);
  });

  it("#post successful response", function(done) {
    var path = "baz";
    var token = new client.Token({ access_token: "access token" });
    nock([client.apiUrl, path].join("/"), { reqheaders: requestHeaders(token) })
      .post("", requestBody)
      .reply(200, responseBody);
    expect(token.post(path, requestBody).then(toResponseBody))
      .to.eventually.deep.equal(responseBody)
      .and.notify(done);
  });

  it("#post successful text response", function(done) {
    var path = "baz";
    var token = new client.Token({ access_token: "access token" });
    nock([client.apiUrl, path].join("/"), { reqheaders: requestHeaders(token) })
      .post("", requestBody)
      .reply(200, textResponseBody);
    expect(token.post(path, requestBody).then(toResponseBody))
      .to.eventually.deep.equal(textResponseBody)
      .and.notify(done);
  });

  it("#post error response", function(done) {
    var path = "baz";
    var token = new client.Token({ access_token: "access token" });
    nock([client.apiUrl, path].join("/"), { reqheaders: requestHeaders(token) })
      .post("", requestBody)
      .reply(400, responseBody);
    expect(
      token.post(path, requestBody).then(toResponseBody)
    ).to.eventually.be.rejected.and.notify(done);
  });

  it("#post undefined body", function(done) {
    var path = "baz";
    var token = new client.Token({ access_token: "access token" });
    nock([client.apiUrl, path].join("/"), { reqheaders: requestHeaders(token) })
      .post("")
      .reply(200, responseBody);
    expect(token.post(path).then(toResponseBody))
      .to.eventually.deep.equal(responseBody)
      .and.notify(done);
  });

  it("#post headers", function(done) {
    var path = "baz";
    var token = new client.Token({ access_token: "access token" });
    nock([client.apiUrl, path].join("/"), {
      reqheaders: requestHeaders(token, moreHeaders)
    })
      .post("")
      .reply(200, responseBody);
    expect(token.post(path, null, moreHeaders).then(toResponseBody))
      .to.eventually.deep.equal(responseBody)
      .and.notify(done);
  });

  it("#post form data body", function(done) {
    var path = "baz";
    var token = new client.Token({ access_token: "access token" });
    formDataRequestBody.getLength(function(_, length) {
      nock([client.apiUrl, path].join("/"), {
        reqheaders: requestHeaders(token)
      })
        .post("", bodyLengthEquals.bind(null, length))
        .reply(200, responseBody);
      expect(token.post(path, formDataRequestBody).then(toResponseBody))
        .to.eventually.deep.equal(responseBody)
        .and.notify(done);
    });
  });

  it("#delete resource object", function(done) {
    var resourceHref = "http://foo.bar/baz";
    var resource = { _links: { self: { href: resourceHref } } };
    var token = new client.Token({ access_token: "access token" });
    nock(resourceHref, { reqheaders: requestHeaders(token) })
      .delete("")
      .reply(200, responseBody);
    expect(token.delete(resource).then(toResponseBody))
      .to.eventually.deep.equal(responseBody)
      .and.notify(done);
  });

  it("#delete leading slash", function(done) {
    var path = "/baz";
    var token = new client.Token({ access_token: "access token" });
    nock([client.apiUrl, path].join(""), { reqheaders: requestHeaders(token) })
      .delete("")
      .reply(200, responseBody);
    expect(token.delete(path).then(toResponseBody))
      .to.eventually.deep.equal(responseBody)
      .and.notify(done);
  });

  it("#delete full url", function(done) {
    var fullUrl = [client.apiUrl, "baz"].join("/");
    var token = new client.Token({ access_token: "access token" });
    nock(fullUrl, { reqheaders: requestHeaders(token) })
      .delete("")
      .reply(200, responseBody);
    expect(token.delete(fullUrl).then(toResponseBody))
      .to.eventually.deep.equal(responseBody)
      .and.notify(done);
  });

  it("#delete successful response", function(done) {
    var path = "baz";
    var token = new client.Token({ access_token: "access token" });
    nock([client.apiUrl, path].join("/"), { reqheaders: requestHeaders(token) })
      .delete("")
      .reply(200, responseBody);
    expect(token.delete(path).then(toResponseBody))
      .to.eventually.deep.equal(responseBody)
      .and.notify(done);
  });

  it("#delete successful text response", function(done) {
    var path = "baz";
    var token = new client.Token({ access_token: "access token" });
    nock([client.apiUrl, path].join("/"), { reqheaders: requestHeaders(token) })
      .delete("")
      .reply(200, textResponseBody);
    expect(token.delete(path).then(toResponseBody))
      .to.eventually.deep.equal(textResponseBody)
      .and.notify(done);
  });

  it("#delete error response", function(done) {
    var path = "baz";
    var token = new client.Token({ access_token: "access token" });
    nock([client.apiUrl, path].join("/"), { reqheaders: requestHeaders(token) })
      .delete("")
      .reply(400, responseBody);
    expect(
      token.delete(path).then(toResponseBody)
    ).to.eventually.be.rejected.and.notify(done);
  });

  it("#delete headers", function(done) {
    var path = "baz";
    var token = new client.Token({ access_token: "access token" });
    nock([client.apiUrl, path].join("/"), {
      reqheaders: requestHeaders(token, moreHeaders)
    })
      .delete("")
      .reply(400, responseBody);
    expect(
      token.delete(path, null, moreHeaders).then(toResponseBody)
    ).to.eventually.be.rejected.and.notify(done);
  });
});
