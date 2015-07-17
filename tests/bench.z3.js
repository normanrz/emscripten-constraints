describe('Z3 Benchmarks', function(){
  this.timeout("20s");
  before(function(done){
    var self = this;
    console.time("load z3");
    require(['../z3/module.z3'], function (loadZ3) {
      loadZ3().then(function(z3) {
        console.timeEnd("successfully loaded z3");
        self.z3 = z3;
        done();
      })
    });
  });

  describe("Run", function() {
    it("Multiple Constraints", function () {
      this._runnable.title += ": " + perfTest(function () {
        var z3 = this.z3;
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

        assert.isTrue(v1.value - 1 == v2.value);
        assert.isTrue(v1.value >= 2);

      }.bind(this));
    });

    it("Complex Constraint Set", function () {
      var z3 = this.z3;
      var c = z3.c;
      this._runnable.title += ": " + perfTest(function () {

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
        assert.isTrue(mercuryTop.value <= thermometerTop.value);
        assert.equal(mercuryBottom.value, thermometerBottom.value);
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
      });
    });

  });
});
