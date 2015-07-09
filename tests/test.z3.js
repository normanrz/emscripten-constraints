describe('Z3', function(){
    before(function(done){
        var self = this;
        this.timeout(20000); // 20s
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

            function run(problem, fileName) {
                if (!fileName) {
                    fileName = "problem.smt2";
                }

                var oldConsoleLog = console.log;
                var stdout = [];
                window.console.log = function(solution) {
                    stdout.push(solution);
                    oldConsoleLog.apply(console, arguments);
                }

                self.z3.FS.createDataFile("/", fileName, "(check-sat) " + problem, !0, !0);

                try {
                    self.z3.Module.callMain(["-smt2", "/" + fileName])
                } catch (exception) {
                    console.error("exception", exception);
                } finally {
                    self.z3.FS.unlink("/" + fileName)
                }

                window.console.log = oldConsoleLog;

                return stdout.join("")
            }

            var solution = run(problem);

            assert.isTrue(solution.indexOf("top0 500.0") > -1);
            assert.isTrue(solution.indexOf("top1 500.0") > -1);
        })
    });

    describe("API Layer", function() {
        it("should be able to construct the problem description", function() {
            var variableCounter = 0;
            var c = {
                Variable : function(opts) {
                    this.value = (opts || {}).value;
                    this.name = "var" + variableCounter++;
                    var _this = this;
                    this.toString = function() {
                        // return this.value || _this.name;
                        return _this.name;
                    }
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
                    return new c.Expression(exp1, "+", exp2);
                },
                minus : function(exp1, exp2) {
                    return new c.Expression(exp1, "-", exp2);
                },
                times : function(exp1, exp2) {
                    return new c.Expression(exp1, "*", exp2);
                },
                divide : function(exp1, exp2) {
                    return new c.Expression(exp1, "/", exp2);
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
                }
            }

            var v1 = new c.Variable({ value: 3 });
            var v2 = new c.Variable({ value: 4 });
            var ineq1 = new c.Inequality(v1, c.GEQ, v2);

            var e1 = c.minus(v1, 1);
            // plus times divide

            var eq1 = new c.Equation(e1, v2);
            // debugger;
            var s1 = new c.SimplexSolver();
            s1.addConstraint(eq1);
            var problemStr = s1.solve();
            console.log("problemStr",  problemStr);
        })
    })

})

