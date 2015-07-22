var loadZ3 = require("../z3/module.z3");
var assert = require("assert");
var perfTest = require("./perf_test");

describe('Z3 Benchmarks', function(){
  var c = null;
  this.timeout("200s");

  before(function(done){
    console.time("load z3");
    loadZ3("/z3/").then(function(_z3) {
      console.timeEnd("successfully loaded z3");
      c = _z3.c;
      done();
    });
  });

  describe("Run", function() {

    it("Solve nothing", perfTest(function () {
      new c.SimplexSolver().solve();
    }));

    it("Multiple Constraints", perfTest(function () {
      var v1 = new c.Variable({ value: 0 });
      var v2 = new c.Variable({ value: 0 });

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

    it("Complex Drag Simulation", perfTest(function () {
      var mouseLocationY = new c.Variable({ value: 0 });
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
      for (var i = 0; i < constraints.length; i++) {
        solver.addConstraint(constraints[i]);
      }
      solver.solve();

      for (var i = 0; i <= 10; i++) {
        var eq = new c.Equation(mouseLocationY, i);
        solver.addConstraint(eq);
        solver.solve();
        assert.equal(mouseLocationY.value, i);
        solver.removeConstraint(eq);
      }

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

    it("dbAddSim", perfTest(function () {
      var x = new c.Variable();
      var y = new c.Variable();
      var z = new c.Variable();

      var constraints = [
        // o.x == o.z - o.y
        new c.Equation(x, c.minus(z, y)),
        // o.y == o.z - o.x
        new c.Equation(y, c.minus(z, x)),
        // o.z == o.x + o.y;
        new c.Equation(z, c.plus(x, y))
      ];

      var solver = new c.SimplexSolver();
      solver.addStay(x);
      solver.addEditVar(x);
      constraints.forEach(function (c) {
        solver.addConstraint(c);
      });

      for (var i = 0; i < 10; i++) {
        solver.suggestValue(x, i);
        // o.x + o.y == o.z
        assert.ok(x.value + y.value == z.value);
      }

    }));

    it("clAddSim", perfTest(function () {
      var x = new c.Variable();
      var y = new c.Variable();
      var z = new c.Variable();

      var solver = new c.SimplexSolver();
      solver.addStay(x);
      solver.addEditVar(x);
      // o.x + o.y == o.z
      solver.addConstraint(new c.Equation(c.plus(x,y), z));

      for (var i = 0; i < 10; i++) {
        solver.suggestValue(x, i);
        // o.x + o.y == o.z
        assert.ok(x.value + y.value == z.value);
      }

    }));

    it("clDrag2DSim", perfTest(function () {
      var mouseX = new c.Variable({ value: 100 });
      var mouseY = new c.Variable({ value: 100 });
      var wndW = new c.Variable({ value: 100 });
      var wndH = new c.Variable({ value: 100 });
      var comp1W = new c.Variable({ value: 70 });
      var comp1Display = new c.Variable({ value: 0 });
      var comp2W = new c.Variable({ value: 30 });
      var comp2Display = new c.Variable({ value: 0 });

      var constraints = [
        // wnd.w == mouse.x
        new c.Equation(wndW, mouseX),
        // wnd.h == mouse.y
        new c.Equation(wndH, mouseY),
        // wnd.w <= 400
        new c.Inequality(wndW, c.LEQ, 400),
        // wnd.h <= 250
        new c.Inequality(wndH, c.LEQ, 250),
        // comp1.w+comp2.w == wnd.w
        new c.Equation(c.plus(comp1W,comp2W), wndW),
        // comp1.display == wnd.w
        new c.Equation(comp1Display, wndW),
        // comp2.display == wnd.h
        new c.Equation(comp2Display, wndH)
      ];

      var solver = new c.SimplexSolver();
      solver.addStay(mouseX);
      solver.addEditVar(mouseX);
      solver.addStay(mouseY);
      solver.addEditVar(mouseY);
      constraints.forEach(function (c) {
        solver.addConstraint(c);
      });

      var sheer = 1;

      for(var i = 0; i < 10; i++) {
        var eq1 = new c.Equation(mouseX, 100+i);
        solver.addConstraint(eq1);
        solver.solve();
        assert.equal(mouseX.value, 100+i);

        if(i % sheer == 0) {
          var eq2 = new c.Equation(mouseY, 100+i);
          solver.addConstraint(eq2);
          solver.solve();
          assert.equal(mouseY.value, 100+i);
          solver.removeConstraint(eq2);
        }

        solver.removeConstraint(eq1);
      }

    }));

    it("clDrag2DSimFastX", perfTest(function () {
      var mouseX = new c.Variable({ value: 100 });
      var mouseY = new c.Variable({ value: 100 });
      var wndW = new c.Variable({ value: 100 });
      var wndH = new c.Variable({ value: 100 });
      var comp1W = new c.Variable({ value: 70 });
      var comp1Display = new c.Variable({ value: 0 });
      var comp2W = new c.Variable({ value: 30 });
      var comp2Display = new c.Variable({ value: 0 });

      var constraints = [
        // wnd.w == mouse.x
        new c.Equation(wndW, mouseX),
        // wnd.h == mouse.y
        new c.Equation(wndH, mouseY),
        // wnd.w <= 400
        new c.Inequality(wndW, c.LEQ, 400),
        // wnd.h <= 250
        new c.Inequality(wndH, c.LEQ, 250),
        // comp1.w+comp2.w == wnd.w
        new c.Equation(c.plus(comp1W,comp2W), wndW),
        // comp1.display == wnd.w
        new c.Equation(comp1Display, wndW),
        // comp2.display == wnd.h
        new c.Equation(comp2Display, wndH)
      ];

      var solver = new c.SimplexSolver();
      solver.addStay(mouseX);
      solver.addEditVar(mouseX);
      solver.addStay(mouseY);
      solver.addEditVar(mouseY);
      constraints.forEach(function (c) {
        solver.addConstraint(c);
      });

      var sheer = 3;

      for(var i = 0; i < 10; i++) {
        var eq1 = new c.Equation(mouseX, 100+i);
        solver.addConstraint(eq1);
        solver.solve();
        assert.equal(mouseX.value, 100+i);

        if(i % sheer == 0) {
          var eq2 = new c.Equation(mouseY, 100+i);
          solver.addConstraint(eq2);
          solver.solve();
          assert.equal(mouseY.value, 100+i);
          solver.removeConstraint(eq2);
        }

        solver.removeConstraint(eq1);
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
