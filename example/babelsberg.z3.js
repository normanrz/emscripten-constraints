module("users.timfelgentreff.z3").requires().toRun(function() {
    var z3 = null;
    require(['../z3/module.z3'], function (loadZ3) {
        loadZ3('/z3/').then(function(_z3) {
            z3 = extendBindings(_z3.c);
        })
    });
    Object.subclass("Z3", {
        loadModule: function(url) {
        },
        initialize: function(url) {
            this.loadModule(url);
            this.solver = new z3.SimplexSolver();
            this.variables = [];
        },
        always: function(opts, func) {
            if (opts.priority) throw new Error("Not implemented: CustomSolver.always - Priority");
            func.varMapping = opts.ctx;
            var constraint = new Constraint(func, this);
            // constraint.enable();
            return constraint;
        },
        constraintVariableFor: function(value, ivarname, cvar) {
            if ("number" == typeof value || null === value || value instanceof Number) {
                var v = new z3.Variable({ value: value + 0 });
                v.setSolver(this.solver);
                v.name = ivarname + "" + this.variables.length;
                return v
            }
            return null
        },
        isConstraintObject: true,
        get strength() {
            throw new Error("Not implemented: CustomSolver.strength");
        },
        weight: 500,
        solveOnce: function(c) {
            this.solver.addConstraint(c);
            try {
                this.solve()
            } finally {
                this.solver.removeConstraint(c)
            }
        },
        removeVariable: function(v) {
            throw new Error("Not implemented: CustomSolver.removeVariable");
        },
        addVariable: function(v, cvar) {
            this.variables.push(v);
        },
        addConstraint: function(c) {
            this.solver.addConstraint(c);
        },
        removeConstraint: function(c) {
            throw new Error("Not implemented: CustomSolver.removeConstraint");
        },
        solve: function() {
            this.solver.solve();
        }
    });

    function extendBindings(binding) {

        function extend(target, mixin) {
            for(var key in mixin) {
                if (mixin.hasOwnProperty(key)) {
                    target[key] = mixin[key];
                }
            }
            return target;
        }
        var ASTMixin = {
            setSolver: function (solver) {
                this.solver = solver;
                return this;
            },
            cnEquals: function(r) {
                return new binding.Equation(this, r).setSolver(this.solver);
            },
            cnGeq: function(r) {
                return new binding.Inequality(this, binding.GEQ, r).setSolver(this.solver);
            },
            cnLeq: function(r) {
                return new binding.Inequality(this, binding.LEQ, r).setSolver(this.solver);
            },
            isConstraintObject: true,
            cnIdentical: function(value) {
                return this.cnEquals(value);
            }
        };

        extend(binding.Expression.prototype, ASTMixin);
        extend(binding.Equation.prototype, ASTMixin);
        extend(binding.Variable.prototype, ASTMixin);
        extend(binding.Inequality.prototype, ASTMixin);

        extend(binding.Variable.prototype, {
            stay: function() {
                this.solver.addStay(this);
            },
            removeStay: function() {
                throw new Error("Not implemented: Variable.removeStay");
            },
            suggestValue: function(value) {
                if (value !== this.value) {
                    this.solver.addEditVar(this);
                    this.solver.beginEdit();
                    this.solver.suggestValue(this, value);
                    this.solver.endEdit();
                    this.solver.removeAllEditVars();
                }
            },
            prepareEdit: function() {
                solver.addEditVar(this);
                solver.beginEdit();
            },
            finishEdit: function() {
                solver.endEdit();
            },
            setReadonly: function (bool) {

            },
            isReadonly: function (bool) {
                return false;
            },
            divide: function(r) {
                return binding.divide(this, r).setSolver(this.solver);
            },
            times: function(r) {
                return binding.times(this, r).setSolver(this.solver);
            },
            minus: function(r) {
                return binding.minus(this, r).setSolver(this.solver);
            },
            plus: function(r) {
                return binding.plus(this, r).setSolver(this.solver);
            }
        });

        // extend(binding.Constraint.prototype, {
        //     enable: function() {
        //         this.solver.addConstraint(this);
        //     },
        //     disable: function() {
        //         this.solver.removeConstraint(this);
        //     }
        // });

        extend(binding.Equation.prototype, {
            enable: function() {
                this.solver.addConstraint(this);
            },
            disable: function() {
                this.solver.removeConstraint(this);
            }
        });

        extend(binding.Inequality.prototype, {
            enable: function() {
                this.solver.addConstraint(this);
            },
            disable: function() {
                this.solver.removeConstraint(this);
            }
        });

        return binding;
    }
});
