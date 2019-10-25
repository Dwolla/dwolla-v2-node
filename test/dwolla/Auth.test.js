var chai = require("chai");
var assert = chai.assert;
var expect = chai.expect;
var nock = require("nock");
var formurlencoded = require("form-urlencoded").default;
var sinon = require("sinon");

var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

describe("Auth", function() {
  var dwolla = require("../../src/index");
  var client = new dwolla.Client({ id: "client_id", secret: "client_secret" });
  var requestHeaders = {
    "content-type": "application/x-www-form-urlencoded",
    "user-agent": require("../../src/dwolla/userAgent")
  };

  it("Auth#url", function() {
    var auth = new client.Auth();
    assert.equal(
      "https://accounts.dwolla.com/auth?response_type=code&client_id=" +
        client.id,
      auth.url
    );
  });

  it("Auth#url with redirect_uri", function() {
    var redirect_uri = "redirect uri";
    var auth = new client.Auth({ redirect_uri: redirect_uri });
    var expectedQuery = formurlencoded({
      response_type: "code",
      client_id: client.id,
      redirect_uri: redirect_uri
    });
    assert.equal(
      ["https://accounts.dwolla.com/auth", expectedQuery].join("?"),
      auth.url
    );
    assert.equal(redirect_uri, auth.redirect_uri);
  });

  it("Auth#url with scope", function() {
    var scope = "b|l|a";
    var auth = new client.Auth({ scope: scope });
    var expectedQuery = formurlencoded({
      response_type: "code",
      client_id: client.id,
      scope: scope
    });
    assert.equal(
      ["https://accounts.dwolla.com/auth", expectedQuery].join("?"),
      auth.url
    );
    assert.equal(scope, auth.scope);
  });

  it("Auth#url with state", function() {
    var state = "b l a";
    var auth = new client.Auth({ state: state });
    var expectedQuery = formurlencoded({
      response_type: "code",
      client_id: client.id,
      state: state
    });
    assert.equal(
      ["https://accounts.dwolla.com/auth", expectedQuery].join("?"),
      auth.url
    );
    assert.equal(state, auth.state);
  });

  it("Auth#url with verified_account", function() {
    var verified_account = true;
    var auth = new client.Auth({ verified_account: verified_account });
    var expectedQuery = formurlencoded({
      response_type: "code",
      client_id: client.id,
      verified_account: verified_account
    });
    assert.equal(
      ["https://accounts.dwolla.com/auth", expectedQuery].join("?"),
      auth.url
    );
    assert.equal(verified_account, auth.verified_account);
  });

  it("Auth#url with dwolla_landing", function() {
    var dwolla_landing = "register";
    var auth = new client.Auth({ dwolla_landing: dwolla_landing });
    var expectedQuery = formurlencoded({
      response_type: "code",
      client_id: client.id,
      dwolla_landing: dwolla_landing
    });
    assert.equal(
      ["https://accounts.dwolla.com/auth", expectedQuery].join("?"),
      auth.url
    );
    assert.equal(dwolla_landing, auth.dwolla_landing);
  });

  it("Auth#callback throws error with bad state", function() {
    var state = "state";
    var auth = new client.Auth({ state: state });
    assert.throws(function() {
      auth.callback({ state: "bad state" });
    }, "Invalid state parameter.");
  });

  it("Auth#callback throws error if error", function() {
    var errorParams = { error: "error" };
    var auth = new client.Auth();
    assert.throws(function() {
      auth.callback(errorParams);
    });
  });

  it("Auth#callback successful response", function(done) {
    var state = "state";
    var code = "code";
    var auth = new client.Auth({ state: state });
    nock(client.tokenUrl, { reqheaders: requestHeaders })
      .post("", {
        client_id: client.id,
        client_secret: client.secret,
        grant_type: "authorization_code",
        code: code
      })
      .reply(200, {});
    expect(
      auth.callback({ state: state, code: code })
    ).to.be.fulfilled.and.notify(done);
  });

  it("Auth#callback error response", function(done) {
    var state = "state";
    var code = "code";
    var redirect_uri = "redirect uri";
    var auth = new client.Auth({ redirect_uri: redirect_uri, state: state });
    var error = { error: "error" };
    nock(client.tokenUrl, { reqheaders: requestHeaders })
      .post("", {
        client_id: client.id,
        client_secret: client.secret,
        grant_type: "authorization_code",
        code: code,
        redirect_uri: redirect_uri
      })
      .reply(200, error);
    expect(auth.callback({ state: state, code: code }))
      .to.be.rejectedWith(error)
      .and.notify(done);
  });

  it("auth.client successful response", function(done) {
    nock(client.tokenUrl, { reqheaders: requestHeaders })
      .post("", {
        client_id: client.id,
        client_secret: client.secret,
        grant_type: "client_credentials"
      })
      .reply(200, {});
    expect(client.auth.client()).to.be.fulfilled.and.notify(done);
  });

  it("auth.client error response", function(done) {
    var error = { error: "error" };
    nock(client.tokenUrl, { reqheaders: requestHeaders })
      .post("", {
        client_id: client.id,
        client_secret: client.secret,
        grant_type: "client_credentials"
      })
      .reply(200, error);
    expect(client.auth.client())
      .to.be.rejectedWith(error)
      .and.notify(done);
  });

  it("auth.refresh successful response", function(done) {
    var token = new client.Token({ refresh_token: "refresh token" });
    nock(client.tokenUrl, { reqheaders: requestHeaders })
      .post("", {
        client_id: client.id,
        client_secret: client.secret,
        grant_type: "refresh_token",
        refresh_token: token.refresh_token
      })
      .reply(200, {});
    expect(client.auth.refresh(token)).to.be.fulfilled.and.notify(done);
  });

  it("auth.refresh error response", function(done) {
    var error = { error: "error" };
    var token = new client.Token({ refresh_token: "refresh token" });
    nock(client.tokenUrl, { reqheaders: requestHeaders })
      .post("", {
        client_id: client.id,
        client_secret: client.secret,
        grant_type: "refresh_token",
        refresh_token: token.refresh_token
      })
      .reply(200, error);
    expect(client.auth.refresh(token))
      .to.be.rejectedWith(error)
      .and.notify(done);
  });

  it("calls onGrant", function(done) {
    var onGrant = sinon.spy();
    var clientWithOnGrant = new dwolla.Client({
      id: "client_id",
      secret: "client_secret",
      onGrant: onGrant
    });
    nock(clientWithOnGrant.tokenUrl, { reqheaders: requestHeaders })
      .post("", {
        client_id: clientWithOnGrant.id,
        client_secret: clientWithOnGrant.secret,
        grant_type: "client_credentials"
      })
      .reply(200, {});
    expect(clientWithOnGrant.auth.client()).to.be.fulfilled.and.notify(
      function() {
        assert.isTrue(onGrant.called);
        done();
      }
    );
  });
});
