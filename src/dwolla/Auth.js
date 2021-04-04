var fetch = require("node-fetch").default;
var formurlencoded = require("form-urlencoded").default;
var assign = Object.assign;
var invariant = require("invariant");
var rejectEmptyKeys = require("../util/rejectEmptyKeys");
var toJson = require("../util/toJson");
var snakifyKeys = require("../util/snakifyKeys");
var Promise = require("bluebird");

fetch.Promise = Promise;

function errorFrom(parsedRes) {
  var error = new Error(JSON.stringify(parsedRes));
  error.error = parsedRes.error;
  error.error_description = parsedRes.error_description;
  error.error_uri = parsedRes.error_uri;
  return error;
}

function handleTokenResponse(client, res) {
  if (res.error) {
    return Promise.reject(errorFrom(res));
  }
  return new client.Token(res);
}

function performOnGrantCallback(client, token) {
  if (client.onGrant) {
    return client.onGrant(token).then(function() {
      return token;
    });
  }
  return token;
}

function requestToken(client, params) {
  return fetch(client.tokenUrl, {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      "user-agent": require("../../src/dwolla/userAgent")
    },
    body: formurlencoded(
      assign(
        {
          client_id: client.id,
          client_secret: client.secret
        },
        params
      )
    )
  })
    .then(toJson)
    .then(handleTokenResponse.bind(null, client))
    .then(performOnGrantCallback.bind(null, client));
}

function refreshGrant(client, token) {
  return requestToken(client, {
    grant_type: "refresh_token",
    refresh_token: token.refresh_token
  });
}

function query(client, opts) {
  return formurlencoded(
    rejectEmptyKeys({
      response_type: "code",
      client_id: client.id,
      redirect_uri: opts.redirect_uri,
      scope: opts.scope,
      state: opts.state,
      verified_account: opts.verified_account,
      dwolla_landing: opts.dwolla_landing
    })
  );
}

function AuthClass(client, opts) {
  if (typeof opts === "undefined") {
    opts = {};
  }
  this.client = client;
  this.redirect_uri = opts.redirect_uri;
  this.scope = opts.scope;
  this.state = opts.state;
  this.verified_account = opts.verified_account;
  this.dwolla_landing = opts.dwolla_landing;
  this.url = [client.authUrl, query(client, opts)].join("?");
}

AuthClass.prototype.callback = function(params) {
  invariant(params.state === this.state, "Invalid state parameter.");
  if (params.error) {
    throw params;
  }
  return requestToken(this.client, {
    grant_type: "authorization_code",
    code: params.code,
    redirect_uri: this.redirect_uri
  });
};

module.exports = function(client) {
  var klass = AuthClass.bind(null, client);
  var methods = function(opts) {
    snakifyKeys(opts);
    return new klass(opts);
  };
  methods.client = requestToken.bind(null, client, {
    grant_type: "client_credentials"
  });
  methods.refresh = refreshGrant.bind(null, client);
  return {
    klass: klass,
    methods: methods
  };
};
