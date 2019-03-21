var invariant = require("invariant");
var auth = require("./Auth");
var Token = require("./Token");
var isOneOfTypes = require("../util/isOneOfTypes");

var DEFAULT_ENVIRONMENT = "production";

var ENVIRONMENTS = {
  production: {
    authUrl: "https://www.dwolla.com/oauth/v2/authenticate",
    tokenUrl: "https://accounts.dwolla.com/token",
    apiUrl: "https://api.dwolla.com",
  },
  sandbox: {
    authUrl: "https://sandbox.dwolla.com/oauth/v2/authenticate",
    tokenUrl: "https://accounts-sandbox.dwolla.com/token",
    apiUrl: "https://api-sandbox.dwolla.com",
  },
};

function Client(opts) {
  invariant(typeof opts === "object", "First argument must be an object.");

  this.id = this.key = opts.id || opts.key;
  this.secret = opts.secret;
  this.environment = opts.environment || DEFAULT_ENVIRONMENT;
  this.onGrant = opts.onGrant;

  invariant(
    typeof opts.id === "string" || typeof opts.key === "string",
    "key is required."
  );
  invariant(typeof opts.secret === "string", "secret is required.");
  invariant(this.environment in ENVIRONMENTS, "Invalid environment.");
  invariant(
    isOneOfTypes(opts.onGrant, ["undefined", "function"]),
    "Invalid onGrant."
  );

  this.authUrl = ENVIRONMENTS[this.environment].authUrl;
  this.tokenUrl = ENVIRONMENTS[this.environment].tokenUrl;
  this.apiUrl = ENVIRONMENTS[this.environment].apiUrl;

  var thisAuth = auth(this);
  this.auth = thisAuth.methods;
  this.Auth = thisAuth.klass;

  this.Token = Token.bind(null, this);

  var currentToken = {};

  function now() {
    return parseInt(Date.now() / 1000, 10);
  }

  function updateToken() {
    currentToken.updatedAt = now();
    currentToken.expiresIn = null;
    currentToken.instance = thisAuth.methods.client().then(function(token) {
      currentToken.expiresIn = token.expires_in;
      return token;
    });
  }
  updateToken();

  var freshToken = function() {
    var fresh =
      currentToken.expiresIn === null || // token is updating
      currentToken.updatedAt + currentToken.expiresIn > now();

    if (!fresh) {
      updateToken();
    }

    return currentToken.instance;
  };

  this.get = function() {
    var getArgs = arguments;
    return freshToken().then(function(token) {
      return token.get.apply(token, getArgs);
    });
  };

  this.post = function() {
    var postArgs = arguments;
    return freshToken().then(function(token) {
      return token.post.apply(token, postArgs);
    });
  };

  this.delete = function() {
    var deleteArgs = arguments;
    return freshToken().then(function(token) {
      return token.delete.apply(token, deleteArgs);
    });
  };
}

if (process.env.NODE_ENV === "test") {
  Client.ENVIRONMENTS = ENVIRONMENTS;
}

module.exports = Client;
