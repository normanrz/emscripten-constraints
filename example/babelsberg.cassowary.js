module("users.timfelgentreff.cassowary.Hashtable").requires().toRun(function() {
    function hashObject(obj) {
        function safeToString(obj) {
            try {
                return String(obj)
            } catch (ex) {
                return Object.prototype.toString.call(obj)
            }
        }
        var hashCode;
        return "string" == typeof obj ? obj : typeof obj.hashCode == FUNCTION ? (hashCode = obj.hashCode(), "string" == typeof hashCode ? hashCode : hashObject(hashCode)) : typeof obj.toString == FUNCTION ? obj.toString() : safeToString(obj)
    }

    function equals_fixedValueHasEquals(fixedValue, variableValue) {
        return fixedValue.equals(variableValue)
    }

    function equals_fixedValueNoEquals(fixedValue, variableValue) {
        return typeof variableValue.equals == FUNCTION ? variableValue.equals(fixedValue) : fixedValue === variableValue
    }

    function createKeyValCheck(kvStr) {
        return function(kv) {
            if (null === kv) throw new Error("null is not a valid " + kvStr);
            if ("undefined" == typeof kv) throw new Error(kvStr + " must not be undefined")
        }
    }

    function searchBuckets(buckets, hash) {
        for (var bucket, i = buckets.length; i--;)
            if (bucket = buckets[i], hash === bucket[0]) return i;
        return null
    }

    function getBucketForHash(bucketsByHash, hash) {
        var bucket = bucketsByHash[hash];
        return bucket && bucket instanceof Bucket ? bucket : null
    }
    var FUNCTION = "function",
        arrayRemoveAt = typeof Array.prototype.splice == FUNCTION ? function(arr, idx) {
            arr.splice(idx, 1)
        } : function(arr, idx) {
            var itemsAfterDeleted, i, len;
            if (idx === arr.length - 1) arr.length = idx;
            else
                for (itemsAfterDeleted = arr.slice(idx + 1), arr.length = idx, i = 0, len = itemsAfterDeleted.length; len > i; ++i) arr[idx + i] = itemsAfterDeleted[i]
        },
        checkKey = createKeyValCheck("key"),
        checkValue = createKeyValCheck("value"),
        EXISTENCE = 0,
        ENTRY = 1,
        ENTRY_INDEX_AND_VALUE = 2;
    Object.subclass("Bucket", "default category", {
        initialize: function(hash, firstKey, firstValue, equalityFunction) {
            this[0] = hash, this.entries = [], this.addEntry(firstKey, firstValue), null !== equalityFunction && (this.getEqualityFunction = function() {
                return equalityFunction
            })
        },
        createBucketSearcher: function(mode) {
            var that = this;
            return function(key) {
                for (var entry, i = that.entries.length, equals = that.getEqualityFunction(key); i--;)
                    if (entry = that.entries[i], equals(key, entry[0])) switch (mode) {
                        case EXISTENCE:
                            return !0;
                        case ENTRY:
                            return entry;
                        case ENTRY_INDEX_AND_VALUE:
                            return [i, entry[1]]
                    }
                    return !1
            }
        },
        createBucketLister: function(entryProperty) {
            var that = this;
            return function(aggregatedArr) {
                for (var startIndex = aggregatedArr.length, i = 0, len = that.entries.length; len > i; ++i) aggregatedArr[startIndex + i] = that.entries[i][entryProperty]
            }
        },
        getEqualityFunction: function(searchValue) {
            return typeof searchValue.equals == FUNCTION ? equals_fixedValueHasEquals : equals_fixedValueNoEquals
        },
        getEntryForKey: function(key) {
            return this.createBucketSearcher(ENTRY)(key)
        },
        getEntryAndIndexForKey: function(key) {
            return this.createBucketSearcher(ENTRY_INDEX_AND_VALUE)(key)
        },
        removeEntryForKey: function(key) {
            var result = this.getEntryAndIndexForKey(key);
            return result ? (arrayRemoveAt(this.entries, result[0]), result[1]) : null
        },
        addEntry: function(key, value) {
            this.entries[this.entries.length] = [key, value]
        },
        keys: function(aggregatedArr) {
            return this.createBucketLister(0)(aggregatedArr)
        },
        values: function(aggregatedArr) {
            return this.createBucketLister(1)(aggregatedArr)
        },
        getEntries: function(entries) {
            for (var startIndex = entries.length, i = 0, len = this.entries.length; len > i; ++i) entries[startIndex + i] = this.entries[i].slice(0)
        },
        containsKey: function(key) {
            return this.createBucketSearcher(EXISTENCE)(key)
        },
        containsValue: function(value) {
            for (var i = this.entries.length; i--;)
                if (value === this.entries[i][1]) return !0;
            return !1
        }
    }), Object.subclass("Hashtable", "default category", {
        initialize: function(hashingFunctionParam, equalityFunctionParam) {
            this.hashingFunctionParam = hashingFunctionParam, this.equalityFunctionParam = equalityFunctionParam, this.hasCustomEqualityFunction = typeof equalityFunctionParam == FUNCTION, this.buckets = [], this.bucketsByHash = {}
        },
        hashingFunction: function(key) {
            return (typeof this.hashingFunctionParam == FUNCTION ? this.hashingFunctionParam : hashObject)(key)
        },
        equalityFunction: function(arg1, arg2) {
            return (this.hasCustomEqualityFunction ? equalityFunctionParam : function(a, b) {
                return a == b
            })(arg1, arg2)
        },
        put: function(key, value) {
            checkKey(key), checkValue(value);
            var bucket, bucketEntry, hash = this.hashingFunction(key),
                oldValue = null;
            return bucket = getBucketForHash(this.bucketsByHash, hash), bucket ? (bucketEntry = bucket.getEntryForKey(key), bucketEntry ? (oldValue = bucketEntry[1], bucketEntry[1] = value) : bucket.addEntry(key, value)) : (bucket = new Bucket(hash, key, value, this.hasCustomEqualityFunction ? this.equalityFunction : null), this.buckets[this.buckets.length] = bucket, this.bucketsByHash[hash] = bucket), oldValue
        },
        get: function(key) {
            checkKey(key);
            var hash = this.hashingFunction(key),
                bucket = getBucketForHash(this.bucketsByHash, hash);
            if (bucket) {
                var bucketEntry = bucket.getEntryForKey(key);
                if (bucketEntry) return bucketEntry[1]
            }
            return null
        },
        containsKey: function(key) {
            checkKey(key);
            var bucketKey = this.hashingFunction(key),
                bucket = getBucketForHash(this.bucketsByHash, bucketKey);
            return bucket ? bucket.containsKey(key) : !1
        },
        containsValue: function(value) {
            checkValue(value);
            for (var i = this.buckets.length; i--;)
                if (this.buckets[i].containsValue(value)) return !0;
            return !1
        },
        clear: function() {
            this.buckets.length = 0, this.bucketsByHash = {}
        },
        isEmpty: function() {
            return !this.buckets.length
        },
        createBucketAggregator: function(bucketFuncName) {
            var that = this;
            return function() {
                for (var aggregated = [], i = that.buckets.length; i--;) that.buckets[i][bucketFuncName](aggregated);
                return aggregated
            }
        },
        keys: function() {
            return this.createBucketAggregator("keys")()
        },
        values: function() {
            return this.createBucketAggregator("values")()
        },
        entries: function() {
            return this.createBucketAggregator("getEntries")()
        },
        remove: function(key) {
            checkKey(key);
            var bucketIndex, hash = this.hashingFunction(key),
                oldValue = null,
                bucket = getBucketForHash(this.bucketsByHash, hash);
            return bucket && (oldValue = bucket.removeEntryForKey(key), null !== oldValue && (bucket.entries.length || (bucketIndex = searchBuckets(this.buckets, hash), arrayRemoveAt(this.buckets, bucketIndex), delete this.bucketsByHash[hash]))), oldValue
        },
        size: function() {
            for (var total = 0, i = this.buckets.length; i--;) total += this.buckets[i].entries.length;
            return total
        },
        each: function(callback) {
            for (var entry, that = this, entries = that.entries(), i = entries.length; i--;) entry = entries[i], callback(entry[0], entry[1])
        },
        escapingEach: function(callback) {
            for (var entry, that = this, entries = that.entries(), i = entries.length, context = {}; i--;) {
                if (entry = entries[i], context = callback(entry[0], entry[1]), context && context.hasOwnProperty("return")) return context["return"];
                if (context && context.hasOwnProperty("retval")) return context.retval;
                if (context && context.hasOwnProperty("break")) break
            }
        },
        putAll: function(hashtable, conflictCallback) {
            for (var entry, key, value, thisValue, that = this, entries = hashtable.entries(), i = entries.length, hasConflictCallback = typeof conflictCallback == FUNCTION; i--;) entry = entries[i], key = entry[0], value = entry[1], hasConflictCallback && (thisValue = that.get(key)) && (value = conflictCallback(key, thisValue, value)), that.put(key, value)
        },
        clone: function() {
            var that = this,
                clone = new Hashtable(this.hashingFunctionParam, this.equalityFunctionParam);
            return clone.putAll(that), clone
        }
    })
}), module("users.timfelgentreff.cassowary.HashSet").requires("users.timfelgentreff.cassowary.Hashtable").toRun(function() {
    Object.subclass("HashSet", "default category", {
        initialize: function(hashingFunction, equalityFunction) {
            this.hashingFunction = hashingFunction, this.equalityFunction = equalityFunction, this.hashTable = new Hashtable(hashingFunction, equalityFunction)
        },
        add: function(o) {
            this.hashTable.put(o, !0)
        },
        addAll: function(arr) {
            for (var i = arr.length; i--;) this.hashTable.put(arr[i], !0)
        },
        values: function() {
            return this.hashTable.keys()
        },
        remove: function(o) {
            return this.hashTable.remove(o) ? o : null
        },
        contains: function(o) {
            return this.hashTable.containsKey(o)
        },
        clear: function() {
            this.hashTable.clear()
        },
        size: function() {
            return this.hashTable.size()
        },
        isEmpty: function() {
            return this.hashTable.isEmpty()
        },
        clone: function() {
            var h = new HashSet(this.hashingFunction, this.equalityFunction);
            return h.addAll(this.hashTable.keys()), h
        },
        intersection: function() {
            for (var val, intersection = new HashSet(this.hashingFunction, this.equalityFunction), values = this.hashSet.values(), i = values.length; i--;) val = values[i], this.hashTable.containsKey(val) && intersection.add(val);
            return intersection
        },
        union: function() {
            for (var val, union = this.clone(), values = this.hashSet.values(), i = values.length; i--;) val = values[i], this.hashTable.containsKey(val) || union.add(val);
            return union
        },
        isSubsetOf: function() {
            for (var values = this.hashTable.keys(), i = values.length; i--;)
                if (!this.hashSet.contains(values[i])) return !1;
            return !0
        },
        each: function(f) {
            for (var e = this.hashTable.keys(), i = e.length; i-- && i >= 0;) f(this.hashTable.keys()[i])
        },
        escapingEach: function(callback) {
            return this.hashTable.escapingEach(callback)
        }
    })
}), module("users.timfelgentreff.cassowary.DwarfCassowary").requires("users.timfelgentreff.cassowary.HashSet").toRun(function() {
    Object.extend(Global, {
        ExCLError: function() {
            return new Error("(ExCLError) An error has occured in CL")
        }
    }), Object.extend(ExCLError, {
        subclass: function(name, category, obj) {
            Global[name] = function() {
                return new Error(obj.description())
            }
        }
    }), ExCLError.subclass("ExCLConstraintNotFound", "default category", {
        description: function() {
            return "(ExCLConstraintNotFound) Tried to remove a constraint never added to the tableu"
        }
    }), ExCLError.subclass("ExCLInternalError", "default category", {
        initialize: function(s) {
            description_ = s
        },
        description: function() {
            return "(ExCLInternalError) " + description_
        }
    }), ExCLError.subclass("ExCLNonlinearExpression", "default category", {
        description: function() {
            return "(ExCLNonlinearExpression) The resulting expression would be nonlinear"
        }
    }), ExCLError.subclass("ExCLNotEnoughStays", "default category", {
        description: function() {
            return "(ExCLNotEnoughStays) There are not enough stays to give specific values to all variables"
        }
    }), ExCLError.subclass("ExCLRequiredFailure", "default category", {
        description: function() {
            return "(ExCLRequiredFailure) A required constraint cannot be satisfied"
        }
    }), ExCLError.subclass("ExCLTooDifficult", "default category", {
        description: function() {
            return "(ExCLTooDifficult) The constraints are too difficult to solve"
        }
    }), Object.subclass("ClSymbolicWeight", "default category", {
        initialize: function(w1, w2, w3) {
            this._values = new Array(w1, w2, w3)
        },
        times: function(n) {
            return new ClSymbolicWeight(this._values[0] * n, this._values[1] * n, this._values[2] * n)
        },
        divideBy: function(n) {
            return new ClSymbolicWeight(this._values[0] / n, this._values[1] / n, this._values[2] / n)
        },
        add: function(c) {
            return new ClSymbolicWeight(this._values[0] + c._values[0], this._values[1] + c._values[1], this._values[2] + c._values[2])
        },
        subtract: function(c) {
            return new ClSymbolicWeight(this._values[0] - c._values[0], this._values[1] - c._values[1], this._values[2] - c._values[2])
        },
        lessThan: function(c) {
            for (var i = 0; i < this._values.length; ++i) {
                if (this._values[i] < c._values[i]) return !0;
                if (this._values[i] > c._values[i]) return !1
            }
            return !1
        },
        lessThanOrEqual: function(c) {
            for (var i = 0; i < this._values.length; ++i) {
                if (this._values[i] < c._values[i]) return !0;
                if (this._values[i] > c._values[i]) return !1
            }
            return !0
        },
        equal: function(c) {
            for (var i = 0; i < this._values.length; ++i)
                if (this._values[i] != c._values[i]) return !1;
            return !0
        },
        greaterThan: function(c) {
            return !this.lessThanOrEqual(c)
        },
        greaterThanOrEqual: function(c) {
            return !this.lessThan(c)
        },
        isNegative: function() {
            return this.lessThan(ClSymbolicWeight.clsZero)
        },
        toDouble: function() {
            sum = 0, factor = 1, multiplier = 1e3;
            for (var i = this._values.length - 1; i >= 0; --i) sum += this._values[i] * factor, factor *= multiplier;
            return sum
        },
        toString: function() {
            return "[" + this._values[0] + "," + this._values[1] + "," + this._values[2] + "]"
        },
        cLevels: function() {
            return 3
        }
    }), ClSymbolicWeight.clsZero = new ClSymbolicWeight(0, 0, 0), Object.subclass("ClStrength", "default category", {
        initialize: function(name, symbolicWeight, w2, w3) {
            this._name = name, this._symbolicWeight = symbolicWeight instanceof ClSymbolicWeight ? symbolicWeight : new ClSymbolicWeight(symbolicWeight, w2, w3)
        },
        isRequired: function() {
            return this == ClStrength.required
        },
        toString: function() {
            return this._name + (this.isRequired() ? "" : ":" + this.symbolicWeight())
        },
        symbolicWeight: function() {
            return this._symbolicWeight
        },
        name: function() {
            return this._name
        },
        set_name: function(name) {
            this._name = name
        },
        set_symbolicWeight: function(symbolicWeight) {
            this._symbolicWeight = symbolicWeight
        }
    }), ClStrength.required = new ClStrength("<Required>", 1e3, 1e3, 1e3), ClStrength.strong = new ClStrength("strong", 1, 0, 0), ClStrength.medium = new ClStrength("medium", 0, 1, 0), ClStrength.weak = new ClStrength("weak", 0, 0, 1), Object.subclass("ClAbstractVariable", "default category", {
        initialize: function(a1, a2) {
            if (this.hash_code = ClAbstractVariable.iVariableNumber++, "string" == typeof a1 || null == a1) this._name = a1 || "v" + this.hash_code;
            else {
                var varnumber = a1,
                    prefix = a2;
                this._name = prefix + varnumber
            }
        },
        hashCode: function() {
            return this.hash_code
        },
        name: function() {
            return this._name
        },
        setName: function(name) {
            this._name = name
        },
        isDummy: function() {
            return !1
        },
        isExternal: function() {
            throw "abstract isExternal"
        },
        isPivotable: function() {
            throw "abstract isPivotable"
        },
        isRestricted: function() {
            throw "abstract isRestricted"
        },
        toString: function() {
            return "ABSTRACT[" + this._name + "]"
        }
    }), ClAbstractVariable.iVariableNumber = 1, ClAbstractVariable.subclass("ClVariable", "default category", {
        initialize: function($super, name_or_val, value) {
            this._name = "", this._value = 0, "string" == typeof name_or_val ? ($super(name_or_val), this._value = value || 0) : "number" == typeof name_or_val ? ($super(), this._value = name_or_val) : $super(), ClVariable._ourVarMap && (ClVariable._ourVarMap[this._name] = this)
        },
        isDummy: function() {
            return !1
        },
        isExternal: function() {
            return !0
        },
        isPivotable: function() {
            return !1
        },
        isRestricted: function() {
            return !1
        },
        toString: function() {
            return "[" + this.name() + ":" + this._value + "]"
        },
        value: function() {
            return this._value
        },
        set_value: function(value) {
            this._value = value
        },
        change_value: function(value) {
            this._value = value
        },
        setAttachedObject: function(o) {
            this._attachedObject = o
        },
        getAttachedObject: function() {
            return this._attachedObject
        }
    }), ClVariable.setVarMap = function(map) {
        this._ourVarMap = map
    }, ClVariable.getVarMap = function() {
        return this._ourVarMap
    }, ClAbstractVariable.subclass("ClDummyVariable", "default category", {
        initialize: function($super, name_or_val, prefix) {
            $super(name_or_val, prefix)
        },
        isDummy: function() {
            return !0
        },
        isExternal: function() {
            return !1
        },
        isPivotable: function() {
            return !1
        },
        isRestricted: function() {
            return !0
        },
        toString: function() {
            return "[" + this.name() + ":dummy]"
        }
    }), ClAbstractVariable.subclass("ClObjectiveVariable", "default category", {
        initialize: function($super, name_or_val, prefix) {
            $super(name_or_val, prefix)
        },
        isExternal: function() {
            return !1
        },
        isPivotable: function() {
            return !1
        },
        isRestricted: function() {
            return !1
        },
        toString: function() {
            return "[" + this.name() + ":obj]"
        }
    }), ClAbstractVariable.subclass("ClSlackVariable", "default category", {
        initialize: function($super, name_or_val, prefix) {
            $super(name_or_val, prefix)
        },
        isExternal: function() {
            return !1
        },
        isPivotable: function() {
            return !0
        },
        isRestricted: function() {
            return !0
        },
        toString: function() {
            return "[" + this.name() + ":slack]"
        }
    }), Object.subclass("ClPoint", "default category", {
        initialize: function(x, y, suffix) {
            this.x = x instanceof ClVariable ? x : null != suffix ? new ClVariable("x" + suffix, x) : new ClVariable(x), this.y = y instanceof ClVariable ? y : null != suffix ? new ClVariable("y" + suffix, y) : new ClVariable(y)
        },
        SetXY: function(x, y) {
            x instanceof ClVariable ? this.x = x : this.x.set_value(x), y instanceof ClVariable ? this.y = y : this.y.set_value(y)
        },
        X: function() {
            return this.x
        },
        Y: function() {
            return this.y
        },
        Xvalue: function() {
            return this.x.value()
        },
        Yvalue: function() {
            return this.y.value()
        },
        toString: function() {
            return "(" + this.x + ", " + this.y + ")"
        }
    }), Object.subclass("ClLinearExpression", "default category", {
        initialize: function(clv, value, constant) {
            CL.fGC && print("new ClLinearExpression"), this._constant = constant || 0, this._terms = new Hashtable, clv instanceof ClAbstractVariable ? this._terms.put(clv, value || 1) : "number" == typeof clv && (this._constant = clv)
        },
        initializeFromHash: function(constant, terms) {
            return CL.fGC && print("clone ClLinearExpression"), this._constant = constant, this._terms = terms.clone(), this
        },
        multiplyMe: function(x) {
            var that = this;
            return this._constant *= x, this._terms.each(function(clv, coeff) {
                that._terms.put(clv, coeff * x)
            }), this
        },
        clone: function() {
            return (new ClLinearExpression).initializeFromHash(this._constant, this._terms)
        },
        times: function(x) {
            if ("number" == typeof x) return this.clone().multiplyMe(x);
            if (this.isConstant()) return x.times(this._constant);
            if (x.isConstant()) return this.times(x._constant);
            throw new ExCLNonlinearExpression
        },
        plus: function(expr) {
            return expr instanceof ClLinearExpression ? this.clone().addExpression(expr, 1) : expr instanceof ClVariable ? this.clone().addVariable(expr, 1) : void 0
        },
        minus: function(expr) {
            return expr instanceof ClLinearExpression ? this.clone().addExpression(expr, -1) : expr instanceof ClVariable ? this.clone().addVariable(expr, -1) : void 0
        },
        divide: function(x) {
            if ("number" == typeof x) {
                if (CL.approx(x, 0)) throw new ExCLNonlinearExpression;
                return this.times(1 / x)
            }
            if (x instanceof ClLinearExpression) {
                if (!x.isConstant) throw new ExCLNonlinearExpression;
                return this.times(1 / x._constant)
            }
        },
        divFrom: function() {
            if (!this.isConstant() || CL.approx(this._constant, 0)) throw new ExCLNonlinearExpression;
            return x.divide(this._constant)
        },
        subtractFrom: function(expr) {
            return expr.minus(this)
        },
        addExpression: function(expr, n, subject, solver) {
            expr instanceof ClAbstractVariable && (expr = new ClLinearExpression(expr), print("addExpression: Had to cast a var to an expression")), this.incrementConstant(n * expr.constant()), n = n || 1;
            var that = this;
            return expr.terms().each(function(clv, coeff) {
                that.addVariable(clv, coeff * n, subject, solver)
            }), this
        },
        addVariable: function(v, c, subject, solver) {
            return c = c || 1, CL.fTraceOn && CL.fnenterprint("CLE: addVariable:" + v + ", " + c), coeff = this._terms.get(v), coeff ? (new_coefficient = coeff + c, CL.approx(new_coefficient, 0) ? (solver && solver.noteRemovedVariable(v, subject), this._terms.remove(v)) : this._terms.put(v, new_coefficient)) : CL.approx(c, 0) || (this._terms.put(v, c), solver && solver.noteAddedVariable(v, subject)), this
        },
        setVariable: function(v, c) {
            return this._terms.put(v, c), this
        },
        anyPivotableVariable: function() {
            if (this.isConstant()) throw new ExCLInternalError("anyPivotableVariable called on a constant");
            var pivotable = null;
            try {
                this._terms.each(function(clv) {
                    if (clv.isPivotable()) throw pivotable = clv, "NLR"
                })
            } catch (e) {
                if ("NLR" === e) return pivotable;
                throw e
            }
            return null
        },
        substituteOut: function(outvar, expr, subject, solver) {
            var that = this;
            CL.fTraceOn && (CL.fnenterprint("CLE:substituteOut: " + outvar + ", " + expr + ", " + subject + ", ..."), CL.traceprint("this = " + this));
            var multiplier = this._terms.remove(outvar);
            this.incrementConstant(multiplier * expr.constant()), expr.terms().each(function(clv, coeff) {
                var old_coeff = that._terms.get(clv);
                if (old_coeff) {
                    var newCoeff = old_coeff + multiplier * coeff;
                    CL.approx(newCoeff, 0) ? (solver.noteRemovedVariable(clv, subject), that._terms.remove(clv)) : that._terms.put(clv, newCoeff)
                } else that._terms.put(clv, multiplier * coeff), solver.noteAddedVariable(clv, subject)
            }), CL.fTraceOn && CL.traceprint("Now this is " + this)
        },
        changeSubject: function(old_subject, new_subject) {
            this._terms.put(old_subject, this.newSubject(new_subject))
        },
        newSubject: function(subject) {
            CL.fTraceOn && CL.fnenterprint("newSubject:" + subject);
            var reciprocal = 1 / this._terms.remove(subject);
            return this.multiplyMe(-reciprocal), reciprocal
        },
        coefficientFor: function(clv) {
            return this._terms.get(clv) || 0
        },
        constant: function() {
            return this._constant
        },
        set_constant: function(c) {
            this._constant = c
        },
        terms: function() {
            return this._terms
        },
        incrementConstant: function(c) {
            this._constant += c
        },
        isConstant: function() {
            return 0 == this._terms.size()
        },
        toString: function() {
            var bstr = "",
                needsplus = !1;
            if (!CL.approx(this._constant, 0) || this.isConstant()) {
                if (bstr += this._constant, this.isConstant()) return bstr;
                needsplus = !0
            }
            return this._terms.each(function(clv, coeff) {
                needsplus && (bstr += " + "), bstr += coeff + "*" + clv, needsplus = !0
            }), bstr
        },
        Plus: function(e1, e2) {
            return e1.plus(e2)
        },
        Minus: function(e1, e2) {
            return e1.minus(e2)
        },
        Times: function(e1, e2) {
            return e1.times(e2)
        },
        Divide: function(e1, e2) {
            return e1.divide(e2)
        }
    }), Object.subclass("ClConstraint", "default category", {
        initialize: function(strength, weight) {
            this.hash_code = ClConstraint.iConstraintNumber++, this._strength = strength || ClStrength.required, this._weight = weight || 1, this._times_added = 0
        },
        hashCode: function() {
            return this.hash_code
        },
        isEditConstraint: function() {
            return !1
        },
        isInequality: function() {
            return !1
        },
        isRequired: function() {
            return this._strength.isRequired()
        },
        isStayConstraint: function() {
            return !1
        },
        strength: function() {
            return this._strength
        },
        weight: function() {
            return this._weight
        },
        toString: function() {
            return this._strength + " {" + this._weight + "} (" + this.expression() + ")"
        },
        setAttachedObject: function(o) {
            this._attachedObject = o
        },
        getAttachedObject: function() {
            return this._attachedObject
        },
        changeStrength: function(strength) {
            if (0 != this._times_added) throw new ExCLTooDifficult;
            this.setStrength(strength)
        },
        addedTo: function() {
            ++this._times_added
        },
        removedFrom: function() {
            --this._times_added
        },
        setStrength: function(strength) {
            this._strength = strength
        },
        setWeight: function(weight) {
            this._weight = weight
        }
    }), ClConstraint.subclass("ClEditOrStayConstraint", "default category", {
        initialize: function($super, clv, strength, weight) {
            $super(strength, weight), this._variable = clv, this._expression = new ClLinearExpression(this._variable, -1, this._variable.value())
        },
        variable: function() {
            return this._variable
        },
        expression: function() {
            return this._expression
        },
        setVariable: function(v) {
            this._variable = v
        }
    }), ClEditOrStayConstraint.subclass("ClEditConstraint", "default category", {
        initialize: function($super, clv, strength, weight) {
            $super(clv, strength, weight)
        },
        isEditConstraint: function() {
            return !0
        },
        toString: function() {
            return "edit" + $super()
        }
    }), ClEditOrStayConstraint.subclass("ClStayConstraint", "default category", {
        initialize: function($super, clv, strength, weight) {
            $super(clv, strength || ClStrength.weak, weight)
        },
        isStayConstraint: function() {
            return !0
        },
        toString: function() {
            return "stay " + $super()
        }
    }), ClConstraint.iConstraintNumber = 1, ClConstraint.subclass("ClLinearConstraint", "default category", {
        initialize: function($super, cle, strength, weight) {
            $super(strength, weight), this._expression = cle
        },
        expression: function() {
            return this._expression
        },
        setExpression: function(expr) {
            this._expression = expr
        }
    }), ClLinearConstraint.subclass("ClLinearInequality", "default category", {
        initialize: function($super, a1, a2, a3, a4, a5) {
            if (a1 instanceof ClLinearExpression && a3 instanceof ClAbstractVariable) {
                var cle = a1,
                    op = a2,
                    clv = a3,
                    strength = a4,
                    weight = a5;
                if ($super(cle.clone(), strength, weight), op == CL.LEQ) this._expression.multiplyMe(-1), this._expression.addVariable(clv);
                else {
                    if (op != CL.GEQ) throw new ExCLInternalError("Invalid operator in ClLinearInequality constructor");
                    this._expression.addVariable(clv, -1)
                }
            } else {
                if (a1 instanceof ClLinearExpression) return $super(a1, a2, a3);
                if (a2 == CL.GEQ) $super(new ClLinearExpression(a3), a4, a5), this._expression.multiplyMe(-1), this._expression.addVariable(a1);
                else {
                    if (a2 != CL.LEQ) throw new ExCLInternalError("Invalid operator in ClLinearInequality constructor");
                    $super(new ClLinearExpression(a3), a4, a5), this._expression.addVariable(a1, -1)
                }
            }
        },
        isInequality: function() {
            return !0
        },
        toString: function($super) {
            return $super() + " >= 0)"
        }
    }), ClLinearConstraint.subclass("ClLinearEquation", "default category", {
        initialize: function($super, a1, a2, a3, a4) {
            if (a1 instanceof ClLinearExpression && !a2 || a2 instanceof ClStrength) $super(a1, a2, a3);
            else if (a1 instanceof ClAbstractVariable && a2 instanceof ClLinearExpression) {
                var clv = a1,
                    cle = a2,
                    strength = a3,
                    weight = a4;
                $super(cle, strength, weight), this._expression.addVariable(clv, -1)
            } else if (a1 instanceof ClAbstractVariable && "number" == typeof a2) {
                var clv = a1,
                    val = a2,
                    strength = a3,
                    weight = a4;
                $super(new ClLinearExpression(val), strength, weight), this._expression.addVariable(clv, -1)
            } else if (a1 instanceof ClLinearExpression && a2 instanceof ClAbstractVariable) {
                var cle = a1,
                    clv = a2,
                    strength = a3,
                    weight = a4;
                $super(cle.clone(), strength, weight), this._expression.addVariable(clv, -1)
            } else {
                if (!(a1 instanceof ClLinearExpression || a1 instanceof ClAbstractVariable || "number" == typeof a1) || !(a2 instanceof ClLinearExpression || a2 instanceof ClAbstractVariable || "number" == typeof a2)) throw "Bad initializer to ClLinearEquation";
                a1 = a1 instanceof ClLinearExpression ? a1.clone() : new ClLinearExpression(a1), a2 = a2 instanceof ClLinearExpression ? a2.clone() : new ClLinearExpression(a2), $super(a1, a3, a4), this._expression.addExpression(a2, -1)
            }
            CL.Assert(this._strength instanceof ClStrength, "_strength not set")
        },
        toString: function() {
            return $super() + " = 0)"
        }
    }), Object.subclass("ClEditInfo", "default category", {
        initialize: function(cn_, eplus_, eminus_, prevEditConstant_, i_) {
            this.cn = cn_, this.clvEditPlus = eplus_, this.clvEditMinus = eminus_, this.prevEditConstant = prevEditConstant_, this.i = i_
        },
        Index: function() {
            return this.i
        },
        Constraint: function() {
            return this.cn
        },
        ClvEditPlus: function() {
            return this.clvEditPlus
        },
        ClvEditMinus: function() {
            return this.clvEditMinus
        },
        PrevEditConstant: function() {
            return this.prevEditConstant
        },
        SetPrevEditConstant: function(prevEditConstant_) {
            this.prevEditConstant = prevEditConstant_
        },
        toString: function() {
            return "<cn=" + this.cn + ",ep=" + this.clvEditPlus + ",em=" + this.clvEditMinus + ",pec=" + this.prevEditConstant + ",i=" + i + ">"
        }
    }), Object.subclass("ClTableau", "default category", {
        initialize: function() {
            this._columns = new Hashtable, this._rows = new Hashtable, this._infeasibleRows = new HashSet, this._externalRows = new HashSet, this._externalParametricVars = new HashSet
        },
        noteRemovedVariable: function(v, subject) {
            CL.fVerboseTraceOn && CL.fnenterprint("noteRemovedVariable: " + v + ", " + subject), null != subject && this._columns.get(v).remove(subject)
        },
        noteAddedVariable: function(v, subject) {
            CL.fVerboseTraceOn && CL.fnenterprint("noteAddedVariable: " + v + ", " + subject), subject && this.insertColVar(v, subject)
        },
        getInternalInfo: function() {
            var retstr = "Tableau Information:\n";
            return retstr += "Rows: " + this._rows.size(), retstr += " (= " + (this._rows.size() - 1) + " constraints)", retstr += "\nColumns: " + this._columns.size(), retstr += "\nInfeasible Rows: " + this._infeasibleRows.size(), retstr += "\nExternal basic variables: " + this._externalRows.size(), retstr += "\nExternal parametric variables: ", retstr += this._externalParametricVars.size(), retstr += "\n"
        },
        toString: function() {
            var bstr = "Tableau:\n";
            return this._rows.each(function(clv, expr) {
                bstr += clv, bstr += " <==> ", bstr += expr, bstr += "\n"
            }), bstr += "\nColumns:\n", bstr += CL.hashToString(this._columns), bstr += "\nInfeasible rows: ", bstr += CL.setToString(this._infeasibleRows), bstr += "External basic variables: ", bstr += CL.setToString(this._externalRows), bstr += "External parametric variables: ", bstr += CL.setToString(this._externalParametricVars)
        },
        insertColVar: function(param_var, rowvar) {
            var rowset = this._columns.get(param_var);
            rowset || this._columns.put(param_var, rowset = new HashSet), rowset.add(rowvar)
        },
        addRow: function(aVar, expr) {
            var that = this;
            CL.fTraceOn && CL.fnenterprint("addRow: " + aVar + ", " + expr), this._rows.put(aVar, expr), expr.terms().each(function(clv) {
                that.insertColVar(clv, aVar), clv.isExternal() && that._externalParametricVars.add(clv)
            }), aVar.isExternal() && this._externalRows.add(aVar), CL.fTraceOn && CL.traceprint(this.toString())
        },
        removeColumn: function(aVar) {
            var that = this;
            CL.fTraceOn && CL.fnenterprint("removeColumn:" + aVar);
            var rows = this._columns.remove(aVar);
            rows ? rows.each(function(clv) {
                var expr = that._rows.get(clv);
                expr.terms().remove(aVar)
            }) : CL.fTraceOn && CL.debugprint("Could not find var " + aVar + " in _columns"), aVar.isExternal() && (this._externalRows.remove(aVar), this._externalParametricVars.remove(aVar))
        },
        removeRow: function(aVar) {
            var that = this;
            CL.fTraceOn && CL.fnenterprint("removeRow:" + aVar);
            var expr = this._rows.get(aVar);
            return CL.Assert(null != expr), expr.terms().each(function(clv) {
                var varset = that._columns.get(clv);
                null != varset && (CL.fTraceOn && CL.debugprint("removing from varset " + aVar), varset.remove(aVar))
            }), this._infeasibleRows.remove(aVar), aVar.isExternal() && this._externalRows.remove(aVar), this._rows.remove(aVar), CL.fTraceOn && CL.fnexitprint("returning " + expr), expr
        },
        substituteOut: function(oldVar, expr) {
            var that = this;
            CL.fTraceOn && (CL.fnenterprint("substituteOut:" + oldVar + ", " + expr), CL.traceprint(this.toString()));
            var varset = this._columns.get(oldVar);
            varset.each(function(v) {
                var row = that._rows.get(v);
                row.substituteOut(oldVar, expr, v, that), v.isRestricted() && row.constant() < 0 && that._infeasibleRows.add(v)
            }), oldVar.isExternal() && (this._externalRows.add(oldVar), this._externalParametricVars.remove(oldVar)), this._columns.remove(oldVar)
        },
        columns: function() {
            return this._columns
        },
        rows: function() {
            return this._rows
        },
        columnsHasKey: function(subject) {
            return null != this._columns.get(subject)
        },
        rowExpression: function(v) {
            return this._rows.get(v)
        }
    }), ClTableau.subclass("ClSimplexSolver", "default category", {
        initialize: function($super) {
            $super(), this._stayMinusErrorVars = new Array, this._stayPlusErrorVars = new Array, this._errorVars = new Hashtable, this._markerVars = new Hashtable, this._resolve_pair = new Array(0, 0), this._objective = new ClObjectiveVariable("Z"), this._editVarMap = new Hashtable, this._slackCounter = 0, this._artificialCounter = 0, this._dummyCounter = 0, this._epsilon = 1e-8, this._fOptimizeAutomatically = !0, this._fNeedsSolving = !1, this._rows = new Hashtable, this._rows.put(this._objective, new ClLinearExpression), this._stkCedcns = new Array, this._stkCedcns.push(0), CL.fTraceOn && CL.traceprint("objective expr == " + this.rowExpression(this._objective))
        },
        addLowerBound: function(v, lower) {
            var cn = new ClLinearInequality(v, CL.GEQ, new ClLinearExpression(lower));
            return this.addConstraint(cn)
        },
        addUpperBound: function(v, upper) {
            var cn = new ClLinearInequality(v, CL.LEQ, new ClLinearExpression(upper));
            return this.addConstraint(cn)
        },
        addBounds: function(v, lower, upper) {
            return this.addLowerBound(v, lower), this.addUpperBound(v, upper), this
        },
        addConstraint: function(cn) {
            CL.fTraceOn && CL.fnenterprint("addConstraint: " + cn);
            var eplus_eminus = new Array(2),
                prevEConstant = new Array(1),
                expr = this.newExpression(cn, eplus_eminus, prevEConstant);
            prevEConstant = prevEConstant[0];
            var fAddedOkDirectly = !1;
            if (fAddedOkDirectly = this.tryAddingDirectly(expr), fAddedOkDirectly || this.addWithArtificialVariable(expr), this._fNeedsSolving = !0, cn.isEditConstraint()) {
                var i = this._editVarMap.size(),
                    clvEplus = eplus_eminus[0],
                    clvEminus = eplus_eminus[1];
                !clvEplus instanceof ClSlackVariable && print("clvEplus not a slack variable = " + clvEplus), !clvEminus instanceof ClSlackVariable && print("clvEminus not a slack variable = " + clvEminus), this._editVarMap.put(cn.variable(), new ClEditInfo(cn, clvEplus, clvEminus, prevEConstant, i))
            }
            return this._fOptimizeAutomatically && (this.optimize(this._objective), this.setExternalVariables()), cn.addedTo(this), cn
        },
        addConstraintNoException: function(cn) {
            CL.fTraceOn && CL.fnenterprint("addConstraintNoException: " + cn);
            try {
                return this.addConstraint(cn), !0
            } catch (e) {
                return !1
            }
        },
        addEditVar: function(v, strength) {
            CL.fTraceOn && CL.fnenterprint("addEditVar: " + v + " @ " + strength), strength = strength || ClStrength.strong;
            var cnEdit = new ClEditConstraint(v, strength);
            return this.addConstraint(cnEdit)
        },
        removeEditVar: function(v) {
            var cei = this._editVarMap.get(v),
                cn = cei.Constraint();
            return this.removeConstraint(cn), this
        },
        beginEdit: function() {
            return this.solve(), CL.Assert(this._editVarMap.size() > 0, "_editVarMap.size() > 0"), this._infeasibleRows.clear(), this.resetStayConstants(), this._stkCedcns.push(this._editVarMap.size()), this
        },
        endEdit: function() {
            CL.Assert(this._editVarMap.size() > 0, "_editVarMap.size() > 0"), this.resolve(), this._stkCedcns.pop();
            var n = this._stkCedcns[this._stkCedcns.length - 1];
            return this.removeEditVarsTo(n), this
        },
        removeAllEditVars: function() {
            return this.removeEditVarsTo(0)
        },
        removeEditVarsTo: function(n) {
            try {
                var that = this;
                return this._editVarMap.each(function(v, cei) {
                    cei.Index() >= n && that.removeEditVar(v)
                }), CL.Assert(this._editVarMap.size() == n, "_editVarMap.size() == n"), this
            } catch (e) {
                throw new ExCLInternalError("Constraint not found in removeEditVarsTo")
            }
        },
        addPointStays: function(listOfPoints) {
            CL.fTraceOn && CL.fnenterprint("addPointStays" + listOfPoints);
            for (var weight = 1, multiplier = 2, i = 0; i < listOfPoints.length; i++) this.addPointStay(listOfPoints[i], weight), weight *= multiplier;
            return this
        },
        addPointStay: function(a1, a2, a3) {
            if (a1 instanceof ClPoint) {
                var clp = a1,
                    weight = a2;
                this.addStay(clp.X(), ClStrength.weak, weight || 1), this.addStay(clp.Y(), ClStrength.weak, weight || 1)
            } else {
                var vx = a1,
                    vy = a2,
                    weight = a3;
                this.addStay(vx, ClStrength.weak, weight || 1), this.addStay(vy, ClStrength.weak, weight || 1)
            }
            return this
        },
        addStay: function(v, strength, weight) {
            var cn = new ClStayConstraint(v, strength || ClStrength.weak, weight || 1);
            return this.addConstraint(cn)
        },
        removeConstraint: function(cn) {
            return this.removeConstraintInternal(cn), cn.removedFrom(this), this
        },
        removeConstraintInternal: function(cn) {
            var that = this;
            CL.fTraceOn && CL.fnenterprint("removeConstraint: " + cn), CL.fTraceOn && CL.traceprint(this.toString()), this._fNeedsSolving = !0, this.resetStayConstants();
            var zRow = this.rowExpression(this._objective),
                eVars = this._errorVars.get(cn);
            CL.fTraceOn && CL.traceprint("eVars == " + CL.setToString(eVars)), null != eVars && eVars.each(function(clv) {
                var expr = that.rowExpression(clv);
                null == expr ? zRow.addVariable(clv, -cn.weight() * cn.strength().symbolicWeight().toDouble(), that._objective, that) : zRow.addExpression(expr, -cn.weight() * cn.strength().symbolicWeight().toDouble(), that._objective, that), CL.fTraceOn && CL.traceprint("now eVars == " + CL.setToString(eVars))
            });
            var marker = this._markerVars.remove(cn);
            if (null == marker) throw new ExCLConstraintNotFound;
            if (CL.fTraceOn && CL.traceprint("Looking to remove var " + marker), null == this.rowExpression(marker)) {
                var col = this._columns.get(marker);
                CL.fTraceOn && CL.traceprint("Must pivot -- columns are " + col);
                var exitVar = null,
                    minRatio = 0;
                col.each(function(v) {
                    if (v.isRestricted()) {
                        var expr = that.rowExpression(v),
                            coeff = expr.coefficientFor(marker);
                        if (that.fTraceOn && that.traceprint("Marker " + marker + "'s coefficient in " + expr + " is " + coeff), 0 > coeff) {
                            var r = -expr.constant() / coeff;
                            (null == exitVar || minRatio > r || CL.approx(r, minRatio) && v.hashCode() < exitVar.hashCode()) && (minRatio = r, exitVar = v)
                        }
                    }
                }), null == exitVar && (CL.fTraceOn && CL.traceprint("exitVar is still null"), col.each(function(v) {
                    if (v.isRestricted()) {
                        var expr = that.rowExpression(v),
                            coeff = expr.coefficientFor(marker),
                            r = expr.constant() / coeff;
                        (null == exitVar || minRatio > r) && (minRatio = r, exitVar = v)
                    }
                })), null == exitVar && (0 == col.size() ? this.removeColumn(marker) : col.escapingEach(function(v) {
                    return v != that._objective ? (exitVar = v, {
                        brk: !0
                    }) : void 0
                })), null != exitVar && this.pivot(marker, exitVar)
            }
            if (null != this.rowExpression(marker)) {
                var expr = this.removeRow(marker);
                expr = null
            }
            if (null != eVars && eVars.each(function(v) {
                    v != marker && (that.removeColumn(v), v = null)
                }), cn.isStayConstraint()) {
                if (null != eVars)
                    for (var i = 0; i < this._stayPlusErrorVars.length; i++) eVars.remove(this._stayPlusErrorVars[i]), eVars.remove(this._stayMinusErrorVars[i])
            } else if (cn.isEditConstraint()) {
                CL.Assert(null != eVars, "eVars != null");
                var cnEdit = cn,
                    clv = cnEdit.variable(),
                    cei = this._editVarMap.get(clv),
                    clvEditMinus = cei.ClvEditMinus();
                this.removeColumn(clvEditMinus), this._editVarMap.remove(clv)
            }
            return null != eVars && this._errorVars.remove(eVars), marker = null, this._fOptimizeAutomatically && (this.optimize(this._objective), this.setExternalVariables()), this
        },
        reset: function() {
            throw CL.fTraceOn && CL.fnenterprint("reset"), new ExCLInternalError("reset not implemented")
        },
        resolveArray: function(newEditConstants) {
            CL.fTraceOn && CL.fnenterprint("resolveArray" + newEditConstants);
            var that = this;
            this._editVarMap.each(function(v, cei) {
                var i = cei.Index();
                i < newEditConstants.length && that.suggestValue(v, newEditConstants[i])
            }), this.resolve()
        },
        resolvePair: function(x, y) {
            this._resolve_pair[0] = x, this._resolve_pair[1] = y, this.resolveArray(this._resolve_pair)
        },
        resolve: function() {
            CL.fTraceOn && CL.fnenterprint("resolve()"), this.dualOptimize(), this.setExternalVariables(), this._infeasibleRows.clear(), this.resetStayConstants()
        },
        suggestValue: function(v, x) {
            CL.fTraceOn && CL.fnenterprint("suggestValue(" + v + ", " + x + ")");
            var cei = this._editVarMap.get(v);
            if (null == cei) throw print("suggestValue for variable " + v + ", but var is not an edit variable\n"), new ExCLError;
            cei.Index();
            var clvEditPlus = cei.ClvEditPlus(),
                clvEditMinus = cei.ClvEditMinus(),
                delta = x - cei.PrevEditConstant();
            return cei.SetPrevEditConstant(x), this.deltaEditConstant(delta, clvEditPlus, clvEditMinus), this
        },
        setAutosolve: function(f) {
            return this._fOptimizeAutomatically = f, this
        },
        FIsAutosolving: function() {
            return this._fOptimizeAutomatically
        },
        solve: function() {
            return this._fNeedsSolving && (this.optimize(this._objective), this.setExternalVariables()), this
        },
        setEditedValue: function(v, n) {
            if (!this.FContainsVariable(v)) return v.change_value(n), this;
            if (!CL.approx(n, v.value())) {
                this.addEditVar(v), this.beginEdit();
                try {
                    this.suggestValue(v, n)
                } catch (e) {
                    throw new ExCLInternalError("Error in setEditedValue")
                }
                this.endEdit()
            }
            return this
        },
        FContainsVariable: function(v) {
            return this.columnsHasKey(v) || null != this.rowExpression(v)
        },
        addVar: function(v) {
            if (!this.FContainsVariable(v)) {
                try {
                    this.addStay(v)
                } catch (e) {
                    throw new ExCLInternalError("Error in addVar -- required failure is impossible")
                }
                CL.fTraceOn && CL.traceprint("added initial stay on " + v)
            }
            return this
        },
        getInternalInfo: function($super) {
            var retstr = $super();
            return retstr += "\nSolver info:\n", retstr += "Stay Error Variables: ", retstr += this._stayPlusErrorVars.length + this._stayMinusErrorVars.length, retstr += " (" + this._stayPlusErrorVars.length + " +, ", retstr += this._stayMinusErrorVars.length + " -)\n", retstr += "Edit Variables: " + this._editVarMap.size(), retstr += "\n"
        },
        getDebugInfo: function() {
            var bstr = this.toString();
            return bstr += this.getInternalInfo(), bstr += "\n"
        },
        toString: function($super) {
            var bstr = $super();
            return bstr += "\n_stayPlusErrorVars: ", bstr += "[" + this._stayPlusErrorVars + "]", bstr += "\n_stayMinusErrorVars: ", bstr += "[" + this._stayMinusErrorVars + "]", bstr += "\n", bstr += "_editVarMap:\n" + CL.hashToString(this._editVarMap), bstr += "\n"
        },
        getConstraintMap: function() {
            return this._markerVars
        },
        addWithArtificialVariable: function(expr) {
            CL.fTraceOn && CL.fnenterprint("addWithArtificialVariable: " + expr);
            var av = new ClSlackVariable(++this._artificialCounter, "a"),
                az = new ClObjectiveVariable("az"),
                azRow = expr.clone();
            CL.fTraceOn && CL.traceprint("before addRows:\n" + this), this.addRow(az, azRow), this.addRow(av, expr), CL.fTraceOn && CL.traceprint("after addRows:\n" + this), this.optimize(az);
            var azTableauRow = this.rowExpression(az);
            if (CL.fTraceOn && CL.traceprint("azTableauRow.constant() == " + azTableauRow.constant()), !CL.approx(azTableauRow.constant(), 0)) throw this.removeRow(az), this.removeColumn(av), new ExCLRequiredFailure;
            var e = this.rowExpression(av);
            if (null != e) {
                if (e.isConstant()) return this.removeRow(av), this.removeRow(az), void 0;
                var entryVar = e.anyPivotableVariable();
                this.pivot(entryVar, av)
            }
            CL.Assert(null == this.rowExpression(av), "rowExpression(av) == null"), this.removeColumn(av), this.removeRow(az)
        },
        tryAddingDirectly: function(expr) {
            CL.fTraceOn && CL.fnenterprint("tryAddingDirectly: " + expr);
            var subject = this.chooseSubject(expr);
            return null == subject ? (CL.fTraceOn && CL.fnexitprint("returning false"), !1) : (expr.newSubject(subject), this.columnsHasKey(subject) && this.substituteOut(subject, expr), this.addRow(subject, expr), CL.fTraceOn && CL.fnexitprint("returning true"), !0)
        },
        chooseSubject: function(expr) {
            var that = this;
            CL.fTraceOn && CL.fnenterprint("chooseSubject: " + expr);
            var subject = null,
                foundUnrestricted = !1,
                foundNewRestricted = !1,
                terms = expr.terms(),
                rv = terms.escapingEach(function(v, c) {
                    if (foundUnrestricted) {
                        if (!v.isRestricted() && !that.columnsHasKey(v)) return {
                            retval: v
                        }
                    } else if (v.isRestricted()) {
                        if (!foundNewRestricted && !v.isDummy() && 0 > c) {
                            var col = that._columns.get(v);
                            (null == col || 1 == col.size() && that.columnsHasKey(that._objective)) && (subject = v, foundNewRestricted = !0)
                        }
                    } else subject = v, foundUnrestricted = !0
                });
            if (void 0 !== rv) return rv;
            if (null != subject) return subject;
            var coeff = 0,
                rv = terms.escapingEach(function(v, c) {
                    return v.isDummy() ? (that.columnsHasKey(v) || (subject = v, coeff = c), void 0) : {
                        retval: null
                    }
                });
            if (void 0 !== rv) return rv;
            if (!CL.approx(expr.constant(), 0)) throw new ExCLRequiredFailure;
            return coeff > 0 && expr.multiplyMe(-1), subject
        },
        deltaEditConstant: function(delta, plusErrorVar, minusErrorVar) {
            var that = this;
            CL.fTraceOn && CL.fnenterprint("deltaEditConstant :" + delta + ", " + plusErrorVar + ", " + minusErrorVar);
            var exprPlus = this.rowExpression(plusErrorVar);
            if (null != exprPlus) return exprPlus.incrementConstant(delta), exprPlus.constant() < 0 && this._infeasibleRows.add(plusErrorVar), void 0;
            var exprMinus = this.rowExpression(minusErrorVar);
            if (null != exprMinus) return exprMinus.incrementConstant(-delta), exprMinus.constant() < 0 && this._infeasibleRows.add(minusErrorVar), void 0;
            var columnVars = this._columns.get(minusErrorVar);
            columnVars || print("columnVars is null -- tableau is:\n" + this), columnVars.each(function(basicVar) {
                var expr = that.rowExpression(basicVar),
                    c = expr.coefficientFor(minusErrorVar);
                expr.incrementConstant(c * delta), basicVar.isRestricted() && expr.constant() < 0 && that._infeasibleRows.add(basicVar)
            })
        },
        dualOptimize: function() {
            CL.fTraceOn && CL.fnenterprint("dualOptimize:");
            for (var zRow = this.rowExpression(this._objective); !this._infeasibleRows.isEmpty();) {
                var exitVar = this._infeasibleRows.values()[0];
                this._infeasibleRows.remove(exitVar);
                var entryVar = null,
                    expr = this.rowExpression(exitVar);
                if (null != expr && expr.constant() < 0) {
                    var r, ratio = Number.MAX_VALUE,
                        terms = expr.terms();
                    if (terms.each(function(v, c) {
                            if (c > 0 && v.isPivotable()) {
                                var zc = zRow.coefficientFor(v);
                                r = zc / c, (ratio > r || CL.approx(r, ratio) && v.hashCode() < entryVar.hashCode()) && (entryVar = v, ratio = r)
                            }
                        }), ratio == Number.MAX_VALUE) throw new ExCLInternalError("ratio == nil (MAX_VALUE) in dualOptimize");
                    this.pivot(entryVar, exitVar)
                }
            }
        },
        newExpression: function(cn, eplus_eminus, prevEConstant) {
            var that = this;
            CL.fTraceOn && (CL.fnenterprint("newExpression: " + cn), CL.traceprint("cn.isInequality() == " + cn.isInequality()), CL.traceprint("cn.isRequired() == " + cn.isRequired()));
            var cnExpr = cn.expression(),
                expr = new ClLinearExpression(cnExpr.constant()),
                slackVar = new ClSlackVariable,
                dummyVar = new ClDummyVariable,
                eminus = new ClSlackVariable,
                eplus = new ClSlackVariable,
                cnTerms = cnExpr.terms();
            if (cnTerms.each(function(v, c) {
                    var e = that.rowExpression(v);
                    null == e ? expr.addVariable(v, c) : expr.addExpression(e, c)
                }), cn.isInequality()) {
                if (++this._slackCounter, slackVar = new ClSlackVariable(this._slackCounter, "s"), expr.setVariable(slackVar, -1), this._markerVars.put(cn, slackVar), !cn.isRequired()) {
                    ++this._slackCounter, eminus = new ClSlackVariable(this._slackCounter, "em"), expr.setVariable(eminus, 1);
                    var zRow = this.rowExpression(this._objective),
                        sw = cn.strength().symbolicWeight().times(cn.weight());
                    zRow.setVariable(eminus, sw.toDouble()), this.insertErrorVar(cn, eminus), this.noteAddedVariable(eminus, this._objective)
                }
            } else if (cn.isRequired()) ++this._dummyCounter, dummyVar = new ClDummyVariable(this._dummyCounter, "d"), expr.setVariable(dummyVar, 1), this._markerVars.put(cn, dummyVar), CL.fTraceOn && CL.traceprint("Adding dummyVar == d" + this._dummyCounter);
            else {
                ++this._slackCounter, eplus = new ClSlackVariable(this._slackCounter, "ep"), eminus = new ClSlackVariable(this._slackCounter, "em"), expr.setVariable(eplus, -1), expr.setVariable(eminus, 1), this._markerVars.put(cn, eplus);
                var zRow = this.rowExpression(this._objective),
                    sw = cn.strength().symbolicWeight().times(cn.weight()),
                    swCoeff = sw.toDouble();
                0 == swCoeff && CL.fTraceOn && (CL.traceprint("sw == " + sw), CL.traceprint("cn == " + cn), CL.traceprint("adding " + eplus + " and " + eminus + " with swCoeff == " + swCoeff)), zRow.setVariable(eplus, swCoeff), this.noteAddedVariable(eplus, this._objective), zRow.setVariable(eminus, swCoeff), this.noteAddedVariable(eminus, this._objective), this.insertErrorVar(cn, eminus), this.insertErrorVar(cn, eplus), cn.isStayConstraint() ? (this._stayPlusErrorVars.push(eplus), this._stayMinusErrorVars.push(eminus)) : cn.isEditConstraint() && (eplus_eminus[0] = eplus, eplus_eminus[1] = eminus, prevEConstant[0] = cnExpr.constant())
            }
            return expr.constant() < 0 && expr.multiplyMe(-1), CL.fTraceOn && CL.fnexitprint("returning " + expr), expr
        },
        optimize: function(zVar) {
            var that = this;
            CL.fTraceOn && CL.fnenterprint("optimize: " + zVar), CL.fTraceOn && CL.traceprint(this.toString());
            var zRow = this.rowExpression(zVar);
            CL.Assert(null != zRow, "zRow != null");
            for (var entryVar = null, exitVar = null;;) {
                var objectiveCoeff = 0,
                    terms = zRow.terms();
                if (terms.escapingEach(function(v, c) {
                        return v.isPivotable() && objectiveCoeff > c ? (objectiveCoeff = c, entryVar = v, {
                            brk: !0
                        }) : void 0
                    }), objectiveCoeff >= -this._epsilon) return;
                CL.fTraceOn && CL.traceprint("entryVar == " + entryVar + ", objectiveCoeff == " + objectiveCoeff);
                var minRatio = Number.MAX_VALUE,
                    columnVars = this._columns.get(entryVar),
                    r = 0;
                if (columnVars.each(function(v) {
                        if (that.fTraceOn && that.traceprint("Checking " + v), v.isPivotable()) {
                            var expr = that.rowExpression(v),
                                coeff = expr.coefficientFor(entryVar);
                            that.fTraceOn && that.traceprint("pivotable, coeff = " + coeff), 0 > coeff && (r = -expr.constant() / coeff, (minRatio > r || CL.approx(r, minRatio) && v.hashCode() < exitVar.hashCode()) && (minRatio = r, exitVar = v))
                        }
                    }), minRatio == Number.MAX_VALUE) throw new ExCLInternalError("Objective function is unbounded in optimize");
                this.pivot(entryVar, exitVar), CL.fTraceOn && CL.traceprint(this.toString())
            }
        },
        pivot: function(entryVar, exitVar) {
            CL.fTraceOn && CL.fnenterprint("pivot: " + entryVar + ", " + exitVar), null == entryVar && console.log("pivot: entryVar == null"), null == exitVar && console.log("pivot: exitVar == null");
            var pexpr = this.removeRow(exitVar);
            pexpr.changeSubject(exitVar, entryVar), this.substituteOut(entryVar, pexpr), this.addRow(entryVar, pexpr)
        },
        resetStayConstants: function() {
            CL.fTraceOn && CL.fnenterprint("resetStayConstants");
            for (var i = 0; i < this._stayPlusErrorVars.length; i++) {
                var expr = this.rowExpression(this._stayPlusErrorVars[i]);
                null == expr && (expr = this.rowExpression(this._stayMinusErrorVars[i])), null != expr && expr.set_constant(0)
            }
        },
        setExternalVariables: function() {
            var that = this;
            CL.fTraceOn && CL.fnenterprint("setExternalVariables:"), CL.fTraceOn && CL.traceprint(this.toString()), this._externalParametricVars.each(function(v) {
                null != that.rowExpression(v) ? print("Error: variable" + v + " in _externalParametricVars is basic") : v.change_value(0)
            }), this._externalRows.each(function(v) {
                var expr = that.rowExpression(v);
                CL.fTraceOn && CL.debugprint("v == " + v), CL.fTraceOn && CL.debugprint("expr == " + expr), v.change_value(expr.constant())
            }), this._fNeedsSolving = !1
        },
        insertErrorVar: function(cn, aVar) {
            CL.fTraceOn && CL.fnenterprint("insertErrorVar:" + cn + ", " + aVar);
            var cnset = this._errorVars.get(aVar);
            null == cnset && this._errorVars.put(cn, cnset = new HashSet), cnset.add(aVar)
        }
    }), CL = {
        debugprint: function(s) {
            CL.fVerboseTraceOn && print(s)
        },
        traceprint: function(s) {
            CL.fVerboseTraceOn && print(s)
        },
        fnenterprint: function(s) {
            print("* " + s)
        },
        fnexitprint: function(s) {
            print("- " + s)
        },
        Assert: function(f, description) {
            if (!f) throw new ExCLInternalError("Assertion failed:" + description)
        },
        Plus: function(e1, e2) {
            return e1 instanceof ClLinearExpression || (e1 = new ClLinearExpression(e1)), e2 instanceof ClLinearExpression || (e2 = new ClLinearExpression(e2)), e1.plus(e2)
        },
        Minus: function(e1, e2) {
            return e1 instanceof ClLinearExpression || (e1 = new ClLinearExpression(e1)), e2 instanceof ClLinearExpression || (e2 = new ClLinearExpression(e2)), e1.minus(e2)
        },
        Times: function(e1, e2) {
            return e1 instanceof ClLinearExpression && e2 instanceof ClLinearExpression ? e1.times(e2) : e1 instanceof ClLinearExpression && e2 instanceof ClVariable ? e1.times(new ClLinearExpression(e2)) : e1 instanceof ClVariable && e2 instanceof ClLinearExpression ? new ClLinearExpression(e1).times(e2) : e1 instanceof ClLinearExpression && "number" == typeof e2 ? e1.times(new ClLinearExpression(e2)) : "number" == typeof e1 && e2 instanceof ClLinearExpression ? new ClLinearExpression(e1).times(e2) : "number" == typeof e1 && e2 instanceof ClVariable ? new ClLinearExpression(e2, e1) : e1 instanceof ClVariable && "number" == typeof e2 ? new ClLinearExpression(e1, e2) : e1 instanceof ClVariable && e2 instanceof ClLinearExpression ? new ClLinearExpression(e2, n) : void 0
        },
        Divide: function(e1, e2) {
            return e1.divide(e2)
        },
        approx: function(a, b) {
            return a instanceof ClVariable && (a = a.value()), b instanceof ClVariable && (b = b.value()), epsilon = 1e-8, 0 == a ? Math.abs(b) < epsilon : 0 == b ? Math.abs(a) < epsilon : Math.abs(a - b) < Math.abs(a) * epsilon
        },
        hashToString: function(h) {
            var answer = "";
            return CL.Assert(h instanceof Hashtable), h.each(function(k, v) {
                answer += k + " => ", answer += v instanceof Hashtable ? CL.hashToString(v) : v instanceof HashSet ? CL.setToString(v) : v + "\n"
            }), answer
        },
        setToString: function(s) {
            CL.Assert(s instanceof HashSet);
            var answer = s.size() + " {",
                first = !0;
            return s.each(function(e) {
                first ? first = !1 : answer += ", ", answer += e
            }), answer += "}\n"
        }
    }, CL.fDebugOn = !1, CL.fVerboseTraceOn = !1, CL.fTraceOn = !1, CL.fTraceAdded = !1, CL.fGC = !1, CL.GEQ = 1, CL.LEQ = 2, Object.subclass("Timer", "default category", {
        initialize: function() {
            this._timerIsRunning = !1, this._elapsedMs = 0
        },
        Start: function() {
            this._timerIsRunning = !0, this._startReading = new Date
        },
        Stop: function() {
            this._timerIsRunning = !1, this._elapsedMs += new Date - this._startReading
        },
        Reset: function() {
            this._timerIsRunning = !1, this._elapsedMs = 0
        },
        IsRunning: function() {
            return this._timerIsRunning
        },
        ElapsedTime: function() {
            return this._timerIsRunning ? (this._elapsedMs + (new Date - this._startReading)) / 1e3 : this._elapsedMs / 1e3
        }
    })
}), module("users.timfelgentreff.babelsberg.cassowary_ext").requires("users.timfelgentreff.cassowary.DwarfCassowary").toRun(function() {
    ClSimplexSolver.addMethods({
        isConstraintObject: !0,
        constraintVariableFor: function(value) {
            if ("number" == typeof value || null === value || value instanceof Number) {
                var v = new ClVariable(value + 0);
                return v.solver = this, v.stay(), v
            }
            return null
        },
        get strength() {
            return ClStrength
        },
        weight: 1e3,
        always: function(opts, func) {
            var ctx = opts.ctx,
                priority = this.strength[opts.priority];
            func.varMapping = ctx;
            var constraint = new Constraint(func, this);
            return constraint.priority = priority, constraint
        }
    }), Object.extend(ClSimplexSolver, {
        getInstance: function() {
            return this.$$instance || (this.$$instance = new ClSimplexSolver, this.$$instance.setAutosolve(!1)), this.$$instance
        },
        resetInstance: function() {
            this.$$instance = void 0
        }
    }), ClAbstractVariable.addMethods({
        isConstraintObject: !0,
        stay: function(strength) {
            strength instanceof ClStrength || (strength = this.solver.strength[strength]), this.stayConstraint && this.solver.removeConstraint(this.stayConstraint);
            var cn = new ClStayConstraint(this, strength || ClStrength.weak, 1);
            return this.solver.addConstraint(cn), this.stayConstraint = cn, cn
        },
        removeStay: function() {
            if (this.stayConstraint) try {
                this.solver.removeConstraint(this.stayConstraint)
            } catch (_) {
                this.stayConstraint = null
            }
        },
        suggestValue: function(value) {
            var c = this.cnEquals(value),
                s = this.solver;
            s.addConstraint(c);
            try {
                s.solve()
            } finally {
                s.removeConstraint(c)
            }
        },
        setReadonly: function(bool) {
            if (bool && !this.readonlyConstraint) {
                var cn = new ClStayConstraint(this, ClStrength.required, 1);
                return this.solver.addConstraint(cn), this.readonlyConstraint = cn, cn
            }!bool && this.readonlyConstraint && (this.solver.removeConstraint(this.readonlyConstraint), this.readonlyConstraint = void 0)
        },
        isReadonly: function() {
            return !!this.readonlyConstraint
        },
        plus: function(value) {
            return new ClLinearExpression(this).plus(value)
        },
        minus: function(value) {
            return new ClLinearExpression(this).minus(value)
        },
        times: function(value) {
            return new ClLinearExpression(this).times(value)
        },
        divide: function(value) {
            return new ClLinearExpression(this).divide(value)
        },
        cnGeq: function(value) {
            return new ClLinearExpression(this).cnGeq(value)
        },
        cnLeq: function(value) {
            return new ClLinearExpression(this).cnLeq(value)
        },
        cnOr: function() {
            return this
        },
        cnEquals: function(value) {
            return new ClLinearExpression(this).cnEquals(value)
        },
        cnIdentical: function(value) {
            return this.cnEquals(value)
        },
        prepareEdit: function() {
            this.solver.addEditVar(this)
        },
        finishEdit: function() {}
    }), ClLinearExpression.addMethods({
        isConstraintObject: !0,
        cnGeq: function(value) {
            return "string" == typeof value && (value = parseFloat(value)), new ClLinearInequality(this.minus(value))
        },
        cnLeq: function(value) {
            return "string" == typeof value && (value = parseFloat(value)), value instanceof ClLinearExpression || (value = new ClLinearExpression(value)), !value.minus, new ClLinearInequality(value.minus(this))
        },
        cnOr: function() {
            return this
        },
        cnEquals: function(value) {
            return "string" == typeof value && (value = parseFloat(value)), new ClLinearEquation(this, value)
        },
        plus: function(expr) {
            if ("string" == typeof expr && (expr = parseFloat(expr)), expr instanceof ClLinearExpression) return this.clone().addExpression(expr, 1);
            if (expr instanceof ClVariable) return this.clone().addVariable(expr, 1);
            if ("number" == typeof expr) return this.clone().addExpression(new ClLinearExpression(expr), 1);
            throw "Not supported: plus with " + expr
        },
        times: function(x) {
            if ("string" == typeof x && (x = parseFloat(x)), "number" == typeof x) return this.clone().multiplyMe(x);
            if (this.isConstant()) return x.times(this._constant);
            if (x.isConstant()) return this.times(x._constant);
            throw new ExCLNonlinearExpression
        },
        minus: function(expr) {
            if ("string" == typeof expr && (expr = parseFloat(expr)), expr instanceof ClLinearExpression) return this.clone().addExpression(expr, -1);
            if (expr instanceof ClVariable) return this.clone().addVariable(expr, -1);
            if ("number" == typeof expr) return this.clone().addExpression(new ClLinearExpression(expr), -1);
            throw "Not supported: minus with " + expr
        },
        divide: function(x) {
            if ("string" == typeof x && (x = parseFloat(x)), "number" == typeof x) {
                if (CL.approx(x, 0)) throw new ExCLNonlinearExpression;
                return this.times(1 / x)
            }
            if (x instanceof ClLinearExpression) {
                if (!x.isConstant) throw new ExCLNonlinearExpression;
                return this.times(1 / x._constant)
            }
            throw "Not supported: divide with " + expr
        }
    }), ClConstraint.addMethods({
        isConstraintObject: !0,
        enable: function(strength) {
            strength && this.setStrength(strength), this.solver.addConstraint(this)
        },
        disable: function() {
            this.solver.removeConstraint(this)
        },
        cnOr: function() {
            return this
        },
        get solver() {
            return this._solver || ClSimplexSolver.getInstance()
        },
        set solver(value) {
            this._solver = value
        }
    })
});