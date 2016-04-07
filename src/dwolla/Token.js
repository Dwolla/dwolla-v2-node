var fetch = require('node-fetch');
var formurlencoded = require('form-urlencoded');
var rejectEmptyKeys = require('../util/rejectEmptyKeys');
var instanceOf = require('../util/instanceOf');
var assign = require('lodash/assign');
var FormData = require('form-data');

fetch.Promise = require('bluebird');

var Token = function(client, opts) {
  this.client = client;
  this.access_token = opts.access_token;
  this.refresh_token = opts.refresh_token;
  this.expires_in = opts.expires_in;
  this.scope = opts.scope;
  this.account_id = opts.account_id;
};

function getHeaders(token) {
  return {
    Authorization: ['Bearer', token.access_token].join(' '),
    Accept: 'application/vnd.dwolla.v1.hal+json',
  };
}

function getUrl(token, suppliedPath, suppliedQuery) {
  var url;
  if (typeof suppliedPath === 'object') {
    url = suppliedPath._links.self.href;
  } else if (suppliedPath.indexOf(token.client.apiUrl) === 0) {
    url = suppliedPath;
  } else if (suppliedPath.indexOf('/') === 0) {
    url = [token.client.apiUrl, suppliedPath].join('');
  } else {
    url = [token.client.apiUrl, suppliedPath].join('/');
  }
  var query = formurlencoded(rejectEmptyKeys(suppliedQuery || {}));
  return query ? [url, query].join('?') : url;
}

function handleResponse(resolve, reject, res) {
  if (res.status < 400) {
    resolve(res);
  } else {
    reject(res);
  }
}

function handleRequest(request) {
  return new Promise(function(resolve, reject) {
    request.then(handleResponse.bind(null, resolve, reject));
  });
}

Token.prototype.get = function(path, query) {
  return handleRequest(
    fetch(
      getUrl(this, path, query),
      {
        headers: getHeaders(this),
      }
    )
  );
};

Token.prototype.post = function(path, body) {
  return handleRequest(
    fetch(
      getUrl(this, path),
      {
        method: 'POST',
        headers: assign(
          getHeaders(this),
          instanceOf(body, FormData) ? body.getHeaders() : { 'content-type': 'application/json' }
        ),
        body: instanceOf(body, FormData) ? body : JSON.stringify(body),
      }
    )
  );
};

Token.prototype.delete = function(path, query) {
  return handleRequest(
    fetch(
      getUrl(this, path, query),
      {
        method: 'DELETE',
        headers: getHeaders(this),
      }
    )
  );
};

module.exports = Token;
