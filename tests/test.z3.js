var loadZ3 = require("../z3/module.z3");
var assert = require("assert");


describe('Z3', function(){
  var z3 = null;
  this.timeout("20s");

  before(function (done) {
    loadZ3("/z3/").then(function(_z3) {
      z3 = _z3;
      done();
    });
  });

  describe('Properties', function(){
    it('Module present in z3', function(){
      assert.ok('Module' in z3);
    })
    it('FS present in z3', function(){
      assert.ok('FS' in z3);
    })
  });

  describe('Solving', function() {
    it('should solve simple constraints', function() {
      var problem = [
        "(declare-fun top0 () Real)",
        "(declare-fun top1 () Real)",
        "(assert (= top0 top1))",
        "(assert (= top0 500))",
        "(check-sat) (get-value (top0 top1))"
      ].join(" ");

      var solution = z3.solveProblem(problem);

      assert.ok(solution.indexOf("top0 500.0") > -1);
      assert.ok(solution.indexOf("top1 500.0") > -1);
    });

    it("should support rational numbers", function() {
      var c = z3.c;

      var tenOverTwelve = c.divide(10, 12);
      var result = new c.Variable();

      var solver = new c.SimplexSolver();
      solver.addConstraint(new c.Equation(result, tenOverTwelve));

      solver.solve();
      var absDiff = Math.abs(result.value - 10/12);
      assert.ok(absDiff < 0.1);
    });
  });

  describe("API Layer", function() {
    it("should be able to construct the problem description", function() {
      var c = z3.c;

      var v1 = new c.Variable();
      var v2 = new c.Variable();
      // v1 >= v2
      var ineq1 = new c.Inequality(v1, c.GEQ, v2);

      var e1 = c.minus(v1, 1);
      // v1 - 1 = v2
      var eq1 = new c.Equation(e1, v2);
      var s1 = new c.SimplexSolver();
      s1.addConstraint(eq1);
      s1.addConstraint(ineq1);

      s1.solve();

      assert.ok(v1.value >= v2.value);
      assert.ok(v1.value - 1 === v2.value);
    });

  });
});
