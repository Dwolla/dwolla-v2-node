function isStream(stream) {
  return (
    stream !== null &&
    typeof stream === "object" &&
    typeof stream.pipe === "function"
  );
}

module.exports = function(obj) {
  return isStream(obj) && typeof obj.getBoundary === "function";
};
