var invariant = require('invariant');
var auth = require('./Auth');
var Token = require('./Token');
var isOneOfTypes = require('../util/isOneOfTypes');

var DEFAULT_ENVIRONMENT = 'production';

var ENVIRONMENTS = {
  production: {
    authUrl: 'https://www.dwolla.com/oauth/v2/authenticate',
    tokenUrl: 'https://www.dwolla.com/oauth/v2/token',
    apiUrl: 'https://api.dwolla.com',
  },
  sandbox: {
    authUrl: 'https://sandbox.dwolla.com/oauth/v2/authenticate',
    tokenUrl: 'https://sandbox.dwolla.com/oauth/v2/token',
    apiUrl: 'https://api-sandbox.dwolla.com',
  },
};

function Client(opts) {
  invariant(typeof opts === 'object', 'First argument must be an object.');

  this.id = this.key = opts.id || opts.key;
  this.secret = opts.secret;
  this.environment = opts.environment || DEFAULT_ENVIRONMENT;
  this.onGrant = opts.onGrant;

  invariant(typeof opts.id === 'string' || typeof opts.key === 'string', 'key is required.');
  invariant(typeof opts.secret === 'string', 'secret is required.');
  invariant(this.environment in ENVIRONMENTS, 'Invalid environment.');
  invariant(isOneOfTypes(opts.onGrant, ['undefined', 'function']), 'Invalid onGrant.');

  this.authUrl = ENVIRONMENTS[this.environment].authUrl;
  this.tokenUrl = ENVIRONMENTS[this.environment].tokenUrl;
  this.apiUrl = ENVIRONMENTS[this.environment].apiUrl;

  var thisAuth = auth(this);
  this.auth = thisAuth.methods;
  this.Auth = thisAuth.klass;

  this.Token = Token.bind(null, this);
}

if (process.env.NODE_ENV === 'test') {
  Client.ENVIRONMENTS = ENVIRONMENTS;
}

module.exports = Client;
