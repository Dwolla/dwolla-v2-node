var snakecase = require("lodash.snakecase");

module.exports = function snakifyKeys(obj) {
  if (typeof obj === "object") {
    var keys = Object.keys(obj);
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i];
      var snaked = snakecase(k);
      if (k !== snaked) {
        var v = obj[k];
        delete obj[k];
        obj[snaked] = v;
      }
    }
  }
};
