module.exports = function(originalObj) {
  var obj = {};
  for (var k in originalObj) {
    if (
      originalObj.hasOwnProperty(k) &&
      originalObj[k] !== null &&
      typeof originalObj[k] !== "undefined"
    ) {
      obj[k] = originalObj[k];
    }
  }
  return obj;
};
