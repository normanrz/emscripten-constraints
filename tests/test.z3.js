define(['module.z3'], function (loadZ3) {

  describe('Z3', function(){
    this.timeout("20s");
    before(function(done){
      var self = this;
      console.time("load z3");
      loadZ3().then(function(z3) {
        console.timeEnd("successfully loaded z3");
        self.z3 = z3;
        done();
      });
    });

    describe('Properties', function(){
      it('Module present in z3', function(){
        assert.isTrue('Module' in this.z3);
      })
      it('FS present in z3', function(){
        assert.isTrue('FS' in this.z3);
      })
    });

    describe('Solving', function() {
      it('should solve simple constraints', function() {
        var self = this;
        var problem = [
          "(declare-fun top0 () Real)",
          "(declare-fun top1 () Real)",
          "(assert (= top0 top1))",
          "(assert (= top0 500))",
          "(check-sat) (get-value (top0 top1))"
        ].join(" ");

        var solution = this.z3.solveProblem(problem);

        assert.isTrue(solution.indexOf("top0 500.0") > -1);
        assert.isTrue(solution.indexOf("top1 500.0") > -1);
      });

      it("should support rational numbers", function() {
        var z3 = this.z3;
        var c = z3.c;

        var tenOverTwelve = c.divide(10, 12);
        var result = new c.Variable();

        var solver = new c.SimplexSolver();
        solver.addConstraint(new c.Equation(result, tenOverTwelve));

        solver.solve();
        var absDiff = Math.abs(result.value - 10/12);
        assert.isTrue(absDiff < 0.1);
      });
    });

    describe("API Layer", function() {
      it("should be able to construct the problem description", function() {
        var z3 = this.z3;
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

        assert.isTrue(v1.value >= v2.value);
        assert.isTrue(v1.value - 1 === v2.value);
      });

    });
  });
});
