module.exports = function(obj) {
  return obj !== null && typeof obj === 'object' && typeof obj.getBoundary === 'function';
};
