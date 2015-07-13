module("users.timfelgentreff.z3.NaClZ3").requires().toRun(function() {
    Object.subclass("NaCLZ3", {
        loadModule: function(url) {
            var owner, bounds;
            this.embedMorph ? (owner = this.embedMorph.owner, bounds = this.embedMorph.getBounds(), this.embedMorph.remove()) : (owner = $world, bounds = lively.rect(0, 0, 50, 50)), this.uuid || (this.uuid = (new UUID).id), this.url = url || NaCLZ3.url, this.embedMorph = new lively.morphic.HtmlWrapperMorph(bounds.extent()), this.embedMorph.setHTML('<div id="' + this.uuid + '">            <embed name="nacl_module"                id="' + this.uuid + 'z3"                width=0 height=0                src="' + this.url + '/z3.nmf"                type="application/x-nacl" />        </div>'), this.embedMorph.setPosition(bounds.topLeft()), this.embedMorph.name = "Z3Module", owner.addMorph(this.embedMorph), this.embedMorph.module = this;
            var listener = document.getElementById(this.uuid);
            listener.addEventListener("load", this.moduleDidLoad.bind(this), !0), listener.addEventListener("message", this.handleMessage.bind(this), !0), listener.addEventListener("crash", function() {
                alert("Z3 crashed, reloading."), this.loadModule(url)
            }.bind(this), !0)
        },
        moduleDidLoad: function() {
            alertOK("NaCLZ3 loaded"), this.module = document.getElementById(this.uuid + "z3"), this.solve()
        },
        get isLoaded() {
            return !!this.module
        },
        handleMessage: function(message) {
            console.log(message.data), this.applyResults(message.data)
        },
        applyResults: function(rawData) {
            var data = rawData.replace(/{([a-z]+):/g, '{"$1":').replace(/'/g, '"').replace(/\n/g, ","),
                response = JSON.parse(data.replace(/^{([a-z]):/, '{"":'));
            if (response.info) console.log(response.info);
            else {
                if (response.error) throw response.error;
                if (response.result) {
                    var assignments = response.result.split(",").map(function(str) {
                        var both = str.split("->");
                        if (2 === both.length) {
                            var name = both[0].trim(),
                                value = this.parseAndEvalSexpr(both[1].trim(), name);
                            if (isNaN(value)) throw "Error assigning result " + both[1].trim();
                            return {
                                name: name,
                                value: value
                            }
                        }
                    }.bind(this)).compact();
                    assignments.each(function(a) {
                        this.varsByName[a.name].value = a.value, this.cvarsByName[a.name].suggestValue(a.value)
                    }.bind(this))
                }
            }
        },
        parseAndEvalSexpr: function(sexp, varName) {
            if (sexp) {
                var variable = this.varsByName[varName];
                if (variable && variable.isString) return sexp;
                var dom = variable && variable._domain;
                if (dom) {
                    if ("C" !== sexp.charAt(0)) throw new Error("Expected a domain value");
                    var value = dom[parseInt(sexp.slice(1))];
                    return value
                }
                var fl = parseFloat(sexp);
                if (!isNaN(fl)) return fl;
                for (var atomEnd = [" ", '"', "'", ")", "(", "", "\n", "\r", "\f", " "], stack = [], atom = [], i = 0, length = sexp.length; length > i;) {
                    var c = sexp[i],
                        reading_tuple = atom.length > 0;
                    if (reading_tuple) - 1 !== atomEnd.indexOf(c) ? (stack[stack.length - 1].push(atom.join("")), atom = [], i -= 1) : atom.push(c);
                    else if ("(" == c) stack.push([]);
                    else if (")" == c) {
                        var pred = stack.length - 2;
                        if (!(pred >= 0)) return this.evaluateSexpr(stack.pop());
                        stack[pred].push(String(this.evaluateSexpr(stack.pop())))
                    } else null !== c.match(/\s/) || atom.push(c);
                    i += 1
                }
                throw "NotImplementedError(whatever this is) " + sexp
            }
        },
        evaluateSexpr: function(l) {
            var op = l[0],
                self = this,
                args = l.slice(1, l.length).map(function(arg) {
                    return self.evalFloat(arg)
                });
            switch (op) {
                case "sin":
                    return Math.sin(args[0]);
                case "cos":
                    return Math.cos(args[0]);
                case "tan":
                    return Math.tan(args[0]);
                case "asin":
                    return Math.asin(args[0]);
                case "acos":
                    return Math.acos(args[0]);
                case "atan":
                    return Math.atan(args[0]);
                case "+":
                    return args[0] + args[1];
                case "-":
                    return 1 == args.length ? -args[0] : args[0] - args[1];
                case "*":
                    return args[0] * args[1];
                case "/":
                    return args[0] / args[1];
                case "^":
                    return Math.pow(args[0], args[1]);
                case "root-obj":
                    return args[0];
                default:
                    throw op + " in sexprs returned from Z3"
            }
        },
        evalFloat: function(arg) {
            if (arg.match(/\//)) {
                var nomden = arg.split("/");
                return parseFloat(nomden[0]) / parseFloat(nomden[1])
            }
            return parseFloat(arg)
        },
        postMessage: function(string) {
            this.isLoaded ? (console.log(string), this.module.postMessage("(set-option :pp.decimal true)\n(set-option :model true)" + string)) : alert("Z3 not ready, will solve when loaded.")
        },
        initialize: function(url) {
            this.loadModule(url), this.variables = [], this.cvarsByName = {}, this.varsByName = {}, this.constraints = [], this.domains = [], this.domainsByName = {}
        },
        always: function(opts, func) {
            if (opts.priority) throw "soft constraints not implemented for Z3";
            func.varMapping = opts.ctx;
            var constraint = new Constraint(func, this);
            return constraint.enable(), constraint
        },
        constraintVariableFor: function(value, ivarname, cvar) {
            if ("number" == typeof value || null === value || value instanceof Number) {
                var name = ivarname + "" + this.variables.length,
                    v = new NaCLZ3Variable(name, value + 0, this);
                return this.addVariable(v, cvar), v
            }
            return null
        },
        isConstraintObject: function() {
            return !0
        },
        get strength() {
            throw "strength (and soft constraints) not implemented for Z3, yet"
        },
        weight: 500,
        solveOnce: function(c) {
            this.addConstraint(c);
            try {
                this.solve()
            } finally {
                this.removeConstraint(c)
            }
        },
        removeVariable: function(v) {
            this.variables.remove(v), delete this.cvarsByName[v.name], delete this.varsByName[v.name]
        },
        addVariable: function(v, cvar) {
            this.variables.push(v), this.cvarsByName[v.name] = cvar, this.varsByName[v.name] = v
        },
        addDomain: function(array) {
            var dom = this.domains.detect(function(ary) {
                return ary.equals(array)
            });
            return dom || (dom = array.uniq(), this.domains.push(dom)), dom.$z3name = "Dom" + this.domains.indexOf(dom), this.domainsByName[dom.$z3name] = dom, dom
        },
        addConstraint: function(c) {
            this.constraints.push(c)
        },
        removeConstraint: function(c) {
            this.constraints.remove(c)
        },
        solve: function() {
            var decls = this.printDeclarations(),
                constraints = this.printConstraints(),
                domains = this.printDomains();
            return this.postMessage(domains + decls + constraints), decls + constraints
        },
        printDeclarations: function() {
            return [""].concat(this.variables).reduce(function(acc, v) {
                return acc + "\n" + v.printDeclaration()
            })
        },
        printDomains: function() {
            var i = -1;
            return ["\n"].concat(this.domains).reduce(function(acc, d) {
                return acc + "\n" + ["(declare-datatypes () ((" + d.$z3name].concat(d).reduce(function(accD) {
                    return i++, accD + " C" + i
                }) + ")))"
            })
        },
        printConstraints: function() {
            return ["\n"].concat(this.constraints).reduce(function(acc, c) {
                return acc + "\n(assert " + c.print() + ")"
            })
        }
    }), URL && URL.codeBase && URL.codeBase.withFilename ? NaCLZ3.url = URL.codeBase.withFilename(module("users.timfelgentreff.z3.NaClZ3").relativePath()).dirname() : NaCLZ3.__defineGetter__("url", function() {
        throw "Standalone deployment must provide the URL to the Native client module as NaCLZ3.url"
    }), Object.subclass("NaCLZ3Ast", {
        cnEquals: function(r) {
            return new NaCLZ3BinaryExpression("=", this, r, this.solver)
        },
        cnNeq: function(r) {
            return new NaCLZ3UnaryExpression("not", new NaCLZ3BinaryExpression("=", this, r, this.solver), this.solver)
        },
        cnGeq: function(r) {
            return new NaCLZ3BinaryExpression(">=", this, r, this.solver)
        },
        cnGreater: function(r) {
            return new NaCLZ3BinaryExpression(">", this, r, this.solver)
        },
        cnLeq: function(r) {
            return new NaCLZ3BinaryExpression("<=", this, r, this.solver)
        },
        cnLess: function(r) {
            return new NaCLZ3BinaryExpression("<", this, r, this.solver)
        },
        divide: function(r) {
            return new NaCLZ3BinaryExpression("/", this, r, this.solver)
        },
        times: function(r) {
            return new NaCLZ3BinaryExpression("*", this, r, this.solver)
        },
        sin: function() {
            return this.minus(this.pow(3).divide(6)).plus(this.pow(5).divide(120)).minus(this.pow(7).divide(5040)).plus(this.pow(9).divide(362880)).minus(this.pow(11).divide(39916800)).plus(this.pow(13).divide(6227020800)).minus(this.pow(15).divide(13076744e5)).plus(this.pow(17).divide(35568743e7))
        },
        cos: function() {
            return this.plus(Math.PI / 2).sin()
        },
        minus: function(r) {
            return new NaCLZ3BinaryExpression("-", this, r, this.solver)
        },
        print: function() {
            throw "my subclass should have overridden `print'"
        },
        plus: function(r) {
            return new NaCLZ3BinaryExpression("+", this, r, this.solver)
        },
        pow: function(r) {
            return new NaCLZ3BinaryExpression("^", this, r, this.solver)
        },
        cnAnd: function(r) {
            return new NaCLZ3BinaryExpression("and", this, r, this.solver)
        },
        cnOr: function(r) {
            return new NaCLZ3BinaryExpression("or", this, r, this.solver)
        },
        isConstraintObject: function() {
            return !0
        }
    }), NaCLZ3Ast.subclass("NaCLZ3Variable", {
        initialize: function(name, value, solver) {
            this.name = name, this.value = value, this.solver = solver
        },
        stay: function() {
            throw "stay constraints not implemented for Z3 (yet)"
        },
        removeStay: function() {},
        suggestValue: function(value) {
            if (value !== this.value) {
                var c = this.cnEquals(value);
                this.solver.solveOnce(c)
            }
        },
        setReadonly: function(bool) {
            if (bool && !this.readonlyConstraint) {
                var cn = this.cnEquals(this.value);
                return this.solver.addConstraint(cn), this.readonlyConstraint = cn, cn
            }!bool && this.readonlyConstraint && (this.solver.removeConstraint(this.readonlyConstraint), this.readonlyConstraint = void 0)
        },
        isReadonly: function() {
            return !!this.readonlyConstraint
        },
        cnIn: function(domain) {
            return this.setDomain(domain), new NaCLZ3EmptyExpression(this, this.solver)
        },
        setDomain: function(domain) {
            if (this._domain && (this._domain = this._domain.intersect(domain), 0 === this._domain.length)) throw new Error("Domain intersection is empty");
            this._domain = domain, this._domain = this.solver.addDomain(this._domain)
        },
        cnIdentical: function(value) {
            return this._domain && !value.isConstraintObject ? this.cnEquals("C" + this._domain.indexOf(value)) : this.cnEquals(value)
        },
        cnNotIdentical: function(value) {
            return new NaCLZ3UnaryExpression("not", this.cnIdentical(value), this.solver)
        },
        print: function() {
            return this.name
        },
        printDeclaration: function() {
            return this.isString ? "(declare-variable " + this.name + " String)" : this._domain ? "(declare-fun " + this.name + " () " + this._domain.$z3name + ")" : "(declare-fun " + this.name + " () Real)"
        },
        prepareEdit: function() {
            throw "Z3 does not support editing"
        },
        finishEdit: function() {
            throw "Z3 does not support editing"
        }
    }), NaCLZ3Ast.subclass("NaCLZ3Constant", {
        initialize: function(value, solver) {
            this.value = value, this.solver = solver
        },
        print: function() {
            return "" + this.value
        }
    }), NaCLZ3Ast.subclass("NaCLZ3Constraint", {
        enable: function() {
            this.solver.addConstraint(this)
        },
        disable: function() {
            this.solver.removeConstraint(this)
        }
    }), NaCLZ3Constraint.subclass("NaCLZ3BinaryExpression", {
        initialize: function(op, left, right, solver) {
            this.solver = solver, this.op = op, this.left = this.z3object(left), this.right = this.z3object(right)
        },
        z3object: function(obj) {
            return obj instanceof NaCLZ3Ast ? obj : new NaCLZ3Constant(obj, this.solver)
        },
        print: function() {
            return "(" + this.op + " " + this.left.print() + " " + this.right.print() + ")"
        }
    }), NaCLZ3BinaryExpression.subclass("NaCLZ3TertiaryExpression", {
        initialize: function(op, first, second, third, solver) {
            this.solver = solver, this.op = op, this.first = this.z3object(first), this.second = this.z3object(second), this.third = this.z3object(third)
        },
        print: function() {
            return "(" + this.op + " " + this.first.print() + " " + this.second.print() + " " + this.third.print() + ")"
        }
    }), NaCLZ3Constraint.subclass("NaCLZ3UnaryExpression", {
        initialize: function(op, arg, solver) {
            this.solver = solver, this.op = op, this.arg = arg
        },
        print: function() {
            return "(" + this.op + " " + this.arg.print() + ")"
        }
    }), NaCLZ3Constraint.subclass("NaCLZ3EmptyExpression", {
        initialize: function(variable, solver) {
            this.solver = solver, this.variable
        },
        print: function() {
            return "(= 1 1)"
        }
    })
}), lively.ide = lively.ide || {}, lively.ide.CommandLineInterface || (lively.ide.CommandLineInterface = {
    run: function(commandString, options, thenDo) {
        if (CommandLineInterface.run) return CommandLineInterface.run(commandString, options, thenDo);
        throw "The deployment should have defined CommandLineInterface.run"
    },
    runAll: function(commandSpecs, thenDo) {
        if (CommandLineInterface.runAll) return CommandLineInterface.runAll(commandSpecs, thenDo);
        throw "The deployment should have defined CommandLineInterface.runAll"
    },
    cwd: function() {
        if (CommandLineInterface.cwd) return CommandLineInterface.cwd();
        throw "The deployment should have defined CommandLineInterface.cwd"
    }
}), module("users.timfelgentreff.z3.CommandLineZ3").requires("users.timfelgentreff.z3.NaClZ3", "lively.ide.CommandLineInterface").toRun(function() {
    NaCLZ3.subclass("CommandLineZ3", {
        loadModule: function() {},
        get strength() {
            return {
                required: void 0,
                strong: 10,
                medium: 5,
                weak: 1
            }
        },
        postMessage: function(string) {
            string = "(set-option :pp.decimal true)\n" + string + ("\n(check-sat)\n(get-value (" + this.variables.inject("", function(acc, v) {
                return acc + v.name + " "
            }) + "))");
            var commandString = this.constructor.z3Path + ".sh";
            if (this.sync) {
                var r = lively.ide.CommandLineInterface.run(commandString, {
                    sync: this.sync,
                    stdin: string
                });
                this.applyResult(r.getStdout() + r.getStderr())
            } else lively.ide.CommandLineInterface.run(commandString, {
                sync: this.sync,
                stdin: string
            }, function(r) {
                this.applyResult(r.getStdout() + r.getStderr())
            }.bind(this))
        },
        initialize: function($super, sync) {
            this.sync = !0, $super()
        },
        applyResult: function(result) {
            if (result = result.replace(/ ?\|->.*\n/m, ""), result = result.replace(/\(error.*\n/m, ""), !result.startsWith("sat")) throw result.startsWith("unsat") ? new Error("Unsatisfiable constraint system") : new Error("Z3 failed to solve this system");
            var idx = result.indexOf("sat\n");
            result = result.slice(idx + "sat".length, result.length - 1), result = result.trim().slice(1, result.length - 1);
            var assignments = result.split("\n").map(function(str) {
                var both = str.trim().slice(1, str.length - 1).split(" ");
                if (!(both.length < 2)) {
                    both = [both[0].trim(), both.slice(1, both.length).join(" ").trim()];
                    var name = both[0],
                        value = this.parseAndEvalSexpr(both[1], name);
                    return {
                        name: name,
                        value: value
                    }
                }
            }.bind(this));
            assignments.each(function(a) {
                this.varsByName[a.name].value = a.value, this.varsByName[a.name].updateStay(), this.sync || this.cvarsByName[a.name].suggestValue(a.value)
            }.bind(this))
        },
        printConstraints: function() {
            return ["\n"].concat(this.constraints).reduce(function(acc, c) {
                return c.strength ? acc + "\n(assert-soft " + c.print() + " :weight " + c.strength + ")" : acc + "\n(assert " + c.print() + ")"
            })
        },
        constraintVariableFor: function($super, value, ivarname, cvar) {
            var cvar = $super(value, ivarname, cvar);
            return cvar && this.constructor === CommandLineZ3 && cvar.stay(), cvar
        },
        always: function($super, opts, func) {
            var prio = opts.priority;
            (prio instanceof String || "string" == typeof prio) && (prio = this.strength[prio]), delete opts.priority;
            var result = cop.withLayers([CommandLineZ3Layer], function() {
                return $super(opts, func)
            });
            return prio && prio !== this.strength.required && (result.priority = prio), result
        }
    }), window.Config && window.Config.codeBase ? (Object.extend(CommandLineZ3, {
        modulePath: module("users.timfelgentreff.z3.CommandLineZ3").relativePath().replace("CommandLineZ3.js", "")
    }), Object.extend(CommandLineZ3, {
        z3Path: lively.ide.CommandLineInterface.cwd() + "/" + Config.codeBase.replace(Config.rootPath, "") + CommandLineZ3.modulePath + "z3"
    })) : Object.extend(CommandLineZ3, {get z3Path() {
            return CommandLineZ3Path ? CommandLineZ3Path : (console.error("Standalone deployment must define CommandLineZ3Path"), void 0)
        }
    }), cop.create("CommandLineZ3Layer").refineObject(Global, {get NaCLZ3Variable() {
            return CommandLineZ3Variable
        }
    }).refineClass(NaCLZ3Constraint, {
        enable: function(strength) {
            this.strength = strength, this.solver.addConstraint(this)
        }
    }), NaCLZ3Variable.subclass("CommandLineZ3Variable", {
        stay: function(strength) {
            strength = strength || this.solver.strength.weak, this._stayCn || (this._stayCn = new NaCLZ3BinaryExpression("=", this, this.value, this.solver), this._stayCn.strength = strength, this.solver.addConstraint(this._stayCn))
        },
        removeStay: function() {
            this._stayCn && (this._stayCn.disable(), delete this._stayCn)
        },
        updateStay: function() {
            if (this._stayCn) {
                var s = this._stayCn.strength;
                this.solver.removeConstraint(this._stayCn), this._stayCn = new NaCLZ3BinaryExpression("=", this, this.value, this.solver), this._stayCn.strength = s, this.solver.addConstraint(this._stayCn)
            }
        },
        cnIn: function($super, domain) {
            return this.removeStay(), $super(domain)
        }
    })
}), module("users.timfelgentreff.z3.emz3.EmZ3").requires("users.timfelgentreff.z3.NaClZ3").toRun(function() {
    NaCLZ3.subclass("EmZ3", {
        initialize: function($super) {
            $super();
            var prefixUrl, errlines = [];
            try {
                throw new Error
            } catch (e) {
                errlines = e.stack.split("\n")
            }
            for (var i = 0; i < errlines.length; i++) {
                var match = /((?:https?|file):\/\/.+\/)EmZ3.js/.exec(errlines[i]);
                if (match) {
                    prefixUrl = match[1];
                    break
                }
            }
            for (var i = 0; i < errlines.length; i++) {
                var match = /((?:https?|file):\/\/.+\/)babelsberg.z3.js/.exec(errlines[i]);
                if (match) {
                    prefixUrl = match[1];
                    break
                }
            }
            if (!prefixUrl) {
                if (!module("users.timfelgentreff.z3.emz3.EmZ3").uri()) throw "Could not determine em-z3 uri";
                prefixUrl = module("users.timfelgentreff.z3.emz3.EmZ3").uri().replace("EmZ3.js", "")
            }
            var self = this,
                request = new XMLHttpRequest;
            request.onreadystatechange = function() {
                var DONE = request.DONE || 4;
                if (request.readyState === DONE) {
                    var Module = {};
                    self.Module = Module, Module.TOTAL_MEMORY = 134217728, Module.memoryInitializerPrefixURL = prefixUrl, Module.arguments = ["-smt2", "problem.smt2"], Module.noInitialRun = !0, Module.noExitRuntime = !0, Module.stderr = function(x) {
                        self.stderr(x)
                    }, console.log("evaluating asmjs code..."), eval(request.responseText), self.FS = FS
                }
            }, request.open("GET", prefixUrl + "z3.js", !1), request.send()
        },
        loadModule: function() {},
        run: function(code) {
            var self = this;
            this.stdout = [], this.FS.createDataFile("/", "problem.smt2", "(check-sat)" + code, !0, !0);
            try {
                var oldlog = console.log;
                console.log = function() {
                    self.stdout.push.apply(self.stdout, arguments), oldlog.apply(console, arguments)
                }, this.Module.callMain(["-smt2", "/problem.smt2"])
            } finally {
                console.log = oldlog, this.FS.unlink("/problem.smt2")
            }
            return this.stdout.join("")
        },
        stdin: function() {},
        stdout: function(c) {
            this.stdout.push(String.fromCharCode(c))
        },
        stderr: function(c) {
            this.stdout.push(String.fromCharCode(c))
        },
        applyResults: function(result) {
            if (result = result.replace(/\(error.*\n/m, "").replace(/^WARNING.*\n/m, ""), !result.startsWith("sat")) throw result.startsWith("unsat") ? "Unsatisfiable constraint system" : "Z3 failed to solve this system";
            var idx = result.indexOf("sat");
            result = result.slice(idx + "sat".length, result.length), result = result.trim().slice(2, result.length - 2);
            var assignments = result.split(/\)\s+\(/m).map(function(str) {
                var both = str.trim().split(" ");
                if (!(both.length < 2)) {
                    both = [both[0].trim(), both.slice(1, both.length).join(" ").trim()];
                    var name = both[0],
                        value = this.parseAndEvalSexpr(both[1], both[0]);
                    return {
                        name: name,
                        value: value
                    }
                }
            }.bind(this));
            assignments.each(function(a) {
                this.varsByName[a.name].value = a.value
            }.bind(this))
        },
        postMessage: function(string) {
            string = string.replace(/\n/g, " ") + ("(check-sat)(get-value (" + this.variables.inject("", function(acc, v) {
                return acc + v.name + " "
            }) + "))"), this.applyResults(this.run(string).replace("sat", ""))
        }
    })
});