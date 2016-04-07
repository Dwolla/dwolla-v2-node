var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var nock = require('nock');
var formurlencoded = require('form-urlencoded');

var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

describe('Auth', function() {
  var dwolla = require('../../src/index');
  var client = new dwolla.Client({ id: 'client_id', secret: 'client_secret' });

  it('Auth#url', function() {
    var auth = new client.Auth();
    assert.equal(
      'https://www.dwolla.com/oauth/v2/authenticate?response_type=code&client_id=' + client.id,
      auth.url
    );
  });

  it('Auth#url with redirect_uri', function() {
    var redirect_uri = 'redirect uri';
    var auth = new client.Auth({ redirect_uri: redirect_uri });
    var expectedQuery = formurlencoded({ response_type: 'code', client_id: client.id, redirect_uri: redirect_uri });
    assert.equal(['https://www.dwolla.com/oauth/v2/authenticate', expectedQuery].join('?'), auth.url);
    assert.equal(redirect_uri, auth.redirect_uri);
  });

  it('Auth#url with scope', function() {
    var scope = 'b|l|a';
    var auth = new client.Auth({ scope: scope });
    var expectedQuery = formurlencoded({ response_type: 'code', client_id: client.id, scope: scope });
    assert.equal(['https://www.dwolla.com/oauth/v2/authenticate', expectedQuery].join('?'), auth.url);
    assert.equal(scope, auth.scope);
  });

  it('Auth#url with state', function() {
    var state = 'b l a';
    var auth = new client.Auth({ state: state });
    var expectedQuery = formurlencoded({ response_type: 'code', client_id: client.id, state: state });
    assert.equal(['https://www.dwolla.com/oauth/v2/authenticate', expectedQuery].join('?'), auth.url);
    assert.equal(state, auth.state);
  });

  it('Auth#callback throws error with bad state', function() {
    var state = 'state';
    var auth = new client.Auth({ state: state });
    assert.throws(function() {
      auth.callback({ state: 'bad state' });
    }, 'Invalid state parameter.');
  });

  it('Auth#callback throws error if error', function() {
    var errorParams = { error: 'error' };
    var auth = new client.Auth();
    assert.throws(function() {
      auth.callback(errorParams);
    }, errorParams);
  });

  it('Auth#callback successful response', function(done) {
    var state = 'state';
    var code = 'code';
    var auth = new client.Auth({ state: state });
    nock(client.tokenUrl, { reqheaders: { 'content-type': 'application/x-www-form-urlencoded' } })
      .post('', { client_id: client.id, client_secret: client.secret, grant_type: 'authorization_code', code: code })
      .reply(200, {});
    expect(auth.callback({ state: state, code: code })).to.be.fulfilled.and.notify(done);
  });

  it('Auth#callback error response', function(done) {
    var state = 'state';
    var code = 'code';
    var redirect_uri = 'redirect uri';
    var auth = new client.Auth({ redirect_uri: redirect_uri, state: state });
    nock(client.tokenUrl, { reqheaders: { 'content-type': 'application/x-www-form-urlencoded' } })
      .post('', { client_id: client.id, client_secret: client.secret, grant_type: 'authorization_code', code: code, redirect_uri: redirect_uri })
      .reply(200, { error: 'error' });
    expect(auth.callback({ state: state, code: code })).to.be.rejected.and.notify(done);
  });

  it('auth.client successful response', function(done) {
    nock(client.tokenUrl, { reqheaders: { 'content-type': 'application/x-www-form-urlencoded' } })
      .post('', { client_id: client.id, client_secret: client.secret, grant_type: 'client_credentials' })
      .reply(200, {});
    expect(client.auth.client()).to.be.fulfilled.and.notify(done);
  });

  it('auth.client error response', function(done) {
    nock(client.tokenUrl, { reqheaders: { 'content-type': 'application/x-www-form-urlencoded' } })
      .post('', { client_id: client.id, client_secret: client.secret, grant_type: 'client_credentials' })
      .reply(200, { error: 'error' });
    expect(client.auth.client()).to.be.rejected.and.notify(done);
  });

  it('auth.refresh successful response', function(done) {
    var token = new client.Token({ refresh_token: 'refresh token' });
    nock(client.tokenUrl, { reqheaders: { 'content-type': 'application/x-www-form-urlencoded' } })
      .post('', { client_id: client.id, client_secret: client.secret, grant_type: 'refresh_token', refresh_token: token.refresh_token })
      .reply(200, {});
    expect(client.auth.refresh(token)).to.be.fulfilled.and.notify(done);
  });

  it('auth.refresh error response', function(done) {
    var token = new client.Token({ refresh_token: 'refresh token' });
    nock(client.tokenUrl, { reqheaders: { 'content-type': 'application/x-www-form-urlencoded' } })
      .post('', { client_id: client.id, client_secret: client.secret, grant_type: 'refresh_token', refresh_token: token.refresh_token })
      .reply(200, { error: 'error' });
    expect(client.auth.refresh(token)).to.be.rejected.and.notify(done);
  });
});
