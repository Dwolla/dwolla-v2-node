module.exports = function(obj, klass) {
  if (!obj || typeof obj !== "object") {
    return false;
  }
  return Object.getPrototypeOf(obj) === klass.prototype;
};
