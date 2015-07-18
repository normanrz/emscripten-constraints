(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var c = require("cassowary");
var assert = require("assert");
var perfTest = require("./perf_test");

describe("Cassowary-js Benchmarks", function () {
  describe("Run", function () {
    it("Multiple Constraints", perfTest(function () {
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

      console.log(v1.value, v2.value);

      assert.ok(v1.value - 1 == v2.value);
      assert.ok(v1.value >= 2);
    }));

    it("Complex Constraint Set", perfTest(function () {
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
    }));

    it("Pythagorean Theorem", perfTest(function () {
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
    }));

    it("Add 50 Equations", perfTest(function () {
      var s1 = new c.SimplexSolver();
      var c1 = new c.Variable();
      for (var i = 0; i < 50; i++) {
        var c2 = new c.Variable();
        s1.addConstraint(new c.Equation(c1, c.plus(c2, 1)));
        c1 = c2;
      }
    }));

    it("Add 50 Inequalities", perfTest(function () {
      var s1 = new c.SimplexSolver();
      var c1 = new c.Variable();
      for (var i = 0; i < 50; i++) {
        var c2 = new c.Variable();
        s1.addConstraint(new c.Inequality(c1, c.GEQ, c.plus(c2, 1)));
        c1 = c2;
      }
    }));

    it("Add & Remove 50 Equations", perfTest(function () {
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
    }));

    it("Add & Remove 50 Inequalities", perfTest(function () {
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
    }));

    it("All In One Test", perfTest(function () {
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

      assert.ok(v1.value == v2.value + 100);
      assert.ok(v2.value == v3.value * 8);
      assert.ok(v3.value == v4.value - 56.87);
      assert.ok(v4.value == v5.value / 4);

      assert.ok(v1.value >= 10000);
      assert.ok(v2.value <= v1.value * 500.4);
      assert.ok(v5.value >= v4.value + 250.2);
      assert.ok(v3.value >= v3.value - 100);
    }));

  });
});

},{"./perf_test":5,"assert":7,"cassowary":12}],2:[function(require,module,exports){
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

},{"../rhea/module.rhea":13,"./perf_test":5,"assert":7}],3:[function(require,module,exports){
var loadZ3 = require("../z3/module.z3");
var assert = require("assert");
var perfTest = require("./perf_test");

describe('Z3 Benchmarks', function(){
  var z3 = null;
  this.timeout("200s");

  before(function(done){
    console.time("load z3");
    loadZ3("/z3/").then(function(_z3) {
      console.timeEnd("successfully loaded z3");
      z3 = _z3;
      done();
    });
  });

  describe("Run", function() {
    it("Multiple Constraints", perfTest(function () {
      var c = z3.c;

      var v1 = new c.Variable();
      var v2 = new c.Variable();

      // v1 - 1 == v2
      var e1 = c.minus(v1, 1);
      var eq1 = new c.Equation(e1, v2);

      // v1 >= 2
      var eq2 = new c.Inequality(v1, ">=", 2);

      var s1 = new c.SimplexSolver();
      s1.addConstraint(eq1);
      s1.addConstraint(eq2);
      s1.solve();

      assert.ok(v1.value - 1 == v2.value);
      assert.ok(v1.value >= 2);

    }));

    it("Complex Constraint Set", perfTest(function () {
      var c = z3.c;

      var mouseLocationY = new c.Variable({ value: 10 });
      var temperature = new c.Variable();
      var mercuryTop = new c.Variable();
      var mercuryBottom = new c.Variable();
      var thermometerTop = new c.Variable();
      var thermometerBottom = new c.Variable();
      var grayTop = new c.Variable();
      var grayBottom = new c.Variable();
      var whiteTop = new c.Variable();
      var whiteBottom = new c.Variable();
      var displayNumber = new c.Variable();

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
      // solver.addStay(mouseLocationY);
      // solver.addEditVar(mouseLocationY);
      constraints.forEach(function(constraint) {
        solver.addConstraint(constraint);
      });
      solver.solve();

      assert.equal(temperature.value, mercuryTop.value);
      assert.equal(whiteTop.value, thermometerTop.value);
      assert.equal(whiteBottom.value, mercuryTop.value);
      assert.equal(grayTop.value, mercuryTop.value);
      assert.equal(grayBottom.value, mercuryBottom.value);
      assert.equal(displayNumber.value, temperature.value);
      assert.equal(mercuryTop.value, mouseLocationY.value);
      assert.ok(mercuryTop.value <= thermometerTop.value);
      assert.equal(mercuryBottom.value, thermometerBottom.value);
    }));

    it("Pythagorean Theorem", perfTest(function () {
      var c = z3.c;

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
    }));

    it("Add 50 Equations", perfTest(function () {
      var c = z3.c;

      var s1 = new c.SimplexSolver();
      var c1 = new c.Variable();
      for (var i = 0; i < 50; i++) {
        var c2 = new c.Variable();
        s1.addConstraint(new c.Equation(c1, c.plus(c2, 1)));
        c1 = c2;
      }
    }));

    it("Add 50 Inequalities", perfTest(function () {
      var c = z3.c;

      var s1 = new c.SimplexSolver();
      var c1 = new c.Variable();
      for (var i = 0; i < 50; i++) {
        var c2 = new c.Variable();
        s1.addConstraint(new c.Inequality(c1, c.GEQ, c.plus(c2, 1)));
        c1 = c2;
      }
    }));

    it("Add & Remove 50 Equations", perfTest(function () {
      var c = z3.c;

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
    }));

    it("Add & Remove 50 Inequalities", perfTest(function () {
      var c = z3.c;

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
    }));

    it("All In One Test", perfTest(function () {
      var c = z3.c;

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

      assert.ok(v1.value == v2.value + 100);
      assert.ok(v2.value == v3.value * 8);
      assert.ok(v3.value == v4.value - 56.87);
      assert.ok(v4.value == v5.value / 4);

      assert.ok(v1.value >= 10000);
      assert.ok(v2.value <= v1.value * 500.4);
      assert.ok(v5.value >= v4.value + 250.2);
      assert.ok(v3.value >= v3.value - 100);
    }));

  });
});

},{"../z3/module.z3":14,"./perf_test":5,"assert":7}],4:[function(require,module,exports){
require("./bench.cassowary");
require("./bench.rhea");
require("./bench.z3");

},{"./bench.cassowary":1,"./bench.rhea":2,"./bench.z3":3}],5:[function(require,module,exports){
module.exports = function perfTest(runner, runs) {
  return function () {
    if (typeof runs == "undefined") {
      runs = 100;
    }
    var start = performance.now();
    for(var i = 0; i < runs; i++) {
      runner.call(this);
    }
    var time = (performance.now() - start) / runs;
    this._runnable.title += ": " + time.toFixed(3) + "ms";
    return time;
  };
};

},{}],6:[function(require,module,exports){
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD
    define([], factory);
  } else if (typeof exports === 'object') {
    // Node, CommonJS-like
    module.exports = factory();
  } else {
    // Browser globals (root is window)
    root.loader = factory();
  }
}(this, function () {
  return function loadModule(moduleUrl, path, callback) {
    return new Promise(function(resolve, reject) {
      var solverObj = null;

      var request = new XMLHttpRequest();
      request.onreadystatechange = function () {
        var DONE = request.DONE || 4;
        if (request.readyState === DONE){
          if (request.status == 200) {
            // emscripten puts Module into global namespace if it
            // determines that it runs in the web
            // save potential old window.Module
            var oldWindowModule;
            if (window.Module) {
              oldWindowModule = window.Module;
            }

            console.log("Evaluating asmjs code...");
            var newCode = "var memoryInitializerPath = '" + path + "';" + request.responseText;
            solverObj = new Function(newCode)();

            if (oldWindowModule) {
              window.Module = oldWindowModule;
            } else {
              delete window.Module;
            }
            resolve(solverObj);
          } else {
            console.error("Error while loading ", moduleUrl);
          }
        }
      };
      request.open("GET", path + moduleUrl);
      request.send();
    });
  };
}));

},{}],7:[function(require,module,exports){
// http://wiki.commonjs.org/wiki/Unit_Testing/1.0
//
// THIS IS NOT TESTED NOR LIKELY TO WORK OUTSIDE V8!
//
// Originally from narwhal.js (http://narwhaljs.org)
// Copyright (c) 2009 Thomas Robinson <280north.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the 'Software'), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

// when used in node, this will actually load the util module we depend on
// versus loading the builtin util module as happens otherwise
// this is a bug in node module loading as far as I am concerned
var util = require('util/');

var pSlice = Array.prototype.slice;
var hasOwn = Object.prototype.hasOwnProperty;

// 1. The assert module provides functions that throw
// AssertionError's when particular conditions are not met. The
// assert module must conform to the following interface.

var assert = module.exports = ok;

// 2. The AssertionError is defined in assert.
// new assert.AssertionError({ message: message,
//                             actual: actual,
//                             expected: expected })

assert.AssertionError = function AssertionError(options) {
  this.name = 'AssertionError';
  this.actual = options.actual;
  this.expected = options.expected;
  this.operator = options.operator;
  if (options.message) {
    this.message = options.message;
    this.generatedMessage = false;
  } else {
    this.message = getMessage(this);
    this.generatedMessage = true;
  }
  var stackStartFunction = options.stackStartFunction || fail;

  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, stackStartFunction);
  }
  else {
    // non v8 browsers so we can have a stacktrace
    var err = new Error();
    if (err.stack) {
      var out = err.stack;

      // try to strip useless frames
      var fn_name = stackStartFunction.name;
      var idx = out.indexOf('\n' + fn_name);
      if (idx >= 0) {
        // once we have located the function frame
        // we need to strip out everything before it (and its line)
        var next_line = out.indexOf('\n', idx + 1);
        out = out.substring(next_line + 1);
      }

      this.stack = out;
    }
  }
};

// assert.AssertionError instanceof Error
util.inherits(assert.AssertionError, Error);

function replacer(key, value) {
  if (util.isUndefined(value)) {
    return '' + value;
  }
  if (util.isNumber(value) && !isFinite(value)) {
    return value.toString();
  }
  if (util.isFunction(value) || util.isRegExp(value)) {
    return value.toString();
  }
  return value;
}

function truncate(s, n) {
  if (util.isString(s)) {
    return s.length < n ? s : s.slice(0, n);
  } else {
    return s;
  }
}

function getMessage(self) {
  return truncate(JSON.stringify(self.actual, replacer), 128) + ' ' +
         self.operator + ' ' +
         truncate(JSON.stringify(self.expected, replacer), 128);
}

// At present only the three keys mentioned above are used and
// understood by the spec. Implementations or sub modules can pass
// other keys to the AssertionError's constructor - they will be
// ignored.

// 3. All of the following functions must throw an AssertionError
// when a corresponding condition is not met, with a message that
// may be undefined if not provided.  All assertion methods provide
// both the actual and expected values to the assertion error for
// display purposes.

function fail(actual, expected, message, operator, stackStartFunction) {
  throw new assert.AssertionError({
    message: message,
    actual: actual,
    expected: expected,
    operator: operator,
    stackStartFunction: stackStartFunction
  });
}

// EXTENSION! allows for well behaved errors defined elsewhere.
assert.fail = fail;

// 4. Pure assertion tests whether a value is truthy, as determined
// by !!guard.
// assert.ok(guard, message_opt);
// This statement is equivalent to assert.equal(true, !!guard,
// message_opt);. To test strictly for the value true, use
// assert.strictEqual(true, guard, message_opt);.

function ok(value, message) {
  if (!value) fail(value, true, message, '==', assert.ok);
}
assert.ok = ok;

// 5. The equality assertion tests shallow, coercive equality with
// ==.
// assert.equal(actual, expected, message_opt);

assert.equal = function equal(actual, expected, message) {
  if (actual != expected) fail(actual, expected, message, '==', assert.equal);
};

// 6. The non-equality assertion tests for whether two objects are not equal
// with != assert.notEqual(actual, expected, message_opt);

assert.notEqual = function notEqual(actual, expected, message) {
  if (actual == expected) {
    fail(actual, expected, message, '!=', assert.notEqual);
  }
};

// 7. The equivalence assertion tests a deep equality relation.
// assert.deepEqual(actual, expected, message_opt);

assert.deepEqual = function deepEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected)) {
    fail(actual, expected, message, 'deepEqual', assert.deepEqual);
  }
};

function _deepEqual(actual, expected) {
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;

  } else if (util.isBuffer(actual) && util.isBuffer(expected)) {
    if (actual.length != expected.length) return false;

    for (var i = 0; i < actual.length; i++) {
      if (actual[i] !== expected[i]) return false;
    }

    return true;

  // 7.2. If the expected value is a Date object, the actual value is
  // equivalent if it is also a Date object that refers to the same time.
  } else if (util.isDate(actual) && util.isDate(expected)) {
    return actual.getTime() === expected.getTime();

  // 7.3 If the expected value is a RegExp object, the actual value is
  // equivalent if it is also a RegExp object with the same source and
  // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
  } else if (util.isRegExp(actual) && util.isRegExp(expected)) {
    return actual.source === expected.source &&
           actual.global === expected.global &&
           actual.multiline === expected.multiline &&
           actual.lastIndex === expected.lastIndex &&
           actual.ignoreCase === expected.ignoreCase;

  // 7.4. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by ==.
  } else if (!util.isObject(actual) && !util.isObject(expected)) {
    return actual == expected;

  // 7.5 For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical 'prototype' property. Note: this
  // accounts for both named and indexed properties on Arrays.
  } else {
    return objEquiv(actual, expected);
  }
}

function isArguments(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
}

function objEquiv(a, b) {
  if (util.isNullOrUndefined(a) || util.isNullOrUndefined(b))
    return false;
  // an identical 'prototype' property.
  if (a.prototype !== b.prototype) return false;
  // if one is a primitive, the other must be same
  if (util.isPrimitive(a) || util.isPrimitive(b)) {
    return a === b;
  }
  var aIsArgs = isArguments(a),
      bIsArgs = isArguments(b);
  if ((aIsArgs && !bIsArgs) || (!aIsArgs && bIsArgs))
    return false;
  if (aIsArgs) {
    a = pSlice.call(a);
    b = pSlice.call(b);
    return _deepEqual(a, b);
  }
  var ka = objectKeys(a),
      kb = objectKeys(b),
      key, i;
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length != kb.length)
    return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] != kb[i])
      return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!_deepEqual(a[key], b[key])) return false;
  }
  return true;
}

// 8. The non-equivalence assertion tests for any deep inequality.
// assert.notDeepEqual(actual, expected, message_opt);

assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
  if (_deepEqual(actual, expected)) {
    fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
  }
};

// 9. The strict equality assertion tests strict equality, as determined by ===.
// assert.strictEqual(actual, expected, message_opt);

assert.strictEqual = function strictEqual(actual, expected, message) {
  if (actual !== expected) {
    fail(actual, expected, message, '===', assert.strictEqual);
  }
};

// 10. The strict non-equality assertion tests for strict inequality, as
// determined by !==.  assert.notStrictEqual(actual, expected, message_opt);

assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
  if (actual === expected) {
    fail(actual, expected, message, '!==', assert.notStrictEqual);
  }
};

function expectedException(actual, expected) {
  if (!actual || !expected) {
    return false;
  }

  if (Object.prototype.toString.call(expected) == '[object RegExp]') {
    return expected.test(actual);
  } else if (actual instanceof expected) {
    return true;
  } else if (expected.call({}, actual) === true) {
    return true;
  }

  return false;
}

function _throws(shouldThrow, block, expected, message) {
  var actual;

  if (util.isString(expected)) {
    message = expected;
    expected = null;
  }

  try {
    block();
  } catch (e) {
    actual = e;
  }

  message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
            (message ? ' ' + message : '.');

  if (shouldThrow && !actual) {
    fail(actual, expected, 'Missing expected exception' + message);
  }

  if (!shouldThrow && expectedException(actual, expected)) {
    fail(actual, expected, 'Got unwanted exception' + message);
  }

  if ((shouldThrow && actual && expected &&
      !expectedException(actual, expected)) || (!shouldThrow && actual)) {
    throw actual;
  }
}

// 11. Expected to throw an error:
// assert.throws(block, Error_opt, message_opt);

assert.throws = function(block, /*optional*/error, /*optional*/message) {
  _throws.apply(this, [true].concat(pSlice.call(arguments)));
};

// EXTENSION! This is annoying to write outside this module.
assert.doesNotThrow = function(block, /*optional*/message) {
  _throws.apply(this, [false].concat(pSlice.call(arguments)));
};

assert.ifError = function(err) { if (err) {throw err;}};

var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) {
    if (hasOwn.call(obj, key)) keys.push(key);
  }
  return keys;
};

},{"util/":11}],8:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],9:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            currentQueue[queueIndex].run();
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        setTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],10:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],11:[function(require,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./support/isBuffer":10,"_process":9,"inherits":8}],12:[function(require,module,exports){
/**
 * Parts Copyright (C) 2011-2012, Alex Russell (slightlyoff@chromium.org)
 * Parts Copyright (C) Copyright (C) 1998-2000 Greg J. Badros
 *
 * Use of this source code is governed by the LGPL, which can be found in the
 * COPYING.LGPL file.
 *
 * This is a compiled version of Cassowary/JS. For source versions or to
 * contribute, see the github project:
 *
 *  https://github.com/slightlyoff/cassowary-js-refactor
 *
 */

(function() {
(function(a){"use strict";try{(function(){}).bind(a)}catch(b){Object.defineProperty(Function.prototype,"bind",{value:function(a){var b=this;return function(){return b.apply(a,arguments)}},enumerable:!1,configurable:!0,writable:!0})}var c=a.HTMLElement!==void 0,d=function(a){for(var b=null;a&&a!=Object.prototype;){if(a.tagName){b=a.tagName;break}a=a.prototype}return b||"div"},e=1e-8,f={},g=function(a,b){if(a&&b){if("function"==typeof a[b])return a[b];var c=a.prototype;if(c&&"function"==typeof c[b])return c[b];if(c!==Object.prototype&&c!==Function.prototype)return"function"==typeof a.__super__?g(a.__super__,b):void 0}},h=a.c={debug:!1,trace:!1,verbose:!1,traceAdded:!1,GC:!1,GEQ:1,LEQ:2,inherit:function(b){var e=null,g=null;b["extends"]&&(g=b["extends"],delete b["extends"]),b.initialize&&(e=b.initialize,delete b.initialize);var h=e||function(){};Object.defineProperty(h,"__super__",{value:g?g:Object,enumerable:!1,configurable:!0,writable:!1}),b._t&&(f[b._t]=h);var i=h.prototype=Object.create(g?g.prototype:Object.prototype);if(this.extend(i,b),c&&g&&g.prototype instanceof a.HTMLElement){var j=h,k=d(i),l=function(a){return a.__proto__=i,j.apply(a,arguments),i.created&&a.created(),i.decorate&&a.decorate(),a};this.extend(i,{upgrade:l}),h=function(){return l(a.document.createElement(k))},h.prototype=i,this.extend(h,{ctor:j})}return h},extend:function(a,b){return this.own(b,function(c){var d=Object.getOwnPropertyDescriptor(b,c);try{"function"==typeof d.get||"function"==typeof d.set?Object.defineProperty(a,c,d):"function"==typeof d.value||"_"===c.charAt(0)?(d.writable=!0,d.configurable=!0,d.enumerable=!1,Object.defineProperty(a,c,d)):a[c]=b[c]}catch(e){}}),a},own:function(b,c,d){return Object.getOwnPropertyNames(b).forEach(c,d||a),b},traceprint:function(a){h.verbose&&console.log(a)},fnenterprint:function(a){console.log("* "+a)},fnexitprint:function(a){console.log("- "+a)},assert:function(a,b){if(!a)throw new h.InternalError("Assertion failed: "+b)},plus:function(a,b){return a instanceof h.Expression||(a=new h.Expression(a)),b instanceof h.Expression||(b=new h.Expression(b)),a.plus(b)},minus:function(a,b){return a instanceof h.Expression||(a=new h.Expression(a)),b instanceof h.Expression||(b=new h.Expression(b)),a.minus(b)},times:function(a,b){return("number"==typeof a||a instanceof h.Variable)&&(a=new h.Expression(a)),("number"==typeof b||b instanceof h.Variable)&&(b=new h.Expression(b)),a.times(b)},divide:function(a,b){return("number"==typeof a||a instanceof h.Variable)&&(a=new h.Expression(a)),("number"==typeof b||b instanceof h.Variable)&&(b=new h.Expression(b)),a.divide(b)},approx:function(a,b){if(a===b)return!0;var c,d;return c=a instanceof h.Variable?a.value:a,d=b instanceof h.Variable?b.value:b,0==c?e>Math.abs(d):0==d?e>Math.abs(c):Math.abs(c-d)<Math.abs(c)*e},_inc:function(a){return function(){return a++}}(0),parseJSON:function(a){return JSON.parse(a,function(a,b){if("object"!=typeof b||"string"!=typeof b._t)return b;var c=b._t,d=f[c];if(c&&d){var e=g(d,"fromJSON");if(e)return e(b,d)}return b})}};"function"==typeof require&&"undefined"!=typeof module&&"undefined"==typeof load&&(a.exports=h)})(this),function(a){"use strict";var b=function(a){var b=a.hashCode?a.hashCode:""+a;return b},c=function(a,b){Object.keys(a).forEach(function(c){b[c]=a[c]})},d={};a.HashTable=a.inherit({initialize:function(){this.size=0,this._store={},this._keyStrMap={},this._deleted=0},set:function(a,c){var d=b(a);this._store.hasOwnProperty(d)||this.size++,this._store[d]=c,this._keyStrMap[d]=a},get:function(a){if(!this.size)return null;a=b(a);var c=this._store[a];return c!==void 0?this._store[a]:null},clear:function(){this.size=0,this._store={},this._keyStrMap={}},_compact:function(){var a={};c(this._store,a),this._store=a},_compactThreshold:100,_perhapsCompact:function(){this._size>64||this._deleted>this._compactThreshold&&(this._compact(),this._deleted=0)},"delete":function(a){a=b(a),this._store.hasOwnProperty(a)&&(this._deleted++,delete this._store[a],this.size>0&&this.size--)},each:function(a,b){if(this.size){this._perhapsCompact();var c=this._store,d=this._keyStrMap;Object.keys(this._store).forEach(function(e){a.call(b||null,d[e],c[e])},this)}},escapingEach:function(a,b){if(this.size){this._perhapsCompact();for(var c=this,e=this._store,f=this._keyStrMap,g=d,h=Object.keys(e),i=0;h.length>i;i++)if(function(d){c._store.hasOwnProperty(d)&&(g=a.call(b||null,f[d],e[d]))}(h[i]),g){if(void 0!==g.retval)return g;if(g.brk)break}}},clone:function(){var b=new a.HashTable;return this.size&&(b.size=this.size,c(this._store,b._store),c(this._keyStrMap,b._keyStrMap)),b},equals:function(b){if(b===this)return!0;if(!(b instanceof a.HashTable)||b._size!==this._size)return!1;for(var c=Object.keys(this._store),d=0;c.length>d;d++){var e=c[d];if(this._keyStrMap[e]!==b._keyStrMap[e]||this._store[e]!==b._store[e])return!1}return!0},toString:function(){var b="";return this.each(function(a,c){b+=a+" => "+c+"\n"}),b}})}(this.c||module.parent.exports||{}),function(a){"use strict";a.HashSet=a.inherit({_t:"c.HashSet",initialize:function(){this.storage=[],this.size=0},add:function(a){var b=this.storage;b.indexOf(a),-1==b.indexOf(a)&&b.push(a),this.size=this.storage.length},values:function(){return this.storage},has:function(a){var b=this.storage;return-1!=b.indexOf(a)},"delete":function(a){var b=this.storage.indexOf(a);return-1==b?null:(this.storage.splice(b,1)[0],this.size=this.storage.length,void 0)},clear:function(){this.storage.length=0},each:function(a,b){this.size&&this.storage.forEach(a,b)},escapingEach:function(a,b){this.size&&this.storage.forEach(a,b)},toString:function(){var a=this.size+" {",b=!0;return this.each(function(c){b?b=!1:a+=", ",a+=c}),a+="}\n"},toJSON:function(){var a=[];return this.each(function(b){a.push(b.toJSON())}),{_t:"c.HashSet",data:a}},fromJSON:function(b){var c=new a.HashSet;return b.data&&(c.size=b.data.length,c.storage=b.data),c}})}(this.c||module.parent.exports||{}),function(a){"use strict";a.Error=a.inherit({initialize:function(a){a&&(this._description=a)},_name:"c.Error",_description:"An error has occured in Cassowary",set description(a){this._description=a},get description(){return"("+this._name+") "+this._description},get message(){return this.description},toString:function(){return this.description}});var b=function(b,c){return a.inherit({"extends":a.Error,initialize:function(){a.Error.apply(this,arguments)},_name:b||"",_description:c||""})};a.ConstraintNotFound=b("c.ConstraintNotFound","Tried to remove a constraint never added to the tableu"),a.InternalError=b("c.InternalError"),a.NonExpression=b("c.NonExpression","The resulting expression would be non"),a.NotEnoughStays=b("c.NotEnoughStays","There are not enough stays to give specific values to every variable"),a.RequiredFailure=b("c.RequiredFailure","A required constraint cannot be satisfied"),a.TooDifficult=b("c.TooDifficult","The constraints are too difficult to solve")}(this.c||module.parent.exports||{}),function(a){"use strict";var b=1e3;a.SymbolicWeight=a.inherit({_t:"c.SymbolicWeight",initialize:function(){this.value=0;for(var a=1,c=arguments.length-1;c>=0;--c)this.value+=arguments[c]*a,a*=b},toJSON:function(){return{_t:this._t,value:this.value}}})}(this.c||module.parent.exports||{}),function(a){a.Strength=a.inherit({initialize:function(b,c,d,e){this.name=b,this.symbolicWeight=c instanceof a.SymbolicWeight?c:new a.SymbolicWeight(c,d,e)},get required(){return this===a.Strength.required},toString:function(){return this.name+(this.isRequired?"":":"+this.symbolicWeight)}}),a.Strength.required=new a.Strength("<Required>",1e3,1e3,1e3),a.Strength.strong=new a.Strength("strong",1,0,0),a.Strength.medium=new a.Strength("medium",0,1,0),a.Strength.weak=new a.Strength("weak",0,0,1)}(this.c||("undefined"!=typeof module?module.parent.exports.c:{})),function(a){"use strict";a.AbstractVariable=a.inherit({isDummy:!1,isExternal:!1,isPivotable:!1,isRestricted:!1,_init:function(b,c){this.hashCode=a._inc(),this.name=(c||"")+this.hashCode,b&&(b.name!==void 0&&(this.name=b.name),b.value!==void 0&&(this.value=b.value),b.prefix!==void 0&&(this._prefix=b.prefix))},_prefix:"",name:"",value:0,toJSON:function(){var a={};return this._t&&(a._t=this._t),this.name&&(a.name=this.name),this.value!==void 0&&(a.value=this.value),this._prefix&&(a._prefix=this._prefix),this._t&&(a._t=this._t),a},fromJSON:function(b,c){var d=new c;return a.extend(d,b),d},toString:function(){return this._prefix+"["+this.name+":"+this.value+"]"}}),a.Variable=a.inherit({_t:"c.Variable","extends":a.AbstractVariable,initialize:function(b){this._init(b,"v");var c=a.Variable._map;c&&(c[this.name]=this)},isExternal:!0}),a.DummyVariable=a.inherit({_t:"c.DummyVariable","extends":a.AbstractVariable,initialize:function(a){this._init(a,"d")},isDummy:!0,isRestricted:!0,value:"dummy"}),a.ObjectiveVariable=a.inherit({_t:"c.ObjectiveVariable","extends":a.AbstractVariable,initialize:function(a){this._init(a,"o")},value:"obj"}),a.SlackVariable=a.inherit({_t:"c.SlackVariable","extends":a.AbstractVariable,initialize:function(a){this._init(a,"s")},isPivotable:!0,isRestricted:!0,value:"slack"})}(this.c||module.parent.exports||{}),function(a){"use strict";a.Point=a.inherit({initialize:function(b,c,d){if(b instanceof a.Variable)this._x=b;else{var e={value:b};d&&(e.name="x"+d),this._x=new a.Variable(e)}if(c instanceof a.Variable)this._y=c;else{var f={value:c};d&&(f.name="y"+d),this._y=new a.Variable(f)}},get x(){return this._x},set x(b){b instanceof a.Variable?this._x=b:this._x.value=b},get y(){return this._y},set y(b){b instanceof a.Variable?this._y=b:this._y.value=b},toString:function(){return"("+this.x+", "+this.y+")"}})}(this.c||module.parent.exports||{}),function(a){"use strict";a.Expression=a.inherit({initialize:function(b,c,d){a.GC&&console.log("new c.Expression"),this.constant="number"!=typeof d||isNaN(d)?0:d,this.terms=new a.HashTable,b instanceof a.AbstractVariable?this.setVariable(b,"number"==typeof c?c:1):"number"==typeof b&&(isNaN(b)?console.trace():this.constant=b)},initializeFromHash:function(b,c){return a.verbose&&(console.log("*******************************"),console.log("clone c.initializeFromHash"),console.log("*******************************")),a.GC&&console.log("clone c.Expression"),this.constant=b,this.terms=c.clone(),this},multiplyMe:function(a){this.constant*=a;var b=this.terms;return b.each(function(c,d){b.set(c,d*a)}),this},clone:function(){a.verbose&&(console.log("*******************************"),console.log("clone c.Expression"),console.log("*******************************"));var b=new a.Expression;return b.initializeFromHash(this.constant,this.terms),b},times:function(b){if("number"==typeof b)return this.clone().multiplyMe(b);if(this.isConstant)return b.times(this.constant);if(b.isConstant)return this.times(b.constant);throw new a.NonExpression},plus:function(b){return b instanceof a.Expression?this.clone().addExpression(b,1):b instanceof a.Variable?this.clone().addVariable(b,1):void 0},minus:function(b){return b instanceof a.Expression?this.clone().addExpression(b,-1):b instanceof a.Variable?this.clone().addVariable(b,-1):void 0},divide:function(b){if("number"==typeof b){if(a.approx(b,0))throw new a.NonExpression;return this.times(1/b)}if(b instanceof a.Expression){if(!b.isConstant)throw new a.NonExpression;return this.times(1/b.constant)}},addExpression:function(b,c,d,e){return b instanceof a.AbstractVariable&&(b=new a.Expression(b),a.trace&&console.log("addExpression: Had to cast a var to an expression")),c=c||1,this.constant+=c*b.constant,b.terms.each(function(a,b){this.addVariable(a,b*c,d,e)},this),this},addVariable:function(b,c,d,e){null==c&&(c=1),a.trace&&console.log("c.Expression::addVariable():",b,c);var f=this.terms.get(b);if(f){var g=f+c;0==g||a.approx(g,0)?(e&&e.noteRemovedVariable(b,d),this.terms.delete(b)):this.setVariable(b,g)}else a.approx(c,0)||(this.setVariable(b,c),e&&e.noteAddedVariable(b,d));return this},setVariable:function(a,b){return this.terms.set(a,b),this},anyPivotableVariable:function(){if(this.isConstant)throw new a.InternalError("anyPivotableVariable called on a constant");var b=this.terms.escapingEach(function(a){return a.isPivotable?{retval:a}:void 0});return b&&void 0!==b.retval?b.retval:null},substituteOut:function(b,c,d,e){a.trace&&(a.fnenterprint("CLE:substituteOut: "+b+", "+c+", "+d+", ..."),a.traceprint("this = "+this));var f=this.setVariable.bind(this),g=this.terms,h=g.get(b);g.delete(b),this.constant+=h*c.constant,c.terms.each(function(b,c){var i=g.get(b);if(i){var j=i+h*c;a.approx(j,0)?(e.noteRemovedVariable(b,d),g.delete(b)):f(b,j)}else f(b,h*c),e&&e.noteAddedVariable(b,d)}),a.trace&&a.traceprint("Now this is "+this)},changeSubject:function(a,b){this.setVariable(a,this.newSubject(b))},newSubject:function(b){a.trace&&a.fnenterprint("newSubject:"+b);var c=1/this.terms.get(b);return this.terms.delete(b),this.multiplyMe(-c),c},coefficientFor:function(a){return this.terms.get(a)||0},get isConstant(){return 0==this.terms.size},toString:function(){var b="",c=!1;if(!a.approx(this.constant,0)||this.isConstant){if(b+=this.constant,this.isConstant)return b;c=!0}return this.terms.each(function(a,d){c&&(b+=" + "),b+=d+"*"+a,c=!0}),b},equals:function(b){return b===this?!0:b instanceof a.Expression&&b.constant===this.constant&&b.terms.equals(this.terms)},Plus:function(a,b){return a.plus(b)},Minus:function(a,b){return a.minus(b)},Times:function(a,b){return a.times(b)},Divide:function(a,b){return a.divide(b)}})}(this.c||module.parent.exports||{}),function(a){"use strict";a.AbstractConstraint=a.inherit({initialize:function(b,c){this.hashCode=a._inc(),this.strength=b||a.Strength.required,this.weight=c||1},isEditConstraint:!1,isInequality:!1,isStayConstraint:!1,get required(){return this.strength===a.Strength.required},toString:function(){return this.strength+" {"+this.weight+"} ("+this.expression+")"}});var b=a.AbstractConstraint.prototype.toString,c=function(b,c,d){a.AbstractConstraint.call(this,c||a.Strength.strong,d),this.variable=b,this.expression=new a.Expression(b,-1,b.value)};a.EditConstraint=a.inherit({"extends":a.AbstractConstraint,initialize:function(){c.apply(this,arguments)},isEditConstraint:!0,toString:function(){return"edit:"+b.call(this)}}),a.StayConstraint=a.inherit({"extends":a.AbstractConstraint,initialize:function(){c.apply(this,arguments)},isStayConstraint:!0,toString:function(){return"stay:"+b.call(this)}});var d=a.Constraint=a.inherit({"extends":a.AbstractConstraint,initialize:function(b,c,d){a.AbstractConstraint.call(this,c,d),this.expression=b}});a.Inequality=a.inherit({"extends":a.Constraint,_cloneOrNewCle:function(b){return b.clone?b.clone():new a.Expression(b)},initialize:function(b,c,e,f,g){var h=b instanceof a.Expression,i=e instanceof a.Expression,j=b instanceof a.AbstractVariable,k=e instanceof a.AbstractVariable,l="number"==typeof b,m="number"==typeof e;if((h||l)&&k){var n=b,o=c,p=e,q=f,r=g;if(d.call(this,this._cloneOrNewCle(n),q,r),o==a.LEQ)this.expression.multiplyMe(-1),this.expression.addVariable(p);else{if(o!=a.GEQ)throw new a.InternalError("Invalid operator in c.Inequality constructor");this.expression.addVariable(p,-1)}}else if(j&&(i||m)){var n=e,o=c,p=b,q=f,r=g;if(d.call(this,this._cloneOrNewCle(n),q,r),o==a.GEQ)this.expression.multiplyMe(-1),this.expression.addVariable(p);else{if(o!=a.LEQ)throw new a.InternalError("Invalid operator in c.Inequality constructor");this.expression.addVariable(p,-1)}}else{if(h&&m){var s=b,o=c,t=e,q=f,r=g;if(d.call(this,this._cloneOrNewCle(s),q,r),o==a.LEQ)this.expression.multiplyMe(-1),this.expression.addExpression(this._cloneOrNewCle(t));else{if(o!=a.GEQ)throw new a.InternalError("Invalid operator in c.Inequality constructor");this.expression.addExpression(this._cloneOrNewCle(t),-1)}return this}if(l&&i){var s=e,o=c,t=b,q=f,r=g;if(d.call(this,this._cloneOrNewCle(s),q,r),o==a.GEQ)this.expression.multiplyMe(-1),this.expression.addExpression(this._cloneOrNewCle(t));else{if(o!=a.LEQ)throw new a.InternalError("Invalid operator in c.Inequality constructor");this.expression.addExpression(this._cloneOrNewCle(t),-1)}return this}if(h&&i){var s=b,o=c,t=e,q=f,r=g;if(d.call(this,this._cloneOrNewCle(t),q,r),o==a.GEQ)this.expression.multiplyMe(-1),this.expression.addExpression(this._cloneOrNewCle(s));else{if(o!=a.LEQ)throw new a.InternalError("Invalid operator in c.Inequality constructor");this.expression.addExpression(this._cloneOrNewCle(s),-1)}}else{if(h)return d.call(this,b,c,e);if(c==a.GEQ)d.call(this,new a.Expression(e),f,g),this.expression.multiplyMe(-1),this.expression.addVariable(b);else{if(c!=a.LEQ)throw new a.InternalError("Invalid operator in c.Inequality constructor");d.call(this,new a.Expression(e),f,g),this.expression.addVariable(b,-1)}}}},isInequality:!0,toString:function(){return d.prototype.toString.call(this)+" >= 0) id: "+this.hashCode}}),a.Equation=a.inherit({"extends":a.Constraint,initialize:function(b,c,e,f){if(b instanceof a.Expression&&!c||c instanceof a.Strength)d.call(this,b,c,e);else if(b instanceof a.AbstractVariable&&c instanceof a.Expression){var g=b,h=c,i=e,j=f;d.call(this,h.clone(),i,j),this.expression.addVariable(g,-1)}else if(b instanceof a.AbstractVariable&&"number"==typeof c){var g=b,k=c,i=e,j=f;d.call(this,new a.Expression(k),i,j),this.expression.addVariable(g,-1)}else if(b instanceof a.Expression&&c instanceof a.AbstractVariable){var h=b,g=c,i=e,j=f;d.call(this,h.clone(),i,j),this.expression.addVariable(g,-1)}else{if(!(b instanceof a.Expression||b instanceof a.AbstractVariable||"number"==typeof b)||!(c instanceof a.Expression||c instanceof a.AbstractVariable||"number"==typeof c))throw"Bad initializer to c.Equation";b=b instanceof a.Expression?b.clone():new a.Expression(b),c=c instanceof a.Expression?c.clone():new a.Expression(c),d.call(this,b,e,f),this.expression.addExpression(c,-1)}a.assert(this.strength instanceof a.Strength,"_strength not set")},toString:function(){return d.prototype.toString.call(this)+" = 0)"}})}(this.c||module.parent.exports||{}),function(a){"use strict";a.EditInfo=a.inherit({initialize:function(a,b,c,d,e){this.constraint=a,this.editPlus=b,this.editMinus=c,this.prevEditConstant=d,this.index=e},toString:function(){return"<cn="+this.constraint+", ep="+this.editPlus+", em="+this.editMinus+", pec="+this.prevEditConstant+", index="+this.index+">"}})}(this.c||module.parent.exports||{}),function(a){"use strict";a.Tableau=a.inherit({initialize:function(){this.columns=new a.HashTable,this.rows=new a.HashTable,this._infeasibleRows=new a.HashSet,this._externalRows=new a.HashSet,this._externalParametricVars=new a.HashSet},noteRemovedVariable:function(b,c){a.trace&&console.log("c.Tableau::noteRemovedVariable: ",b,c);var d=this.columns.get(b);c&&d&&d.delete(c)},noteAddedVariable:function(a,b){b&&this.insertColVar(a,b)},getInternalInfo:function(){var a="Tableau Information:\n";return a+="Rows: "+this.rows.size,a+=" (= "+(this.rows.size-1)+" constraints)",a+="\nColumns: "+this.columns.size,a+="\nInfeasible Rows: "+this._infeasibleRows.size,a+="\nExternal basic variables: "+this._externalRows.size,a+="\nExternal parametric variables: ",a+=this._externalParametricVars.size,a+="\n"},toString:function(){var a="Tableau:\n";return this.rows.each(function(b,c){a+=b,a+=" <==> ",a+=c,a+="\n"}),a+="\nColumns:\n",a+=this.columns,a+="\nInfeasible rows: ",a+=this._infeasibleRows,a+="External basic variables: ",a+=this._externalRows,a+="External parametric variables: ",a+=this._externalParametricVars},insertColVar:function(b,c){var d=this.columns.get(b);d||(d=new a.HashSet,this.columns.set(b,d)),d.add(c)},addRow:function(b,c){a.trace&&a.fnenterprint("addRow: "+b+", "+c),this.rows.set(b,c),c.terms.each(function(a){this.insertColVar(a,b),a.isExternal&&this._externalParametricVars.add(a)},this),b.isExternal&&this._externalRows.add(b),a.trace&&a.traceprint(""+this)},removeColumn:function(b){a.trace&&a.fnenterprint("removeColumn:"+b);var c=this.columns.get(b);c?(this.columns.delete(b),c.each(function(a){var c=this.rows.get(a);c.terms.delete(b)},this)):a.trace&&console.log("Could not find var",b,"in columns"),b.isExternal&&(this._externalRows.delete(b),this._externalParametricVars.delete(b))},removeRow:function(b){a.trace&&a.fnenterprint("removeRow:"+b);var c=this.rows.get(b);return a.assert(null!=c),c.terms.each(function(c){var e=this.columns.get(c);null!=e&&(a.trace&&console.log("removing from varset:",b),e.delete(b))},this),this._infeasibleRows.delete(b),b.isExternal&&this._externalRows.delete(b),this.rows.delete(b),a.trace&&a.fnexitprint("returning "+c),c},substituteOut:function(b,c){a.trace&&a.fnenterprint("substituteOut:"+b+", "+c),a.trace&&a.traceprint(""+this);var d=this.columns.get(b);d.each(function(a){var d=this.rows.get(a);d.substituteOut(b,c,a,this),a.isRestricted&&0>d.constant&&this._infeasibleRows.add(a)},this),b.isExternal&&(this._externalRows.add(b),this._externalParametricVars.delete(b)),this.columns.delete(b)},columnsHasKey:function(a){return!!this.columns.get(a)}})}(this.c||module.parent.exports||{}),function(a){var b=a.Tableau,c=b.prototype,d=1e-8,e=a.Strength.weak;a.SimplexSolver=a.inherit({"extends":a.Tableau,initialize:function(){a.Tableau.call(this),this._stayMinusErrorVars=[],this._stayPlusErrorVars=[],this._errorVars=new a.HashTable,this._markerVars=new a.HashTable,this._objective=new a.ObjectiveVariable({name:"Z"}),this._editVarMap=new a.HashTable,this._editVarList=[],this._slackCounter=0,this._artificialCounter=0,this._dummyCounter=0,this.autoSolve=!0,this._fNeedsSolving=!1,this._optimizeCount=0,this.rows.set(this._objective,new a.Expression),this._stkCedcns=[0],a.trace&&a.traceprint("objective expr == "+this.rows.get(this._objective))},addLowerBound:function(b,c){var d=new a.Inequality(b,a.GEQ,new a.Expression(c));return this.addConstraint(d)},addUpperBound:function(b,c){var d=new a.Inequality(b,a.LEQ,new a.Expression(c));return this.addConstraint(d)},addBounds:function(a,b,c){return this.addLowerBound(a,b),this.addUpperBound(a,c),this},add:function(){for(var a=0;arguments.length>a;a++)this.addConstraint(arguments[a]);return this},addConstraint:function(b){a.trace&&a.fnenterprint("addConstraint: "+b);var c=Array(2),d=Array(1),e=this.newExpression(b,c,d);if(d=d[0],this.tryAddingDirectly(e)||this.addWithArtificialVariable(e),this._fNeedsSolving=!0,b.isEditConstraint){var f=this._editVarMap.size,g=c[0],h=c[1];!g instanceof a.SlackVariable&&console.warn("cvEplus not a slack variable =",g),!h instanceof a.SlackVariable&&console.warn("cvEminus not a slack variable =",h),a.debug&&console.log("new c.EditInfo("+b+", "+g+", "+h+", "+d+", "+f+")");var i=new a.EditInfo(b,g,h,d,f);this._editVarMap.set(b.variable,i),this._editVarList[f]={v:b.variable,info:i}}return this.autoSolve&&(this.optimize(this._objective),this._setExternalVariables()),this},addConstraintNoException:function(b){a.trace&&a.fnenterprint("addConstraintNoException: "+b);try{return this.addConstraint(b),!0}catch(c){return!1}},addEditVar:function(b,c){return a.trace&&a.fnenterprint("addEditVar: "+b+" @ "+c),this.addConstraint(new a.EditConstraint(b,c||a.Strength.strong))},beginEdit:function(){return a.assert(this._editVarMap.size>0,"_editVarMap.size > 0"),this._infeasibleRows.clear(),this._resetStayConstants(),this._stkCedcns.push(this._editVarMap.size),this},endEdit:function(){return a.assert(this._editVarMap.size>0,"_editVarMap.size > 0"),this.resolve(),this._stkCedcns.pop(),this.removeEditVarsTo(this._stkCedcns[this._stkCedcns.length-1]),this},removeAllEditVars:function(){return this.removeEditVarsTo(0)},removeEditVarsTo:function(b){try{for(var c=this._editVarList.length,d=b;c>d;d++)this._editVarList[d]&&this.removeConstraint(this._editVarMap.get(this._editVarList[d].v).constraint);return this._editVarList.length=b,a.assert(this._editVarMap.size==b,"_editVarMap.size == n"),this}catch(e){throw new a.InternalError("Constraint not found in removeEditVarsTo")}},addPointStays:function(b){return a.trace&&console.log("addPointStays",b),b.forEach(function(a,b){this.addStay(a.x,e,Math.pow(2,b)),this.addStay(a.y,e,Math.pow(2,b))},this),this},addStay:function(b,c,d){var f=new a.StayConstraint(b,c||e,d||1);return this.addConstraint(f)},removeConstraint:function(a){return this.removeConstraintInternal(a),this},removeConstraintInternal:function(b){a.trace&&a.fnenterprint("removeConstraintInternal: "+b),a.trace&&a.traceprint(""+this),this._fNeedsSolving=!0,this._resetStayConstants();var c=this.rows.get(this._objective),d=this._errorVars.get(b);a.trace&&a.traceprint("eVars == "+d),null!=d&&d.each(function(e){var f=this.rows.get(e);null==f?c.addVariable(e,-b.weight*b.strength.symbolicWeight.value,this._objective,this):c.addExpression(f,-b.weight*b.strength.symbolicWeight.value,this._objective,this),a.trace&&a.traceprint("now eVars == "+d)},this);var e=this._markerVars.get(b);if(this._markerVars.delete(b),null==e)throw new a.InternalError("Constraint not found in removeConstraintInternal");if(a.trace&&a.traceprint("Looking to remove var "+e),null==this.rows.get(e)){var f=this.columns.get(e);a.trace&&a.traceprint("Must pivot -- columns are "+f);var g=null,h=0;f.each(function(b){if(b.isRestricted){var c=this.rows.get(b),d=c.coefficientFor(e);if(a.trace&&a.traceprint("Marker "+e+"'s coefficient in "+c+" is "+d),0>d){var f=-c.constant/d;(null==g||h>f||a.approx(f,h)&&b.hashCode<g.hashCode)&&(h=f,g=b)}}},this),null==g&&(a.trace&&a.traceprint("exitVar is still null"),f.each(function(a){if(a.isRestricted){var b=this.rows.get(a),c=b.coefficientFor(e),d=b.constant/c;(null==g||h>d)&&(h=d,g=a)}},this)),null==g&&(0==f.size?this.removeColumn(e):f.escapingEach(function(a){return a!=this._objective?(g=a,{brk:!0}):void 0},this)),null!=g&&this.pivot(e,g)}if(null!=this.rows.get(e)&&this.removeRow(e),null!=d&&d.each(function(a){a!=e&&this.removeColumn(a)},this),b.isStayConstraint){if(null!=d)for(var j=0;this._stayPlusErrorVars.length>j;j++)d.delete(this._stayPlusErrorVars[j]),d.delete(this._stayMinusErrorVars[j])}else if(b.isEditConstraint){a.assert(null!=d,"eVars != null");var k=this._editVarMap.get(b.variable);this.removeColumn(k.editMinus),this._editVarMap.delete(b.variable)}return null!=d&&this._errorVars.delete(d),this.autoSolve&&(this.optimize(this._objective),this._setExternalVariables()),this},reset:function(){throw a.trace&&a.fnenterprint("reset"),new a.InternalError("reset not implemented")},resolveArray:function(b){a.trace&&a.fnenterprint("resolveArray"+b);var c=b.length;this._editVarMap.each(function(a,d){var e=d.index;c>e&&this.suggestValue(a,b[e])},this),this.resolve()},resolvePair:function(a,b){this.suggestValue(this._editVarList[0].v,a),this.suggestValue(this._editVarList[1].v,b),this.resolve()},resolve:function(){a.trace&&a.fnenterprint("resolve()"),this.dualOptimize(),this._setExternalVariables(),this._infeasibleRows.clear(),this._resetStayConstants()},suggestValue:function(b,c){a.trace&&console.log("suggestValue("+b+", "+c+")");var d=this._editVarMap.get(b);if(!d)throw new a.Error("suggestValue for variable "+b+", but var is not an edit variable");var e=c-d.prevEditConstant;return d.prevEditConstant=c,this.deltaEditConstant(e,d.editPlus,d.editMinus),this},solve:function(){return this._fNeedsSolving&&(this.optimize(this._objective),this._setExternalVariables()),this},setEditedValue:function(b,c){if(!this.columnsHasKey(b)&&null==this.rows.get(b))return b.value=c,this;if(!a.approx(c,b.value)){this.addEditVar(b),this.beginEdit();try{this.suggestValue(b,c)}catch(d){throw new a.InternalError("Error in setEditedValue")}this.endEdit()}return this},addVar:function(b){if(!this.columnsHasKey(b)&&null==this.rows.get(b)){try{this.addStay(b)}catch(c){throw new a.InternalError("Error in addVar -- required failure is impossible")}a.trace&&a.traceprint("added initial stay on "+b)}return this},getInternalInfo:function(){var a=c.getInternalInfo.call(this);return a+="\nSolver info:\n",a+="Stay Error Variables: ",a+=this._stayPlusErrorVars.length+this._stayMinusErrorVars.length,a+=" ("+this._stayPlusErrorVars.length+" +, ",a+=this._stayMinusErrorVars.length+" -)\n",a+="Edit Variables: "+this._editVarMap.size,a+="\n"},getDebugInfo:function(){return""+this+this.getInternalInfo()+"\n"},toString:function(){var a=c.getInternalInfo.call(this);return a+="\n_stayPlusErrorVars: ",a+="["+this._stayPlusErrorVars+"]",a+="\n_stayMinusErrorVars: ",a+="["+this._stayMinusErrorVars+"]",a+="\n",a+="_editVarMap:\n"+this._editVarMap,a+="\n"},getConstraintMap:function(){return this._markerVars},addWithArtificialVariable:function(b){a.trace&&a.fnenterprint("addWithArtificialVariable: "+b);var c=new a.SlackVariable({value:++this._artificialCounter,prefix:"a"}),d=new a.ObjectiveVariable({name:"az"}),e=b.clone();a.trace&&a.traceprint("before addRows:\n"+this),this.addRow(d,e),this.addRow(c,b),a.trace&&a.traceprint("after addRows:\n"+this),this.optimize(d);var f=this.rows.get(d);if(a.trace&&a.traceprint("azTableauRow.constant == "+f.constant),!a.approx(f.constant,0))throw this.removeRow(d),this.removeColumn(c),new a.RequiredFailure;var g=this.rows.get(c);if(null!=g){if(g.isConstant)return this.removeRow(c),this.removeRow(d),void 0;var h=g.anyPivotableVariable();this.pivot(h,c)}a.assert(null==this.rows.get(c),"rowExpression(av) == null"),this.removeColumn(c),this.removeRow(d)},tryAddingDirectly:function(b){a.trace&&a.fnenterprint("tryAddingDirectly: "+b);var c=this.chooseSubject(b);return null==c?(a.trace&&a.fnexitprint("returning false"),!1):(b.newSubject(c),this.columnsHasKey(c)&&this.substituteOut(c,b),this.addRow(c,b),a.trace&&a.fnexitprint("returning true"),!0)},chooseSubject:function(b){a.trace&&a.fnenterprint("chooseSubject: "+b);var c=null,d=!1,e=!1,f=b.terms,g=f.escapingEach(function(a,b){if(d){if(!a.isRestricted&&!this.columnsHasKey(a))return{retval:a}}else if(a.isRestricted){if(!e&&!a.isDummy&&0>b){var f=this.columns.get(a);(null==f||1==f.size&&this.columnsHasKey(this._objective))&&(c=a,e=!0)}}else c=a,d=!0},this);if(g&&void 0!==g.retval)return g.retval;if(null!=c)return c;var h=0,g=f.escapingEach(function(a,b){return a.isDummy?(this.columnsHasKey(a)||(c=a,h=b),void 0):{retval:null}},this);if(g&&void 0!==g.retval)return g.retval;if(!a.approx(b.constant,0))throw new a.RequiredFailure;return h>0&&b.multiplyMe(-1),c},deltaEditConstant:function(b,c,d){a.trace&&a.fnenterprint("deltaEditConstant :"+b+", "+c+", "+d);var e=this.rows.get(c);if(null!=e)return e.constant+=b,0>e.constant&&this._infeasibleRows.add(c),void 0;var f=this.rows.get(d);if(null!=f)return f.constant+=-b,0>f.constant&&this._infeasibleRows.add(d),void 0;var g=this.columns.get(d);g||console.log("columnVars is null -- tableau is:\n"+this),g.each(function(a){var c=this.rows.get(a),e=c.coefficientFor(d);c.constant+=e*b,a.isRestricted&&0>c.constant&&this._infeasibleRows.add(a)},this)},dualOptimize:function(){a.trace&&a.fnenterprint("dualOptimize:");for(var b=this.rows.get(this._objective);this._infeasibleRows.size;){var c=this._infeasibleRows.values()[0];this._infeasibleRows.delete(c);var d=null,e=this.rows.get(c);if(e&&0>e.constant){var g,f=Number.MAX_VALUE,h=e.terms;if(h.each(function(c,e){if(e>0&&c.isPivotable){var h=b.coefficientFor(c);g=h/e,(f>g||a.approx(g,f)&&c.hashCode<d.hashCode)&&(d=c,f=g)}}),f==Number.MAX_VALUE)throw new a.InternalError("ratio == nil (MAX_VALUE) in dualOptimize");this.pivot(d,c)}}},newExpression:function(b,c,d){a.trace&&(a.fnenterprint("newExpression: "+b),a.traceprint("cn.isInequality == "+b.isInequality),a.traceprint("cn.required == "+b.required));var e=b.expression,f=new a.Expression(e.constant),g=new a.SlackVariable,h=new a.DummyVariable,i=new a.SlackVariable,j=new a.SlackVariable,k=e.terms;if(k.each(function(a,b){var c=this.rows.get(a);c?f.addExpression(c,b):f.addVariable(a,b)},this),b.isInequality){if(a.trace&&a.traceprint("Inequality, adding slack"),++this._slackCounter,g=new a.SlackVariable({value:this._slackCounter,prefix:"s"}),f.setVariable(g,-1),this._markerVars.set(b,g),!b.required){++this._slackCounter,i=new a.SlackVariable({value:this._slackCounter,prefix:"em"}),f.setVariable(i,1);
var l=this.rows.get(this._objective);l.setVariable(i,b.strength.symbolicWeight.value*b.weight),this.insertErrorVar(b,i),this.noteAddedVariable(i,this._objective)}}else if(b.required)a.trace&&a.traceprint("Equality, required"),++this._dummyCounter,h=new a.DummyVariable({value:this._dummyCounter,prefix:"d"}),f.setVariable(h,1),this._markerVars.set(b,h),a.trace&&a.traceprint("Adding dummyVar == d"+this._dummyCounter);else{a.trace&&a.traceprint("Equality, not required"),++this._slackCounter,j=new a.SlackVariable({value:this._slackCounter,prefix:"ep"}),i=new a.SlackVariable({value:this._slackCounter,prefix:"em"}),f.setVariable(j,-1),f.setVariable(i,1),this._markerVars.set(b,j);var l=this.rows.get(this._objective);a.trace&&console.log(l);var m=b.strength.symbolicWeight.value*b.weight;0==m&&(a.trace&&a.traceprint("cn == "+b),a.trace&&a.traceprint("adding "+j+" and "+i+" with swCoeff == "+m)),l.setVariable(j,m),this.noteAddedVariable(j,this._objective),l.setVariable(i,m),this.noteAddedVariable(i,this._objective),this.insertErrorVar(b,i),this.insertErrorVar(b,j),b.isStayConstraint?(this._stayPlusErrorVars.push(j),this._stayMinusErrorVars.push(i)):b.isEditConstraint&&(c[0]=j,c[1]=i,d[0]=e.constant)}return 0>f.constant&&f.multiplyMe(-1),a.trace&&a.fnexitprint("returning "+f),f},optimize:function(b){a.trace&&a.fnenterprint("optimize: "+b),a.trace&&a.traceprint(""+this),this._optimizeCount++;var c=this.rows.get(b);a.assert(null!=c,"zRow != null");for(var g,h,e=null,f=null;;){if(g=0,h=c.terms,h.escapingEach(function(a,b){return a.isPivotable&&g>b?(g=b,e=a,{brk:1}):void 0},this),g>=-d)return;a.trace&&console.log("entryVar:",e,"objectiveCoeff:",g);var i=Number.MAX_VALUE,j=this.columns.get(e),k=0;if(j.each(function(b){if(a.trace&&a.traceprint("Checking "+b),b.isPivotable){var c=this.rows.get(b),d=c.coefficientFor(e);a.trace&&a.traceprint("pivotable, coeff = "+d),0>d&&(k=-c.constant/d,(i>k||a.approx(k,i)&&b.hashCode<f.hashCode)&&(i=k,f=b))}},this),i==Number.MAX_VALUE)throw new a.InternalError("Objective function is unbounded in optimize");this.pivot(e,f),a.trace&&a.traceprint(""+this)}},pivot:function(b,c){a.trace&&console.log("pivot: ",b,c);var d=!1;d&&console.time(" SimplexSolver::pivot"),null==b&&console.warn("pivot: entryVar == null"),null==c&&console.warn("pivot: exitVar == null"),d&&console.time("  removeRow");var e=this.removeRow(c);d&&console.timeEnd("  removeRow"),d&&console.time("  changeSubject"),e.changeSubject(c,b),d&&console.timeEnd("  changeSubject"),d&&console.time("  substituteOut"),this.substituteOut(b,e),d&&console.timeEnd("  substituteOut"),d&&console.time("  addRow"),this.addRow(b,e),d&&console.timeEnd("  addRow"),d&&console.timeEnd(" SimplexSolver::pivot")},_resetStayConstants:function(){a.trace&&console.log("_resetStayConstants");for(var b=0;this._stayPlusErrorVars.length>b;b++){var c=this.rows.get(this._stayPlusErrorVars[b]);null==c&&(c=this.rows.get(this._stayMinusErrorVars[b])),null!=c&&(c.constant=0)}},_setExternalVariables:function(){a.trace&&a.fnenterprint("_setExternalVariables:"),a.trace&&a.traceprint(""+this),this._externalParametricVars.each(function(b){null!=this.rows.get(b)?a.trace&&console.log("Error: variable"+b+" in _externalParametricVars is basic"):b.value=0},this),this._externalRows.each(function(a){var b=this.rows.get(a);a.value!=b.constant&&(a.value=b.constant)},this),this._fNeedsSolving=!1,this.onsolved()},onsolved:function(){},insertErrorVar:function(b,c){a.trace&&a.fnenterprint("insertErrorVar:"+b+", "+c);var d=this._errorVars.get(c);d||(d=new a.HashSet,this._errorVars.set(b,d)),d.add(c)}})}(this.c||module.parent.exports||{}),function(a){"use strict";a.Timer=a.inherit({initialize:function(){this.isRunning=!1,this._elapsedMs=0},start:function(){return this.isRunning=!0,this._startReading=new Date,this},stop:function(){return this.isRunning=!1,this._elapsedMs+=new Date-this._startReading,this},reset:function(){return this.isRunning=!1,this._elapsedMs=0,this},elapsedTime:function(){return this.isRunning?(this._elapsedMs+(new Date-this._startReading))/1e3:this._elapsedMs/1e3}})}(this.c||module.parent.exports||{}),__cassowary_parser=function(){function a(a){return'"'+a.replace(/\\/g,"\\\\").replace(/"/g,'\\"').replace(/\x08/g,"\\b").replace(/\t/g,"\\t").replace(/\n/g,"\\n").replace(/\f/g,"\\f").replace(/\r/g,"\\r").replace(/[\x00-\x07\x0B\x0E-\x1F\x80-\uFFFF]/g,escape)+'"'}var b={parse:function(b,c){function k(a){g>e||(e>g&&(g=e,h=[]),h.push(a))}function l(){var a,b,c,d,f;if(d=e,f=e,a=z(),null!==a){if(c=m(),null!==c)for(b=[];null!==c;)b.push(c),c=m();else b=null;null!==b?(c=z(),null!==c?a=[a,b,c]:(a=null,e=f)):(a=null,e=f)}else a=null,e=f;return null!==a&&(a=function(a,b){return b}(d,a[1])),null===a&&(e=d),a}function m(){var a,b,c,d;return c=e,d=e,a=P(),null!==a?(b=s(),null!==b?a=[a,b]:(a=null,e=d)):(a=null,e=d),null!==a&&(a=function(a,b){return b}(c,a[0])),null===a&&(e=c),a}function n(){var a;return b.length>e?(a=b.charAt(e),e++):(a=null,0===f&&k("any character")),a}function o(){var a;return/^[a-zA-Z]/.test(b.charAt(e))?(a=b.charAt(e),e++):(a=null,0===f&&k("[a-zA-Z]")),null===a&&(36===b.charCodeAt(e)?(a="$",e++):(a=null,0===f&&k('"$"')),null===a&&(95===b.charCodeAt(e)?(a="_",e++):(a=null,0===f&&k('"_"')))),a}function p(){var a;return f++,/^[\t\x0B\f \xA0\uFEFF]/.test(b.charAt(e))?(a=b.charAt(e),e++):(a=null,0===f&&k("[\\t\\x0B\\f \\xA0\\uFEFF]")),f--,0===f&&null===a&&k("whitespace"),a}function q(){var a;return/^[\n\r\u2028\u2029]/.test(b.charAt(e))?(a=b.charAt(e),e++):(a=null,0===f&&k("[\\n\\r\\u2028\\u2029]")),a}function r(){var a;return f++,10===b.charCodeAt(e)?(a="\n",e++):(a=null,0===f&&k('"\\n"')),null===a&&("\r\n"===b.substr(e,2)?(a="\r\n",e+=2):(a=null,0===f&&k('"\\r\\n"')),null===a&&(13===b.charCodeAt(e)?(a="\r",e++):(a=null,0===f&&k('"\\r"')),null===a&&(8232===b.charCodeAt(e)?(a="\u2028",e++):(a=null,0===f&&k('"\\u2028"')),null===a&&(8233===b.charCodeAt(e)?(a="\u2029",e++):(a=null,0===f&&k('"\\u2029"')))))),f--,0===f&&null===a&&k("end of line"),a}function s(){var a,c,d;return d=e,a=z(),null!==a?(59===b.charCodeAt(e)?(c=";",e++):(c=null,0===f&&k('";"')),null!==c?a=[a,c]:(a=null,e=d)):(a=null,e=d),null===a&&(d=e,a=y(),null!==a?(c=r(),null!==c?a=[a,c]:(a=null,e=d)):(a=null,e=d),null===a&&(d=e,a=z(),null!==a?(c=t(),null!==c?a=[a,c]:(a=null,e=d)):(a=null,e=d))),a}function t(){var a,c;return c=e,f++,b.length>e?(a=b.charAt(e),e++):(a=null,0===f&&k("any character")),f--,null===a?a="":(a=null,e=c),a}function u(){var a;return f++,a=v(),null===a&&(a=x()),f--,0===f&&null===a&&k("comment"),a}function v(){var a,c,d,g,h,i,j;if(h=e,"/*"===b.substr(e,2)?(a="/*",e+=2):(a=null,0===f&&k('"/*"')),null!==a){for(c=[],i=e,j=e,f++,"*/"===b.substr(e,2)?(d="*/",e+=2):(d=null,0===f&&k('"*/"')),f--,null===d?d="":(d=null,e=j),null!==d?(g=n(),null!==g?d=[d,g]:(d=null,e=i)):(d=null,e=i);null!==d;)c.push(d),i=e,j=e,f++,"*/"===b.substr(e,2)?(d="*/",e+=2):(d=null,0===f&&k('"*/"')),f--,null===d?d="":(d=null,e=j),null!==d?(g=n(),null!==g?d=[d,g]:(d=null,e=i)):(d=null,e=i);null!==c?("*/"===b.substr(e,2)?(d="*/",e+=2):(d=null,0===f&&k('"*/"')),null!==d?a=[a,c,d]:(a=null,e=h)):(a=null,e=h)}else a=null,e=h;return a}function w(){var a,c,d,g,h,i,j;if(h=e,"/*"===b.substr(e,2)?(a="/*",e+=2):(a=null,0===f&&k('"/*"')),null!==a){for(c=[],i=e,j=e,f++,"*/"===b.substr(e,2)?(d="*/",e+=2):(d=null,0===f&&k('"*/"')),null===d&&(d=q()),f--,null===d?d="":(d=null,e=j),null!==d?(g=n(),null!==g?d=[d,g]:(d=null,e=i)):(d=null,e=i);null!==d;)c.push(d),i=e,j=e,f++,"*/"===b.substr(e,2)?(d="*/",e+=2):(d=null,0===f&&k('"*/"')),null===d&&(d=q()),f--,null===d?d="":(d=null,e=j),null!==d?(g=n(),null!==g?d=[d,g]:(d=null,e=i)):(d=null,e=i);null!==c?("*/"===b.substr(e,2)?(d="*/",e+=2):(d=null,0===f&&k('"*/"')),null!==d?a=[a,c,d]:(a=null,e=h)):(a=null,e=h)}else a=null,e=h;return a}function x(){var a,c,d,g,h,i,j;if(h=e,"//"===b.substr(e,2)?(a="//",e+=2):(a=null,0===f&&k('"//"')),null!==a){for(c=[],i=e,j=e,f++,d=q(),f--,null===d?d="":(d=null,e=j),null!==d?(g=n(),null!==g?d=[d,g]:(d=null,e=i)):(d=null,e=i);null!==d;)c.push(d),i=e,j=e,f++,d=q(),f--,null===d?d="":(d=null,e=j),null!==d?(g=n(),null!==g?d=[d,g]:(d=null,e=i)):(d=null,e=i);null!==c?a=[a,c]:(a=null,e=h)}else a=null,e=h;return a}function y(){var a,b;for(a=[],b=p(),null===b&&(b=w(),null===b&&(b=x()));null!==b;)a.push(b),b=p(),null===b&&(b=w(),null===b&&(b=x()));return a}function z(){var a,b;for(a=[],b=p(),null===b&&(b=r(),null===b&&(b=u()));null!==b;)a.push(b),b=p(),null===b&&(b=r(),null===b&&(b=u()));return a}function A(){var a,b;return b=e,a=C(),null===a&&(a=B()),null!==a&&(a=function(a,b){return{type:"NumericLiteral",value:b}}(b,a)),null===a&&(e=b),a}function B(){var a,c,d;if(d=e,/^[0-9]/.test(b.charAt(e))?(c=b.charAt(e),e++):(c=null,0===f&&k("[0-9]")),null!==c)for(a=[];null!==c;)a.push(c),/^[0-9]/.test(b.charAt(e))?(c=b.charAt(e),e++):(c=null,0===f&&k("[0-9]"));else a=null;return null!==a&&(a=function(a,b){return parseInt(b.join(""))}(d,a)),null===a&&(e=d),a}function C(){var a,c,d,g,h;return g=e,h=e,a=B(),null!==a?(46===b.charCodeAt(e)?(c=".",e++):(c=null,0===f&&k('"."')),null!==c?(d=B(),null!==d?a=[a,c,d]:(a=null,e=h)):(a=null,e=h)):(a=null,e=h),null!==a&&(a=function(a,b){return parseFloat(b.join(""))}(g,a)),null===a&&(e=g),a}function D(){var a,c,d,g;if(g=e,/^[\-+]/.test(b.charAt(e))?(a=b.charAt(e),e++):(a=null,0===f&&k("[\\-+]")),a=null!==a?a:"",null!==a){if(/^[0-9]/.test(b.charAt(e))?(d=b.charAt(e),e++):(d=null,0===f&&k("[0-9]")),null!==d)for(c=[];null!==d;)c.push(d),/^[0-9]/.test(b.charAt(e))?(d=b.charAt(e),e++):(d=null,0===f&&k("[0-9]"));else c=null;null!==c?a=[a,c]:(a=null,e=g)}else a=null,e=g;return a}function E(){var a,b;return f++,b=e,a=F(),null!==a&&(a=function(a,b){return b}(b,a)),null===a&&(e=b),f--,0===f&&null===a&&k("identifier"),a}function F(){var a,b,c,d,g;if(f++,d=e,g=e,a=o(),null!==a){for(b=[],c=o();null!==c;)b.push(c),c=o();null!==b?a=[a,b]:(a=null,e=g)}else a=null,e=g;return null!==a&&(a=function(a,b,c){return b+c.join("")}(d,a[0],a[1])),null===a&&(e=d),f--,0===f&&null===a&&k("identifier"),a}function G(){var a,c,d,g,h,i,j;return i=e,a=E(),null!==a&&(a=function(a,b){return{type:"Variable",name:b}}(i,a)),null===a&&(e=i),null===a&&(a=A(),null===a&&(i=e,j=e,40===b.charCodeAt(e)?(a="(",e++):(a=null,0===f&&k('"("')),null!==a?(c=z(),null!==c?(d=P(),null!==d?(g=z(),null!==g?(41===b.charCodeAt(e)?(h=")",e++):(h=null,0===f&&k('")"')),null!==h?a=[a,c,d,g,h]:(a=null,e=j)):(a=null,e=j)):(a=null,e=j)):(a=null,e=j)):(a=null,e=j),null!==a&&(a=function(a,b){return b}(i,a[2])),null===a&&(e=i))),a}function H(){var a,b,c,d,f;return a=G(),null===a&&(d=e,f=e,a=I(),null!==a?(b=z(),null!==b?(c=H(),null!==c?a=[a,b,c]:(a=null,e=f)):(a=null,e=f)):(a=null,e=f),null!==a&&(a=function(a,b,c){return{type:"UnaryExpression",operator:b,expression:c}}(d,a[0],a[2])),null===a&&(e=d)),a}function I(){var a;return 43===b.charCodeAt(e)?(a="+",e++):(a=null,0===f&&k('"+"')),null===a&&(45===b.charCodeAt(e)?(a="-",e++):(a=null,0===f&&k('"-"')),null===a&&(33===b.charCodeAt(e)?(a="!",e++):(a=null,0===f&&k('"!"')))),a}function J(){var a,b,c,d,f,g,h,i,j;if(h=e,i=e,a=H(),null!==a){for(b=[],j=e,c=z(),null!==c?(d=K(),null!==d?(f=z(),null!==f?(g=H(),null!==g?c=[c,d,f,g]:(c=null,e=j)):(c=null,e=j)):(c=null,e=j)):(c=null,e=j);null!==c;)b.push(c),j=e,c=z(),null!==c?(d=K(),null!==d?(f=z(),null!==f?(g=H(),null!==g?c=[c,d,f,g]:(c=null,e=j)):(c=null,e=j)):(c=null,e=j)):(c=null,e=j);null!==b?a=[a,b]:(a=null,e=i)}else a=null,e=i;return null!==a&&(a=function(a,b,c){for(var d=b,e=0;c.length>e;e++)d={type:"MultiplicativeExpression",operator:c[e][1],left:d,right:c[e][3]};return d}(h,a[0],a[1])),null===a&&(e=h),a}function K(){var a;return 42===b.charCodeAt(e)?(a="*",e++):(a=null,0===f&&k('"*"')),null===a&&(47===b.charCodeAt(e)?(a="/",e++):(a=null,0===f&&k('"/"'))),a}function L(){var a,b,c,d,f,g,h,i,j;if(h=e,i=e,a=J(),null!==a){for(b=[],j=e,c=z(),null!==c?(d=M(),null!==d?(f=z(),null!==f?(g=J(),null!==g?c=[c,d,f,g]:(c=null,e=j)):(c=null,e=j)):(c=null,e=j)):(c=null,e=j);null!==c;)b.push(c),j=e,c=z(),null!==c?(d=M(),null!==d?(f=z(),null!==f?(g=J(),null!==g?c=[c,d,f,g]:(c=null,e=j)):(c=null,e=j)):(c=null,e=j)):(c=null,e=j);null!==b?a=[a,b]:(a=null,e=i)}else a=null,e=i;return null!==a&&(a=function(a,b,c){for(var d=b,e=0;c.length>e;e++)d={type:"AdditiveExpression",operator:c[e][1],left:d,right:c[e][3]};return d}(h,a[0],a[1])),null===a&&(e=h),a}function M(){var a;return 43===b.charCodeAt(e)?(a="+",e++):(a=null,0===f&&k('"+"')),null===a&&(45===b.charCodeAt(e)?(a="-",e++):(a=null,0===f&&k('"-"'))),a}function N(){var a,b,c,d,f,g,h,i,j;if(h=e,i=e,a=L(),null!==a){for(b=[],j=e,c=z(),null!==c?(d=O(),null!==d?(f=z(),null!==f?(g=L(),null!==g?c=[c,d,f,g]:(c=null,e=j)):(c=null,e=j)):(c=null,e=j)):(c=null,e=j);null!==c;)b.push(c),j=e,c=z(),null!==c?(d=O(),null!==d?(f=z(),null!==f?(g=L(),null!==g?c=[c,d,f,g]:(c=null,e=j)):(c=null,e=j)):(c=null,e=j)):(c=null,e=j);null!==b?a=[a,b]:(a=null,e=i)}else a=null,e=i;return null!==a&&(a=function(a,b,c){for(var d=b,e=0;c.length>e;e++)d={type:"Inequality",operator:c[e][1],left:d,right:c[e][3]};return d}(h,a[0],a[1])),null===a&&(e=h),a}function O(){var a;return"<="===b.substr(e,2)?(a="<=",e+=2):(a=null,0===f&&k('"<="')),null===a&&(">="===b.substr(e,2)?(a=">=",e+=2):(a=null,0===f&&k('">="')),null===a&&(60===b.charCodeAt(e)?(a="<",e++):(a=null,0===f&&k('"<"')),null===a&&(62===b.charCodeAt(e)?(a=">",e++):(a=null,0===f&&k('">"'))))),a}function P(){var a,c,d,g,h,i,j,l,m;if(j=e,l=e,a=N(),null!==a){for(c=[],m=e,d=z(),null!==d?("=="===b.substr(e,2)?(g="==",e+=2):(g=null,0===f&&k('"=="')),null!==g?(h=z(),null!==h?(i=N(),null!==i?d=[d,g,h,i]:(d=null,e=m)):(d=null,e=m)):(d=null,e=m)):(d=null,e=m);null!==d;)c.push(d),m=e,d=z(),null!==d?("=="===b.substr(e,2)?(g="==",e+=2):(g=null,0===f&&k('"=="')),null!==g?(h=z(),null!==h?(i=N(),null!==i?d=[d,g,h,i]:(d=null,e=m)):(d=null,e=m)):(d=null,e=m)):(d=null,e=m);null!==c?a=[a,c]:(a=null,e=l)}else a=null,e=l;return null!==a&&(a=function(a,b,c){for(var d=b,e=0;c.length>e;e++)d={type:"Equality",operator:c[e][1],left:d,right:c[e][3]};return d}(j,a[0],a[1])),null===a&&(e=j),a}function Q(a){a.sort();for(var b=null,c=[],d=0;a.length>d;d++)a[d]!==b&&(c.push(a[d]),b=a[d]);return c}function R(){for(var a=1,c=1,d=!1,f=0;Math.max(e,g)>f;f++){var h=b.charAt(f);"\n"===h?(d||a++,c=1,d=!1):"\r"===h||"\u2028"===h||"\u2029"===h?(a++,c=1,d=!0):(c++,d=!1)}return{line:a,column:c}}var d={start:l,Statement:m,SourceCharacter:n,IdentifierStart:o,WhiteSpace:p,LineTerminator:q,LineTerminatorSequence:r,EOS:s,EOF:t,Comment:u,MultiLineComment:v,MultiLineCommentNoLineTerminator:w,SingleLineComment:x,_:y,__:z,Literal:A,Integer:B,Real:C,SignedInteger:D,Identifier:E,IdentifierName:F,PrimaryExpression:G,UnaryExpression:H,UnaryOperator:I,MultiplicativeExpression:J,MultiplicativeOperator:K,AdditiveExpression:L,AdditiveOperator:M,InequalityExpression:N,InequalityOperator:O,LinearExpression:P};if(void 0!==c){if(void 0===d[c])throw Error("Invalid rule name: "+a(c)+".")}else c="start";var e=0,f=0,g=0,h=[],S=d[c]();if(null===S||e!==b.length){var T=Math.max(e,g),U=b.length>T?b.charAt(T):null,V=R();throw new this.SyntaxError(Q(h),U,T,V.line,V.column)}return S},toSource:function(){return this._source}};return b.SyntaxError=function(b,c,d,e,f){function g(b,c){var d,e;switch(b.length){case 0:d="end of input";break;case 1:d=b[0];break;default:d=b.slice(0,b.length-1).join(", ")+" or "+b[b.length-1]}return e=c?a(c):"end of input","Expected "+d+" but "+e+" found."}this.name="SyntaxError",this.expected=b,this.found=c,this.message=g(b,c),this.offset=d,this.line=e,this.column=f},b.SyntaxError.prototype=Error.prototype,b}();
}).call(
  (typeof module != "undefined") ?
      (module.compiled = true && module) : this
);

},{}],13:[function(require,module,exports){
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD
    define(["../loader"], factory);
  } else if (typeof exports === 'object') {
    // Node, CommonJS-like
    module.exports = factory(require("../loader"));
  } else {
    // Browser globals (root is window)
    root.z3 = factory(root.loadModule);
  }
}(this, function (loadModule) {
  return function loadRhea(directory) {
    return new Promise(function(resolve, reject) {
      loadModule("rhea.wrapped.js", directory).then(function (rhea) {

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

          // console.log("New object", self.constructor.name);
        }


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

          if (arguments.length == 1 && isNumber(v1)) {
            e = rhea.Module.createExpressionConst(v1);
          } else if (isExpression(v1) && isExpression(v2)) {
            e = rhea.Module.createExpressionExpExp(v1.base, op, v2.base);
            this.rc.add(v1, v2);
          } else if (isExpression(v1) && isVariable(v2)) {
            e = rhea.Module.createExpressionExpVar(v1.base, op, v2.base);
            this.rc.add(v1, v2);
          } else if (isVariable(v1) && isExpression(v2)) {
            e = rhea.Module.createExpressionVarExp(v1.base, op, v2.base);
            this.rc.add(v1, v2);
          } else if (isVariable(v1) && isVariable(v2)) {
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
            var e2 = new Expression(v2);
            e = rhea.Module.createEquationExpExp(v1.base, e2.base);
            this.rc.add(v1, e2);
          } else if (isNumber(v1) && isExpression(v2)) {
            var e1 = new Expression(v1);
            e = rhea.Module.createEquationExpExp(v2.base, e1.base);
            this.rc.add(v2, e1);
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
          } else if (isExpression(v1) && isNumber(v2)) {
            var e2 = new Expression(v2);
            e = rhea.Module.createInequalityExpExp(v1.base, op, e2.base);
            this.rc.add(v1, e2);
          } else if (isNumber(v1) && isExpression(v2)) {
            var e1 = new Expression(v1);
            e = rhea.Module.createInequalityExpExp(v1.base, op, v2.base);
            this.rc.add(e1, v2);
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

          this.removeConstraint = function (c) {
            if (isConstraint(c)) {
              solver.remove_constraint(c.base);
            } else {
              throw new TypeError("Invalid arguments");
            }
          };

          this.removeStay = function (c) {
            if (isVariable(c)) {
              solver.remove_stay(c.base);
            } else {
              throw new TypeError("Invalid arguments");
            }
          };

          this.removeAllEditVars = function () { solver.remove_all_edit_vars(); };

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
        resolve({
          Variable : Variable,
          Expression: Expression,
          Equation: Equation,
          Inequality: Inequality,
          SimplexSolver: SimplexSolver,
          Constraint: Constraint,
          GEQ: ">=",
          LEQ: "<=",
          plus: plus,
          minus: minus,
          times: times,
          divide: divide,
          ReferenceCounterRoot: ReferenceCounterRoot,
          ReferenceCounter: ReferenceCounter,
          _Module: rhea.Module
        });

      });
    });
  };
}));

},{"../loader":6}],14:[function(require,module,exports){
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD
    define(["../loader"], factory);
  } else if (typeof exports === 'object') {
    // Node, CommonJS-like
    module.exports = factory(require("../loader"));
  } else {
    // Browser globals (root is window)
    root.z3 = factory(root.loadModule);
  }
}(this, function (loadModule) {
  return function loadZ3(directory) {
    return new Promise(function(resolve, reject) {
      loadModule("z3.wrapped.js", directory).then(function(z3) {
        var memFileTimeOut = 1000;
        setTimeout(function() {

          z3.solveProblem = function solveProblem(problem, fileName) {
            if (!fileName) {
              fileName = "problem.smt2";
            }

            var oldConsoleLog = console.log;
            var stdout = [];
            window.console.log = function(solution) {
              stdout.push(solution);
              // oldConsoleLog.apply(console, arguments);
            }

            z3.FS.createDataFile("/", fileName, "(check-sat) " + problem, !0, !0);

            try {
              z3.Module.callMain(["-smt2", "/" + fileName])
            } catch (exception) {
              console.error("exception", exception);
            } finally {
              z3.FS.unlink("/" + fileName)
            }

            window.console.log = oldConsoleLog;

            return stdout.join("")
          };

          var variableCounter = 0;
          var variableMap = {};
          z3.c = {
            Variable : function(opts) {
              this.value = (opts || {}).value;
              this._name = "var" + variableCounter++;
              var _this = this;
              this.toString = function() {
                // return this.value || _this.name;
                return _this._name;
              };
              variableMap[this._name] = this;
            },
            Inequality : function(exp1, comparator, exp2) {
              this.exp1 = exp1;
              this.exp2 = exp2;
              this.toString = function() {
                return "(assert (" + comparator + " " + exp1.toString() + " " + exp2.toString() + "))";
              }
            },
            Equation : function(exp1, exp2) {
              this.exp1 = exp1;
              this.exp2 = exp2;
              this.toString = function() {
                return "(assert (= " + exp1.toString() + " " + exp2.toString() + "))";
              }
            },
            Expression : function(exp1, operator, exp2) {
              this.exp1 = exp1;
              this.operator = operator;
              this.exp2 = exp2;
              var _this = this;
              this.toString = function() {
                return "(" + operator + " " + exp1.toString() + " " + exp2.toString() + ")";
              }
            },
            plus : function(exp1, exp2) {
              return new z3.c.Expression(exp1, "+", exp2);
            },
            minus : function(exp1, exp2) {
              return new z3.c.Expression(exp1, "-", exp2);
            },
            times : function(exp1, exp2) {
              return new z3.c.Expression(exp1, "*", exp2);
            },
            divide : function(exp1, exp2) {
              return new z3.c.Expression(exp1, "/", exp2);
            },
            GEQ : ">=",
            LEQ : "<=",
            SimplexSolver : function() {
              this.constraints = [];
              var _this = this;
              this.addConstraint = function(eq) {
                _this.constraints.push(eq);
              };
              this.solve = function() {
                var problemString = this.getProblemString();
                var solutionString = z3.solveProblem(problemString);
                var varTermRegex = /\((var[0-9]+) (.*?)\)/g;

                var result;
                while (result = varTermRegex.exec(solutionString)) {
                  var varName = result[1];
                  var term = result[2].replace(/[()]/g, "");

                  var rationalRegex = /\/ ([0-9]+(\.[0-9]+)?) ([0-9]+(\.[0-9]+)?)/;
                  var rationalResult;
                  var value;
                  if (rationalResult = rationalRegex.exec(term)) {
                    var sign = term.indexOf("-") > -1 ? -1 : 1;
                    var a = parseFloat(rationalResult[1]);
                    var b = parseFloat(rationalResult[3]);
                    value = sign * a / b;
                  } else {
                    value = parseFloat(term.replace(/\s/g, ""));
                  }

                  variableMap[varName].value = value;
                }
              }
              this.getProblemString = function() {
                var constraintString = this.constraints.map(function(el) {
                  return el.toString();
                }).join("\n");

                var regex = /var[0-9]+/g;
                var result;
                var varNames = []
                while (result = regex.exec(constraintString)) {
                  var varName = result[0];
                  if (varNames.indexOf(varName) == -1) {
                    varNames.push(varName)
                  }
                }
                var varDeclarationString = varNames.map((function(varName) {
                  return "(declare-fun " + varName + " () Real)";
                })).join("\n");

                var getValueString = "(check-sat) (get-value (" + varNames.join(" ") + "))";

                return [varDeclarationString, constraintString, getValueString].join("\n");
              };
              this.removeConstraint = function (c) {
                this.constraints.splice(this.constraints.indexOf(c), 1);
              };
              this.suggest = this.suggestValue = function (v, value) {
                var constraint = new z3.c.Equation(v, value);
                this.addConstraint(constraint);
                this.solve();
                this.removeConstraint(constraint);
              };

              this.addEditVar = function () {};
              this.addStay = function () {};
              this.removeStay = function () {};
              this.removeAllEditVars = function () {};
              this.beginEdit = function () {};
              this.endEdit = function () {};
            }
          };
          resolve(z3);
        }, memFileTimeOut);
      });
    });
  };
}));

},{"../loader":6}]},{},[4]);
