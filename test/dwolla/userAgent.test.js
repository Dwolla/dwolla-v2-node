var chai = require("chai");
var assert = chai.assert;

describe("userAgent", function() {
  it("includes version", function() {
    assert.equal(
      ["dwolla-v2-node", require("../../package.json").version].join(" "),
      require("../../src/dwolla/userAgent")
    );
  });
});
