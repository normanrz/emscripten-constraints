var loadRhea = require("../rhea/module.rhea");
var assert = require("assert");
var perfTest = require("./perf_test");

describe("Rhea Benchmarks", function() {
  var rhea = null;

  before(function (done) {
    loadRhea("/rhea/").then(function (_rhea) {
      rhea = _rhea;
      done();
    })
  });

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

    it("Multiple Constraints", perfTest(function () {
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

      assert.ok(v1.value - 1 == v2.value);
      assert.ok(v1.value >= 2);

      this.rc.add(s1);
    }));


    it("Complex Constraint Set", perfTest(function () {

      var mouseLocationY = new rhea.Variable({ value: 10 });
      var temperature = new rhea.Variable();
      var mercuryTop = new rhea.Variable();
      var mercuryBottom = new rhea.Variable();
      var thermometerTop = new rhea.Variable();
      var thermometerBottom = new rhea.Variable();
      var grayTop = new rhea.Variable();
      var grayBottom = new rhea.Variable();
      var whiteTop = new rhea.Variable();
      var whiteBottom = new rhea.Variable();
      var displayNumber = new rhea.Variable();

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

      //solver.beginEdit();
      for (var i = 0; i <= 100; i++) {
        solver.suggestValue(mouseLocationY, i);
      }
      //solver.endEdit();

      assert.equal(temperature.value, mercuryTop.value);
      assert.equal(whiteTop.value, thermometerTop.value);
      assert.equal(whiteBottom.value, mercuryTop.value);
      assert.equal(grayTop.value, mercuryTop.value);
      assert.equal(grayBottom.value, mercuryBottom.value);
      assert.equal(displayNumber.value, temperature.value);
      assert.equal(mercuryTop.value, mouseLocationY.value);
      assert.ok(mercuryTop.value <= thermometerTop.value);
      assert.equal(mercuryBottom.value, thermometerBottom.value);

      this.rc.add(solver);
    }));

    it("Pythagorean Theorem", perfTest(function () {
      var v1 = new rhea.Variable();
      var v2 = new rhea.Variable();
      var v3 = new rhea.Variable();

      var s1 = new rhea.SimplexSolver();

      var v1v1v1 = rhea.plus(v1, rhea.plus(v1, v1));
      var v2v2v2v2 = rhea.plus(v2, rhea.plus(v2, rhea.plus(v2, v2)));
      var v3v3v3v3v3 = rhea.plus(v3, rhea.plus(v3, rhea.plus(v3, rhea.plus(v3, v3))));
      var eq = new rhea.Equation(rhea.plus(v1v1v1, v2v2v2v2), v3v3v3v3v3);
      s1.addConstraint(eq);

      s1.addConstraint(new rhea.Equation(v1, 3));
      s1.addConstraint(new rhea.Inequality(v2, rhea.GEQ, 1));
      s1.addConstraint(new rhea.Equation(v3, 5));

      s1.solve();

      assert.equal(v1.value, 3);
      assert.equal(v2.value, 4);
      assert.equal(v3.value, 5);
      assert.equal((v1.value * v1.value) + (v2.value * v2.value), v3.value * v3.value);

      this.rc.add(s1);
    }));

    it("Add 50 Equations", perfTest(function () {
      var s1 = new rhea.SimplexSolver();
      var c1 = new rhea.Variable();
      for (var i = 0; i < 50; i++) {
        var c2 = new rhea.Variable();
        s1.addConstraint(new rhea.Equation(c1, rhea.plus(c2, 1)));
        c1 = c2;
      }
      this.rc.add(s1);
    }));

    it("Add 50 Inequalities", perfTest(function () {
      var s1 = new rhea.SimplexSolver();
      var c1 = new rhea.Variable();
      for (var i = 0; i < 50; i++) {
        var c2 = new rhea.Variable();
        s1.addConstraint(new rhea.Inequality(c1, rhea.GEQ, rhea.plus(c2, 1)));
        c1 = c2;
      }
      this.rc.add(s1);
    }));

    it("Add & Remove 50 Equations", perfTest(function () {
      var s1 = new rhea.SimplexSolver();
      var v1 = new rhea.Variable();
      var equations = []
      for (var i = 0; i < 50; i++) {
        var v2 = new rhea.Variable();
        var eq = new rhea.Equation(v1, v2);
        var c1 = new rhea.Constraint(eq);
        equations.push(c1);
        s1.addConstraint(c1);
        v1 = v2;
      }
      for (var i = 0; i < equations.length; i++) {
        s1.removeConstraint(equations[i]);
      }
      this.rc.add(s1);
    }));

    it("Add & Remove 50 Inequalities", perfTest(function () {
      var s1 = new rhea.SimplexSolver();
      var v1 = new rhea.Variable();
      var equations = []
      for (var i = 0; i < 50; i++) {
        var v2 = new rhea.Variable();
        var eq = new rhea.Inequality(v1, rhea.GEQ, v2);
        var c1 = new rhea.Constraint(eq);
        equations.push(c1);
        s1.addConstraint(c1);
        v1 = v2;
      }
      for (var i = 0; i < equations.length; i++) {
        s1.removeConstraint(equations[i]);
      }
      this.rc.add(s1);
    }));

    it("All In One Test", perfTest(function () {
      var v1 = new rhea.Variable();
      var v2 = new rhea.Variable();
      var v3 = new rhea.Variable();
      var v4 = new rhea.Variable();
      var v5 = new rhea.Variable();

      var s1 = new rhea.SimplexSolver();

      s1.addConstraint(new rhea.Equation(v1, rhea.plus(v2, 100)));
      s1.addConstraint(new rhea.Equation(v2, rhea.times(v3, 8)));
      s1.addConstraint(new rhea.Equation(v3, rhea.minus(v4, 56.87)));
      s1.addConstraint(new rhea.Equation(v4, rhea.divide(v5, 4)));

      s1.addConstraint(new rhea.Inequality(v1, rhea.GEQ, 10000));
      s1.addConstraint(new rhea.Inequality(v2, rhea.LEQ, rhea.times(v1, 500.4)));
      s1.addConstraint(new rhea.Inequality(v5, rhea.GEQ, rhea.plus(v4, 250.2)));
      s1.addConstraint(new rhea.Inequality(v3, rhea.GEQ, rhea.minus(v3, 100)));

      s1.solve();

      assert.ok(v1.value == v2.value + 100);
      assert.ok(v2.value == v3.value * 8);
      assert.ok(v3.value == v4.value - 56.87);
      assert.ok(v4.value == v5.value / 4);

      assert.ok(v1.value >= 10000);
      assert.ok(v2.value <= v1.value * 500.4);
      assert.ok(v5.value >= v4.value + 250.2);
      assert.ok(v3.value >= v3.value - 100);

      this.rc.add(s1);
    }));

  });
});
