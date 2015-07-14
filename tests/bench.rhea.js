require(['../rhea/module.rhea'], function (loadRhea) {
  loadRhea(function(rhea) {
    describe("Rhea Benchmarks", function() {

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

        it("Multiple Constraints", function () {
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

            assert.isTrue(v1.value - 1 == v2.value);
            assert.isTrue(v1.value >= 2);

            this.rc.add(s1);
          }.bind(this));
        });

        it("Complex Constraint Set", function () {
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

        it("Pythagorean Theorem", function () {
          this._runnable.title += ": " + perfTest(function () {
            var v1 = new c.Variable();
            var v2 = new c.Variable();
            var v3 = new c.Variable();

            var s1 = new c.SimplexSolver();

            var v1v1v1 = c.plus(v1, c.plus(v1, v1));
            var v2v2v2v2 = c.plus(v2, c.plus(v2, c.plus(v2, v2)));
            var v3v3v3v3v3 = c.plus(v3, c.plus(v3, c.plus(v3, c.plus(v3, v3))));
            var eq = new c.Equation(c.plus(v1v1v1, v2v2v2v2), v3v3v3v3v3);
            s1.addConstraint(eq);

            s1.addConstraint(new c.Equation(v1, 3));
            s1.addConstraint(new c.Inequality(v2, c.GEQ, 1));
            s1.addConstraint(new c.Equation(v3, 5));

            s1.solve();

            assert.equal(v1.value, 3);
            assert.equal(v2.value, 4);
            assert.equal(v3.value, 5);
            assert.equal((v1.value * v1.value) + (v2.value * v2.value), v3.value * v3.value);

            this.rc.add(s1);
          });
        });

        it("Add 50 Equations", function () {
          this._runnable.title += ": " + perfTest(function () {
            var s1 = new c.SimplexSolver();
            var c1 = new c.Variable();
            for (var i = 0; i < 50; i++) {
              var c2 = new c.Variable();
              s1.addConstraint(new c.Equation(c1, c.plus(c2, 1)));
              c1 = c2;
            }

            this.rc.add(s1);
          });
        });

        it("Add 50 Inequalities", function () {
          this._runnable.title += ": " + perfTest(function () {
            var s1 = new c.SimplexSolver();
            var c1 = new c.Variable();
            for (var i = 0; i < 50; i++) {
              var c2 = new c.Variable();
              s1.addConstraint(new c.Inequality(c1, c.GEQ, c.plus(c2, 1)));
              c1 = c2;
            }

            this.rc.add(s1);
          });
        });

        it("Add & Remove 50 Equations", function () {
          this._runnable.title += ": " + perfTest(function () {
            var s1 = new c.SimplexSolver();
            var c1 = new c.Variable();
            var equations = []
            for (var i = 0; i < 50; i++) {
              var c2 = new c.Variable();
              var eq = new c.Equation(c1, c2);
              equations.push(eq);
              s1.addConstraint(eq);
              c1 = c2;
            }
            for (var i = 0; i < equations.length; i++) {
              s1.removeConstraint(equations[i]);
            }

            this.rc.add(s1);
          });
        });

        it("Add & Remove 50 Inequalities", function () {
          this._runnable.title += ": " + perfTest(function () {
            var s1 = new c.SimplexSolver();
            var c1 = new c.Variable();
            var equations = []
            for (var i = 0; i < 50; i++) {
              var c2 = new c.Variable();
              var eq = new c.Inequality(c1, c.GEQ, c2);
              equations.push(eq);
              s1.addConstraint(eq);
              c1 = c2;
            }
            for (var i = 0; i < equations.length; i++) {
              s1.removeConstraint(equations[i]);
            }

            this.rc.add(s1);
          });
        });

        it("All In One Test", function () {
          this._runnable.title += ": " + perfTest(function () {
            var v1 = new c.Variable();
            var v2 = new c.Variable();
            var v3 = new c.Variable();
            var v4 = new c.Variable();
            var v5 = new c.Variable();

            var s1 = new c.SimplexSolver();

            s1.addConstraint(new c.Equation(v1, c.plus(v2, 100)));
            s1.addConstraint(new c.Equation(v2, c.times(v3, 8)));
            s1.addConstraint(new c.Equation(v3, c.minus(v4, 56.87)));
            s1.addConstraint(new c.Equation(v4, c.divide(v5, 4)));

            s1.addConstraint(new c.Inequality(v1, c.GEQ, 10000));
            s1.addConstraint(new c.Inequality(v2, c.LEQ, c.times(v1, 500.4)));
            s1.addConstraint(new c.Inequality(v5, c.GEQ, c.plus(v4, 250.2)));
            s1.addConstraint(new c.Inequality(v3, c.GEQ, c.minus(v3, 100)));

            s1.solve();

            assert.isTrue(v1.value == v2.value + 100);
            assert.isTrue(v2.value == v3.value * 8);
            assert.isTrue(v3.value == v4.value - 56.87);
            assert.isTrue(v4.value == v5.value / 4);

            assert.isTrue(v1.value >= 10000);
            assert.isTrue(v2.value <= v1.value * 500.4);
            assert.isTrue(v5.value >= v4.value + 250.2);
            assert.isTrue(v3.value >= v3.value - 100);

            this.rc.add(s1);
          });
        });

      });
    });
  });
});
