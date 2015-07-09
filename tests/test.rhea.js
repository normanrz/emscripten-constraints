try {
  var assert = require("assert");
}
catch(err) {
  var assert = chai.assert;
}

function perfTest(runner, runs) {
  if (typeof runs == "undefined") {
    runs = 100;
  }
  var start = performance.now();
  for(var i = 0; i < runs; i++) {
    runner();
  }
  return (performance.now() - start) / runs;
}


describe("Rhea", function(){
  before(function(done){
    loadModule("rhea.wrapped.js", "/cassowary/", function (rhea) {
      this.rhea = rhea;
      this.deleteAll = function () {
        for (var i = 0; i < arguments.length; i++) {
          arguments[i].delete();
        }
      }
      done();
    }.bind(this));
  });
  describe('Properties', function () {
    it('Module present in rhea', function () {
      assert.isTrue('Module' in this.rhea);
    });
  });
  describe("Run", function () {
    it("should run test function", function () {
      // v1 - 1 == v2, v1 >= 2
      var res = this.rhea.Module.test();
      console.log(res.get(0), res.get(1));
      assert.isTrue(res.get(0) - 1 == res.get(1));
      assert.isTrue(res.get(0) >= 2);
    });
    it("should create a Variable", function () {
      var v1 = new this.rhea.Module.Variable(12);
      assert.equal(v1.value(), 12);
      this.deleteAll(v1);
    });
    it("should modify a Variable", function () {
      var v1 = new this.rhea.Module.Variable(12);
      v1.set_value(23);
      assert.equal(v1.value(), 23);
      this.deleteAll(v1);
    });
    it("should create expressions", function () {
      var v1 = new this.rhea.Module.Variable(1);
      var v2 = new this.rhea.Module.Variable(2);

      var e1 = this.rhea.Module.createExpressionVarVar(v1, "+", v2);
      var e2 = this.rhea.Module.createExpressionVarVar(v1, "-", v2);

      var e3 = this.rhea.Module.createExpressionVarConst(v1, "+", 3);
      var e4 = this.rhea.Module.createExpressionVarConst(v1, "-", 3);
      var e5 = this.rhea.Module.createExpressionVarConst(v1, "*", 3);
      var e6 = this.rhea.Module.createExpressionVarConst(v1, "/", 2);

      var e7 = this.rhea.Module.createExpressionConstVar(3, "+", v2)
      var e8 = this.rhea.Module.createExpressionConstVar(3, "-", v2)
      var e9 = this.rhea.Module.createExpressionConstVar(3, "*", v2)

      assert.equal(e1.evaluate(), 3);
      assert.equal(e2.evaluate(), -1);

      assert.equal(e3.evaluate(), 4);
      assert.equal(e4.evaluate(), -2);
      assert.equal(e5.evaluate(), 3);
      assert.equal(e6.evaluate(), 0.5);

      assert.equal(e7.evaluate(), 5);
      assert.equal(e8.evaluate(), 1);
      assert.equal(e9.evaluate(), 6);

      this.deleteAll(v1, v2, e1, e2, e3, e4, e5, e6, e7, e8, e9);
    });

    it("should create equations", function () {
      var v1 = new this.rhea.Module.Variable(1);
      var v2 = new this.rhea.Module.Variable(2);

      var e1 = this.rhea.Module.createExpressionVarVar(v1, "+", v2);
      var e2 = this.rhea.Module.createExpressionVarVar(v2, "-", v1);

      var eq1 = this.rhea.Module.createEquationExpVar(e1, v2);
      var eq2 = this.rhea.Module.createEquationVarExp(v1, e2);
      var eq3 = this.rhea.Module.createEquationVarVar(v1, v2);
      var eq4 = this.rhea.Module.createEquationExpExp(e1, e2);
      var eq5 = this.rhea.Module.createEquationVarConst(v2, 2);

      assert.isFalse(eq1.is_satisfied()); // v1 + v2 == v2
      assert.isTrue(eq2.is_satisfied()); // v1 == v2 - v1
      assert.isFalse(eq3.is_satisfied()); // v1 == v2
      assert.isFalse(eq4.is_satisfied()); // v1 + v2 == v1 - v2
      assert.isTrue(eq5.is_satisfied()); // v2 == 2

      this.deleteAll(v1, v2, e1, e2, eq1, eq2, eq3, eq4, eq5);
    });

    it("should create inequalities", function () {
      var v1 = new this.rhea.Module.Variable(1);
      var v2 = new this.rhea.Module.Variable(2);
      var e1 = this.rhea.Module.createExpressionVarVar(v1, "+", v2);
      var e2 = this.rhea.Module.createExpressionVarVar(v1, "-", v2);

      var eq1 = this.rhea.Module.createInequalityExpExp(e1, "<=", e2);
      var eq2 = this.rhea.Module.createInequalityVarExp(v1, ">=", e2);
      var eq3 = this.rhea.Module.createInequalityVarVar(v1, "<=", v2);
      var eq4 = this.rhea.Module.createInequalityVarConst(v1, ">=", 3);

      assert.isFalse(eq1.is_satisfied()); // v1 + v2 <= v1 - v2
      assert.isTrue(eq2.is_satisfied()); // v1 >= v1 - v2
      assert.isTrue(eq3.is_satisfied()); // v1 <= v2
      assert.isFalse(eq4.is_satisfied()); // v1 >= 3

      this.deleteAll(v1, v2, e1, e2, eq1, eq2, eq3, eq4);
    });

    it("should create constraints", function () {
      var v1 = new this.rhea.Module.Variable(1);
      var eq1 = this.rhea.Module.createEquationVarConst(v1, 2);
      var eq2 = this.rhea.Module.createInequalityVarConst(v1, "<=", 2);

      var c1 = this.rhea.Module.createConstraintEq(eq1);
      var c2 = this.rhea.Module.createConstraintIneq(eq2);

      assert.isFalse(c1.is_satisfied());
      assert.isTrue(c2.is_satisfied());

      this.deleteAll(v1, eq1, eq2, c1, c2);
    });
    
    it("should create a solver", function () {
      var v1 = new this.rhea.Module.Variable(1);
      var eq1 = this.rhea.Module.createEquationVarConst(v1, 2);

      var c1 = this.rhea.Module.createConstraintEq(eq1);
      var s1 = new this.rhea.Module.SimplexSolver();
      s1.add_constraint(c1);

      this.deleteAll(v1, eq1, c1, s1);
    });

    it("should solve an equation", function () {
      var v1 = new this.rhea.Module.Variable(3);
      var v2 = new this.rhea.Module.Variable(2);
      var e1 = this.rhea.Module.createExpressionVarConst(v1, "-", 1);
      var eq1 = this.rhea.Module.createEquationExpVar(e1, v2);
      var c1 = this.rhea.Module.createConstraintEq(eq1);

      var s1 = new this.rhea.Module.SimplexSolver();
      s1.add_constraint(c1);
      s1.solve();
      assert.isTrue(v1.value() - 1 == v2.value());

      this.deleteAll(v1, v2, e1, eq1, c1, s1);
    });

    it("should solve an inequality", function () {
      var v1 = new this.rhea.Module.Variable(3);
      var v2 = new this.rhea.Module.Variable(4);
      var eq1 = this.rhea.Module.createInequalityVarVar(v1, ">=", v2);
      var c1 = this.rhea.Module.createConstraintIneq(eq1);

      var s1 = new this.rhea.Module.SimplexSolver();
      s1.add_constraint(c1);
      s1.solve();
      assert.isTrue(v1.value() >= v2.value());

      this.deleteAll(v1, v2, eq1, c1, s1);
    });

    it("should solve multiple constraints", function () {
      var v1 = new this.rhea.Module.Variable();
      var v2 = new this.rhea.Module.Variable();
      
      // v1 - 1 == v2
      var e1 = this.rhea.Module.createExpressionVarConst(v1, "-", 1);
      var eq1 = this.rhea.Module.createEquationExpVar(e1, v2);
      var c1 = this.rhea.Module.createConstraintEq(eq1);
      
      // v1 >= 2
      var eq2 = this.rhea.Module.createInequalityVarConst(v1, ">=", 2);
      var c2 = this.rhea.Module.createConstraintIneq(eq2);

      var s1 = new this.rhea.Module.SimplexSolver();
      s1.add_constraint(c1);
      s1.add_constraint(c2);
      s1.solve();

      console.log(v1.value(), v2.value());
      assert.isTrue(v1.value() - 1 == v2.value())
      assert.isTrue(v1.value() >= 2);

      this.deleteAll(v1, v2, e1, eq1, c1, eq2, c2, s1);
    });

    it("should benchmark solving multiple constraints", function () {
      this._runnable.title += ": " + perfTest(function () {
        var v1 = new this.rhea.Module.Variable();
        var v2 = new this.rhea.Module.Variable();
        
        // v1 - 1 == v2
        var e1 = this.rhea.Module.createExpressionVarConst(v1, "-", 1);
        var eq1 = this.rhea.Module.createEquationExpVar(e1, v2);
        var c1 = this.rhea.Module.createConstraintEq(eq1);
        
        // v1 >= 2
        var eq2 = this.rhea.Module.createInequalityVarConst(v1, ">=", 2);
        var c2 = this.rhea.Module.createConstraintIneq(eq2);

        var s1 = new this.rhea.Module.SimplexSolver();
        s1.add_constraint(c1);
        s1.add_constraint(c2);
        s1.solve();

        // assert.isTrue(v1.value() - 1 == v2.value())
        // assert.isTrue(v1.value() >= 2);

        this.deleteAll(v1, v2, e1, eq1, c1, eq2, c2, s1);
      }.bind(this));
    });


  });
});