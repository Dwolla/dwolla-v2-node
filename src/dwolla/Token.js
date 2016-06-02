var fetch = require('node-fetch');
var formurlencoded = require('form-urlencoded');
var rejectEmptyKeys = require('../util/rejectEmptyKeys');
var instanceOf = require('../util/instanceOf');
var assign = require('lodash/assign');
var FormData = require('form-data');
var Promise = require('bluebird');

fetch.Promise = Promise;

var Token = function(client, opts) {
  this.client = client;
  this.access_token = opts.access_token;
  this.refresh_token = opts.refresh_token;
  this.expires_in = opts.expires_in;
  this.scope = opts.scope;
  this.account_id = opts.account_id;
};

function getHeaders(token, moreHeaders) {
  return assign({
    Authorization: ['Bearer', token.access_token].join(' '),
    Accept: 'application/vnd.dwolla.v1.hal+json',
    'User-Agent': require('./userAgent'),
  }, moreHeaders);
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
  res.text().then(function(body) {
    var parsedBody;
    try {
      parsedBody = JSON.parse(body);
    } catch (e) {
      parsedBody = body;
    }
    var parsedRes = {
      status: res.status,
      headers: res.headers,
      body: parsedBody,
    };
    if (parsedRes.status < 400) {
      resolve(parsedRes);
    } else {
      reject(parsedRes);
    }
  });
}

function handleRequest(request) {
  return new Promise(function(resolve, reject) {
    request.then(handleResponse.bind(null, resolve, reject));
  });
}

Token.prototype.get = function(path, query, headers) {
  return handleRequest(
    fetch(
      getUrl(this, path, query),
      {
        headers: getHeaders(this, headers),
      }
    )
  );
};

Token.prototype.post = function(path, body, headers) {
  return handleRequest(
    fetch(
      getUrl(this, path),
      {
        method: 'POST',
        headers: assign(
          getHeaders(this, headers),
          instanceOf(body, FormData) ? body.getHeaders() : { 'content-type': 'application/json' }
        ),
        body: instanceOf(body, FormData) ? body : JSON.stringify(body),
      }
    )
  );
};

Token.prototype.delete = function(path, query, headers) {
  return handleRequest(
    fetch(
      getUrl(this, path, query),
      {
        method: 'DELETE',
        headers: getHeaders(this, headers),
      }
    )
  );
};

module.exports = Token;
