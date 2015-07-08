try {
  var assert = require("assert");
}
catch(err) {
  var assert = chai.assert;
}

describe("Rhea", function(){
  before(function(done){
    this.timeout(20000); // 20s
    var self = this;
    loadModule("rhea.js", "/cassowary/", function (rhea) {
      self.rhea = rhea;
      done();
    });
  });
  describe('Properties', function () {
    it('Module present in rhea', function () {
      assert.isTrue('Module' in this.rhea);
    });
    it('FS present in rhea', function () {
      assert.isTrue('FS' in this.rhea);
    });
  });
  describe("Run", function () {
    it("should run test function", function () {
      assert.equal(this.rhea.Module.test(100), 10);
    });
  });
});