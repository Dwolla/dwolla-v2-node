module.exports = function(obj, klass) {
  if (typeof obj !== 'object') {
    return false;
  }
  return Object.getPrototypeOf(obj) === klass.prototype;
};
