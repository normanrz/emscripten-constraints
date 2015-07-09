module("users.timfelgentreff.custom_solver").requires().toRun(function() {
    Object.subclass("CustomSolver", {
        loadModule: function(url) {
        },
        initialize: function(url) {
            this.loadModule(url);
            this.solver = new cassowary.SimplexSolver();
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
                var v = new cassowary.Variable({ value: value + 0 });
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
            return new cassowary.Equation(this, r).setSolver(this.solver);
        },
        cnGeq: function(r) {
            return new cassowary.Inequality(this, cassowary.GEQ, r).setSolver(this.solver);
        },
        cnLeq: function(r) {
            return new cassowary.Inequality(this, cassowary.LEQ, r).setSolver(this.solver);
        },
        isConstraintObject: true,
        cnIdentical: function(value) {
            return this.cnEquals(value);
        }      
    };

    extend(cassowary.Expression.prototype, ASTMixin);
    extend(cassowary.Equation.prototype, ASTMixin);
    extend(cassowary.Variable.prototype, ASTMixin);
    extend(cassowary.Inequality.prototype, ASTMixin);

    extend(cassowary.Variable.prototype, {
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
                this.solver.addStay(this);
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
            return cassowary.divide(this, r).setSolver(this.solver);
        },
        times: function(r) {
            return cassowary.times(this, r).setSolver(this.solver);
        },
        minus: function(r) {
            return cassowary.minus(this, r).setSolver(this.solver);
        },
        plus: function(r) {
            return cassowary.plus(this, r).setSolver(this.solver);
        }
    });

    extend(cassowary.Constraint.prototype, {
        enable: function() {
            this.solver.addConstraint(this);
        },
        disable: function() {
            this.solver.removeConstraint(this);
        }
    })
});
