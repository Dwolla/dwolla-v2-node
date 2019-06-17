var chai = require("chai");
var expect = chai.expect;
var nock = require("nock");

var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

describe("TokenManager", function() {
  var dwolla = require("../../src/index");
  var client = new dwolla.Client({ id: "client_id", secret: "client_secret" });
  var requestHeaders = {
    "content-type": "application/x-www-form-urlencoded",
    "user-agent": require("../../src/dwolla/userAgent")
  };
  var existingToken = Promise.resolve("existing-token");
  var accessToken = "access-token";

  this.beforeEach(function() {
    mockClientCredentials({ access_token: accessToken, expires_in: 3600 });
  });

  it("gets new token when no existing token", function(done) {
    var tokenManager = require("../../src/dwolla/TokenManager")(client);

    var token = tokenManager.getToken();

    expect(accessTokenOf(token)).to.eventually.be.eq(accessToken);
    expect(token).to.be.fulfilled.and.notify(done);
  });

  it("returns existing token if fresh", function(done) {
    var tokenManager = require("../../src/dwolla/TokenManager")(client, {
      instance: existingToken,
      expiresIn: 3600,
      updatedAt: now()
    });

    var token = tokenManager.getToken();

    expect(token).to.eventually.be.eq(existingToken);
    expect(token).to.be.fulfilled.and.notify(done);
  });

  it("gets new token when existing token stale", function(done) {
    var tokenManager = require("../../src/dwolla/TokenManager")(client, {
      instance: existingToken,
      expiresIn: 30,
      updatedAt: now()
    });

    var token = tokenManager.getToken();

    expect(accessTokenOf(token)).to.eventually.be.eq(accessToken);
    expect(token).to.be.fulfilled.and.notify(done);
  });

  function mockClientCredentials(response) {
    nock(client.tokenUrl, { reqheaders: requestHeaders })
      .post("", {
        client_id: client.id,
        client_secret: client.secret,
        grant_type: "client_credentials"
      })
      .reply(200, response);
  }

  function accessTokenOf(tokenPromise) {
    return tokenPromise.then(function(t) {
      return t.access_token;
    });
  }
});

function now() {
  return parseInt(Date.now() / 1000, 10);
}
