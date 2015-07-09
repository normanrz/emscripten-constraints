function ReferenceCounterRoot () {
  var children = [];

  this.add = function () {
    for(var i = 0; i < arguments.length; i++) {
      arguments[i].rc.increment();
      children.push(arguments[i]);
    }
  };
  this.deleteAll = function () {
    children.forEach(function (child) {
      child.delete();
    });
    children = [];
  };
}


describe("Rhea", function () {
  beforeEach(function (done) {

    function ReferenceCounter (self) {
      var counter = 0;
      var children = [];

      self.rc = {
        increment: function () {
          counter++;
        },
        add: function () {
          for(var i = 0; i < arguments.length; i++) {
            arguments[i].rc.increment();
            children.push(arguments[i]);
          }
        }
      };
      self.delete = function () {
        counter--;
        if (counter == 0) {
          if (typeof self.base != "undefined") {
            self.base.delete();
          }
          children.forEach(function (child) {
            child.delete();
          });
        } else if (counter < 0) {
          throw new Error("Object already deleted");
        }
      };
    }

    this.rc = new ReferenceCounterRoot();

    loadModule("rhea.wrapped.js", "/cassowary/", function (rhea) {
      this.rhea = rhea;
      this.deleteAll = function () {
        for (var i = 0; i < arguments.length; i++) {
          arguments[i].delete();
        }
      }

      this.r = (function (rhea) {

        function isExpression(a) { return a instanceof Expression; }
        function isVariable(a) { return a instanceof Variable; }
        function isEquation(a) { return a instanceof Equation; }
        function isInequality(a) { return a instanceof Inequality; }
        function isConstraint(a) { return a instanceof Constraint; }
        function isNumber(a) { return typeof a == "number"; }

        function Variable(obj) {
          ReferenceCounter(this);
          var v;
          if (obj && typeof obj.value == "number") {
            v = new rhea.Module.Variable(obj.value);
          } else {
            v = new rhea.Module.Variable();
          }
          Object.defineProperty(this, "base", { enumerable: false, readonly: true, value: v });
          Object.defineProperty(this, "value", { get: function () { return v.value(); } });
          this.set = function (value) { v.set_value(value); };
        }

        function plus(e1, e2) { return new Expression(e1, "+", e2); }
        function minus(e1, e2) { return new Expression(e1, "-", e2); }
        function times(e1, e2) { return new Expression(e1, "*", e2); }
        function divide(e1, e2) { return new Expression(e1, "/", e2); }

        function Expression(v1, op, v2) {
          
          ReferenceCounter(this);
          var e;
          
          if (isVariable(v1) && isVariable(v2)) {
            e = rhea.Module.createExpressionVarVar(v1.base, op, v2.base);
            this.rc.add(v1, v2);
          } else if (isVariable(v1) && isNumber(v2)) {
            e = rhea.Module.createExpressionVarConst(v1.base, op, v2);
            this.rc.add(v1);
          } else if (isNumber(v1) && isVariable(v2)) {
            e = rhea.Module.createExpressionConstVar(v1, op, v2.base);
            this.rc.add(v2);
          } else {
            throw new TypeError("Invalid arguments");
          }

          this.evaluate = function () { return e.evaluate(); };

          Object.defineProperty(this, "base", { enumerable: false, readonly: true, value: e });
        }

        function Equation(v1, v2) {
          ReferenceCounter(this);
          var e;

          if (isExpression(v1) && isVariable(v2)) {
            e = rhea.Module.createEquationExpVar(v1.base, v2.base);
            this.rc.add(v1, v2);
          } else if (isVariable(v1) && isExpression(v2)) {
            e = rhea.Module.createEquationVarExp(v1.base, v2.base);
            this.rc.add(v1, v2);
          } else if (isVariable(v1) && isVariable(v2)) {
            e = rhea.Module.createEquationVarVar(v1.base, v2.base);
            this.rc.add(v1, v2);
          } else if (isExpression(v1) && isExpression(v2)) {
            e = rhea.Module.createEquationExpExp(v1.base, v2.base);
            this.rc.add(v1, v2);
          } else if (isExpression(v1) && isNumber(v2)) {
            e = rhea.Module.createEquationExpConst(v1.base, v2);
            this.rc.add(v1);
          } else if (isNumber(v1) && isExpression(v2)) {
            e = rhea.Module.createEquationExpConst(v2.base, v1);
            this.rc.add(v2);
          } else if (isVariable(v1) && isNumber(v2)) {
            e = rhea.Module.createEquationVarConst(v1.base, v2);
            this.rc.add(v1);
          } else if (isNumber(v1) && isVariable(v2)) {
            e = rhea.Module.createEquationVarConst(v2.base, v1);
            this.rc.add(v2);
          } else {
            throw new TypeError("Invalid arguments");
          }

          this.isSatisfied = function () { return e.is_satisfied(); };

          Object.defineProperty(this, "base", { enumerable: false, readonly: true, value: e });

        }

        function Inequality(v1, op, v2) {
          ReferenceCounter(this);
          var e;

          if (isExpression(v1) && isExpression(v2)) {
            e = rhea.Module.createInequalityExpExp(v1.base, op, v2.base);
            this.rc.add(v1, v2);
          } else if (isVariable(v1) && isExpression(v2)) {
            e = rhea.Module.createInequalityVarExp(v1.base, op, v2.base);
            this.rc.add(v1, v2);
          } else if (isExpression(v1) && isVariable(v2)) {
            e = rhea.Module.createInequalityVarExp(v2.base, op, v1.base);
            this.rc.add(v1, v2);
          } else if (isVariable(v1) && isVariable(v2)) {
            e = rhea.Module.createInequalityVarVar(v1.base, op, v2.base);
            this.rc.add(v1, v2);
          } else if (isVariable(v1) && isNumber(v2)) {
            e = rhea.Module.createInequalityVarConst(v1.base, op, v2);
            this.rc.add(v1);
          } else if (isNumber(v1) && isVariable(v2)) {
            e = rhea.Module.createInequalityVarConst(v1, op, v2.base);
            this.rc.add(v2);
          } else {
            throw new TypeError("Invalid arguments");
          }

          this.isSatisfied = function () { return e.is_satisfied(); };

          Object.defineProperty(this, "base", { enumerable: false, readonly: true, value: e });
        }

        function Constraint(e1) {
          ReferenceCounter(this);
          var c;

          if (isEquation(e1)) {
            c = rhea.Module.createConstraintEq(e1.base);
            this.rc.add(e1);
          } else if (isInequality(e1)) {
            c = rhea.Module.createConstraintIneq(e1.base);
            this.rc.add(e1);
          } else {
            throw new TypeError("Invalid arguments");
          }

          this.isSatisfied = function () { return c.is_satisfied(); };
          Object.defineProperty(this, "base", { enumerable: false, readonly: true, value: c });

        }

        function SimplexSolver() {
          ReferenceCounter(this);
          var solver = new rhea.Module.SimplexSolver();

          this.addConstraint = function (c) {
            if (isConstraint(c)) {
              solver.add_constraint(c.base);
              this.rc.add(c);
            } else if (isEquation(c) || isInequality(c)) {
              this.addConstraint(new Constraint(c));
            } else {
              throw new TypeError("Invalid arguments");
            }
          };

          this.addConstraints = function (constraints) {
            for(var i = 0; i < constraints.length; i++) {
              this.addConstraint(constraints[i]);
            }
          };

          this.addStay = function (v) {
            if (isVariable(v)) {
              solver.add_stay(v.base);
            } else {
              throw new TypeError("Invalid arguments");
            }
          };

          this.addEditVar = function (v) {
            if (isVariable(v)) {
              solver.add_edit_var(v.base);
            } else {
              throw new TypeError("Invalid arguments");
            }
          };

          this.solve = function () { solver.solve(); };
          this.beginEdit = function () { solver.begin_edit(); };
          this.endEdit = function () { solver.end_edit(); };

          this.suggest = function (v, value) {
            if (isVariable(v)) {
              solver.suggest(v.base, value);
            } else {
              throw new TypeError("Invalid arguments");
            }
          };

          this.suggestValue = function (v, value) {
            if (isVariable(v)) {
              solver.suggest_value(v.base, value);
            } else {
              throw new TypeError("Invalid arguments");
            }
          };


          Object.defineProperty(this, "base", { enumerable: false, readonly: true, value: solver });
        }

        return {
          Variable : Variable,
          Expression: Expression,
          Equation: Equation,
          Inequality: Inequality,
          SimplexSolver: SimplexSolver,
          Constraint: Constraint,
          GEQ: ">=",
          LEQ: "<=",
          plus,
          minus,
          times,
          divide
        }
      })(rhea);


      done();
    }.bind(this));
  });
  afterEach(function () {
    this.rc.deleteAll();
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












  describe("Run - New API", function () {
    it("should run test function", function () {
      // v1 - 1 == v2, v1 >= 2
      var res = this.rhea.Module.test();
      console.log(res.get(0), res.get(1));
      assert.isTrue(res.get(0) - 1 == res.get(1));
      assert.isTrue(res.get(0) >= 2);
    });
    it("should create a Variable", function () {
      var v1 = new this.r.Variable({ value: 12 });
      assert.equal(v1.value, 12);
      this.rc.add(v1);
    });
    it("should modify a Variable", function () {
      var v1 = new this.r.Variable({ value: 12 });
      v1.set(23);
      assert.equal(v1.value, 23);
      this.rc.add(v1);
    });
    it("should create expressions", function () {
      var v1 = new this.r.Variable({ value: 1 });
      var v2 = new this.r.Variable({ value: 2 });

      var e1 = this.r.plus(v1, v2);
      var e2 = this.r.minus(v1, v2);

      var e3 = this.r.plus(v1, 3);
      var e4 = this.r.minus(v1, 3);
      var e5 = this.r.times(v1, 3);
      var e6 = this.r.divide(v1, 2);

      var e7 = this.r.plus(3, v2)
      var e8 = this.r.minus(3, v2)
      var e9 = this.r.times(3, v2)

      assert.equal(e1.evaluate(), 3);
      assert.equal(e2.evaluate(), -1);

      assert.equal(e3.evaluate(), 4);
      assert.equal(e4.evaluate(), -2);
      assert.equal(e5.evaluate(), 3);
      assert.equal(e6.evaluate(), 0.5);

      assert.equal(e7.evaluate(), 5);
      assert.equal(e8.evaluate(), 1);
      assert.equal(e9.evaluate(), 6);

      this.rc.add(e1, e2, e3, e4, e5, e6, e7, e8, e9);
    });

    it("should create equations", function () {
      var v1 = new this.r.Variable({ value: 1 });
      var v2 = new this.r.Variable({ value: 2 });

      var e1 = this.r.plus(v1, v2);
      var e2 = this.r.minus(v2, v1);

      var eq1 = new this.r.Equation(e1, v2);
      var eq2 = new this.r.Equation(v1, e2);
      var eq3 = new this.r.Equation(v1, v2);
      var eq4 = new this.r.Equation(e1, e2);
      var eq5 = new this.r.Equation(v2, 2);

      assert.isFalse(eq1.isSatisfied()); // v1 + v2 == v2
      assert.isTrue(eq2.isSatisfied()); // v1 == v2 - v1
      assert.isFalse(eq3.isSatisfied()); // v1 == v2
      assert.isFalse(eq4.isSatisfied()); // v1 + v2 == v1 - v2
      assert.isTrue(eq5.isSatisfied()); // v2 == 2

      this.rc.add(eq1, eq2, eq3, eq4, eq5);
    });

    it("should create inequalities", function () {
      var v1 = new this.r.Variable({ value: 1 });
      var v2 = new this.r.Variable({ value: 2 });

      var e1 = this.r.plus(v1, v2);
      var e2 = this.r.minus(v1, v2);

      var eq1 = new this.r.Inequality(e1, "<=", e2);
      var eq2 = new this.r.Inequality(v1, ">=", e2);
      var eq3 = new this.r.Inequality(v1, "<=", v2);
      var eq4 = new this.r.Inequality(v1, ">=", 3);

      assert.isFalse(eq1.isSatisfied()); // v1 + v2 <= v1 - v2
      assert.isTrue(eq2.isSatisfied()); // v1 >= v1 - v2
      assert.isTrue(eq3.isSatisfied()); // v1 <= v2
      assert.isFalse(eq4.isSatisfied()); // v1 >= 3

      this.rc.add(eq1, eq2, eq3, eq4);
    });

    it("should create constraints", function () {
      var v1 = new this.r.Variable({ value: 1 });
      var eq1 = new this.r.Equation(v1, 2);
      var eq2 = new this.r.Inequality(v1, "<=", 2);

      var c1 = new this.r.Constraint(eq1);
      var c2 = new this.r.Constraint(eq2);

      assert.isFalse(c1.isSatisfied());
      assert.isTrue(c2.isSatisfied());

      this.rc.add(c1, c2);
    });
    
    it("should create a solver", function () {
      var v1 = new this.r.Variable({ value: 1 });
      var eq1 = new this.r.Equation(v1, 2);

      var s1 = new this.r.SimplexSolver();
      s1.addConstraint(eq1);

      this.rc.add(s1);
    });

    it("should solve an equation", function () {
      var v1 = new this.r.Variable({ value: 3 });
      var v2 = new this.r.Variable({ value: 2 });

      var e1 = this.r.minus(v1, 1);
      var eq1 = new this.r.Equation(e1, v2);

      var s1 = new this.r.SimplexSolver();
      s1.addConstraint(eq1);
      s1.solve();
      assert.isTrue(v1.value - 1 == v2.value);

      this.rc.add(s1);
    });

    it("should solve an inequality", function () {
      var v1 = new this.r.Variable({ value: 3 });
      var v2 = new this.r.Variable({ value: 4 });

      var eq1 = new this.r.Inequality(v1, ">=", v2);

      var s1 = new this.r.SimplexSolver();
      s1.addConstraint(eq1);
      s1.solve();
      assert.isTrue(v1.value >= v2.value);

      this.rc.add(s1);
    });

    it("should solve multiple constraints", function () {
      var v1 = new this.r.Variable();
      var v2 = new this.r.Variable();
      
      // v1 - 1 == v2
      var e1 = this.r.minus(v1, 1);
      var eq1 = new this.r.Equation(e1, v2);
      
      // v1 >= 2
      var eq2 = new this.r.Inequality(v1, ">=", 2);

      var s1 = new this.r.SimplexSolver();
      s1.addConstraint(eq1);
      s1.addConstraint(eq2);
      s1.solve();

      console.log(v1.value, v2.value);
      assert.isTrue(v1.value - 1 == v2.value);
      assert.isTrue(v1.value >= 2);

      this.rc.add(s1);
    });

    it("should benchmark solving multiple constraints", function () {
      this._runnable.title += ": " + perfTest(function () {
        var v1 = new this.r.Variable();
        var v2 = new this.r.Variable();
        
        // v1 - 1 == v2
        var e1 = this.r.minus(v1, 1);
        var eq1 = new this.r.Equation(e1, v2);
        
        // v1 >= 2
        var eq2 = new this.r.Inequality(v1, ">=", 2);

        var s1 = new this.r.SimplexSolver();
        s1.addConstraint(eq1);
        s1.addConstraint(eq2);
        s1.solve();

        console.log(v1.value, v2.value);
        assert.isTrue(v1.value - 1 == v2.value);
        assert.isTrue(v1.value >= 2);

        this.rc.add(s1);
      }.bind(this));
    });

    it("should solve a complex constraint set", function () {
      this._runnable.title += ": " + perfTest(function () {
        var c = this.r;

        var mouseLocationY = new c.Variable({ value: 10 });
        var temperature = new c.Variable({ value: 0 });
        var mercuryTop = new c.Variable({ value: 0 });
        var mercuryBottom = new c.Variable({ value: 0 });
        var thermometerTop = new c.Variable({ value: 0 });
        var thermometerBottom = new c.Variable({ value: 0 });
        var grayTop = new c.Variable({ value: 0 });
        var grayBottom = new c.Variable({ value: 0 });
        var whiteTop = new c.Variable({ value: 0 });
        var whiteBottom = new c.Variable({ value: 0 });
        var displayNumber = new c.Variable({ value: 0 });

        var constraints = [
          new c.Equation(temperature, mercuryTop),
          new c.Equation(whiteTop, thermometerTop),
          new c.Equation(whiteBottom, mercuryTop),
          new c.Equation(grayTop, mercuryTop),
          new c.Equation(grayBottom, mercuryBottom),
          new c.Equation(displayNumber, temperature),
          new c.Equation(mercuryTop, mouseLocationY),
          new c.Inequality(mercuryTop, c.LEQ, thermometerTop),
          new c.Equation(mercuryBottom, thermometerBottom)
        ];

        var solver = new c.SimplexSolver();
        solver.addStay(mouseLocationY);
        solver.addEditVar(mouseLocationY);
        constraints.forEach(function (c) {
          solver.addConstraint(c);
        });
        solver.solve();

        assert.equal(mouseLocationY.value, 10);
        assert.equal(temperature.value, 10);
        assert.equal(mercuryTop.value, 10);
        assert.equal(mercuryBottom.value, 0);
        assert.equal(thermometerTop.value, 10);
        assert.equal(thermometerBottom.value, 0);
        assert.equal(grayTop.value, 10);
        assert.equal(grayBottom.value, 0);
        assert.equal(whiteTop.value, 10);
        assert.equal(whiteBottom.value, 10);
        assert.equal(displayNumber.value, 10);

        solver.beginEdit();
        solver.suggestValue(mouseLocationY, 12);
        solver.endEdit();

        assert.equal(mouseLocationY.value, 12);
        assert.equal(temperature.value, 12);
        assert.equal(mercuryTop.value, 12);
        assert.equal(mercuryBottom.value, 0);
        assert.equal(thermometerTop.value, 12);
        assert.equal(thermometerBottom.value, 0);
        assert.equal(grayTop.value, 12);
        assert.equal(grayBottom.value, 0);
        assert.equal(whiteTop.value, 12);
        assert.equal(whiteBottom.value, 12);
        assert.equal(displayNumber.value, 12);


        this.rc.add(solver);
      }.bind(this));
    });


  });
});