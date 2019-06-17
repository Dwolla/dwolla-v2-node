var isStream = require("is-stream");

module.exports = function(obj) {
  // https://github.com/bitinn/node-fetch/blob/master/lib/body.js#L218
  return isStream(obj) && typeof obj.getBoundary === "function";
};
