describe('Z3', function(){
    this.timeout("20s");
    before(function(done){
        var self = this;
        console.time("load z3");
        require(['../z3/module.z3'], function (loadZ3) {
          loadZ3(function(z3) {
            console.timeEnd("successfully loaded z3");
            self.z3 = z3;
            done();
          })
        });
    });

    describe('Properties', function(){
        it('Module present in z3', function(){
            assert.isTrue('Module' in this.z3);
        })
        it('FS present in z3', function(){
            assert.isTrue('FS' in this.z3);
        })
    });

    describe('Solving', function() {
        it('should solve simple constraints', function() {
            var self = this;
            var problem = [
                "(declare-fun top0 () Real)",
                "(declare-fun top1 () Real)",
                "(assert (= top0 top1))",
                "(assert (= top0 500))",
                "(check-sat) (get-value (top0 top1))"
            ].join(" ");

            var solution = this.z3.solveProblem(problem);

            assert.isTrue(solution.indexOf("top0 500.0") > -1);
            assert.isTrue(solution.indexOf("top1 500.0") > -1);
        });

        it("should solve a complex constraint set", function () {
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
            })
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
          }.bind(this), 10);
        });
    });

    describe("API Layer", function() {
        it("should be able to construct the problem description", function() {
            var z3 = this.z3;
            var c = z3.c;

            var v1 = new c.Variable();
            var v2 = new c.Variable();
            // v1 >= v2
            var ineq1 = new c.Inequality(v1, c.GEQ, v2);

            var e1 = c.minus(v1, 1);
            // v1 - 1 = v2
            var eq1 = new c.Equation(e1, v2);
            var s1 = new c.SimplexSolver();
            s1.addConstraint(eq1);
            s1.addConstraint(ineq1);

            s1.solve();

            assert.isTrue(v1.value >= v2.value);
            assert.isTrue(v1.value - 1 === v2.value);
        })
    })

})

