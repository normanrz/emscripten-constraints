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
  return function loadRhea() {
    return new Promise(function(resolve, reject) {
      loadModule("rhea.wrapped.js", "/rhea/").then(function (rhea) {

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

          console.log("New object", self.constructor.name);
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
              solver.remove_constraint(c);
            } else {
              throw new TypeError("Invalid arguments");
            }
          };

          this.removeStay = function (c) {
            if (isVariable(c)) {
              solver.remove_stay(c);
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
