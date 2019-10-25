var invariant = require("invariant");
var auth = require("./Auth");
var Token = require("./Token");
var isOneOfTypes = require("../util/isOneOfTypes");
var snakifyKeys = require("../util/snakifyKeys");
var TokenManager = require("./TokenManager");

var DEFAULT_ENVIRONMENT = "production";

var ENVIRONMENTS = {
  production: {
    authUrl: "https://accounts.dwolla.com/auth",
    tokenUrl: "https://api.dwolla.com/token",
    apiUrl: "https://api.dwolla.com"
  },
  sandbox: {
    authUrl: "https://accounts-sandbox.dwolla.com/auth",
    tokenUrl: "https://api-sandbox.dwolla.com/token",
    apiUrl: "https://api-sandbox.dwolla.com"
  }
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

  var self = this;

  var thisAuth = auth(this);
  this.auth = thisAuth.methods;
  this.Auth = thisAuth.klass;

  this.Token = Token.bind(null, this);

  var getToken = TokenManager(this).getToken;

  this.get = function() {
    var getArgs = arguments;
    return getToken().then(function(token) {
      return token.get.apply(token, getArgs);
    });
  };

  this.post = function() {
    var postArgs = arguments;
    return getToken().then(function(token) {
      return token.post.apply(token, postArgs);
    });
  };

  this.delete = function() {
    var deleteArgs = arguments;
    return getToken().then(function(token) {
      return token.delete.apply(token, deleteArgs);
    });
  };

  this.refreshToken = function(opts) {
    snakifyKeys(opts);
    return thisAuth.methods.refresh(new self.Token(opts));
  };

  this.token = function(opts) {
    snakifyKeys(opts);
    return new self.Token(opts);
  };
}

if (process.env.NODE_ENV === "test") {
  Client.ENVIRONMENTS = ENVIRONMENTS;
}

module.exports = Client;
