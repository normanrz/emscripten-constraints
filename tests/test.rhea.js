require(['../rhea/module.rhea'], function (loadRhea) {
  loadRhea(function(rhea) {
    describe("Rhea", function() {

      beforeEach(function () {
        this.rc = new rhea.ReferenceCounterRoot();
        this.deleteAll = function () {
          for (var i = 0; i < arguments.length; i++) {
            arguments[i].delete();
          }
        };
      });

      afterEach(function () {
        this.rc.deleteAll();
      });

      describe("Run", function () {

        it("should run test function", function () {
          // v1 - 1 == v2, v1 >= 2
          var res = rhea._Module.test();
          console.log(res.get(0), res.get(1));
          assert.isTrue(res.get(0) - 1 == res.get(1));
          assert.isTrue(res.get(0) >= 2);
        });

        it("should create a Variable", function () {
          var v1 = new rhea._Module.Variable(12);
          assert.equal(v1.value(), 12);
          this.deleteAll(v1);
        });

        it("should modify a Variable", function () {
          var v1 = new rhea._Module.Variable(12);
          v1.set_value(23);
          assert.equal(v1.value(), 23);
          this.deleteAll(v1);
        });

        it("should create expressions", function () {
          var v1 = new rhea._Module.Variable(1);
          var v2 = new rhea._Module.Variable(2);

          var e1 = rhea._Module.createExpressionVarVar(v1, "+", v2);
          var e2 = rhea._Module.createExpressionVarVar(v1, "-", v2);

          var e3 = rhea._Module.createExpressionVarConst(v1, "+", 3);
          var e4 = rhea._Module.createExpressionVarConst(v1, "-", 3);
          var e5 = rhea._Module.createExpressionVarConst(v1, "*", 3);
          var e6 = rhea._Module.createExpressionVarConst(v1, "/", 2);

          var e7 = rhea._Module.createExpressionConstVar(3, "+", v2)
          var e8 = rhea._Module.createExpressionConstVar(3, "-", v2)
          var e9 = rhea._Module.createExpressionConstVar(3, "*", v2)

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
          var v1 = new rhea._Module.Variable(1);
          var v2 = new rhea._Module.Variable(2);

          var e1 = rhea._Module.createExpressionVarVar(v1, "+", v2);
          var e2 = rhea._Module.createExpressionVarVar(v2, "-", v1);

          var eq1 = rhea._Module.createEquationExpVar(e1, v2);
          var eq2 = rhea._Module.createEquationVarExp(v1, e2);
          var eq3 = rhea._Module.createEquationVarVar(v1, v2);
          var eq4 = rhea._Module.createEquationExpExp(e1, e2);
          var eq5 = rhea._Module.createEquationVarConst(v2, 2);

          assert.isFalse(eq1.is_satisfied()); // v1 + v2 == v2
          assert.isTrue(eq2.is_satisfied()); // v1 == v2 - v1
          assert.isFalse(eq3.is_satisfied()); // v1 == v2
          assert.isFalse(eq4.is_satisfied()); // v1 + v2 == v1 - v2
          assert.isTrue(eq5.is_satisfied()); // v2 == 2

          this.deleteAll(v1, v2, e1, e2, eq1, eq2, eq3, eq4, eq5);
        });

        it("should create inequalities", function () {
          var v1 = new rhea._Module.Variable(1);
          var v2 = new rhea._Module.Variable(2);
          var e1 = rhea._Module.createExpressionVarVar(v1, "+", v2);
          var e2 = rhea._Module.createExpressionVarVar(v1, "-", v2);

          var eq1 = rhea._Module.createInequalityExpExp(e1, "<=", e2);
          var eq2 = rhea._Module.createInequalityVarExp(v1, ">=", e2);
          var eq3 = rhea._Module.createInequalityVarVar(v1, "<=", v2);
          var eq4 = rhea._Module.createInequalityVarConst(v1, ">=", 3);

          assert.isFalse(eq1.is_satisfied()); // v1 + v2 <= v1 - v2
          assert.isTrue(eq2.is_satisfied()); // v1 >= v1 - v2
          assert.isTrue(eq3.is_satisfied()); // v1 <= v2
          assert.isFalse(eq4.is_satisfied()); // v1 >= 3

          this.deleteAll(v1, v2, e1, e2, eq1, eq2, eq3, eq4);
        });

        it("should create constraints", function () {
          var v1 = new rhea._Module.Variable(1);
          var eq1 = rhea._Module.createEquationVarConst(v1, 2);
          var eq2 = rhea._Module.createInequalityVarConst(v1, "<=", 2);

          var c1 = rhea._Module.createConstraintEq(eq1);
          var c2 = rhea._Module.createConstraintIneq(eq2);

          assert.isFalse(c1.is_satisfied());
          assert.isTrue(c2.is_satisfied());

          this.deleteAll(v1, eq1, eq2, c1, c2);
        });

        it("should create a solver", function () {
          var v1 = new rhea._Module.Variable(1);
          var eq1 = rhea._Module.createEquationVarConst(v1, 2);

          var c1 = rhea._Module.createConstraintEq(eq1);
          var s1 = new rhea._Module.SimplexSolver();
          s1.add_constraint(c1);

          this.deleteAll(v1, eq1, c1, s1);
        });

        it("should solve an equation", function () {
          var v1 = new rhea._Module.Variable(3);
          var v2 = new rhea._Module.Variable(2);
          var e1 = rhea._Module.createExpressionVarConst(v1, "-", 1);
          var eq1 = rhea._Module.createEquationExpVar(e1, v2);
          var c1 = rhea._Module.createConstraintEq(eq1);

          var s1 = new rhea._Module.SimplexSolver();
          s1.add_constraint(c1);
          s1.solve();
          assert.isTrue(v1.value() - 1 == v2.value());

          this.deleteAll(v1, v2, e1, eq1, c1, s1);
        });

        it("should solve an inequality", function () {
          var v1 = new rhea._Module.Variable(3);
          var v2 = new rhea._Module.Variable(4);
          var eq1 = rhea._Module.createInequalityVarVar(v1, ">=", v2);
          var c1 = rhea._Module.createConstraintIneq(eq1);

          var s1 = new rhea._Module.SimplexSolver();
          s1.add_constraint(c1);
          s1.solve();
          assert.isTrue(v1.value() >= v2.value());

          this.deleteAll(v1, v2, eq1, c1, s1);
        });

        it("should solve multiple constraints", function () {
          var v1 = new rhea._Module.Variable();
          var v2 = new rhea._Module.Variable();

          // v1 - 1 == v2
          var e1 = rhea._Module.createExpressionVarConst(v1, "-", 1);
          var eq1 = rhea._Module.createEquationExpVar(e1, v2);
          var c1 = rhea._Module.createConstraintEq(eq1);

          // v1 >= 2
          var eq2 = rhea._Module.createInequalityVarConst(v1, ">=", 2);
          var c2 = rhea._Module.createConstraintIneq(eq2);

          var s1 = new rhea._Module.SimplexSolver();
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
            var v1 = new rhea._Module.Variable();
            var v2 = new rhea._Module.Variable();

            // v1 - 1 == v2
            var e1 = rhea._Module.createExpressionVarConst(v1, "-", 1);
            var eq1 = rhea._Module.createEquationExpVar(e1, v2);
            var c1 = rhea._Module.createConstraintEq(eq1);

            // v1 >= 2
            var eq2 = rhea._Module.createInequalityVarConst(v1, ">=", 2);
            var c2 = rhea._Module.createConstraintIneq(eq2);

            var s1 = new rhea._Module.SimplexSolver();
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

        it("should create a Variable", function () {
          var v1 = new rhea.Variable({ value: 12 });
          assert.equal(v1.value, 12);
          this.rc.add(v1);
        });

        it("should modify a Variable", function () {
          var v1 = new rhea.Variable({ value: 12 });
          v1.set(23);
          assert.equal(v1.value, 23);
          this.rc.add(v1);
        });

        it("should create expressions", function () {
          var v1 = new rhea.Variable({ value: 1 });
          var v2 = new rhea.Variable({ value: 2 });

          var e1 = rhea.plus(v1, v2);
          var e2 = rhea.minus(v1, v2);

          var e3 = rhea.plus(v1, 3);
          var e4 = rhea.minus(v1, 3);
          var e5 = rhea.times(v1, 3);
          var e6 = rhea.divide(v1, 2);

          var e7 = rhea.plus(3, v2)
          var e8 = rhea.minus(3, v2)
          var e9 = rhea.times(3, v2)

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
          var v1 = new rhea.Variable({ value: 1 });
          var v2 = new rhea.Variable({ value: 2 });

          var e1 = rhea.plus(v1, v2);
          var e2 = rhea.minus(v2, v1);

          var eq1 = new rhea.Equation(e1, v2);
          var eq2 = new rhea.Equation(v1, e2);
          var eq3 = new rhea.Equation(v1, v2);
          var eq4 = new rhea.Equation(e1, e2);
          var eq5 = new rhea.Equation(v2, 2);

          assert.isFalse(eq1.isSatisfied()); // v1 + v2 == v2
          assert.isTrue(eq2.isSatisfied()); // v1 == v2 - v1
          assert.isFalse(eq3.isSatisfied()); // v1 == v2
          assert.isFalse(eq4.isSatisfied()); // v1 + v2 == v1 - v2
          assert.isTrue(eq5.isSatisfied()); // v2 == 2

          this.rc.add(eq1, eq2, eq3, eq4, eq5);
        });

        it("should create inequalities", function () {
          var v1 = new rhea.Variable({ value: 1 });
          var v2 = new rhea.Variable({ value: 2 });

          var e1 = rhea.plus(v1, v2);
          var e2 = rhea.minus(v1, v2);

          var eq1 = new rhea.Inequality(e1, "<=", e2);
          var eq2 = new rhea.Inequality(v1, ">=", e2);
          var eq3 = new rhea.Inequality(v1, "<=", v2);
          var eq4 = new rhea.Inequality(v1, ">=", 3);

          assert.isFalse(eq1.isSatisfied()); // v1 + v2 <= v1 - v2
          assert.isTrue(eq2.isSatisfied()); // v1 >= v1 - v2
          assert.isTrue(eq3.isSatisfied()); // v1 <= v2
          assert.isFalse(eq4.isSatisfied()); // v1 >= 3

          this.rc.add(eq1, eq2, eq3, eq4);
        });

        it("should create constraints", function () {
          var v1 = new rhea.Variable({ value: 1 });
          var eq1 = new rhea.Equation(v1, 2);
          var eq2 = new rhea.Inequality(v1, "<=", 2);

          var c1 = new rhea.Constraint(eq1);
          var c2 = new rhea.Constraint(eq2);

          assert.isFalse(c1.isSatisfied());
          assert.isTrue(c2.isSatisfied());

          this.rc.add(c1, c2);
        });

        it("should create a solver", function () {
          var v1 = new rhea.Variable({ value: 1 });
          var eq1 = new rhea.Equation(v1, 2);

          var s1 = new rhea.SimplexSolver();
          s1.addConstraint(eq1);

          this.rc.add(s1);
        });

        it("should solve an equation", function () {
          var v1 = new rhea.Variable({ value: 3 });
          var v2 = new rhea.Variable({ value: 2 });

          var e1 = rhea.minus(v1, 1);
          var eq1 = new rhea.Equation(e1, v2);

          var s1 = new rhea.SimplexSolver();
          s1.addConstraint(eq1);
          s1.solve();
          assert.isTrue(v1.value - 1 == v2.value);

          this.rc.add(s1);
        });

        it("should solve an inequality", function () {
          var v1 = new rhea.Variable({ value: 3 });
          var v2 = new rhea.Variable({ value: 4 });

          var eq1 = new rhea.Inequality(v1, ">=", v2);

          var s1 = new rhea.SimplexSolver();
          s1.addConstraint(eq1);
          s1.solve();
          assert.isTrue(v1.value >= v2.value);

          this.rc.add(s1);
        });

        it("should solve multiple constraints", function () {
          var v1 = new rhea.Variable();
          var v2 = new rhea.Variable();

          // v1 - 1 == v2
          var e1 = rhea.minus(v1, 1);
          var eq1 = new rhea.Equation(e1, v2);

          // v1 >= 2
          var eq2 = new rhea.Inequality(v1, ">=", 2);

          var s1 = new rhea.SimplexSolver();
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
            var v1 = new rhea.Variable();
            var v2 = new rhea.Variable();

            // v1 - 1 == v2
            var e1 = rhea.minus(v1, 1);
            var eq1 = new rhea.Equation(e1, v2);

            // v1 >= 2
            var eq2 = new rhea.Inequality(v1, ">=", 2);

            var s1 = new rhea.SimplexSolver();
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

            var mouseLocationY = new rhea.Variable({ value: 10 });
            var temperature = new rhea.Variable({ value: 0 });
            var mercuryTop = new rhea.Variable({ value: 0 });
            var mercuryBottom = new rhea.Variable({ value: 0 });
            var thermometerTop = new rhea.Variable({ value: 0 });
            var thermometerBottom = new rhea.Variable({ value: 0 });
            var grayTop = new rhea.Variable({ value: 0 });
            var grayBottom = new rhea.Variable({ value: 0 });
            var whiteTop = new rhea.Variable({ value: 0 });
            var whiteBottom = new rhea.Variable({ value: 0 });
            var displayNumber = new rhea.Variable({ value: 0 });

            var constraints = [
              new rhea.Equation(temperature, mercuryTop),
              new rhea.Equation(whiteTop, thermometerTop),
              new rhea.Equation(whiteBottom, mercuryTop),
              new rhea.Equation(grayTop, mercuryTop),
              new rhea.Equation(grayBottom, mercuryBottom),
              new rhea.Equation(displayNumber, temperature),
              new rhea.Equation(mercuryTop, mouseLocationY),
              new rhea.Inequality(mercuryTop, rhea.LEQ, thermometerTop),
              new rhea.Equation(mercuryBottom, thermometerBottom)
            ];

            var solver = new rhea.SimplexSolver();
            solver.addStay(mouseLocationY);
            solver.addEditVar(mouseLocationY);
            solver.addConstraints(constraints);
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
  });
});
