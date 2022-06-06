var assert = require("chai").assert;

describe("index", function() {
  it("has Client", function() {
    var dwolla = require("../src/index");
    assert.equal(require("../src/dwolla/Client"), dwolla.Client);
  });
});
