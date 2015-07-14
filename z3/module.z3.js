define(["../loader"], function(loadModule) {
  return function loadZ3(cb) {
    loadModule("z3.wrapped.js", "/z3/", function(z3) {
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
            oldConsoleLog.apply(console, arguments);
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

        cb(z3);
      }, memFileTimeOut);
    });
  };
});
