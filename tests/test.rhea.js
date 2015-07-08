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
    loadModule("rhea.wrapped.js", "/cassowary/", function (rhea) {
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
      this.rhea.Module.test(1);
    });
    it("should create a Variable", function () {
      var variable = new this.rhea.Module.Variable(12);
      assert.equal(variable.value(), 12);
    });
    it("should modify a Variable", function () {
      var variable = new this.rhea.Module.Variable(12);
      variable.set_value(23);
      assert.equal(variable.value(), 23);
    });
    it("should create expressions", function () {
      var v1 = new this.rhea.Module.Variable(1);
      var v2 = new this.rhea.Module.Variable(2);

      assert.equal(this.rhea.Module.createExpressionVarVar(v1, "+", v2).evaluate(), 3);
      assert.equal(this.rhea.Module.createExpressionVarVar(v1, "-", v2).evaluate(), -1);

      assert.equal(this.rhea.Module.createExpressionVarConst(v1, "+", 3).evaluate(), 4);
      assert.equal(this.rhea.Module.createExpressionVarConst(v1, "-", 3).evaluate(), -2);
      assert.equal(this.rhea.Module.createExpressionVarConst(v1, "*", 3).evaluate(), 3);
      assert.equal(this.rhea.Module.createExpressionVarConst(v1, "/", 2).evaluate(), 0.5);

      assert.equal(this.rhea.Module.createExpressionConstVar(3, "+", v2).evaluate(), 5);
      assert.equal(this.rhea.Module.createExpressionConstVar(3, "-", v2).evaluate(), 1);
      assert.equal(this.rhea.Module.createExpressionConstVar(3, "*", v2).evaluate(), 6);
    });

    it("should create equations", function () {
      var v1 = new this.rhea.Module.Variable(1);
      var v2 = new this.rhea.Module.Variable(2);
      var e1 = this.rhea.Module.createExpressionVarVar(v1, "+", v2);
      var e2 = this.rhea.Module.createExpressionVarVar(v1, "-", v2);

      this.rhea.Module.createEquationExpVar(e1, v2);
      this.rhea.Module.createEquationVarExp(v1, e2);
      this.rhea.Module.createEquationVarVar(v1, v2);
      this.rhea.Module.createEquationVarVar(v1, v2);
      this.rhea.Module.createEquationVarConst(v1, 2);
    });

    it("should create inequalities", function () {
      var v1 = new this.rhea.Module.Variable(1);
      var v2 = new this.rhea.Module.Variable(2);
      var e1 = this.rhea.Module.createExpressionVarVar(v1, "+", v2);
      var e2 = this.rhea.Module.createExpressionVarVar(v1, "-", v2);

      this.rhea.Module.createInequalityExpExp(e1, "<=", e2);
      this.rhea.Module.createInequalityVarExp(v1, ">=", e2);
      this.rhea.Module.createInequalityVarVar(v1, "<=", v2);
      this.rhea.Module.createInequalityVarConst(v1, ">=", 3);
    });

    it("should create constraints", function () {
      var v1 = new this.rhea.Module.Variable(1);
      var eq1 = this.rhea.Module.createEquationVarConst(v1, 2);
      var eq2 = this.rhea.Module.createInequalityVarConst(v1, "<=", 2);

      this.rhea.Module.createConstraintEq(eq1);
      this.rhea.Module.createConstraintIneq(eq2);
    });
    
    it("should create a solver", function () {
      var v1 = new this.rhea.Module.Variable(1);
      var eq1 = this.rhea.Module.createEquationVarConst(v1, 2);

      var c1 = this.rhea.Module.createConstraintEq(eq1);
      var s1 = new this.rhea.Module.SimplexSolver();
      s1.add_constraint(c1);
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
    });

    it("should solve multiple constraints", function () {
      var v1 = new this.rhea.Module.Variable();
      var v2 = new this.rhea.Module.Variable();
      var eq1 = this.rhea.Module.createEquationExpVar(this.rhea.Module.createExpressionVarConst(v1, "-", 1), v2);
      var eq2 = this.rhea.Module.createInequalityVarVar(v1, ">=", v2);
      var c1 = this.rhea.Module.createConstraintEq(eq1);
      var c2 = this.rhea.Module.createConstraintIneq(eq2);

      var s1 = new this.rhea.Module.SimplexSolver();
      s1.add_constraint(c1);
      s1.solve();
      assert.isTrue(v1.value() - 1 == v2.value() && v1.value() >= v2.value());
    });


  });
});