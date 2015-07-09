describe("Cassowary-js", function () {
  describe("Run", function () {
    it("should solve an equation", function () {
      var v1 = new c.Variable({ value: 3 });
      var v2 = new c.Variable({ value: 2 });
      var e1 = c.minus(v1, 1);
      var eq1 = new c.Equation(e1, v2);

      var s1 = new c.SimplexSolver();
      s1.addConstraint(eq1);
      s1.solve();
      console.log(v1.value, v2.value);
      assert.isTrue(v1.value - 1 == v2.value);
    });

    it("should solve an inequality", function () {
      var v1 = new c.Variable({ value: 3 });
      var v2 = new c.Variable({ value: 4 });
      var eq1 = new c.Inequality(v1, c.GEQ, v2);

      var s1 = new c.SimplexSolver();
      s1.addConstraint(eq1);
      s1.solve();
      assert.isTrue(v1.value >= v2.value);
    });

    it("should solve multiple constraints", function () {
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

      assert.isTrue(v1.value - 1 == v2.value);
      assert.isTrue(v1.value >= 2);
    });

    it("should benchmark solving multiple constraints", function () {
      this._runnable.title += ": " + perfTest(function () {
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

        assert.isTrue(v1.value - 1 == v2.value);
        assert.isTrue(v1.value >= 2);
      });

    });

    it("should solve a complex constraint set", function () {
      this._runnable.title += ": " + perfTest(function () {
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
      }.bind(this));
    });

  });
});