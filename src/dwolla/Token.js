var fetch = require("node-fetch").default;
var formurlencoded = require("form-urlencoded").default;
var rejectEmptyKeys = require("../util/rejectEmptyKeys");
var isFormData = require("../util/isFormData");
var assign = Object.assign;
var Promise = require("bluebird");

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
  return assign(
    {
      Authorization: ["Bearer", token.access_token].join(" "),
      Accept: "application/vnd.dwolla.v1.hal+json",
      "User-Agent": require("./userAgent")
    },
    moreHeaders
  );
}

function getUrl(token, suppliedPath, suppliedQuery) {
  var url;
  if (typeof suppliedPath === "object") {
    url = suppliedPath._links.self.href;
  } else if (suppliedPath.startsWith(token.client.apiUrl)) {
    url = suppliedPath;
  } else if (suppliedPath.startsWith("/")) {
    url = [token.client.apiUrl, suppliedPath].join("");
  } else {
    url = [
      token.client.apiUrl,
      suppliedPath.replace(/^https?:\/\/[^\/]*\//, "")
    ].join("/");
  }
  var query = formurlencoded(rejectEmptyKeys(suppliedQuery), {
    skipIndex: true,
    skipBracket: true
  });
  return query ? [url, query].join("?") : url;
}

function errorFrom(message, parsedRes) {
  var error = new Error(message);
  error.status = parsedRes.status;
  error.headers = parsedRes.headers;
  error.body = parsedRes.body;
  return error;
}

function handleResponse(res) {
  return res.text().then(function(body) {
    var parsedBody;
    try {
      parsedBody = JSON.parse(body);
    } catch (e) {
      parsedBody = body;
    }
    var parsedRes = {
      status: res.status,
      headers: res.headers,
      body: parsedBody
    };
    if (parsedRes.status >= 400) {
      return Promise.reject(errorFrom(body, parsedRes));
    }
    return parsedRes;
  });
}

Token.prototype.get = function(path, query, headers) {
  return fetch(getUrl(this, path, query), {
    headers: getHeaders(this, headers)
  }).then(handleResponse);
};

Token.prototype.post = function(path, body, headers) {
  return fetch(getUrl(this, path), {
    method: "POST",
    headers: assign(
      getHeaders(this, headers),
      isFormData(body)
        ? body.getHeaders()
        : { "content-type": "application/json" }
    ),
    body: isFormData(body) ? body : JSON.stringify(body)
  }).then(handleResponse);
};

Token.prototype.delete = function(path, query, headers) {
  return fetch(getUrl(this, path, query), {
    method: "DELETE",
    headers: getHeaders(this, headers)
  }).then(handleResponse);
};

module.exports = Token;
