var assign = require('lodash/assign');
var assert = require('chai').assert;

describe('Client', function() {
  var Client;
  var clientOpts;

  beforeEach(function() {
    Client = require('../../src/dwolla/Client');
    clientOpts = { id: 'id', secret: 'secret' };
  });

  it('throws error opts is not an object', function() {
    assert.throws(function() {
      new Client();
    }, 'First argument must be an object.');
  });

  it('sets id', function() {
    var client = new Client(clientOpts);
    assert.equal(clientOpts.id, client.id);
  });

  it('sets secret', function() {
    var client = new Client(clientOpts);
    assert.equal(clientOpts.secret, client.secret);
  });

  it('defaults environment to production', function() {
    var client = new Client(clientOpts);
    assert.equal('production', client.environment);
  });

  it('sets environment if provided', function() {
    var environment = 'sandbox';
    var client = new Client(assign(clientOpts, { environment: environment }));
    assert.equal(environment, client.environment);
  });

  it('throws error if id is not a string', function() {
    assert.throws(function() {
      new Client({ secret: clientOpts.secret });
    }, 'id is required.');
  });

  it('throws error if secret is not a string', function() {
    assert.throws(function() {
      new Client({ id: clientOpts.id });
    }, 'secret is required.');
  });

  it('throws error if invalid environment', function() {
    assert.throws(function() {
      new Client(assign(clientOpts, { environment: 'invalid' }));
    }, 'Invalid environment.');
  });

  it('has Auth', function() {
    var client = new Client(clientOpts);
    assert.isDefined(client.Auth);
  });

  it('has auth', function() {
    var client = new Client(clientOpts);
    assert.isDefined(client.auth);
  });

  it('authUrl', function() {
    var client = new Client(clientOpts);
    assert.equal(Client.ENVIRONMENTS[client.environment].authUrl, client.authUrl);
  });

  it('tokenUrl', function() {
    var client = new Client(clientOpts);
    assert.equal(Client.ENVIRONMENTS[client.environment].tokenUrl, client.tokenUrl);
  });

  it('apiUrl', function() {
    var client = new Client(clientOpts);
    assert.equal(Client.ENVIRONMENTS[client.environment].apiUrl, client.apiUrl);
  });
});
