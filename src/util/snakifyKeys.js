const _toSnakeCase = str =>
  str.replace(/[A-Z]/g, char => `_${char.toLowerCase()}`);

module.exports = function snakifyKeys(obj) {
  if (typeof obj === "object") {
    var keys = Object.keys(obj);
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i];
      var snaked = _toSnakeCase(k);
      if (k !== snaked) {
        var v = obj[k];
        delete obj[k];
        obj[snaked] = v;
      }
    }
  }
};
