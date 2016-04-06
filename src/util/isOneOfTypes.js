module.exports = function(value, types) {
  var result = false;
  for (var i in types) {
    if (types.hasOwnProperty(i)) {
      var type = types[i];
      if (typeof value === type) {
        result = true;
        break;
      }
    }
  }
  return result;
};
