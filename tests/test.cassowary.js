try {
  var assert = require("assert");
}
catch(err) {
  var assert = chai.assert;
}

var c = window.c;

describe("Cassowary-js", function () {
  describe("Run", function () {
    it("should solve an equation", function () {
      var v1 = new c.Variable({ value: 3 });
      var v2 = new c.Variable({ value: 2 });
      var e1 = c.minus(v1, 1);
      var eq1 = new c.Equation(e1, v2);

      var s1 = new c.SimplexSolver();
      s1.addConstraint(eq1);
      s1.solve();
      console.log(v1.value, v2.value);
      assert.isTrue(v1.value - 1 == v2.value);
    });

    it("should solve an inequality", function () {
      var v1 = new c.Variable({ value: 3 });
      var v2 = new c.Variable({ value: 4 });
      var eq1 = new c.Inequality(v1, c.GEQ, v2);

      var s1 = new c.SimplexSolver();
      s1.addConstraint(eq1);
      s1.solve();
      assert.isTrue(v1.value >= v2.value);
    });

    it("should solve multiple constraints", function () {
      var v1 = new c.Variable();
      var v2 = new c.Variable();
      // v1 - 1 == v2
      var eq1 = new c.Equation(c.minus(v1, 1), v2);
      // v1 >= 2
      var eq2 = new c.Inequality(v1, c.GEQ, 2);

      var s1 = new c.SimplexSolver();
      s1.addConstraint(eq1);
      s1.addConstraint(eq2);
      s1.solve();
      
      assert.isTrue(v1.value - 1 == v2.value);
      assert.isTrue(v1.value >= 2);
    });


  });
});