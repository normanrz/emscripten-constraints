function __oldNamespace(spec, context) {
    var i, N;
    if (context = context || window, spec = spec.valueOf(), "object" != typeof spec) {
        if ("string" == typeof spec) return function() {
            var parts;
            for (parts = spec.split("."), i = 0, N = parts.length; N > i; i++) spec = parts[i], context[spec] = context[spec] || {}, context = context[spec]
        }(), context;
        throw new TypeError
    }
    if ("number" == typeof spec.length)
        for (i = 0, N = spec.length; N > i; i++) return namespace(spec[i], context);
    else
        for (i in spec)
            if (spec.hasOwnProperty(i)) return context[i] = context[i], namespace(spec[i], context[i])
}

function namespace(spec, context) {
    var codeDB;
    "$" == spec[0] && (codeDB = spec.substring(1, spec.indexOf(".")), spec = spec.substring(spec.indexOf(".") + 1));
    var ret = __oldNamespace(spec, context);
    return codeDB && (ret.fromDB = codeDB), ret
}

function contentLoaded(win, fn) {
    var done = !1,
        top = !0,
        doc = win.document,
        root = doc.documentElement,
        add = doc.addEventListener ? "addEventListener" : "attachEvent",
        rem = doc.addEventListener ? "removeEventListener" : "detachEvent",
        pre = doc.addEventListener ? "" : "on",
        init = function(e) {
            ("readystatechange" != e.type || "complete" == doc.readyState) && (("load" == e.type ? win : doc)[rem](pre + e.type, init, !1), !done && (done = !0) && fn.call(win, e.type || e))
        },
        poll = function() {
            try {
                root.doScroll("left")
            } catch (e) {
                return setTimeout(poll, 50), void 0
            }
            init("poll")
        };
    if ("complete" == doc.readyState) fn.call(win, "lazy");
    else {
        if (doc.createEventObject && root.doScroll) {
            try {
                top = !win.frameElement
            } catch (e) {}
            top && poll()
        }
        doc[add](pre + "DOMContentLoaded", init, !1), doc[add](pre + "readystatechange", init, !1), win[add](pre + "load", init, !1)
    }
}

function StringBuffer() {
    this.strings = [];
    for (var idx = 0; idx < arguments.length; idx++) this.nextPutAll(arguments[idx])
}

function ReadStream(anArrayOrString) {
    this.src = anArrayOrString, this.pos = 0
}

function ometaUnescape(s) {
    if ("\\" != s.charAt(0)) return s;
    switch (s.charAt(1)) {
        case "'":
            return "'";
        case '"':
            return '"';
        case "\\":
            return "\\";
        case "b":
            return "\b";
        case "f":
            return "\f";
        case "n":
            return "\n";
        case "r":
            return "\r";
        case "t":
            return "  ";
        case "v":
            return "";
        case "x":
            return String.fromCharCode(parseInt(s.substring(2, 4), 16));
        case "u":
            return String.fromCharCode(parseInt(s.substring(2, 6), 16));
        default:
            return s.charAt(1)
    }
}

function tempnam(s) {
    return (s ? s : "_tmpnam_") + tempnam.n++
}

function OMInputStream(hd, tl) {
    this.memo = {}, this.lst = tl.lst, this.idx = tl.idx, this.hd = hd, this.tl = tl
}

function OMInputStreamEnd(lst, idx) {
    this.memo = {}, this.lst = lst, this.idx = idx
}

function ListOMInputStream(lst, idx) {
    this.memo = {}, this.lst = lst, this.idx = idx, this.hd = lst.at(idx)
}

function makeListOMInputStream(lst, idx) {
    return new(idx < lst.length ? ListOMInputStream : OMInputStreamEnd)(lst, idx)
}

function makeOMInputStreamProxy(target) {
    return objectThatDelegatesTo(target, {
        memo: {},
        target: target,
        tl: void 0,
        tail: function() {
            return this.tl || (this.tl = makeOMInputStreamProxy(target.tail()))
        }
    })
}

function Failer() {}
if (!window.module) {
    window.module = function(dottedPath) {
        if ("" == dottedPath) return window;
        var path = dottedPath.split("."),
            name = path.pop(),
            parent = module(path.join("."));
        return parent[name] || (parent[name] = {
            requires: function() {
                return this
            },
            toRun: function(code) {
                code()
            },
            uri: function() {}
        }), parent[name]
    }, JSLoader = {
        loadJs: function() {}
    }, window.URL = {}, window.Properties = {
        all: function(object, predicate) {
            var a = [];
            for (var name in object) !object.__lookupGetter__(name) && Object.isFunction(object[name]) || (predicate ? !predicate(name, object) : 0) || a.push(name);
            return a
        },
        allOwnPropertiesOrFunctions: function(obj, predicate) {
            var result = [];
            return Object.getOwnPropertyNames(obj).forEach(function(name) {
                predicate(obj, name) && result.push(name)
            }), result
        },
        own: function(object) {
            var a = [];
            for (var name in object) !object.hasOwnProperty(name) || !object.__lookupGetter__(name) && Object.isFunction(object[name]) || a.push(name);
            return a
        },
        forEachOwn: function(object, func, context) {
            var result = [];
            for (var name in object)
                if (object.hasOwnProperty(name)) {
                    var value = object[name];
                    Object.isFunction(value) || result.push(func.call(context || this, name, value))
                }
            return result
        },
        nameFor: function(object, value) {
            for (var name in object)
                if (object[name] === value) return name;
            return void 0
        },
        values: function(obj) {
            var values = [];
            for (var name in obj) values.push(obj[name]);
            return values
        },
        ownValues: function(obj) {
            var values = [];
            for (var name in obj) obj.hasOwnProperty(name) && values.push(obj[name]);
            return values
        },
        printObjectSize: function(obj) {
            return Numbers.humanReadableByteSize(JSON.stringify(obj).length)
        },
        any: function(obj, predicate) {
            for (var name in obj)
                if (predicate(obj, name)) return !0;
            return !1
        },
        allProperties: function(obj, predicate) {
            var result = [];
            for (var name in obj) predicate(obj, name) && result.push(name);
            return result
        },
        hash: function(obj) {
            return Object.keys(obj).sort().join("").hashCode()
        }
    }, window.Config = {}, window.cop = {}, window.Global = window;
    var Module = function() {
        return null
    };
    window.lively = new Module, lively.Class = Class, lively.Module = Module, window.dbgOn = function(b) {}, Object.extend(Class, {
        isClass: function(object) {
            return object === Object || object === Array || object === Function || object === String || object === Boolean || object === Date || object === RegExp || object === Number ? !0 : object instanceof Function && void 0 !== object.superclass
        },
        namespaceFor: function(className) {
            var lastDot = className.lastIndexOf(".");
            return 0 > lastDot ? window : namespace(className.substring(0, lastDot))
        },
        unqualifiedNameFor: function(name) {
            var lastDot = name.lastIndexOf("."),
                unqualifiedName = name.substring(lastDot + 1);
            return unqualifiedName
        }
    }), Object.extend(Function.prototype, {
        subclass: function() {
            var args = $A(arguments),
                className = args.shift(),
                targetScope = Global,
                shortName = null;
            className ? (targetScope = lively.Class.namespaceFor(className), shortName = lively.Class.unqualifiedNameFor(className)) : (shortName = "anonymous_" + lively.Class.anonymousCounter++, className = shortName);
            var klass;
            if (className && targetScope[shortName] && targetScope[shortName].superclass === this) klass = targetScope[shortName];
            else {
                klass = function() {
                    return this.initialize && this.initialize.apply(this, arguments), this
                }, klass.name = shortName, klass.superclass = this;
                var protoclass = function() {};
                protoclass.prototype = this.prototype, klass.prototype = new protoclass, klass.prototype.constructor = klass, klass.prototype.constructor.type = className, klass.prototype.constructor.displayName = className, className && (targetScope[shortName] = klass), Global.lively && lively.Module && lively.Module.current && (klass.sourceModule = lively.Module.current())
            }
            return this.addMethods.apply(klass, args), klass.prototype.initialize || (klass.prototype.initialize = function() {}), klass
        },
        addMethods: function() {
            for (var args = arguments, i = 0; i < args.length; i++) Object.isString(args[i]) || this.addCategorizedMethods(args[i] instanceof Function ? args[i]() : args[i])
        },
        addCategorizedMethods: function(source) {
            var ancestor = this.superclass && this.superclass.prototype,
                className = this.type || "Anonymous";
            for (var property in source)
                if ("constructor" != property) {
                    var getter = source.__lookupGetter__(property);
                    getter && this.prototype.__defineGetter__(property, getter);
                    var setter = source.__lookupSetter__(property);
                    if (setter && this.prototype.__defineSetter__(property, setter), !getter && !setter) {
                        var value = source[property],
                            hasSuperCall = ancestor && Object.isFunction(value) && value.argumentNames && "$super" == value.argumentNames().first();
                        if (hasSuperCall && ! function() {
                                var method = value,
                                    advice = function(m) {
                                        return function() {
                                            var method = ancestor[m];
                                            if (!method) throw new Error(Strings.format("Trying to call super of %s>>%s but no super method in %s", className, m, ancestor.constructor.type));
                                            return method.apply(this, arguments)
                                        }
                                    }(property);
                                advice.methodName = "$super:" + (this.superclass ? this.superclass.type + ">>" : "") + property, value = Object.extend(advice.wrap(method), {
                                    valueOf: function() {
                                        return method
                                    },
                                    toString: function() {
                                        return method.toString()
                                    },
                                    originalFunction: method
                                }), method.varMapping = {
                                    $super: advice
                                }
                            }(), this.prototype[property] = value, Object.isFunction(value))
                            for (value.displayName = className + "$" + property; value; value = value.originalFunction) value.declaredClass = this.prototype.constructor.type, value.methodName = property
                    }
                }
            return this
        },
        binds: function() {
            return this
        },
        getVarMapping: function() {
            return this.varMapping
        }
    });
    for (var lutUUID = [], i = 0; 256 > i; i++) lutUUID[i] = (16 > i ? "0" : "") + i.toString(16);
    window.Strings = {
        newUUID: function() {
            var d0 = 0 | 4294967295 * Math.random(),
                d1 = 0 | 4294967295 * Math.random(),
                d2 = 0 | 4294967295 * Math.random(),
                d3 = 0 | 4294967295 * Math.random();
            return lutUUID[255 & d0] + lutUUID[255 & d0 >> 8] + lutUUID[255 & d0 >> 16] + lutUUID[255 & d0 >> 24] + "-" + lutUUID[255 & d1] + lutUUID[255 & d1 >> 8] + "-" + lutUUID[64 | 15 & d1 >> 16] + lutUUID[255 & d1 >> 24] + "-" + lutUUID[128 | 63 & d2] + lutUUID[255 & d2 >> 8] + "-" + lutUUID[255 & d2 >> 16] + lutUUID[255 & d2 >> 24] + lutUUID[255 & d3] + lutUUID[255 & d3 >> 8] + lutUUID[255 & d3 >> 16] + lutUUID[255 & d3 >> 24]
        },
        format: function() {
            return Strings.formatFromArray(Array.from(arguments))
        },
        formatFromArray: function(objects) {
            function appendText(object) {
                return "" + object
            }

            function appendInteger(value) {
                return value.toString()
            }

            function appendFloat(value, string, precision) {
                return precision > -1 ? value.toFixed(precision) : value.toString()
            }

            function appendObject(value) {
                return Objects.inspect(value)
            }

            function parseFormat(fmt) {
                for (var parts = [], m = reg.exec(fmt); m; m = reg.exec(fmt)) {
                    var type = m[8] || m[5],
                        appender = type in appenderMap ? appenderMap[type] : appendObject,
                        precision = m[3] ? parseInt(m[3]) : "." == m[4] ? -1 : 0;
                    parts.push(fmt.substr(0, "%" == m[0][0] ? m.index : m.index + 1)), parts.push({
                        appender: appender,
                        precision: precision
                    }), fmt = fmt.substr(m.index + m[0].length)
                }
                return fmt && parts.push(fmt.toString()), parts
            }
            var self = objects.shift();
            self || console.log("Error in Strings>>formatFromArray, arg1 undefined");
            for (var appenderMap = {
                    s: appendText,
                    d: appendInteger,
                    i: appendInteger,
                    f: appendFloat,
                    o: appendObject
                }, reg = /((^%|[^\\]%)(\d+)?(\.)([a-zA-Z]))|((^%|[^\\]%)([a-zA-Z]))/, parts = parseFormat(self), str = "", objIndex = 0, i = 0; i < parts.length; ++i) {
                var part = parts[i];
                if (part && "object" == typeof part) {
                    var object = objects[objIndex++];
                    str += (part.appender || appendText)(object, str, part.precision)
                } else str += appendText(part, str)
            }
            return str
        }
    }, Array.prototype.removeAt = function(idx) {
        this.splice(idx, 1)
    }, Array.prototype.remove = function(obj) {
        var idx = this.indexOf(obj);
        idx >= 0 && this.removeAt(idx)
    }, Array.range = function(begin, end, step) {
        step = step || 1;
        for (var result = [], i = begin; end >= i; i += step) result.push(i);
        return result
    }, Array.prototype.equals = function(otherArray) {
        var len = this.length;
        if (!otherArray || len !== otherArray.length) return !1;
        for (var i = 0; len > i; i++) {
            if (this[i] && otherArray[i] && this[i].equals && otherArray[i].equals) {
                if (this[i].equals(otherArray[i])) continue;
                return !1
            }
            if (this[i] != otherArray[i]) return !1
        }
        return !0
    }, "undefined" == typeof Set && (Global.Set = function() {
        throw "Set not supported"
    }), window.alertOK = function(msg) {
        console.log(msg)
    }
}
module("cop.Layers").requires().toRun(function() {
    Config.ignoredepricatedProceed = !0;
    var log_layer_code = !1;
    Object.extend(cop, {
        dynamicInlining: Config.copDynamicInlining && !document.URL.include("noDynamicInlining"),
        staticInlining: !1,
        proceedStack: [],
        GlobalLayers: [],
        object_id_counter: 0
    }), Object.extend(cop, {
        withLogLayerCode: function(func) {
            try {
                var old = log_layer_code;
                log_layer_code = !0, func()
            } finally {
                log_layer_code = old
            }
        },
        getLayerDefinitionForObject: function(layer, object) {
            if (layer && object) {
                var result = layer[object._layer_object_id];
                return result ? result : cop.getLayerDefinitionForObject(layer, object.prototype)
            }
        },
        ensurePartialLayer: function(layer, object) {
            if (!layer) throw new Error("in ensurePartialLayer: layer is nil");
            return object.hasOwnProperty("_layer_object_id") || (object._layer_object_id = cop.object_id_counter++), layer[object._layer_object_id] || (layer[object._layer_object_id] = {
                _layered_object: object
            }), layer[object._layer_object_id]
        },
        layerMethod: function(layer, object, property, func) {
            cop.ensurePartialLayer(layer, object)[property] = func, func.displayName = "layered " + layer.name + " " + (object.constructor ? object.constructor.type + "$" : "") + property, cop.makeFunctionLayerAware(object, property, layer.isHidden), Object.isFunction(object.getName) && (layer.layeredFunctionsList[object][property] = !0)
        },
        layerGetterMethod: function(layer, object, property, getter) {
            cop.ensurePartialLayer(layer, object).__defineGetter__(property, getter)
        },
        layerSetterMethod: function(layer, object, property, setter) {
            cop.ensurePartialLayer(layer, object).__defineSetter__(property, setter)
        },
        layerProperty: function(layer, object, property, defs) {
            var getter = defs.__lookupGetter__(property);
            getter && cop.layerGetterMethod(layer, object, property, getter);
            var setter = defs.__lookupSetter__(property);
            setter && cop.layerSetterMethod(layer, object, property, setter), getter || setter ? cop.makePropertyLayerAware(object, property) : cop.layerMethod(layer, object, property, defs[property])
        },
        layerPropertyWithShadow: function(layer, object, property) {
            var defs = {},
                baseValue = object[property],
                layeredPropName = "_layered_" + layer.getName() + "_" + property;
            defs.__defineGetter__(property, function() {
                return void 0 === this[layeredPropName] ? cop.proceed() : this[layeredPropName]
            }.binds({
                layeredPropName: layeredPropName,
                baseValue: baseValue
            })), defs.__defineSetter__(property, function(v) {
                this[layeredPropName] = v
            }.binds({
                layeredPropName: layeredPropName
            })), cop.layerProperty(layer, object, property, defs)
        },
        computeLayersFor: function(obj) {
            return obj && obj.activeLayers ? obj.activeLayers(cop.currentLayers) : cop.currentLayers()
        },
        composeLayers: function(stack) {
            for (var result = cop.GlobalLayers.clone(), i = 0; i < stack.length; i++) {
                var current = stack[i];
                current.withLayers ? result = result.without.apply(result, current.withLayers).concat(current.withLayers) : current.withoutLayers && (result = result.without.apply(result, current.withoutLayers))
            }
            return result
        },
        currentLayers: function() {
            if (0 == cop.LayerStack.length) throw new Error("The default layer is missing");
            var current = cop.LayerStack.last();
            return (!current.composition || cop.dynamicInlining && !current.composition.hash) && (current.composition = cop.composeLayers(cop.LayerStack), cop.dynamicInlining && (current.composition.hash = cop.computeHashForLayers(current.composition))), current.composition
        },
        invalidateLayerComposition: function() {
            cop.LayerStack.forEach(function(ea) {
                ea.composition = null
            })
        },
        resetLayerStack: function() {
            cop.LayerStack = [{
                isStatic: !0,
                toString: function() {
                    return "BaseLayer"
                },
                composition: null
            }], cop.invalidateLayerComposition()
        },
        lookupLayeredFunctionForObject: function(self, layer, function_name, methodType) {
            if (!layer) return void 0;
            var layered_function, layer_definition_for_object = cop.getLayerDefinitionForObject(layer, self);
            if (layer_definition_for_object && ("getter" == methodType ? layered_function = layer_definition_for_object.__lookupGetter__(function_name) : "setter" == methodType ? layered_function = layer_definition_for_object.__lookupSetter__(function_name) : layer_definition_for_object.hasOwnProperty(function_name) && (layered_function = layer_definition_for_object[function_name])), !layered_function) {
                var superclass = self.constructor.superclass;
                if (superclass) return foundClass = superclass, cop.lookupLayeredFunctionForObject(superclass.prototype, layer, function_name, methodType)
            }
            return layered_function
        },
        pvtMakeFunctionOrPropertyLayerAware: function(obj, slotName, baseValue, type, isHidden) {
            return baseValue.isLayerAware ? void 0 : cop.staticInlining ? cop.makeSlotLayerAwareWithStaticInlining(obj, slotName, baseValue, type) : cop.dynamicInlining ? cop.makeSlotLayerAwareWithDynamicInlining(obj, slotName, baseValue, type) : (cop.makeSlotLayerAwareWithNormalLookup(obj, slotName, baseValue, type, isHidden), void 0)
        },
        makeSlotLayerAwareWithNormalLookup: function(obj, slotName, baseValue, type, isHidden) {
            var wrapped_function = function() {
                var composition = new cop.PartialLayerComposition(this, obj, slotName, baseValue, type);
                cop.proceedStack.push(composition);
                try {
                    return cop.proceed.apply(this, arguments)
                } finally {
                    cop.proceedStack.pop()
                }
            };
            wrapped_function.isLayerAware = !0, wrapped_function.isContextJSWrapper = !0, isHidden && (wrapped_function.toString = function() {
                return this.getOriginal().toString()
            }), wrapped_function.originalFunction = baseValue, "getter" == type ? obj.__defineGetter__(slotName, wrapped_function) : "setter" == type ? obj.__defineSetter__(slotName, wrapped_function) : obj[slotName] = wrapped_function
        },
        makeFunctionLayerAware: function(base_obj, function_name, isHidden) {
            if (!base_obj) throw new Error("can't layer an non existent object");
            var base_function = base_obj[function_name];
            base_function || (base_function = function() {
                return null
            }), cop.pvtMakeFunctionOrPropertyLayerAware(base_obj, function_name, base_function, void 0, isHidden)
        },
        makePropertyLayerAware: function(baseObj, property) {
            if (!baseObj) throw new Error("can't layer an non existent object");
            var getter = baseObj.__lookupGetter__(property),
                propName = "__layered_" + property + "__";
            getter || (baseObj[propName] = baseObj[property], getter = function() {
                return this[propName]
            }.binds({
                propName: propName
            }), baseObj.__defineGetter__(property, getter));
            var setter = baseObj.__lookupSetter__(property);
            setter || (setter = function(value) {
                return this[propName] = value
            }.binds({
                propName: propName
            }), baseObj.__defineSetter__(property, setter)), cop.pvtMakeFunctionOrPropertyLayerAware(baseObj, property, getter, "getter"), cop.pvtMakeFunctionOrPropertyLayerAware(baseObj, property, setter, "setter")
        },
        makeFunctionLayerUnaware: function(base_obj, function_name) {
            if (!base_obj) throw new Error("need object to makeFunctionLayerUnaware");
            var prevFunction, currentFunction = base_obj[function_name];
            if (void 0 !== currentFunction) {
                for (;
                    "function" == typeof currentFunction.originalFunction && !currentFunction.isLayerAware;) {
                    var prevFunction = currentFunction;
                    currentFunction = currentFunction.originalFunction
                }
                if (currentFunction.isLayerAware) {
                    var originalFunction = currentFunction.originalFunction;
                    if (!(originalFunction instanceof Function)) throw new Error("makeFunctionLayerUnaware Error: no orignal function");
                    prevFunction instanceof Function ? prevFunction.originalFunction = originalFunction : base_obj[function_name] = originalFunction
                }
            }
        },
        uninstallLayersInObject: function(object) {
            Functions.own(object).forEach(function(ea) {
                cop.makeFunctionLayerUnaware(object, ea)
            })
        },
        uninstallLayersInAllClasses: function() {
            Global.classes(!0).forEach(function(ea) {
                cop.uninstallLayersInObject(ea.prototype)
            })
        },
        allLayers: function(optObject) {
            return Object.values(optObject || Global).select(function(ea) {
                return ea instanceof Layer
            })
        }
    }), Object.extend(cop, {
        create: function(name) {
            var context = lively.Class.namespaceFor(name),
                layerName = lively.Class.unqualifiedNameFor(name);
            return context[layerName] = cop.basicCreate(layerName, context)
        },
        basicCreate: function(layerName, context) {
            return context = context || Global, context[layerName] || new Layer(layerName, context.namespaceIdentifier)
        },
        layer: function(name) {
            return console.log("SyntaxDepricated: cop.layer(... use cop.create("), cop.create(name, !0)
        },
        createLayer: function(name) {
            return console.log("SyntaxDepricated: cop.createLayer(... use cop.create("), cop.create(name, !1)
        },
        layerObject: function(layer, object, defs) {
            Object.isFunction(object.getName) && (layer.layeredFunctionsList[object] = {}), Object.keys(defs).forEach(function(function_name) {
                cop.layerProperty(layer, object, function_name, defs)
            })
        },
        layerClass: function(layer, classObject, defs) {
            if (!classObject || !classObject.prototype) throw new Error("ContextJS: can not refine class '" + classObject + "' in " + layer);
            cop.layerObject(layer, classObject.prototype, defs)
        },
        layerClassAndSubclasses: function(layer, classObject, defs) {
            cop.layerClass(layer, classObject, defs), classObject.allSubclasses().forEach(function(eaClass) {
                var obj = eaClass.prototype;
                Object.keys(defs).forEach(function(eaFunctionName) {
                    obj.hasOwnProperty(eaFunctionName) && obj[eaFunctionName] instanceof Function && cop.makeFunctionLayerAware(obj, eaFunctionName)
                })
            })
        },
        withLayers: function(layers, func) {
            cop.LayerStack.push({
                withLayers: layers
            });
            try {
                return func()
            } finally {
                cop.LayerStack.pop()
            }
        },
        withoutLayers: function(layers, func) {
            cop.LayerStack.push({
                withoutLayers: layers
            });
            try {
                return func()
            } finally {
                cop.LayerStack.pop()
            }
        },
        enableLayer: function(layer) {
            cop.GlobalLayers.include(layer) || (cop.GlobalLayers.push(layer), cop.invalidateLayerComposition())
        },
        disableLayer: function(layer) {
            var idx = cop.GlobalLayers.indexOf(layer);
            0 > idx || (cop.GlobalLayers.removeAt(idx), cop.invalidateLayerComposition())
        },
        proceed: function() {
            var composition = cop.proceedStack.last();
            if (!composition) return console.log("ContextJS: no composition to proceed (stack is empty) "), void 0;
            void 0 == composition.partialMethodIndex && (composition.partialMethodIndex = composition.partialMethods.length - 1);
            var index = composition.partialMethodIndex,
                partialMethod = composition.partialMethods[index];
            if (partialMethod) {
                try {
                    if (composition.partialMethodIndex = index - 1, !Config.ignoredepricatedProceed && partialMethod.toString().match(/^[\t ]*function ?\(\$?proceed/)) {
                        var args = $A(arguments);
                        args.unshift(cop.proceed);
                        var msg = "proceed in arguments list in " + composition.functionName;
                        if (Config.throwErrorOnDepricated) throw new Error("DEPRICATED ERROR: " + msg);
                        Config.logDepricated && console.log("DEPRICATED WARNING: " + msg);
                        var result = partialMethod.apply(composition.object, args)
                    } else var result = partialMethod.apply(composition.object, arguments)
                } finally {
                    composition.partialMethodIndex = index
                }
                return result
            }
            if (!partialMethod) throw new COPError("no partialMethod to proceed")
        }
    });
    var markNamespaceEntryAsDepricated = function(newNamespace, newName, oldNamespace, oldName) {
        oldNamespace[oldName] = newNamespace[newName].wrap(function(proceed) {
            if (Config.throwErrorOnDepricated) throw new Error("DEPRICATED ERROR: " + oldName + " is depricated");
            Config.logDepricated && console.log("DEPRICATED WARNING: " + oldName + " is depricated");
            var args = $A(arguments);
            return args.shift(), proceed.apply(this, args)
        })
    };
    markNamespaceEntryAsDepricated(cop, "enableLayer", Global, "enableLayer"), markNamespaceEntryAsDepricated(cop, "disableLayer", Global, "disableLayer"), markNamespaceEntryAsDepricated(cop, "withLayers", Global, "withLayers"), markNamespaceEntryAsDepricated(cop, "withoutLayers", Global, "withoutLayers"), markNamespaceEntryAsDepricated(cop, "createLayer", Global, "createLayer"), markNamespaceEntryAsDepricated(cop, "layerObject", Global, "layerObject"), markNamespaceEntryAsDepricated(cop, "layerClass", Global, "layerClass"), markNamespaceEntryAsDepricated(cop, "layerClassAndSubclasses", Global, "layerClassAndSubclasses"), Object.subclass("Layer", "initializing", {
        initialize: function(name, namespaceName) {
            this.name = name, this.namespaceName = namespaceName || "Global", this.layeredFunctionsList = {}, Global.lively && lively.lang && lively.Module && (this.sourceModule = lively.Module.current())
        }
    }, "accessing", {
        getName: function() {
            return this.name
        },
        fullName: function() {
            return this.namespaceName + "." + this.getName()
        },
        layeredObjects: function() {
            return Properties.own(this).collect(function(ea) {
                return this[ea] && this[ea]._layered_object
            }, this).select(function(ea) {
                return ea
            })
        },
        layeredClasses: function() {
            return this.layeredObjects().collect(function(ea) {
                return ea.constructor
            }).select(function(ea) {
                return lively.Class.isClass(ea)
            })
        }
    }, "testing", {
        isGlobal: function() {
            return cop.GlobalLayers.include(this)
        }
    }, "removing", {
        remove: function() {
            this.isGlobal() && this.beNotGlobal();
            var ns = module(this.namespaceName);
            delete ns[this.name]
        },
        uninstall: function() {
            var layer = this;
            this.layeredObjects().each(function(eachLayeredObj) {
                var layerIdx = Object.isFunction(eachLayeredObj.activeLayers) ? eachLayeredObj.activeLayers().indexOf(layer) : -1;
                Properties.own(layer.layeredFunctionsList[eachLayeredObj]).each(function(eachLayeredFunc) {
                    var newerLayer = eachLayeredObj.activeLayers().find(function(eachOtherLayer) {
                        var eachOtherLayerIdx = eachLayeredObj.activeLayers().indexOf(eachOtherLayer),
                            isNewer = -1 !== eachOtherLayerIdx && layerIdx > eachOtherLayerIdx;
                        return isNewer && eachOtherLayer.layeredFunctionsList[eachLayeredObj][eachLayeredFunc]
                    });
                    newerLayer || cop.makeFunctionLayerUnaware(eachLayeredObj, eachLayeredFunc)
                })
            }), this.remove(), alertOK("Successfully uninstalled Layer " + this + " in Global Classes")
        }
    }, "layer installation", {
        layerClass: function(classObj, methods) {
            return cop.layerClass(this, classObj, methods), this
        },
        layerObject: function(obj, methods) {
            return cop.layerObject(this, obj, methods), this
        },
        refineClass: function(classObj, methods) {
            return cop.layerClass(this, classObj, methods), this
        },
        refineObject: function(obj, methods) {
            return cop.layerObject(this, obj, methods), this
        },
        unrefineObject: function(obj) {
            var id = obj._layer_object_id;
            void 0 !== id && delete this[id]
        },
        unrefineClass: function(classObj) {
            this.unrefineObject(classObj.prototype)
        }
    }, "layer activation", {
        beGlobal: function() {
            return cop.enableLayer(this), this
        },
        beNotGlobal: function() {
            return cop.disableLayer(this), this
        },
        hide: function() {
            return this.isHidden = !0, this
        }
    }, "debugging", {
        toString: function() {
            return this.getName()
        }
    }, "deprecated serialization", {
        toLiteral: function() {
            return this.name || console.warn("Layer: Can not serialize without a name!"), {
                name: this.name
            }
        }
    }), Object.extend(Layer, {
        fromLiteral: function(literal) {
            return cop.create(literal.name, !1)
        }
    }), Object.extend(Global, {
        LayerableObjectTrait: {}
    }), Object.extend(LayerableObjectTrait, {
        activeLayers: function() {
            var result = {
                withLayers: [],
                withoutLayers: []
            };
            return this.dynamicLayers(result), this.structuralLayers(result), this.globalLayers(result), result.withLayers
        },
        collectWithLayersIn: function(layers, result) {
            for (var i = 0; i < layers.length; i++) {
                var ea = layers[i]; - 1 === result.withLayers.indexOf(ea) && -1 === result.withoutLayers.indexOf(ea) && result.withLayers.unshift(ea)
            }
        },
        collectWithoutLayersIn: function(layers, result) {
            for (var i = 0; i < layers.length; i++) {
                var ea = layers[i]; - 1 === result.withoutLayers.indexOf(ea) && result.withoutLayers.push(ea)
            }
        },
        dynamicLayers: function(result) {
            for (var stack = cop.LayerStack, j = stack.length - 1; j > 0; j--) {
                var current = stack[j];
                current.withLayers && this.collectWithLayersIn(current.withLayers, result), current.withoutLayers && this.collectWithoutLayersIn(current.withoutLayers, result)
            }
            return result
        },
        structuralLayers: function(result) {
            for (var obj = (result.withLayers, result.withoutLayers, this); obj;) obj.withLayers && this.collectWithLayersIn(obj.withLayers, result), obj.withoutLayers && this.collectWithoutLayersIn(obj.withoutLayers, result), obj = obj.owner;
            return result
        },
        globalLayers: function(result) {
            return this.collectWithLayersIn(cop.GlobalLayers, result), result
        },
        setWithLayers: function(layers) {
            this.withLayers = layers
        },
        addWithLayer: function(layer) {
            var layers = this.getWithLayers();
            layers.include(layer) || this.setWithLayers(layers.concat([layer]))
        },
        removeWithLayer: function(layer) {
            var layers = this.getWithLayers();
            layers.include(layer) && this.setWithLayers(layers.without(layer))
        },
        addWithoutLayer: function(layer) {
            var layers = this.getWithoutLayers();
            layers.include(layer) || this.setWithoutLayers(layers.concat([layer]))
        },
        removeWithoutLayer: function(layer) {
            var layers = this.getWithoutLayers();
            this.setWithoutLayers(layers.without(layer))
        },
        setWithoutLayers: function(layers) {
            this.withoutLayers = layers
        },
        getWithLayers: function() {
            return this.withLayers || []
        },
        getWithoutLayers: function() {
            return this.withoutLayers || []
        }
    }), Object.subclass("LayerableObject", LayerableObjectTrait), Object.subclass("COPError", {
        initialize: function(msg) {
            this.msg = msg
        },
        toString: function() {
            return "COP Error: " + this.msg
        }
    }), Object.subclass("cop.PartialLayerComposition", {
        initialize: function(obj, prototypeObject, functionName, baseFunction, methodType) {
            this.partialMethods = [baseFunction];
            for (var layers = cop.computeLayersFor(obj), i = 0; i < layers.length; i++) {
                var layer = layers[i],
                    partialMethod = cop.lookupLayeredFunctionForObject(obj, layer, functionName, methodType);
                partialMethod && this.partialMethods.push(partialMethod)
            }
            this.object = obj, this.prototypeObject = prototypeObject, this.functionName = functionName
        }
    }), Object.extend(Function.prototype, {
        subclass: Object.subclass.wrap(function(proceed) {
            var args = $A(arguments);
            args.shift();
            for (var layeredMethods = [], i = 1; i < args.length; i++) {
                var methods = args[i];
                Object.isString(methods) || Object.keys(methods).forEach(function(ea) {
                    var m = ea.match(/([A-Za-z0-9]+)\$([A-Za-z0-9]*)/);
                    if (m) {
                        var getter = methods.__lookupGetter__(m[0]),
                            setter = methods.__lookupSetter__(m[0]);
                        layeredMethods.push({
                            layerName: m[1],
                            methodName: m[2],
                            methodBody: methods[ea],
                            getterMethod: getter,
                            setterMethod: setter
                        }), delete methods[ea]
                    }
                })
            }
            var klass = proceed.apply(this, args);
            return layeredMethods.forEach(function(ea) {
                var layer = Global[ea.layerName];
                if (!layer) throw new Error("could not find layer: " + ea.layerName);
                ea.getterMethod || ea.setterMethod ? (ea.getterMethod && cop.layerGetterMethod(layer, klass.prototype, ea.methodName, ea.getterMethod), ea.setterMethod && cop.layerSetterMethod(layer, klass.prototype, ea.methodName, ea.setterMethod), cop.makePropertyLayerAware(klass.prototype, ea.methodName)) : cop.layerMethod(layer, klass.prototype, ea.methodName, ea.methodBody)
            }), klass
        })
    }), cop.resetLayerStack(), cop.dynamicInlining && module("cop.Flatten").load(!0)
}), StringBuffer.prototype.nextPutAll = function(s) {
    this.strings.push(s)
}, StringBuffer.prototype.contents = function() {
    return this.strings.join("")
}, String.prototype.writeStream = function() {
    return new StringBuffer(this)
}, printOn = function(x, ws) {
    if (void 0 === x || null === x) ws.nextPutAll("" + x);
    else if (x.constructor === Array) {
        ws.nextPutAll("[");
        for (var idx = 0; idx < x.length; idx++) idx > 0 && ws.nextPutAll(", "), printOn(x[idx], ws);
        ws.nextPutAll("]")
    } else ws.nextPutAll(x.toString())
}, Array.prototype.ometaToString = function() {
    var ws = "".writeStream();
    return printOn(this, ws), ws.contents()
}, objectThatDelegatesTo = function(x, props) {
    var f = function() {};
    f.prototype = x;
    var r = new f;
    for (var p in props) props.hasOwnProperty(p) && (r[p] = props[p]);
    return r
}, ownPropertyNames = function(x) {
    var r = [];
    for (var name in x) x.hasOwnProperty(name) && r.push(name);
    return r
}, isImmutable = function(x) {
    return null === x || void 0 === x || "boolean" == typeof x || "number" == typeof x || "string" == typeof x
}, String.prototype.digitValue = function() {
    return this.charCodeAt(0) - "0".charCodeAt(0)
}, isSequenceable = function(x) {
    return "string" == typeof x || x.constructor === Array
}, Array.prototype.map = Array.prototype.map || function(f) {
    for (var r = [], idx = 0; idx < this.length; idx++) r[idx] = f(this[idx]);
    return r
}, Array.prototype.reduce = Array.prototype.reduce || function(f, z) {
    for (var r = z, idx = 0; idx < this.length; idx++) r = f(r, this[idx]);
    return r
}, Array.prototype.delimWith = function(d) {
    return this.reduce(function(xs, x) {
        return xs.length > 0 && xs.push(d), xs.push(x), xs
    }, [])
}, ReadStream.prototype.atEnd = function() {
    return this.pos >= this.src.length
}, ReadStream.prototype.next = function() {
    return this.src.at(this.pos++)
}, String.prototype.pad = function(s, len) {
    for (var r = this; r.length < len;) r = s + r;
    return r
}, escapeStringFor = new Object;
for (var c = 0; 128 > c; c++) escapeStringFor[c] = String.fromCharCode(c);
escapeStringFor["'".charCodeAt(0)] = "\\'", escapeStringFor['"'.charCodeAt(0)] = '\\"', escapeStringFor["\\".charCodeAt(0)] = "\\\\", escapeStringFor["\b".charCodeAt(0)] = "\\b", escapeStringFor["\f".charCodeAt(0)] = "\\f", escapeStringFor["\n".charCodeAt(0)] = "\\n", escapeStringFor["\r".charCodeAt(0)] = "\\r", escapeStringFor[" ".charCodeAt(0)] = "\\t", escapeStringFor["".charCodeAt(0)] = "\\v", escapeChar = function(c) {
    var charCode = c.charCodeAt(0);
    return 128 > charCode ? escapeStringFor[charCode] : charCode >= 128 && 256 > charCode ? "\\x" + charCode.toString(16).pad("0", 2) : "\\u" + charCode.toString(16).pad("0", 4)
}, String.prototype.toProgramString = function() {
    for (var ws = '"'.writeStream(), idx = 0; idx < this.length; idx++) ws.nextPutAll(escapeChar(this.charAt(idx)));
    return ws.nextPutAll('"'), ws.contents()
}, tempnam.n = 0, getTag = function() {
    var numIdx = 0;
    return function(x) {
        if (null === x || void 0 === x) return x;
        switch (typeof x) {
            case "boolean":
                return 1 == x ? "Btrue" : "Bfalse";
            case "string":
                return "S" + x;
            case "number":
                return "N" + x;
            default:
                return x.hasOwnProperty("_id_") ? x._id_ : x._id_ = "R" + numIdx++
        }
    }
}(), fail = {
    toString: function() {
        return "match failed"
    }
}, OMInputStream.prototype.head = function() {
    return this.hd
}, OMInputStream.prototype.tail = function() {
    return this.tl
}, OMInputStream.prototype.type = function() {
    return this.lst.constructor
}, OMInputStream.prototype.upTo = function(that) {
    for (var r = [], curr = this; curr != that;) r.push(curr.head()), curr = curr.tail();
    return this.type() == String ? r.join("") : r
}, OMInputStreamEnd.prototype = objectThatDelegatesTo(OMInputStream.prototype), OMInputStreamEnd.prototype.head = function() {
    throw fail
}, OMInputStreamEnd.prototype.tail = function() {
    throw fail
}, Array.prototype.at = function(idx) {
    return this[idx]
}, String.prototype.at = String.prototype.charAt, ListOMInputStream.prototype = objectThatDelegatesTo(OMInputStream.prototype), ListOMInputStream.prototype.head = function() {
    return this.hd
}, ListOMInputStream.prototype.tail = function() {
    return this.tl || (this.tl = makeListOMInputStream(this.lst, this.idx + 1))
}, Array.prototype.toOMInputStream = function() {
    return makeListOMInputStream(this, 0)
}, String.prototype.toOMInputStream = function() {
    return makeListOMInputStream(this, 0)
}, Failer.prototype.used = !1, OMeta = {
    _apply: function(rule) {
        var memoRec = this.input.memo[rule];
        if (void 0 == memoRec) {
            var origInput = this.input,
                failer = new Failer;
            if (void 0 === this[rule]) throw 'tried to apply undefined rule "' + rule + '"';
            if (this.input.memo[rule] = failer, this.input.memo[rule] = memoRec = {
                    ans: this[rule].call(this),
                    nextInput: this.input
                }, failer.used) {
                var sentinel = this.input;
                this._applyTryRules(origInput, rule, sentinel, memoRec)
            }
        } else if (memoRec instanceof Failer) throw memoRec.used = !0, fail;
        return this.input = memoRec.nextInput, memoRec.ans
    },
    _applyTryRules: function(origInput, rule, sentinel, memoRec) {
        for (;;) try {
            this.input = origInput;
            var ans = this[rule].call(this);
            if (this.input == sentinel) throw fail;
            memoRec.ans = ans, memoRec.nextInput = this.input
        } catch (f) {
            if (f != fail) throw f;
            break
        }
    },
    _applyWithArgs: function(rule) {
        for (var ruleFn = this[rule], ruleFnArity = ruleFn.length, idx = arguments.length - 1; idx >= ruleFnArity + 1; idx--) this._prependInput(arguments[idx]);
        return 0 == ruleFnArity ? ruleFn.call(this) : ruleFn.apply(this, Array.prototype.slice.call(arguments, 1, ruleFnArity + 1))
    },
    _superApplyWithArgs: function(recv, rule) {
        for (var ruleFn = this[rule], ruleFnArity = ruleFn.length, idx = arguments.length - 1; idx > ruleFnArity + 2; idx--) recv._prependInput(arguments[idx]);
        return 0 == ruleFnArity ? ruleFn.call(recv) : ruleFn.apply(recv, Array.prototype.slice.call(arguments, 2, ruleFnArity + 2))
    },
    _prependInput: function(v) {
        this.input = new OMInputStream(v, this.input)
    },
    memoizeParameterizedRules: function() {
        this._prependInput = function(v) {
            var newInput;
            isImmutable(v) ? (newInput = this.input[getTag(v)], newInput || (newInput = new OMInputStream(v, this.input), this.input[getTag(v)] = newInput)) : newInput = new OMInputStream(v, this.input), this.input = newInput
        }, this._applyWithArgs = function(rule) {
            for (var ruleFnArity = this[rule].length, idx = arguments.length - 1; idx >= ruleFnArity + 1; idx--) this._prependInput(arguments[idx]);
            return 0 == ruleFnArity ? this._apply(rule) : this[rule].apply(this, Array.prototype.slice.call(arguments, 1, ruleFnArity + 1))
        }
    },
    _pred: function(b) {
        if (b) return !0;
        throw fail
    },
    _not: function(x) {
        var origInput = this.input;
        try {
            x.call(this)
        } catch (f) {
            if (f != fail) throw f;
            return this.input = origInput, !0
        }
        throw fail
    },
    _lookahead: function(x) {
        var origInput = this.input,
            r = x.call(this);
        return this.input = origInput, r
    },
    _or: function() {
        for (var origInput = this.input, idx = 0; idx < arguments.length; idx++) try {
            return this.input = origInput, arguments[idx].call(this)
        } catch (f) {
            if (f != fail) throw f
        }
        throw fail
    },
    _xor: function(ruleName) {
        for (var newInput, ans, origInput = this.input, idx = 1; idx < arguments.length;) {
            try {
                if (this.input = origInput, ans = arguments[idx].call(this), newInput) throw 'more than one choice matched by "exclusive-OR" in ' + ruleName;
                newInput = this.input
            } catch (f) {
                if (f != fail) throw f
            }
            idx++
        }
        if (newInput) return this.input = newInput, ans;
        throw fail
    },
    disableXORs: function() {
        this._xor = this._or
    },
    _opt: function(x) {
        var ans, origInput = this.input;
        try {
            ans = x.call(this)
        } catch (f) {
            if (f != fail) throw f;
            this.input = origInput
        }
        return ans
    },
    _many: function(x) {
        for (var ans = void 0 != arguments[1] ? [arguments[1]] : [];;) {
            var origInput = this.input;
            try {
                ans.push(x.call(this))
            } catch (f) {
                if (f != fail) throw f;
                this.input = origInput;
                break
            }
        }
        return ans
    },
    _many1: function(x) {
        return this._many(x, x.call(this))
    },
    _form: function(x) {
        var v = this._apply("anything");
        if (!isSequenceable(v)) throw fail;
        var origInput = this.input;
        return this.input = v.toOMInputStream(), x.call(this), this._apply("end"), this.input = origInput, v
    },
    _consumedBy: function(x) {
        var origInput = this.input;
        return x.call(this), origInput.upTo(this.input)
    },
    _idxConsumedBy: function(x) {
        var origInput = this.input;
        return x.call(this), {
            fromIdx: origInput.idx,
            toIdx: this.input.idx
        }
    },
    _interleave: function() {
        for (var currInput = this.input, ans = [], idx = 0; idx < arguments.length; idx += 2) ans[idx / 2] = "*" == arguments[idx] || "+" == arguments[idx] ? [] : void 0;
        for (;;) {
            for (var idx = 0, allDone = !0; idx < arguments.length;) {
                if ("0" != arguments[idx]) try {
                    switch (this.input = currInput, arguments[idx]) {
                        case "*":
                            ans[idx / 2].push(arguments[idx + 1].call(this));
                            break;
                        case "+":
                            ans[idx / 2].push(arguments[idx + 1].call(this)), arguments[idx] = "*";
                            break;
                        case "?":
                            ans[idx / 2] = arguments[idx + 1].call(this), arguments[idx] = "0";
                            break;
                        case "1":
                            ans[idx / 2] = arguments[idx + 1].call(this), arguments[idx] = "0";
                            break;
                        default:
                            throw "invalid mode '" + arguments[idx] + "' in OMeta._interleave"
                    }
                    currInput = this.input;
                    break
                } catch (f) {
                    if (f != fail) throw f;
                    allDone = allDone && ("*" == arguments[idx] || "?" == arguments[idx])
                }
                idx += 2
            }
            if (idx == arguments.length) {
                if (allDone) return ans;
                throw fail
            }
        }
    },
    _currIdx: function() {
        return this.input.idx
    },
    anything: function() {
        var r = this.input.head();
        return this.input = this.input.tail(), r
    },
    end: function() {
        return this._not(function() {
            return this._apply("anything")
        })
    },
    pos: function() {
        return this.input.idx
    },
    empty: function() {
        return !0
    },
    apply: function(r) {
        return this._apply(r)
    },
    foreign: function(g, r) {
        var gi = objectThatDelegatesTo(g, {
                input: makeOMInputStreamProxy(this.input)
            }),
            ans = gi._apply(r);
        return this.input = gi.input.target, ans
    },
    exactly: function(wanted) {
        if (wanted === this._apply("anything")) return wanted;
        throw fail
    },
    "true": function() {
        var r = this._apply("anything");
        return this._pred(r === !0), r
    },
    "false": function() {
        var r = this._apply("anything");
        return this._pred(r === !1), r
    },
    undefined: function() {
        var r = this._apply("anything");
        return this._pred(void 0 === r), r
    },
    number: function() {
        var r = this._apply("anything");
        return this._pred("number" == typeof r), r
    },
    string: function() {
        var r = this._apply("anything");
        return this._pred("string" == typeof r), r
    },
    "char": function() {
        var r = this._apply("anything");
        return this._pred("string" == typeof r && 1 == r.length), r
    },
    space: function() {
        var r = this._apply("char"),
            code = r.charCodeAt(0);
        return this._pred(32 >= code || 160 === code), r
    },
    spaces: function() {
        return this._many(function() {
            return this._apply("space")
        })
    },
    digit: function() {
        var r = this._apply("char");
        return this._pred(r >= "0" && "9" >= r), r
    },
    lower: function() {
        var r = this._apply("char");
        return this._pred(r >= "a" && "z" >= r), r
    },
    upper: function() {
        var r = this._apply("char");
        return this._pred(r >= "A" && "Z" >= r), r
    },
    letter: function() {
        return this._or(function() {
            return this._apply("lower")
        }, function() {
            return this._apply("upper")
        })
    },
    letterOrDigit: function() {
        return this._or(function() {
            return this._apply("letter")
        }, function() {
            return this._apply("digit")
        })
    },
    firstAndRest: function(first, rest) {
        return this._many(function() {
            return this._apply(rest)
        }, this._apply(first))
    },
    seq: function(xs) {
        for (var idx = 0; idx < xs.length; idx++) this._applyWithArgs("exactly", xs.at(idx));
        return xs
    },
    notLast: function(rule) {
        var r = this._apply(rule);
        return this._lookahead(function() {
            return this._apply(rule)
        }), r
    },
    listOf: function(rule, delim) {
        return this._or(function() {
            var r = this._apply(rule);
            return this._many(function() {
                return this._applyWithArgs("token", delim), this._apply(rule)
            }, r)
        }, function() {
            return []
        })
    },
    token: function(cs) {
        return this._apply("spaces"), this._applyWithArgs("seq", cs)
    },
    fromTo: function(x, y) {
        return this._consumedBy(function() {
            this._applyWithArgs("seq", x), this._many(function() {
                this._not(function() {
                    this._applyWithArgs("seq", y)
                }), this._apply("char")
            }), this._applyWithArgs("seq", y)
        })
    },
    initialize: function() {},
    _genericMatch: function(input, rule, args, matchFailed) {
        void 0 == args && (args = []);
        for (var realArgs = [rule], idx = 0; idx < args.length; idx++) realArgs.push(args[idx]);
        var m = objectThatDelegatesTo(this, {
            input: input
        });
        m.initialize();
        try {
            return 1 == realArgs.length ? m._apply.call(m, realArgs[0]) : m._applyWithArgs.apply(m, realArgs)
        } catch (f) {
            if (f == fail && void 0 != matchFailed) {
                var input = m.input;
                if (void 0 != input.idx) {
                    for (; void 0 != input.tl && void 0 != input.tl.idx;) input = input.tl;
                    input.idx--
                }
                return matchFailed(m, input.idx)
            }
            throw f
        }
    },
    match: function(obj, rule, args, matchFailed) {
        var toString = Array.prototype.toString;
        Array.prototype.toString = Array.prototype.ometaToString;
        try {
            return this._genericMatch([obj].toOMInputStream(), rule, args, matchFailed)
        } finally {
            Array.prototype.toString = toString
        }
    },
    matchAll: function(listyObj, rule, args, matchFailed) {
        var toString = Array.prototype.toString;
        Array.prototype.toString = Array.prototype.ometaToString;
        try {
            return this._genericMatch(listyObj.toOMInputStream(), rule, args, matchFailed)
        } finally {
            Array.prototype.toString = toString
        }
    },
    createInstance: function() {
        var m = objectThatDelegatesTo(this);
        return m.initialize(), m.matchAll = function(listyObj, aRule) {
            return this.input = listyObj.toOMInputStream(), this._apply(aRule)
        }, m
    }
}, Parser = objectThatDelegatesTo(OMeta, {}), Global.ChunkParser = {
    start: function(ometaParser, chunkStart, chunkEnd) {
        this.ometaParser = ometaParser, this.isString = chunkStart === chunkEnd && ("'" === chunkStart || '"' === chunkStart), this.chunkStart = chunkStart, this.chunkEnd = chunkEnd, this.chunkEndFound = !1, this.next = null, this.counter = 0, this.result = [], this.parseStart();
        do this.makeStep(); while (!this.parseRest());
        return this.result
    },
    parseStart: function() {
        this.result.push(this.ometaParser._applyWithArgs("exactly", this.chunkStart))
    },
    makeStep: function() {
        return this.next = this.ometaParser._apply("anything"), this.result.push(this.next), this.nextNext = this.ometaParser.input.hd, this.next
    },
    backup: function() {
        this.backupRecorded = !0, this.backupInput = this.ometaParser.input, this.backupNext = this.next, this.backupNextNext = this.nextNext, this.backupCounter = this.counter, this.backupResult = this.result
    },
    useBackup: function() {
        if (!this.backupRecorded) throw dbgOn(new Error("Using Chunk parser backup but did not record it!"));
        this.ometaParser.input = this.backupInput, this.next = this.backupNext, this.nextNext = this.backupNextNext, this.counter = this.backupCounter, this.result = this.backupResult
    },
    parseEscapedChar: function() {
        for (;
            "\\" === this.next;) this.makeStep(), this.makeStep()
    },
    parseComment: function() {
        if ("/" !== this.next) return !1;
        var comment1Opened = "/" === this.nextNext,
            comment2Opened = "*" === this.nextNext;
        if (comment1Opened || comment2Opened)
            for (this.makeStep(), this.makeStep();;) {
                if (this.parseEscapedChar(), comment1Opened && ("\n" === this.next || "\r" === this.next)) return;
                if (comment2Opened && "*" === this.next && "/" === this.nextNext && this.makeStep()) return;
                this.makeStep()
            }
    },
    parseString: function() {
        var string1Opened, string2Opened;
        if ("'" !== this.chunkStart && '"' !== this.chunkStart && ("'" === this.next && (string1Opened = !0), '"' === this.next && (string2Opened = !0), string1Opened || string2Opened))
            for (this.makeStep();;) {
                if (this.parseEscapedChar(), string1Opened && "'" === this.next) return;
                if (string2Opened && '"' === this.next) return;
                this.makeStep()
            }
    },
    parseRegex: function() {
        var regexOpen = "/" === this.next && "*" !== this.nextNext && "/" !== this.nextNext;
        if (regexOpen)
            for (this.backup(), this.makeStep();;) {
                if (this.parseEscapedChar(), "\n" === this.next || "\r" === this.next) return this.useBackup(), void 0;
                if ("/" === this.next) return;
                this.makeStep()
            }
    },
    parseRest: function() {
        return this.parseEscapedChar(), this.isString || (this.parseRegex(), this.parseString(), this.parseComment()), this.next === this.chunkEnd && 0 === this.counter ? !0 : this.next === this.chunkEnd ? (this.counter--, !1) : (this.next === this.chunkStart && this.counter++, !1)
    }
}, OMeta.basicChunk = function() {
    var chunkStart = this._apply("anything"),
        chunkEnd = this._apply("anything");
    return this.chunkParser || (this.chunkParser = objectThatDelegatesTo(ChunkParser, {})), this.chunkParser.start(this, chunkStart, chunkEnd)
}, BSOMetaParser = objectThatDelegatesTo(OMeta, {
    space: function() {
        return this.input.idx, this._or(function() {
            return OMeta._superApplyWithArgs(this, "space")
        }, function() {
            return this._applyWithArgs("fromTo", "//", "\n")
        }, function() {
            return this._applyWithArgs("fromTo", "/*", "*/")
        })
    },
    nameFirst: function() {
        return this.input.idx, this._or(function() {
            return function() {
                switch (this._apply("anything")) {
                    case "_":
                        return "_";
                    case "$":
                        return "$";
                    default:
                        throw fail
                }
            }.call(this)
        }, function() {
            return this._apply("letter")
        })
    },
    nameRest: function() {
        return this.input.idx, this._or(function() {
            return this._apply("nameFirst")
        }, function() {
            return this._apply("digit")
        })
    },
    tsName: function() {
        return this.input.idx, this._consumedBy(function() {
            return function() {
                return this._apply("nameFirst"), this._many(function() {
                    return this._apply("nameRest")
                })
            }.call(this)
        })
    },
    name: function() {
        return this.input.idx,
            function() {
                return this._apply("spaces"), this._apply("tsName")
            }.call(this)
    },
    hexDigit: function() {
        var x, v;
        return this.input.idx,
            function() {
                return x = this._apply("char"), v = this.hexDigits.indexOf(x.toLowerCase()), this._pred(v >= 0), v
            }.call(this)
    },
    eChar: function() {
        var s;
        return this.input.idx, this._or(function() {
            return function() {
                return s = this._consumedBy(function() {
                    return function() {
                        return this._applyWithArgs("exactly", "\\"), this._or(function() {
                            return function() {
                                switch (this._apply("anything")) {
                                    case "u":
                                        return function() {
                                            return this._apply("hexDigit"), this._apply("hexDigit"), this._apply("hexDigit"), this._apply("hexDigit")
                                        }.call(this);
                                    case "x":
                                        return function() {
                                            return this._apply("hexDigit"), this._apply("hexDigit")
                                        }.call(this);
                                    default:
                                        throw fail
                                }
                            }.call(this)
                        }, function() {
                            return this._apply("char")
                        })
                    }.call(this)
                }), unescape(s)
            }.call(this)
        }, function() {
            return this._apply("char")
        })
    },
    tsString: function() {
        var xs;
        return this.input.idx,
            function() {
                return this._applyWithArgs("exactly", "'"), xs = this._many(function() {
                    return function() {
                        return this._not(function() {
                            return this._applyWithArgs("exactly", "'")
                        }), this._apply("eChar")
                    }.call(this)
                }), this._applyWithArgs("exactly", "'"), xs.join("")
            }.call(this)
    },
    characters: function() {
        var xs;
        return this.input.idx,
            function() {
                return this._applyWithArgs("exactly", "`"), this._applyWithArgs("exactly", "`"), xs = this._many(function() {
                    return function() {
                        return this._not(function() {
                            return function() {
                                return this._applyWithArgs("exactly", "'"), this._applyWithArgs("exactly", "'")
                            }.call(this)
                        }), this._apply("eChar")
                    }.call(this)
                }), this._applyWithArgs("exactly", "'"), this._applyWithArgs("exactly", "'"), ["App", "seq", xs.join("").toProgramString()]
            }.call(this)
    },
    sCharacters: function() {
        var xs;
        return this.input.idx,
            function() {
                return this._applyWithArgs("exactly", '"'), xs = this._many(function() {
                    return function() {
                        return this._not(function() {
                            return this._applyWithArgs("exactly", '"')
                        }), this._apply("eChar")
                    }.call(this)
                }), this._applyWithArgs("exactly", '"'), ["App", "token", xs.join("").toProgramString()]
            }.call(this)
    },
    string: function() {
        var xs;
        return this.input.idx,
            function() {
                return xs = this._or(function() {
                    return function() {
                        return function() {
                            switch (this._apply("anything")) {
                                case "#":
                                    return "#";
                                case "`":
                                    return "`";
                                default:
                                    throw fail
                            }
                        }.call(this), this._apply("tsName")
                    }.call(this)
                }, function() {
                    return this._apply("tsString")
                }), ["App", "exactly", xs.toProgramString()]
            }.call(this)
    },
    number: function() {
        var n;
        return this.input.idx,
            function() {
                return n = this._consumedBy(function() {
                    return function() {
                        return this._opt(function() {
                            return this._applyWithArgs("exactly", "-")
                        }), this._many1(function() {
                            return this._apply("digit")
                        })
                    }.call(this)
                }), ["App", "exactly", n]
            }.call(this)
    },
    keyword: function() {
        var xs;
        return this.input.idx,
            function() {
                return xs = this._apply("anything"), this._applyWithArgs("token", xs), this._not(function() {
                    return this._apply("letterOrDigit")
                }), xs
            }.call(this)
    },
    args: function() {
        var xs;
        return this.input.idx, this._or(function() {
            return function() {
                switch (this._apply("anything")) {
                    case "(":
                        return function() {
                            return xs = this._applyWithArgs("listOf", "hostExpr", ","), this._applyWithArgs("token", ")"), xs
                        }.call(this);
                    default:
                        throw fail
                }
            }.call(this)
        }, function() {
            return function() {
                return this._apply("empty"), []
            }.call(this)
        })
    },
    application: function() {
        var rule, as, grm;
        return this.input.idx, this._or(function() {
            return function() {
                return this._applyWithArgs("token", "^"), rule = this._apply("name"), as = this._apply("args"), ["App", "super", "'" + rule + "'"].concat(as)
            }.call(this)
        }, function() {
            return function() {
                return grm = this._apply("name"), this._applyWithArgs("token", "."), rule = this._apply("name"), as = this._apply("args"), ["App", "foreign", grm, "'" + rule + "'"].concat(as)
            }.call(this)
        }, function() {
            return function() {
                return rule = this._apply("name"), as = this._apply("args"), ["App", rule].concat(as)
            }.call(this)
        })
    },
    hostExpr: function() {
        var r;
        return this.input.idx,
            function() {
                return r = this._applyWithArgs("foreign", BSSemActionParser, "expr"), this._applyWithArgs("foreign", BSJSTranslator, "trans", r)
            }.call(this)
    },
    curlyHostExpr: function() {
        var r;
        return this.input.idx,
            function() {
                return r = this._applyWithArgs("foreign", BSSemActionParser, "curlySemAction"), this._applyWithArgs("foreign", BSJSTranslator, "trans", r)
            }.call(this)
    },
    primHostExpr: function() {
        var r;
        return this.input.idx,
            function() {
                return r = this._applyWithArgs("foreign", BSSemActionParser, "semAction"), this._applyWithArgs("foreign", BSJSTranslator, "trans", r)
            }.call(this)
    },
    atomicHostExpr: function() {
        return this.input.idx, this._or(function() {
            return this._apply("curlyHostExpr")
        }, function() {
            return this._apply("primHostExpr")
        })
    },
    semAction: function() {
        var x;
        return this.input.idx, this._or(function() {
            return function() {
                return x = this._apply("curlyHostExpr"), ["Act", x]
            }.call(this)
        }, function() {
            return function() {
                return this._applyWithArgs("token", "!"), x = this._apply("atomicHostExpr"), ["Act", x]
            }.call(this)
        })
    },
    arrSemAction: function() {
        var x;
        return this.input.idx,
            function() {
                return this._applyWithArgs("token", "->"), x = this._apply("atomicHostExpr"), ["Act", x]
            }.call(this)
    },
    semPred: function() {
        var x;
        return this.input.idx,
            function() {
                return this._applyWithArgs("token", "?"), x = this._apply("atomicHostExpr"), ["Pred", x]
            }.call(this)
    },
    expr: function() {
        var x, xs;
        return this.input.idx, this._or(function() {
            return function() {
                return x = this._applyWithArgs("expr5", !0), xs = this._many1(function() {
                    return function() {
                        return this._applyWithArgs("token", "|"), this._applyWithArgs("expr5", !0)
                    }.call(this)
                }), ["Or", x].concat(xs)
            }.call(this)
        }, function() {
            return function() {
                return x = this._applyWithArgs("expr5", !0), xs = this._many1(function() {
                    return function() {
                        return this._applyWithArgs("token", "||"), this._applyWithArgs("expr5", !0)
                    }.call(this)
                }), ["XOr", x].concat(xs)
            }.call(this)
        }, function() {
            return this._applyWithArgs("expr5", !1)
        })
    },
    expr5: function() {
        var ne, x, xs;
        return this.input.idx,
            function() {
                return ne = this._apply("anything"), this._or(function() {
                    return function() {
                        return x = this._apply("interleavePart"), xs = this._many1(function() {
                            return function() {
                                return this._applyWithArgs("token", "&&"), this._apply("interleavePart")
                            }.call(this)
                        }), ["Interleave", x].concat(xs)
                    }.call(this)
                }, function() {
                    return this._applyWithArgs("expr4", ne)
                })
            }.call(this)
    },
    interleavePart: function() {
        var part;
        return this.input.idx, this._or(function() {
            return function() {
                return this._applyWithArgs("token", "("), part = this._applyWithArgs("expr4", !0), this._applyWithArgs("token", ")"), ["1", part]
            }.call(this)
        }, function() {
            return function() {
                return part = this._applyWithArgs("expr4", !0), this._applyWithArgs("modedIPart", part)
            }.call(this)
        })
    },
    modedIPart: function() {
        var part;
        return this.input.idx, this._or(function() {
            return function() {
                return this._form(function() {
                    return function() {
                        return this._applyWithArgs("exactly", "And"), this._form(function() {
                            return function() {
                                return this._applyWithArgs("exactly", "Many"), part = this._apply("anything")
                            }.call(this)
                        })
                    }.call(this)
                }), ["*", part]
            }.call(this)
        }, function() {
            return function() {
                return this._form(function() {
                    return function() {
                        return this._applyWithArgs("exactly", "And"), this._form(function() {
                            return function() {
                                return this._applyWithArgs("exactly", "Many1"), part = this._apply("anything")
                            }.call(this)
                        })
                    }.call(this)
                }), ["+", part]
            }.call(this)
        }, function() {
            return function() {
                return this._form(function() {
                    return function() {
                        return this._applyWithArgs("exactly", "And"), this._form(function() {
                            return function() {
                                return this._applyWithArgs("exactly", "Opt"), part = this._apply("anything")
                            }.call(this)
                        })
                    }.call(this)
                }), ["?", part]
            }.call(this)
        }, function() {
            return function() {
                return part = this._apply("anything"), ["1", part]
            }.call(this)
        })
    },
    expr4: function() {
        var ne, xs, act;
        return this.input.idx,
            function() {
                return ne = this._apply("anything"), this._or(function() {
                    return function() {
                        return xs = this._many(function() {
                            return this._apply("expr3")
                        }), act = this._apply("arrSemAction"), ["And"].concat(xs).concat([act])
                    }.call(this)
                }, function() {
                    return function() {
                        return this._pred(ne), xs = this._many1(function() {
                            return this._apply("expr3")
                        }), ["And"].concat(xs)
                    }.call(this)
                }, function() {
                    return function() {
                        return this._pred(0 == ne), xs = this._many(function() {
                            return this._apply("expr3")
                        }), ["And"].concat(xs)
                    }.call(this)
                })
            }.call(this)
    },
    optIter: function() {
        var x;
        return this.input.idx,
            function() {
                return x = this._apply("anything"), this._or(function() {
                    return function() {
                        switch (this._apply("anything")) {
                            case "*":
                                return ["Many", x];
                            case "+":
                                return ["Many1", x];
                            case "?":
                                return ["Opt", x];
                            default:
                                throw fail
                        }
                    }.call(this)
                }, function() {
                    return function() {
                        return this._apply("empty"), x
                    }.call(this)
                })
            }.call(this)
    },
    optBind: function() {
        var x, n;
        return this.input.idx,
            function() {
                return x = this._apply("anything"), this._or(function() {
                    return function() {
                        switch (this._apply("anything")) {
                            case ":":
                                return function() {
                                    return n = this._apply("name"),
                                        function() {
                                            return this.locals[n] = !0, ["Set", n, x]
                                        }.call(this)
                                }.call(this);
                            default:
                                throw fail
                        }
                    }.call(this)
                }, function() {
                    return function() {
                        return this._apply("empty"), x
                    }.call(this)
                })
            }.call(this)
    },
    expr3: function() {
        var n, x, e;
        return this.input.idx, this._or(function() {
            return function() {
                return this._applyWithArgs("token", ":"), n = this._apply("name"),
                    function() {
                        return this.locals[n] = !0, ["Set", n, ["App", "anything"]]
                    }.call(this)
            }.call(this)
        }, function() {
            return function() {
                return e = this._or(function() {
                    return function() {
                        return x = this._apply("expr2"), this._applyWithArgs("optIter", x)
                    }.call(this)
                }, function() {
                    return this._apply("semAction")
                }), this._applyWithArgs("optBind", e)
            }.call(this)
        }, function() {
            return this._apply("semPred")
        })
    },
    expr2: function() {
        var x;
        return this.input.idx, this._or(function() {
            return function() {
                return this._applyWithArgs("token", "~"), x = this._apply("expr2"), ["Not", x]
            }.call(this)
        }, function() {
            return function() {
                return this._applyWithArgs("token", "&"), x = this._apply("expr1"), ["Lookahead", x]
            }.call(this)
        }, function() {
            return this._apply("expr1")
        })
    },
    expr1: function() {
        var x;
        return this.input.idx, this._or(function() {
            return this._apply("application")
        }, function() {
            return function() {
                return x = this._or(function() {
                    return this._applyWithArgs("keyword", "undefined")
                }, function() {
                    return this._applyWithArgs("keyword", "nil")
                }, function() {
                    return this._applyWithArgs("keyword", "true")
                }, function() {
                    return this._applyWithArgs("keyword", "false")
                }), ["App", "exactly", x]
            }.call(this)
        }, function() {
            return function() {
                return this._apply("spaces"), this._or(function() {
                    return this._apply("characters")
                }, function() {
                    return this._apply("sCharacters")
                }, function() {
                    return this._apply("string")
                }, function() {
                    return this._apply("number")
                })
            }.call(this)
        }, function() {
            return function() {
                return this._applyWithArgs("token", "["), x = this._apply("expr"), this._applyWithArgs("token", "]"), ["Form", x]
            }.call(this)
        }, function() {
            return function() {
                return this._applyWithArgs("token", "<"), x = this._apply("expr"), this._applyWithArgs("token", ">"), ["ConsBy", x]
            }.call(this)
        }, function() {
            return function() {
                return this._applyWithArgs("token", "@<"), x = this._apply("expr"), this._applyWithArgs("token", ">"), ["IdxConsBy", x]
            }.call(this)
        }, function() {
            return function() {
                return this._applyWithArgs("token", "("), x = this._apply("expr"), this._applyWithArgs("token", ")"), x
            }.call(this)
        })
    },
    ruleName: function() {
        return this.input.idx, this._or(function() {
            return this._apply("name")
        }, function() {
            return function() {
                return this._apply("spaces"), this._apply("tsString")
            }.call(this)
        })
    },
    rule: function() {
        var n, x, xs;
        return this.input.idx,
            function() {
                return this._lookahead(function() {
                    return n = this._apply("ruleName")
                }), this.locals = {
                    "$elf=this": !0,
                    "_fromIdx=this.input.idx": !0
                }, x = this._applyWithArgs("rulePart", n), xs = this._many(function() {
                    return function() {
                        return this._applyWithArgs("token", ","), this._applyWithArgs("rulePart", n)
                    }.call(this)
                }), ["Rule", n, ownPropertyNames(this.locals), ["Or", x].concat(xs)]
            }.call(this)
    },
    rulePart: function() {
        var rn, n, b1, b2;
        return this.input.idx,
            function() {
                return rn = this._apply("anything"), n = this._apply("ruleName"), this._pred(n == rn), b1 = this._applyWithArgs("expr4", !1), this._or(function() {
                    return function() {
                        return this._applyWithArgs("token", "="), b2 = this._apply("expr"), ["And", b1, b2]
                    }.call(this)
                }, function() {
                    return function() {
                        return this._apply("empty"), b1
                    }.call(this)
                })
            }.call(this)
    },
    grammar: function() {
        var n, sn, rs;
        return this.input.idx,
            function() {
                return this._applyWithArgs("keyword", "ometa"), n = this._apply("name"), sn = this._or(function() {
                    return function() {
                        return this._applyWithArgs("token", "<:"), this._apply("name")
                    }.call(this)
                }, function() {
                    return function() {
                        return this._apply("empty"), "OMeta"
                    }.call(this)
                }), this._applyWithArgs("token", "{"), rs = this._applyWithArgs("listOf", "rule", ","), this._applyWithArgs("token", "}"), this._applyWithArgs("foreign", BSOMetaOptimizer, "optimizeGrammar", ["Grammar", n, sn].concat(rs))
            }.call(this)
    }
}), BSOMetaParser.hexDigits = "0123456789abcdef", BSOMetaTranslator = objectThatDelegatesTo(OMeta, {
    App: function() {
        var args, rule;
        return this.input.idx, this._or(function() {
            return function() {
                switch (this._apply("anything")) {
                    case "super":
                        return function() {
                            return args = this._many1(function() {
                                return this._apply("anything")
                            }), [this.sName, "._superApplyWithArgs(this,", args.join(","), ")"].join("")
                        }.call(this);
                    default:
                        throw fail
                }
            }.call(this)
        }, function() {
            return function() {
                return rule = this._apply("anything"), args = this._many1(function() {
                    return this._apply("anything")
                }), ['this._applyWithArgs("', rule, '",', args.join(","), ")"].join("")
            }.call(this)
        }, function() {
            return function() {
                return rule = this._apply("anything"), ['this._apply("', rule, '")'].join("")
            }.call(this)
        })
    },
    Act: function() {
        var expr;
        return this.input.idx,
            function() {
                return expr = this._apply("anything")
            }.call(this)
    },
    Pred: function() {
        var expr;
        return this.input.idx,
            function() {
                return expr = this._apply("anything"), ["this._pred(", expr, ")"].join("")
            }.call(this)
    },
    Or: function() {
        var xs;
        return this.input.idx,
            function() {
                return xs = this._many(function() {
                    return this._apply("transFn")
                }), ["this._or(", xs.join(","), ")"].join("")
            }.call(this)
    },
    XOr: function() {
        var xs;
        return this.input.idx,
            function() {
                return xs = this._many(function() {
                    return this._apply("transFn")
                }), xs.unshift((this.name + "." + this.rName).toProgramString()), ["this._xor(", xs.join(","), ")"].join("")
            }.call(this)
    },
    And: function() {
        var xs, y;
        return this.input.idx, this._or(function() {
            return function() {
                return xs = this._many(function() {
                    return this._applyWithArgs("notLast", "trans")
                }), y = this._apply("trans"), xs.push("return " + y), ["(function(){", xs.join(";"), "}).call(this)"].join("")
            }.call(this)
        }, function() {
            return "undefined"
        })
    },
    Opt: function() {
        var x;
        return this.input.idx,
            function() {
                return x = this._apply("transFn"), ["this._opt(", x, ")"].join("")
            }.call(this)
    },
    Many: function() {
        var x;
        return this.input.idx,
            function() {
                return x = this._apply("transFn"), ["this._many(", x, ")"].join("")
            }.call(this)
    },
    Many1: function() {
        var x;
        return this.input.idx,
            function() {
                return x = this._apply("transFn"), ["this._many1(", x, ")"].join("")
            }.call(this)
    },
    Set: function() {
        var n, v;
        return this.input.idx,
            function() {
                return n = this._apply("anything"), v = this._apply("trans"), [n, "=", v].join("")
            }.call(this)
    },
    Not: function() {
        var x;
        return this.input.idx,
            function() {
                return x = this._apply("transFn"), ["this._not(", x, ")"].join("")
            }.call(this)
    },
    Lookahead: function() {
        var x;
        return this.input.idx,
            function() {
                return x = this._apply("transFn"), ["this._lookahead(", x, ")"].join("")
            }.call(this)
    },
    Form: function() {
        var x;
        return this.input.idx,
            function() {
                return x = this._apply("transFn"), ["this._form(", x, ")"].join("")
            }.call(this)
    },
    ConsBy: function() {
        var x;
        return this.input.idx,
            function() {
                return x = this._apply("transFn"), ["this._consumedBy(", x, ")"].join("")
            }.call(this)
    },
    IdxConsBy: function() {
        var x;
        return this.input.idx,
            function() {
                return x = this._apply("transFn"), ["this._idxConsumedBy(", x, ")"].join("")
            }.call(this)
    },
    JumpTable: function() {
        var cases;
        return this.input.idx,
            function() {
                return cases = this._many(function() {
                    return this._apply("jtCase")
                }), this.jumpTableCode(cases)
            }.call(this)
    },
    Interleave: function() {
        var xs;
        return this.input.idx,
            function() {
                return xs = this._many(function() {
                    return this._apply("intPart")
                }), ["this._interleave(", xs.join(","), ")"].join("")
            }.call(this)
    },
    Rule: function() {
        var name, ls, body;
        return this.input.idx,
            function() {
                return name = this._apply("anything"), this.rName = name, ls = this._apply("locals"), body = this._apply("trans"), ['\n"', name, '":function(){', ls, "return ", body, "}"].join("")
            }.call(this)
    },
    Grammar: function() {
        var name, sName, rules;
        return this.input.idx,
            function() {
                return name = this._apply("anything"), sName = this._apply("anything"), this.name = name, this.sName = sName, rules = this._many(function() {
                    return this._apply("trans")
                }), [name, "=objectThatDelegatesTo(", sName, ",{", rules.join(","), "})"].join("")
            }.call(this)
    },
    intPart: function() {
        var mode, part;
        return this.input.idx,
            function() {
                return this._form(function() {
                    return function() {
                        return mode = this._apply("anything"), part = this._apply("transFn")
                    }.call(this)
                }), mode.toProgramString() + "," + part
            }.call(this)
    },
    jtCase: function() {
        var x, e;
        return this.input.idx,
            function() {
                return this._form(function() {
                    return function() {
                        return x = this._apply("anything"), e = this._apply("trans")
                    }.call(this)
                }), [x.toProgramString(), e]
            }.call(this)
    },
    locals: function() {
        var vs;
        return this.input.idx, this._or(function() {
            return function() {
                return this._form(function() {
                    return vs = this._many1(function() {
                        return this._apply("string")
                    })
                }), ["var ", vs.join(","), ";"].join("")
            }.call(this)
        }, function() {
            return function() {
                return this._form(function() {
                    return void 0
                }), ""
            }.call(this)
        })
    },
    trans: function() {
        var t, ans;
        return this.input.idx,
            function() {
                return this._form(function() {
                    return function() {
                        return t = this._apply("anything"), ans = this._applyWithArgs("apply", t)
                    }.call(this)
                }), ans
            }.call(this)
    },
    transFn: function() {
        var x;
        return this.input.idx,
            function() {
                return x = this._apply("trans"), ["(function(){return ", x, "})"].join("")
            }.call(this)
    }
}), BSOMetaTranslator.jumpTableCode = function(cases) {
    var buf = new StringBuffer;
    buf.nextPutAll("(function(){switch(this._apply('anything')){");
    for (var i = 0; i < cases.length; i += 1) buf.nextPutAll("case " + cases[i][0] + ":return " + cases[i][1] + ";");
    return buf.nextPutAll("default: throw fail}}).call(this)"), buf.contents()
}, BSJSParser = objectThatDelegatesTo(OMeta, {
    space: function() {
        return this.input.idx, this._or(function() {
            return OMeta._superApplyWithArgs(this, "space")
        }, function() {
            return this._applyWithArgs("fromTo", "//", "\n")
        }, function() {
            return this._applyWithArgs("fromTo", "/*", "*/")
        })
    },
    nameFirst: function() {
        return this.input.idx, this._or(function() {
            return this._apply("letter")
        }, function() {
            return function() {
                switch (this._apply("anything")) {
                    case "$":
                        return "$";
                    case "_":
                        return "_";
                    default:
                        throw fail
                }
            }.call(this)
        })
    },
    nameRest: function() {
        return this.input.idx, this._or(function() {
            return this._apply("nameFirst")
        }, function() {
            return this._apply("digit")
        })
    },
    iName: function() {
        return this.input.idx, this._consumedBy(function() {
            return function() {
                return this._apply("nameFirst"), this._many(function() {
                    return this._apply("nameRest")
                })
            }.call(this)
        })
    },
    isKeyword: function() {
        var x;
        return this.input.idx,
            function() {
                return x = this._apply("anything"), this._pred(BSJSParser._isKeyword(x))
            }.call(this)
    },
    name: function() {
        var n;
        return this.input.idx,
            function() {
                return n = this._apply("iName"), this._not(function() {
                    return this._applyWithArgs("isKeyword", n)
                }), ["name", "self" == n ? "$elf" : n]
            }.call(this)
    },
    keyword: function() {
        var k;
        return this.input.idx,
            function() {
                return k = this._apply("iName"), this._applyWithArgs("isKeyword", k), [k, k]
            }.call(this)
    },
    hexDigit: function() {
        var x, v;
        return this.input.idx,
            function() {
                return x = this._apply("char"), v = this.hexDigits.indexOf(x.toLowerCase()), this._pred(v >= 0), v
            }.call(this)
    },
    hexLit: function() {
        var n, d;
        return this.input.idx, this._or(function() {
            return function() {
                return n = this._apply("hexLit"), d = this._apply("hexDigit"), 16 * n + d
            }.call(this)
        }, function() {
            return this._apply("hexDigit")
        })
    },
    number: function() {
        var n, f;
        return this.input.idx, this._or(function() {
            return function() {
                switch (this._apply("anything")) {
                    case "0":
                        return function() {
                            return this._applyWithArgs("exactly", "x"), n = this._apply("hexLit"), ["number", n]
                        }.call(this);
                    default:
                        throw fail
                }
            }.call(this)
        }, function() {
            return function() {
                return f = this._consumedBy(function() {
                    return function() {
                        return this._many1(function() {
                            return this._apply("digit")
                        }), this._opt(function() {
                            return function() {
                                return this._applyWithArgs("exactly", "."), this._many1(function() {
                                    return this._apply("digit")
                                })
                            }.call(this)
                        })
                    }.call(this)
                }), ["number", parseFloat(f)]
            }.call(this)
        })
    },
    escapeChar: function() {
        var s;
        return this.input.idx,
            function() {
                return s = this._consumedBy(function() {
                    return function() {
                        return this._applyWithArgs("exactly", "\\"), this._or(function() {
                            return function() {
                                switch (this._apply("anything")) {
                                    case "u":
                                        return function() {
                                            return this._apply("hexDigit"), this._apply("hexDigit"), this._apply("hexDigit"), this._apply("hexDigit")
                                        }.call(this);
                                    case "x":
                                        return function() {
                                            return this._apply("hexDigit"), this._apply("hexDigit")
                                        }.call(this);
                                    default:
                                        throw fail
                                }
                            }.call(this)
                        }, function() {
                            return this._apply("char")
                        })
                    }.call(this)
                }), unescape(s)
            }.call(this)
    },
    str: function() {
        var cs, n;
        return this.input.idx, this._or(function() {
            return function() {
                switch (this._apply("anything")) {
                    case '"':
                        return this._or(function() {
                            return function() {
                                switch (this._apply("anything")) {
                                    case '"':
                                        return function() {
                                            return this._applyWithArgs("exactly", '"'), cs = this._many(function() {
                                                return function() {
                                                    return this._not(function() {
                                                        return function() {
                                                            return this._applyWithArgs("exactly", '"'), this._applyWithArgs("exactly", '"'), this._applyWithArgs("exactly", '"'), '"""'
                                                        }.call(this)
                                                    }), this._apply("char")
                                                }.call(this)
                                            }), this._applyWithArgs("exactly", '"'), this._applyWithArgs("exactly", '"'), this._applyWithArgs("exactly", '"'), ["string", cs.join("")]
                                        }.call(this);
                                    default:
                                        throw fail
                                }
                            }.call(this)
                        }, function() {
                            return function() {
                                return cs = this._many(function() {
                                    return this._or(function() {
                                        return this._apply("escapeChar")
                                    }, function() {
                                        return function() {
                                            return this._not(function() {
                                                return this._applyWithArgs("exactly", '"')
                                            }), this._apply("char")
                                        }.call(this)
                                    })
                                }), this._applyWithArgs("exactly", '"'), ["string", cs.join("")]
                            }.call(this)
                        });
                    case "'":
                        return function() {
                            return cs = this._many(function() {
                                return this._or(function() {
                                    return this._apply("escapeChar")
                                }, function() {
                                    return function() {
                                        return this._not(function() {
                                            return this._applyWithArgs("exactly", "'")
                                        }), this._apply("char")
                                    }.call(this)
                                })
                            }), this._applyWithArgs("exactly", "'"), ["string", cs.join("")]
                        }.call(this);
                    default:
                        throw fail
                }
            }.call(this)
        }, function() {
            return function() {
                return function() {
                    switch (this._apply("anything")) {
                        case "#":
                            return "#";
                        case "`":
                            return "`";
                        default:
                            throw fail
                    }
                }.call(this), n = this._apply("iName"), ["string", n]
            }.call(this)
        })
    },
    special: function() {
        var s;
        return this.input.idx,
            function() {
                return s = function() {
                    switch (this._apply("anything")) {
                        case "(":
                            return "(";
                        case ")":
                            return ")";
                        case "{":
                            return "{";
                        case "}":
                            return "}";
                        case "[":
                            return "[";
                        case "]":
                            return "]";
                        case ",":
                            return ",";
                        case ";":
                            return ";";
                        case "?":
                            return "?";
                        case ":":
                            return ":";
                        case "!":
                            return this._or(function() {
                                return function() {
                                    switch (this._apply("anything")) {
                                        case "=":
                                            return this._or(function() {
                                                return function() {
                                                    switch (this._apply("anything")) {
                                                        case "=":
                                                            return "!==";
                                                        default:
                                                            throw fail
                                                    }
                                                }.call(this)
                                            }, function() {
                                                return "!="
                                            });
                                        default:
                                            throw fail
                                    }
                                }.call(this)
                            }, function() {
                                return "!"
                            });
                        case "=":
                            return this._or(function() {
                                return function() {
                                    switch (this._apply("anything")) {
                                        case "=":
                                            return this._or(function() {
                                                return function() {
                                                    switch (this._apply("anything")) {
                                                        case "=":
                                                            return "===";
                                                        default:
                                                            throw fail
                                                    }
                                                }.call(this)
                                            }, function() {
                                                return "=="
                                            });
                                        default:
                                            throw fail
                                    }
                                }.call(this)
                            }, function() {
                                return "="
                            });
                        case ">":
                            return this._or(function() {
                                return function() {
                                    switch (this._apply("anything")) {
                                        case "=":
                                            return ">=";
                                        default:
                                            throw fail
                                    }
                                }.call(this)
                            }, function() {
                                return ">"
                            });
                        case "<":
                            return this._or(function() {
                                return function() {
                                    switch (this._apply("anything")) {
                                        case "=":
                                            return "<=";
                                        default:
                                            throw fail
                                    }
                                }.call(this)
                            }, function() {
                                return "<"
                            });
                        case "+":
                            return this._or(function() {
                                return function() {
                                    switch (this._apply("anything")) {
                                        case "+":
                                            return "++";
                                        case "=":
                                            return "+=";
                                        default:
                                            throw fail
                                    }
                                }.call(this)
                            }, function() {
                                return "+"
                            });
                        case "-":
                            return this._or(function() {
                                return function() {
                                    switch (this._apply("anything")) {
                                        case "-":
                                            return "--";
                                        case "=":
                                            return "-=";
                                        default:
                                            throw fail
                                    }
                                }.call(this)
                            }, function() {
                                return "-"
                            });
                        case "*":
                            return this._or(function() {
                                return function() {
                                    switch (this._apply("anything")) {
                                        case "=":
                                            return "*=";
                                        default:
                                            throw fail
                                    }
                                }.call(this)
                            }, function() {
                                return "*"
                            });
                        case "/":
                            return this._or(function() {
                                return function() {
                                    switch (this._apply("anything")) {
                                        case "=":
                                            return "/=";
                                        default:
                                            throw fail
                                    }
                                }.call(this)
                            }, function() {
                                return "/"
                            });
                        case "%":
                            return this._or(function() {
                                return function() {
                                    switch (this._apply("anything")) {
                                        case "=":
                                            return "%=";
                                        default:
                                            throw fail
                                    }
                                }.call(this)
                            }, function() {
                                return "%"
                            });
                        case "&":
                            return function() {
                                switch (this._apply("anything")) {
                                    case "&":
                                        return this._or(function() {
                                            return function() {
                                                switch (this._apply("anything")) {
                                                    case "=":
                                                        return "&&=";
                                                    default:
                                                        throw fail
                                                }
                                            }.call(this)
                                        }, function() {
                                            return "&&"
                                        });
                                    default:
                                        throw fail
                                }
                            }.call(this);
                        case "|":
                            return function() {
                                switch (this._apply("anything")) {
                                    case "|":
                                        return this._or(function() {
                                            return function() {
                                                switch (this._apply("anything")) {
                                                    case "=":
                                                        return "||=";
                                                    default:
                                                        throw fail
                                                }
                                            }.call(this)
                                        }, function() {
                                            return "||"
                                        });
                                    default:
                                        throw fail
                                }
                            }.call(this);
                        case ".":
                            return ".";
                        default:
                            throw fail
                    }
                }.call(this), [s, s]
            }.call(this)
    },
    tok: function() {
        return this.input.idx,
            function() {
                return this._apply("spaces"), this._or(function() {
                    return this._apply("name")
                }, function() {
                    return this._apply("keyword")
                }, function() {
                    return this._apply("number")
                }, function() {
                    return this._apply("str")
                }, function() {
                    return this._apply("special")
                })
            }.call(this)
    },
    toks: function() {
        var ts;
        return this.input.idx,
            function() {
                return ts = this._many(function() {
                    return this._apply("token")
                }), this._apply("spaces"), this._apply("end"), ts
            }.call(this)
    },
    token: function() {
        var tt, t;
        return this.input.idx,
            function() {
                return tt = this._apply("anything"), t = this._apply("tok"), this._pred(t[0] == tt), t[1]
            }.call(this)
    },
    spacesNoNl: function() {
        return this.input.idx, this._many(function() {
            return function() {
                return this._not(function() {
                    return this._applyWithArgs("exactly", "\n")
                }), this._apply("space")
            }.call(this)
        })
    },
    expr: function() {
        var e, t, f, rhs;
        return this.input.idx,
            function() {
                return e = this._apply("orExpr"), this._or(function() {
                    return function() {
                        return this._applyWithArgs("token", "?"), t = this._apply("expr"), this._applyWithArgs("token", ":"), f = this._apply("expr"), ["condExpr", e, t, f]
                    }.call(this)
                }, function() {
                    return function() {
                        return this._applyWithArgs("token", "="), rhs = this._apply("expr"), ["set", e, rhs]
                    }.call(this)
                }, function() {
                    return function() {
                        return this._applyWithArgs("token", "+="), rhs = this._apply("expr"), ["mset", e, "+", rhs]
                    }.call(this)
                }, function() {
                    return function() {
                        return this._applyWithArgs("token", "-="), rhs = this._apply("expr"), ["mset", e, "-", rhs]
                    }.call(this)
                }, function() {
                    return function() {
                        return this._applyWithArgs("token", "*="), rhs = this._apply("expr"), ["mset", e, "*", rhs]
                    }.call(this)
                }, function() {
                    return function() {
                        return this._applyWithArgs("token", "/="), rhs = this._apply("expr"), ["mset", e, "/", rhs]
                    }.call(this)
                }, function() {
                    return function() {
                        return this._applyWithArgs("token", "%="), rhs = this._apply("expr"), ["mset", e, "%", rhs]
                    }.call(this)
                }, function() {
                    return function() {
                        return this._applyWithArgs("token", "&&="), rhs = this._apply("expr"), ["mset", e, "&&", rhs]
                    }.call(this)
                }, function() {
                    return function() {
                        return this._applyWithArgs("token", "||="), rhs = this._apply("expr"), ["mset", e, "||", rhs]
                    }.call(this)
                }, function() {
                    return function() {
                        return this._apply("empty"), e
                    }.call(this)
                })
            }.call(this)
    },
    orExpr: function() {
        var x, y;
        return this.input.idx, this._or(function() {
            return function() {
                return x = this._apply("orExpr"), this._applyWithArgs("token", "||"), y = this._apply("andExpr"), ["binop", "||", x, y]
            }.call(this)
        }, function() {
            return this._apply("andExpr")
        })
    },
    andExpr: function() {
        var x, y;
        return this.input.idx, this._or(function() {
            return function() {
                return x = this._apply("andExpr"), this._applyWithArgs("token", "&&"), y = this._apply("eqExpr"), ["binop", "&&", x, y]
            }.call(this)
        }, function() {
            return this._apply("eqExpr")
        })
    },
    eqExpr: function() {
        var x, y;
        return this.input.idx, this._or(function() {
            return function() {
                return x = this._apply("eqExpr"), this._or(function() {
                    return function() {
                        return this._applyWithArgs("token", "=="), y = this._apply("relExpr"), ["binop", "==", x, y]
                    }.call(this)
                }, function() {
                    return function() {
                        return this._applyWithArgs("token", "!="), y = this._apply("relExpr"), ["binop", "!=", x, y]
                    }.call(this)
                }, function() {
                    return function() {
                        return this._applyWithArgs("token", "==="), y = this._apply("relExpr"), ["binop", "===", x, y]
                    }.call(this)
                }, function() {
                    return function() {
                        return this._applyWithArgs("token", "!=="), y = this._apply("relExpr"), ["binop", "!==", x, y]
                    }.call(this)
                })
            }.call(this)
        }, function() {
            return this._apply("relExpr")
        })
    },
    relExpr: function() {
        var x, y;
        return this.input.idx, this._or(function() {
            return function() {
                return x = this._apply("relExpr"), this._or(function() {
                    return function() {
                        return this._applyWithArgs("token", ">"), y = this._apply("addExpr"), ["binop", ">", x, y]
                    }.call(this)
                }, function() {
                    return function() {
                        return this._applyWithArgs("token", ">="), y = this._apply("addExpr"), ["binop", ">=", x, y]
                    }.call(this)
                }, function() {
                    return function() {
                        return this._applyWithArgs("token", "<"), y = this._apply("addExpr"), ["binop", "<", x, y]
                    }.call(this)
                }, function() {
                    return function() {
                        return this._applyWithArgs("token", "<="), y = this._apply("addExpr"), ["binop", "<=", x, y]
                    }.call(this)
                }, function() {
                    return function() {
                        return this._applyWithArgs("token", "instanceof"), y = this._apply("addExpr"), ["binop", "instanceof", x, y]
                    }.call(this)
                })
            }.call(this)
        }, function() {
            return this._apply("addExpr")
        })
    },
    addExpr: function() {
        var x, y;
        return this.input.idx, this._or(function() {
            return function() {
                return x = this._apply("addExpr"), this._applyWithArgs("token", "+"), y = this._apply("mulExpr"), ["binop", "+", x, y]
            }.call(this)
        }, function() {
            return function() {
                return x = this._apply("addExpr"), this._applyWithArgs("token", "-"), y = this._apply("mulExpr"), ["binop", "-", x, y]
            }.call(this)
        }, function() {
            return this._apply("mulExpr")
        })
    },
    mulExpr: function() {
        var x, y;
        return this.input.idx, this._or(function() {
            return function() {
                return x = this._apply("mulExpr"), this._applyWithArgs("token", "*"), y = this._apply("unary"), ["binop", "*", x, y]
            }.call(this)
        }, function() {
            return function() {
                return x = this._apply("mulExpr"), this._applyWithArgs("token", "/"), y = this._apply("unary"), ["binop", "/", x, y]
            }.call(this)
        }, function() {
            return function() {
                return x = this._apply("mulExpr"), this._applyWithArgs("token", "%"), y = this._apply("unary"), ["binop", "%", x, y]
            }.call(this)
        }, function() {
            return this._apply("unary")
        })
    },
    unary: function() {
        var p;
        return this.input.idx, this._or(function() {
            return function() {
                return this._applyWithArgs("token", "-"), p = this._apply("postfix"), ["unop", "-", p]
            }.call(this)
        }, function() {
            return function() {
                return this._applyWithArgs("token", "+"), p = this._apply("postfix"), ["unop", "+", p]
            }.call(this)
        }, function() {
            return function() {
                return this._applyWithArgs("token", "++"), p = this._apply("postfix"), ["preop", "++", p]
            }.call(this)
        }, function() {
            return function() {
                return this._applyWithArgs("token", "--"), p = this._apply("postfix"), ["preop", "--", p]
            }.call(this)
        }, function() {
            return function() {
                return this._applyWithArgs("token", "!"), p = this._apply("unary"), ["unop", "!", p]
            }.call(this)
        }, function() {
            return function() {
                return this._applyWithArgs("token", "void"), p = this._apply("unary"), ["unop", "void", p]
            }.call(this)
        }, function() {
            return function() {
                return this._applyWithArgs("token", "delete"), p = this._apply("unary"), ["unop", "delete", p]
            }.call(this)
        }, function() {
            return function() {
                return this._applyWithArgs("token", "typeof"), p = this._apply("unary"), ["unop", "typeof", p]
            }.call(this)
        }, function() {
            return this._apply("postfix")
        })
    },
    postfix: function() {
        var p;
        return this.input.idx,
            function() {
                return p = this._apply("primExpr"), this._or(function() {
                    return function() {
                        return this._apply("spacesNoNl"), this._applyWithArgs("token", "++"), ["postop", "++", p]
                    }.call(this)
                }, function() {
                    return function() {
                        return this._apply("spacesNoNl"), this._applyWithArgs("token", "--"), ["postop", "--", p]
                    }.call(this)
                }, function() {
                    return function() {
                        return this._apply("empty"), p
                    }.call(this)
                })
            }.call(this)
    },
    primExpr: function() {
        var p, i, m, as, f;
        return this.input.idx, this._or(function() {
            return function() {
                return p = this._apply("primExpr"), this._or(function() {
                    return function() {
                        return this._applyWithArgs("token", "["), i = this._apply("expr"), this._applyWithArgs("token", "]"), ["getp", i, p]
                    }.call(this)
                }, function() {
                    return function() {
                        return this._applyWithArgs("token", "."), m = this._applyWithArgs("token", "name"), this._applyWithArgs("token", "("), as = this._applyWithArgs("listOf", "expr", ","), this._applyWithArgs("token", ")"), ["send", m, p].concat(as)
                    }.call(this)
                }, function() {
                    return function() {
                        return this._applyWithArgs("token", "."), f = this._applyWithArgs("token", "name"), ["getp", ["string", f], p]
                    }.call(this)
                }, function() {
                    return function() {
                        return this._applyWithArgs("token", "("), as = this._applyWithArgs("listOf", "expr", ","), this._applyWithArgs("token", ")"), ["call", p].concat(as)
                    }.call(this)
                })
            }.call(this)
        }, function() {
            return this._apply("primExprHd")
        })
    },
    primExprHd: function() {
        var e, n, s, as, es;
        return this.input.idx, this._or(function() {
            return function() {
                return this._applyWithArgs("token", "("), e = this._apply("expr"), this._applyWithArgs("token", ")"), e
            }.call(this)
        }, function() {
            return function() {
                return this._applyWithArgs("token", "this"), ["this"]
            }.call(this)
        }, function() {
            return function() {
                return n = this._applyWithArgs("token", "name"), ["get", n]
            }.call(this)
        }, function() {
            return function() {
                return n = this._applyWithArgs("token", "number"), ["number", n]
            }.call(this)
        }, function() {
            return function() {
                return s = this._applyWithArgs("token", "string"), ["string", s]
            }.call(this)
        }, function() {
            return function() {
                return this._applyWithArgs("token", "function"), this._apply("funcRest")
            }.call(this)
        }, function() {
            return function() {
                return this._applyWithArgs("token", "new"), n = this._applyWithArgs("token", "name"), this._applyWithArgs("token", "("), as = this._applyWithArgs("listOf", "expr", ","), this._applyWithArgs("token", ")"), ["new", n].concat(as)
            }.call(this)
        }, function() {
            return function() {
                return this._applyWithArgs("token", "["), es = this._applyWithArgs("listOf", "expr", ","), this._applyWithArgs("token", "]"), ["arr"].concat(es)
            }.call(this)
        }, function() {
            return this._apply("json")
        }, function() {
            return this._apply("re")
        })
    },
    json: function() {
        var bs;
        return this.input.idx,
            function() {
                return this._applyWithArgs("token", "{"), bs = this._applyWithArgs("listOf", "jsonBinding", ","), this._applyWithArgs("token", "}"), ["json"].concat(bs)
            }.call(this)
    },
    jsonBinding: function() {
        var n, v;
        return this.input.idx,
            function() {
                return n = this._apply("jsonPropName"), this._applyWithArgs("token", ":"), v = this._apply("expr"), ["binding", n, v]
            }.call(this)
    },
    jsonPropName: function() {
        return this.input.idx, this._or(function() {
            return this._applyWithArgs("token", "name")
        }, function() {
            return this._applyWithArgs("token", "number")
        }, function() {
            return this._applyWithArgs("token", "string")
        })
    },
    re: function() {
        var x;
        return this.input.idx,
            function() {
                return this._apply("spaces"), x = this._consumedBy(function() {
                    return function() {
                        return this._applyWithArgs("exactly", "/"), this._apply("reBody"), this._applyWithArgs("exactly", "/"), this._many(function() {
                            return this._apply("reFlag")
                        })
                    }.call(this)
                }), ["regExpr", x]
            }.call(this)
    },
    reBody: function() {
        return this.input.idx,
            function() {
                return this._apply("re1stChar"), this._many(function() {
                    return this._apply("reChar")
                })
            }.call(this)
    },
    re1stChar: function() {
        return this.input.idx, this._or(function() {
            return function() {
                return this._not(function() {
                    return function() {
                        switch (this._apply("anything")) {
                            case "*":
                                return "*";
                            case "\\":
                                return "\\";
                            case "/":
                                return "/";
                            case "[":
                                return "[";
                            default:
                                throw fail
                        }
                    }.call(this)
                }), this._apply("reNonTerm")
            }.call(this)
        }, function() {
            return this._apply("escapeChar")
        }, function() {
            return this._apply("reClass")
        })
    },
    reChar: function() {
        return this.input.idx, this._or(function() {
            return this._apply("re1stChar")
        }, function() {
            return function() {
                switch (this._apply("anything")) {
                    case "*":
                        return "*";
                    default:
                        throw fail
                }
            }.call(this)
        })
    },
    reNonTerm: function() {
        return this.input.idx,
            function() {
                return this._not(function() {
                    return function() {
                        switch (this._apply("anything")) {
                            case "\n":
                                return "\n";
                            case "\r":
                                return "\r";
                            default:
                                throw fail
                        }
                    }.call(this)
                }), this._apply("char")
            }.call(this)
    },
    reClass: function() {
        return this.input.idx,
            function() {
                return this._applyWithArgs("exactly", "["), this._many(function() {
                    return this._apply("reClassChar")
                }), this._applyWithArgs("exactly", "]")
            }.call(this)
    },
    reClassChar: function() {
        return this.input.idx,
            function() {
                return this._not(function() {
                    return function() {
                        switch (this._apply("anything")) {
                            case "[":
                                return "[";
                            case "]":
                                return "]";
                            default:
                                throw fail
                        }
                    }.call(this)
                }), this._apply("reChar")
            }.call(this)
    },
    reFlag: function() {
        return this.input.idx, this._apply("nameFirst")
    },
    formal: function() {
        return this.input.idx,
            function() {
                return this._apply("spaces"), this._applyWithArgs("token", "name")
            }.call(this)
    },
    funcRest: function() {
        var fs, body;
        return this.input.idx,
            function() {
                return this._applyWithArgs("token", "("), fs = this._applyWithArgs("listOf", "formal", ","), this._applyWithArgs("token", ")"), this._applyWithArgs("token", "{"), body = this._apply("srcElems"), this._applyWithArgs("token", "}"), ["func", fs, body]
            }.call(this)
    },
    sc: function() {
        return this.input.idx, this._or(function() {
            return function() {
                return this._apply("spacesNoNl"), this._or(function() {
                    return function() {
                        switch (this._apply("anything")) {
                            case "\n":
                                return "\n";
                            default:
                                throw fail
                        }
                    }.call(this)
                }, function() {
                    return this._lookahead(function() {
                        return this._applyWithArgs("exactly", "}")
                    })
                }, function() {
                    return this._apply("end")
                })
            }.call(this)
        }, function() {
            return this._applyWithArgs("token", ";")
        })
    },
    binding: function() {
        var n, v;
        return this.input.idx,
            function() {
                return n = this._applyWithArgs("token", "name"), v = this._or(function() {
                    return function() {
                        return this._applyWithArgs("token", "="), this._apply("expr")
                    }.call(this)
                }, function() {
                    return function() {
                        return this._apply("empty"), ["get", "undefined"]
                    }.call(this)
                }), ["var", n, v]
            }.call(this)
    },
    block: function() {
        var ss;
        return this.input.idx,
            function() {
                return this._applyWithArgs("token", "{"), ss = this._apply("srcElems"), this._applyWithArgs("token", "}"), ss
            }.call(this)
    },
    stmt: function() {
        var bs, c, t, f, s, i, u, n, v, e, cs, x;
        return this.input.idx, this._or(function() {
            return this._apply("block")
        }, function() {
            return function() {
                return this._applyWithArgs("token", "var"), bs = this._applyWithArgs("listOf", "binding", ","), this._apply("sc"), ["begin"].concat(bs)
            }.call(this)
        }, function() {
            return function() {
                return this._applyWithArgs("token", "if"), this._applyWithArgs("token", "("), c = this._apply("expr"), this._applyWithArgs("token", ")"), t = this._apply("stmt"), f = this._or(function() {
                    return function() {
                        return this._applyWithArgs("token", "else"), this._apply("stmt")
                    }.call(this)
                }, function() {
                    return function() {
                        return this._apply("empty"), ["get", "undefined"]
                    }.call(this)
                }), ["if", c, t, f]
            }.call(this)
        }, function() {
            return function() {
                return this._applyWithArgs("token", "while"), this._applyWithArgs("token", "("), c = this._apply("expr"), this._applyWithArgs("token", ")"), s = this._apply("stmt"), ["while", c, s]
            }.call(this)
        }, function() {
            return function() {
                return this._applyWithArgs("token", "do"), s = this._apply("stmt"), this._applyWithArgs("token", "while"), this._applyWithArgs("token", "("), c = this._apply("expr"), this._applyWithArgs("token", ")"), this._apply("sc"), ["doWhile", s, c]
            }.call(this)
        }, function() {
            return function() {
                return this._applyWithArgs("token", "for"), this._applyWithArgs("token", "("), i = this._or(function() {
                    return function() {
                        return this._applyWithArgs("token", "var"), this._apply("binding")
                    }.call(this)
                }, function() {
                    return this._apply("expr")
                }, function() {
                    return function() {
                        return this._apply("empty"), ["get", "undefined"]
                    }.call(this)
                }), this._applyWithArgs("token", ";"), c = this._or(function() {
                    return this._apply("expr")
                }, function() {
                    return function() {
                        return this._apply("empty"), ["get", "true"]
                    }.call(this)
                }), this._applyWithArgs("token", ";"), u = this._or(function() {
                    return this._apply("expr")
                }, function() {
                    return function() {
                        return this._apply("empty"), ["get", "undefined"]
                    }.call(this)
                }), this._applyWithArgs("token", ")"), s = this._apply("stmt"), ["for", i, c, u, s]
            }.call(this)
        }, function() {
            return function() {
                return this._applyWithArgs("token", "for"), this._applyWithArgs("token", "("), v = this._or(function() {
                    return function() {
                        return this._applyWithArgs("token", "var"), n = this._applyWithArgs("token", "name"), ["var", n, ["get", "undefined"]]
                    }.call(this)
                }, function() {
                    return this._apply("expr")
                }), this._applyWithArgs("token", "in"), e = this._apply("expr"), this._applyWithArgs("token", ")"), s = this._apply("stmt"), ["forIn", v, e, s]
            }.call(this)
        }, function() {
            return function() {
                return this._applyWithArgs("token", "switch"), this._applyWithArgs("token", "("), e = this._apply("expr"), this._applyWithArgs("token", ")"), this._applyWithArgs("token", "{"), cs = this._many(function() {
                    return this._or(function() {
                        return function() {
                            return this._applyWithArgs("token", "case"), c = this._apply("expr"), this._applyWithArgs("token", ":"), cs = this._apply("srcElems"), ["case", c, cs]
                        }.call(this)
                    }, function() {
                        return function() {
                            return this._applyWithArgs("token", "default"), this._applyWithArgs("token", ":"), cs = this._apply("srcElems"), ["default", cs]
                        }.call(this)
                    })
                }), this._applyWithArgs("token", "}"), ["switch", e].concat(cs)
            }.call(this)
        }, function() {
            return function() {
                return this._applyWithArgs("token", "break"), this._apply("sc"), ["break"]
            }.call(this)
        }, function() {
            return function() {
                return this._applyWithArgs("token", "continue"), this._apply("sc"), ["continue"]
            }.call(this)
        }, function() {
            return function() {
                return this._applyWithArgs("token", "throw"), this._apply("spacesNoNl"), e = this._apply("expr"), this._apply("sc"), ["throw", e]
            }.call(this)
        }, function() {
            return function() {
                return this._applyWithArgs("token", "try"), t = this._apply("block"), this._applyWithArgs("token", "catch"), this._applyWithArgs("token", "("), e = this._applyWithArgs("token", "name"), this._applyWithArgs("token", ")"), c = this._apply("block"), f = this._or(function() {
                    return function() {
                        return this._applyWithArgs("token", "finally"), this._apply("block")
                    }.call(this)
                }, function() {
                    return function() {
                        return this._apply("empty"), ["get", "undefined"]
                    }.call(this)
                }), ["try", t, e, c, f]
            }.call(this)
        }, function() {
            return function() {
                return this._applyWithArgs("token", "return"), e = this._or(function() {
                    return this._apply("expr")
                }, function() {
                    return function() {
                        return this._apply("empty"), ["get", "undefined"]
                    }.call(this)
                }), this._apply("sc"), ["return", e]
            }.call(this)
        }, function() {
            return function() {
                return this._applyWithArgs("token", "with"), this._applyWithArgs("token", "("), x = this._apply("expr"), this._applyWithArgs("token", ")"), s = this._apply("stmt"), ["with", x, s]
            }.call(this)
        }, function() {
            return function() {
                return e = this._apply("expr"), this._apply("sc"), e
            }.call(this)
        }, function() {
            return function() {
                return this._applyWithArgs("token", ";"), ["get", "undefined"]
            }.call(this)
        })
    },
    srcElem: function() {
        var n, f;
        return this.input.idx, this._or(function() {
            return function() {
                return this._applyWithArgs("token", "function"), n = this._applyWithArgs("token", "name"), f = this._apply("funcRest"), ["var", n, f]
            }.call(this)
        }, function() {
            return this._apply("stmt")
        })
    },
    srcElems: function() {
        var ss;
        return this.input.idx,
            function() {
                return ss = this._many(function() {
                    return this._apply("srcElem")
                }), ["begin"].concat(ss)
            }.call(this)
    },
    topLevel: function() {
        var r;
        return this.input.idx,
            function() {
                return r = this._apply("srcElems"), this._apply("spaces"), this._apply("end"), r
            }.call(this)
    }
}), BSJSParser.hexDigits = "0123456789abcdef", BSJSParser.keywords = {}, keywords = ["break", "case", "catch", "continue", "default", "delete", "do", "else", "finally", "for", "function", "if", "in", "instanceof", "new", "return", "switch", "this", "throw", "try", "typeof", "var", "void", "while", "with", "ometa"];
for (var idx = 0; idx < keywords.length; idx++) BSJSParser.keywords[keywords[idx]] = !0;
BSJSParser._isKeyword = function(k) {
        return this.keywords.hasOwnProperty(k)
    }, BSSemActionParser = objectThatDelegatesTo(BSJSParser, {
        curlySemAction: function() {
            var r, s, ss;
            return this.input.idx, this._or(function() {
                return function() {
                    return this._applyWithArgs("token", "{"), r = this._apply("expr"), this._apply("sc"), this._applyWithArgs("token", "}"), this._apply("spaces"), r
                }.call(this)
            }, function() {
                return function() {
                    return this._applyWithArgs("token", "{"), ss = this._many(function() {
                        return function() {
                            return s = this._apply("srcElem"), this._lookahead(function() {
                                return this._apply("srcElem")
                            }), s
                        }.call(this)
                    }), s = this._or(function() {
                        return function() {
                            return r = this._apply("expr"), this._apply("sc"), ["return", r]
                        }.call(this)
                    }, function() {
                        return this._apply("srcElem")
                    }), ss.push(s), this._applyWithArgs("token", "}"), this._apply("spaces"), ["send", "call", ["func", [],
                            ["begin"].concat(ss)
                        ],
                        ["this"]
                    ]
                }.call(this)
            })
        },
        semAction: function() {
            var r;
            return this.input.idx, this._or(function() {
                return this._apply("curlySemAction")
            }, function() {
                return function() {
                    return r = this._apply("primExpr"), this._apply("spaces"), r
                }.call(this)
            })
        }
    }), BSJSTranslator = objectThatDelegatesTo(OMeta, {
        trans: function() {
            var t, ans;
            return this.input.idx,
                function() {
                    return this._form(function() {
                        return function() {
                            return t = this._apply("anything"), ans = this._applyWithArgs("apply", t)
                        }.call(this)
                    }), ans
                }.call(this)
        },
        curlyTrans: function() {
            var r, rs;
            return this.input.idx, this._or(function() {
                return function() {
                    return this._form(function() {
                        return function() {
                            return this._applyWithArgs("exactly", "begin"), r = this._apply("curlyTrans")
                        }.call(this)
                    }), r
                }.call(this)
            }, function() {
                return function() {
                    return this._form(function() {
                        return function() {
                            return this._applyWithArgs("exactly", "begin"), rs = this._many(function() {
                                return this._apply("trans")
                            })
                        }.call(this)
                    }), "{" + rs.join(";") + "}"
                }.call(this)
            }, function() {
                return function() {
                    return r = this._apply("trans"), "{" + r + "}"
                }.call(this)
            })
        },
        "this": function() {
            return this.input.idx, "this"
        },
        "break": function() {
            return this.input.idx, "break"
        },
        "continue": function() {
            return this.input.idx, "continue"
        },
        number: function() {
            var n;
            return this.input.idx,
                function() {
                    return n = this._apply("anything"), "(" + n + ")"
                }.call(this)
        },
        string: function() {
            var s;
            return this.input.idx,
                function() {
                    return s = this._apply("anything"), s.toProgramString()
                }.call(this)
        },
        regExpr: function() {
            var x;
            return this.input.idx,
                function() {
                    return x = this._apply("anything")
                }.call(this)
        },
        arr: function() {
            var xs;
            return this.input.idx,
                function() {
                    return xs = this._many(function() {
                        return this._apply("trans")
                    }), "[" + xs.join(",") + "]"
                }.call(this)
        },
        unop: function() {
            var op, x;
            return this.input.idx,
                function() {
                    return op = this._apply("anything"), x = this._apply("trans"), "(" + op + " " + x + ")"
                }.call(this)
        },
        getp: function() {
            var fd, x;
            return this.input.idx,
                function() {
                    return fd = this._apply("trans"), x = this._apply("trans"), x + "[" + fd + "]"
                }.call(this)
        },
        get: function() {
            var x;
            return this.input.idx,
                function() {
                    return x = this._apply("anything")
                }.call(this)
        },
        set: function() {
            var lhs, rhs;
            return this.input.idx,
                function() {
                    return lhs = this._apply("trans"), rhs = this._apply("trans"), "(" + lhs + "=" + rhs + ")"
                }.call(this)
        },
        mset: function() {
            var lhs, op, rhs;
            return this.input.idx,
                function() {
                    return lhs = this._apply("trans"), op = this._apply("anything"), rhs = this._apply("trans"), "(" + lhs + op + "=" + rhs + ")"
                }.call(this)
        },
        binop: function() {
            var op, x, y;
            return this.input.idx,
                function() {
                    return op = this._apply("anything"), x = this._apply("trans"), y = this._apply("trans"), "(" + x + " " + op + " " + y + ")"
                }.call(this)
        },
        preop: function() {
            var op, x;
            return this.input.idx,
                function() {
                    return op = this._apply("anything"), x = this._apply("trans"), op + x
                }.call(this)
        },
        postop: function() {
            var op, x;
            return this.input.idx,
                function() {
                    return op = this._apply("anything"), x = this._apply("trans"), x + op
                }.call(this)
        },
        "return": function() {
            var x;
            return this.input.idx,
                function() {
                    return x = this._apply("trans"), "return " + x
                }.call(this)
        },
        "with": function() {
            var x, s;
            return this.input.idx,
                function() {
                    return x = this._apply("trans"), s = this._apply("curlyTrans"), "with(" + x + ")" + s
                }.call(this)
        },
        "if": function() {
            var cond, t, e;
            return this.input.idx,
                function() {
                    return cond = this._apply("trans"), t = this._apply("curlyTrans"), e = this._apply("curlyTrans"), "if(" + cond + ")" + t + "else" + e
                }.call(this)
        },
        condExpr: function() {
            var cond, t, e;
            return this.input.idx,
                function() {
                    return cond = this._apply("trans"), t = this._apply("trans"), e = this._apply("trans"), "(" + cond + "?" + t + ":" + e + ")"
                }.call(this)
        },
        "while": function() {
            var cond, body;
            return this.input.idx,
                function() {
                    return cond = this._apply("trans"), body = this._apply("curlyTrans"), "while(" + cond + ")" + body
                }.call(this)
        },
        doWhile: function() {
            var body, cond;
            return this.input.idx,
                function() {
                    return body = this._apply("curlyTrans"), cond = this._apply("trans"), "do" + body + "while(" + cond + ")"
                }.call(this)
        },
        "for": function() {
            var init, cond, upd, body;
            return this.input.idx,
                function() {
                    return init = this._apply("trans"), cond = this._apply("trans"), upd = this._apply("trans"), body = this._apply("curlyTrans"), "for(" + init + ";" + cond + ";" + upd + ")" + body
                }.call(this)
        },
        forIn: function() {
            var x, arr, body;
            return this.input.idx,
                function() {
                    return x = this._apply("trans"), arr = this._apply("trans"), body = this._apply("curlyTrans"), "for(" + x + " in " + arr + ")" + body
                }.call(this)
        },
        begin: function() {
            var x, xs;
            return this.input.idx, this._or(function() {
                return function() {
                    return x = this._apply("trans"), this._apply("end"), x
                }.call(this)
            }, function() {
                return function() {
                    return xs = this._many(function() {
                        return function() {
                            return x = this._apply("trans"), this._or(function() {
                                return function() {
                                    return this._or(function() {
                                        return this._pred("}" == x[x.length - 1])
                                    }, function() {
                                        return this._apply("end")
                                    }), x
                                }.call(this)
                            }, function() {
                                return function() {
                                    return this._apply("empty"), x + ";"
                                }.call(this)
                            })
                        }.call(this)
                    }), "{" + xs.join("") + "}"
                }.call(this)
            })
        },
        func: function() {
            var args, body;
            return this.input.idx,
                function() {
                    return args = this._apply("anything"), body = this._apply("curlyTrans"), "(function (" + args.join(",") + ")" + body + ")"
                }.call(this)
        },
        call: function() {
            var fn, args;
            return this.input.idx,
                function() {
                    return fn = this._apply("trans"), args = this._many(function() {
                        return this._apply("trans")
                    }), fn + "(" + args.join(",") + ")"
                }.call(this)
        },
        send: function() {
            var msg, recv, args;
            return this.input.idx,
                function() {
                    return msg = this._apply("anything"), recv = this._apply("trans"), args = this._many(function() {
                        return this._apply("trans")
                    }), recv + "." + msg + "(" + args.join(",") + ")"
                }.call(this)
        },
        "new": function() {
            var cls, args;
            return this.input.idx,
                function() {
                    return cls = this._apply("anything"), args = this._many(function() {
                        return this._apply("trans")
                    }), "new " + cls + "(" + args.join(",") + ")"
                }.call(this)
        },
        "var": function() {
            var name, val;
            return this.input.idx,
                function() {
                    return name = this._apply("anything"), val = this._apply("trans"), "var " + name + "=" + val
                }.call(this)
        },
        "throw": function() {
            var x;
            return this.input.idx,
                function() {
                    return x = this._apply("trans"), "throw " + x
                }.call(this)
        },
        "try": function() {
            var x, name, c, f;
            return this.input.idx,
                function() {
                    return x = this._apply("curlyTrans"), name = this._apply("anything"), c = this._apply("curlyTrans"), f = this._apply("curlyTrans"), "try " + x + "catch(" + name + ")" + c + "finally" + f
                }.call(this)
        },
        json: function() {
            var props;
            return this.input.idx,
                function() {
                    return props = this._many(function() {
                        return this._apply("trans")
                    }), "({" + props.join(",") + "})"
                }.call(this)
        },
        binding: function() {
            var name, val;
            return this.input.idx,
                function() {
                    return name = this._apply("anything"), val = this._apply("trans"), name.toProgramString() + ": " + val
                }.call(this)
        },
        "switch": function() {
            var x, cases;
            return this.input.idx,
                function() {
                    return x = this._apply("trans"), cases = this._many(function() {
                        return this._apply("trans")
                    }), "switch(" + x + "){" + cases.join(";") + "}"
                }.call(this)
        },
        "case": function() {
            var x, y;
            return this.input.idx,
                function() {
                    return x = this._apply("trans"), y = this._apply("trans"), "case " + x + ": " + y
                }.call(this)
        },
        "default": function() {
            var y;
            return this.input.idx,
                function() {
                    return y = this._apply("trans"), "default: " + y
                }.call(this)
        }
    }), BSOMetaJSParser = objectThatDelegatesTo(BSJSParser, {
        srcElem: function() {
            var r;
            return this.input.idx, this._or(function() {
                return function() {
                    return this._apply("spaces"), r = this._applyWithArgs("foreign", BSOMetaParser, "grammar"), this._apply("sc"), r
                }.call(this)
            }, function() {
                return BSJSParser._superApplyWithArgs(this, "srcElem")
            })
        }
    }), BSOMetaJSTranslator = objectThatDelegatesTo(BSJSTranslator, {
        Grammar: function() {
            return this.input.idx, this._applyWithArgs("foreign", BSOMetaTranslator, "Grammar")
        }
    }), BSNullOptimization = objectThatDelegatesTo(OMeta, {
        setHelped: function() {
            return this.input.idx, this._didSomething = !0
        },
        helped: function() {
            return this.input.idx, this._pred(this._didSomething)
        },
        trans: function() {
            var t, ans;
            return this.input.idx,
                function() {
                    return this._form(function() {
                        return function() {
                            return t = this._apply("anything"), this._pred(void 0 != this[t]), ans = this._applyWithArgs("apply", t)
                        }.call(this)
                    }), ans
                }.call(this)
        },
        optimize: function() {
            var x;
            return this.input.idx,
                function() {
                    return x = this._apply("trans"), this._apply("helped"), x
                }.call(this)
        },
        App: function() {
            var rule, args;
            return this.input.idx,
                function() {
                    return rule = this._apply("anything"), args = this._many(function() {
                        return this._apply("anything")
                    }), ["App", rule].concat(args)
                }.call(this)
        },
        Act: function() {
            var expr;
            return this.input.idx,
                function() {
                    return expr = this._apply("anything"), ["Act", expr]
                }.call(this)
        },
        Pred: function() {
            var expr;
            return this.input.idx,
                function() {
                    return expr = this._apply("anything"), ["Pred", expr]
                }.call(this)
        },
        Or: function() {
            var xs;
            return this.input.idx,
                function() {
                    return xs = this._many(function() {
                        return this._apply("trans")
                    }), ["Or"].concat(xs)
                }.call(this)
        },
        XOr: function() {
            var xs;
            return this.input.idx,
                function() {
                    return xs = this._many(function() {
                        return this._apply("trans")
                    }), ["XOr"].concat(xs)
                }.call(this)
        },
        And: function() {
            var xs;
            return this.input.idx,
                function() {
                    return xs = this._many(function() {
                        return this._apply("trans")
                    }), ["And"].concat(xs)
                }.call(this)
        },
        Opt: function() {
            var x;
            return this.input.idx,
                function() {
                    return x = this._apply("trans"), ["Opt", x]
                }.call(this)
        },
        Many: function() {
            var x;
            return this.input.idx,
                function() {
                    return x = this._apply("trans"), ["Many", x]
                }.call(this)
        },
        Many1: function() {
            var x;
            return this.input.idx,
                function() {
                    return x = this._apply("trans"), ["Many1", x]
                }.call(this)
        },
        Set: function() {
            var n, v;
            return this.input.idx,
                function() {
                    return n = this._apply("anything"), v = this._apply("trans"), ["Set", n, v]
                }.call(this)
        },
        Not: function() {
            var x;
            return this.input.idx,
                function() {
                    return x = this._apply("trans"), ["Not", x]
                }.call(this)
        },
        Lookahead: function() {
            var x;
            return this.input.idx,
                function() {
                    return x = this._apply("trans"), ["Lookahead", x]
                }.call(this)
        },
        Form: function() {
            var x;
            return this.input.idx,
                function() {
                    return x = this._apply("trans"), ["Form", x]
                }.call(this)
        },
        ConsBy: function() {
            var x;
            return this.input.idx,
                function() {
                    return x = this._apply("trans"), ["ConsBy", x]
                }.call(this)
        },
        IdxConsBy: function() {
            var x;
            return this.input.idx,
                function() {
                    return x = this._apply("trans"), ["IdxConsBy", x]
                }.call(this)
        },
        JumpTable: function() {
            var c, e, ces;
            return this.input.idx,
                function() {
                    return ces = this._many(function() {
                        return function() {
                            return this._form(function() {
                                return function() {
                                    return c = this._apply("anything"), e = this._apply("trans")
                                }.call(this)
                            }), [c, e]
                        }.call(this)
                    }), ["JumpTable"].concat(ces)
                }.call(this)
        },
        Interleave: function() {
            var m, p, xs;
            return this.input.idx,
                function() {
                    return xs = this._many(function() {
                        return function() {
                            return this._form(function() {
                                return function() {
                                    return m = this._apply("anything"), p = this._apply("trans")
                                }.call(this)
                            }), [m, p]
                        }.call(this)
                    }), ["Interleave"].concat(xs)
                }.call(this)
        },
        Rule: function() {
            var name, ls, body;
            return this.input.idx,
                function() {
                    return name = this._apply("anything"), ls = this._apply("anything"), body = this._apply("trans"), ["Rule", name, ls, body]
                }.call(this)
        }
    }), BSNullOptimization.initialize = function() {
        this._didSomething = !1
    }, BSAssociativeOptimization = objectThatDelegatesTo(BSNullOptimization, {
        And: function() {
            var x, xs;
            return this.input.idx, this._or(function() {
                return function() {
                    return x = this._apply("trans"), this._apply("end"), this._apply("setHelped"), x
                }.call(this)
            }, function() {
                return function() {
                    return xs = this._applyWithArgs("transInside", "And"), ["And"].concat(xs)
                }.call(this)
            })
        },
        Or: function() {
            var x, xs;
            return this.input.idx, this._or(function() {
                return function() {
                    return x = this._apply("trans"), this._apply("end"), this._apply("setHelped"), x
                }.call(this)
            }, function() {
                return function() {
                    return xs = this._applyWithArgs("transInside", "Or"), ["Or"].concat(xs)
                }.call(this)
            })
        },
        XOr: function() {
            var x, xs;
            return this.input.idx, this._or(function() {
                return function() {
                    return x = this._apply("trans"), this._apply("end"), this._apply("setHelped"), x
                }.call(this)
            }, function() {
                return function() {
                    return xs = this._applyWithArgs("transInside", "XOr"), ["XOr"].concat(xs)
                }.call(this)
            })
        },
        transInside: function() {
            var t, xs, ys, x;
            return this.input.idx,
                function() {
                    return t = this._apply("anything"), this._or(function() {
                        return function() {
                            return this._form(function() {
                                return function() {
                                    return this._applyWithArgs("exactly", t), xs = this._applyWithArgs("transInside", t)
                                }.call(this)
                            }), ys = this._applyWithArgs("transInside", t), this._apply("setHelped"), xs.concat(ys)
                        }.call(this)
                    }, function() {
                        return function() {
                            return x = this._apply("trans"), xs = this._applyWithArgs("transInside", t), [x].concat(xs)
                        }.call(this)
                    }, function() {
                        return []
                    })
                }.call(this)
        }
    }), BSSeqInliner = objectThatDelegatesTo(BSNullOptimization, {
        App: function() {
            var s, cs, rule, args;
            return this.input.idx, this._or(function() {
                return function() {
                    switch (this._apply("anything")) {
                        case "seq":
                            return function() {
                                return s = this._apply("anything"), this._apply("end"), cs = this._applyWithArgs("seqString", s), this._apply("setHelped"), ["And"].concat(cs).concat([
                                    ["Act", s]
                                ])
                            }.call(this);
                        default:
                            throw fail
                    }
                }.call(this)
            }, function() {
                return function() {
                    return rule = this._apply("anything"), args = this._many(function() {
                        return this._apply("anything")
                    }), ["App", rule].concat(args)
                }.call(this)
            })
        },
        inlineChar: function() {
            var c;
            return this.input.idx,
                function() {
                    return c = this._applyWithArgs("foreign", BSOMetaParser, "eChar"), this._not(function() {
                        return this._apply("end")
                    }), ["App", "exactly", c.toProgramString()]
                }.call(this)
        },
        seqString: function() {
            var s, cs;
            return this.input.idx,
                function() {
                    return this._lookahead(function() {
                        return function() {
                            return s = this._apply("anything"), this._pred("string" == typeof s)
                        }.call(this)
                    }), this._or(function() {
                        return function() {
                            return this._form(function() {
                                return function() {
                                    return this._applyWithArgs("exactly", '"'), cs = this._many(function() {
                                        return this._apply("inlineChar")
                                    }), this._applyWithArgs("exactly", '"')
                                }.call(this)
                            }), cs
                        }.call(this)
                    }, function() {
                        return function() {
                            return this._form(function() {
                                return function() {
                                    return this._applyWithArgs("exactly", "'"), cs = this._many(function() {
                                        return this._apply("inlineChar")
                                    }), this._applyWithArgs("exactly", "'")
                                }.call(this)
                            }), cs
                        }.call(this)
                    })
                }.call(this)
        }
    }), JumpTable = function(choiceOp, choice) {
        this.choiceOp = choiceOp, this.choices = {}, this.add(choice)
    }, JumpTable.prototype.add = function(choice) {
        var c = choice[0],
            t = choice[1];
        this.choices[c] ? this.choices[c][0] == this.choiceOp ? this.choices[c].push(t) : this.choices[c] = [this.choiceOp, this.choices[c], t] : this.choices[c] = t
    }, JumpTable.prototype.toTree = function() {
        for (var r = ["JumpTable"], choiceKeys = ownPropertyNames(this.choices), i = 0; i < choiceKeys.length; i += 1) r.push([choiceKeys[i], this.choices[choiceKeys[i]]]);
        return r
    }, BSJumpTableOptimization = objectThatDelegatesTo(BSNullOptimization, {
        Or: function() {
            var cs;
            return this.input.idx,
                function() {
                    return cs = this._many(function() {
                        return this._or(function() {
                            return this._applyWithArgs("jtChoices", "Or")
                        }, function() {
                            return this._apply("trans")
                        })
                    }), ["Or"].concat(cs)
                }.call(this)
        },
        XOr: function() {
            var cs;
            return this.input.idx,
                function() {
                    return cs = this._many(function() {
                        return this._or(function() {
                            return this._applyWithArgs("jtChoices", "XOr")
                        }, function() {
                            return this._apply("trans")
                        })
                    }), ["XOr"].concat(cs)
                }.call(this)
        },
        quotedString: function() {
            var c, cs;
            return this.input.idx,
                function() {
                    return this._lookahead(function() {
                        return this._apply("string")
                    }), this._form(function() {
                        return function() {
                            switch (this._apply("anything")) {
                                case '"':
                                    return function() {
                                        return cs = this._many(function() {
                                            return function() {
                                                return c = this._applyWithArgs("foreign", BSOMetaParser, "eChar"), this._not(function() {
                                                    return this._apply("end")
                                                }), c
                                            }.call(this)
                                        }), this._applyWithArgs("exactly", '"')
                                    }.call(this);
                                case "'":
                                    return function() {
                                        return cs = this._many(function() {
                                            return function() {
                                                return c = this._applyWithArgs("foreign", BSOMetaParser, "eChar"), this._not(function() {
                                                    return this._apply("end")
                                                }), c
                                            }.call(this)
                                        }), this._applyWithArgs("exactly", "'")
                                    }.call(this);
                                default:
                                    throw fail
                            }
                        }.call(this)
                    }), cs.join("")
                }.call(this)
        },
        jtChoice: function() {
            var x, rest;
            return this.input.idx, this._or(function() {
                return function() {
                    return this._form(function() {
                        return function() {
                            return this._applyWithArgs("exactly", "And"), this._form(function() {
                                return function() {
                                    return this._applyWithArgs("exactly", "App"), this._applyWithArgs("exactly", "exactly"), x = this._apply("quotedString")
                                }.call(this)
                            }), rest = this._many(function() {
                                return this._apply("anything")
                            })
                        }.call(this)
                    }), [x, ["And"].concat(rest)]
                }.call(this)
            }, function() {
                return function() {
                    return this._form(function() {
                        return function() {
                            return this._applyWithArgs("exactly", "App"), this._applyWithArgs("exactly", "exactly"), x = this._apply("quotedString")
                        }.call(this)
                    }), [x, ["Act", x.toProgramString()]]
                }.call(this)
            })
        },
        jtChoices: function() {
            var op, c, jt;
            return this.input.idx,
                function() {
                    return op = this._apply("anything"), c = this._apply("jtChoice"), jt = new JumpTable(op, c), this._many(function() {
                        return function() {
                            return c = this._apply("jtChoice"), jt.add(c)
                        }.call(this)
                    }), this._apply("setHelped"), jt.toTree()
                }.call(this)
        }
    }), BSOMetaOptimizer = objectThatDelegatesTo(OMeta, {
        optimizeGrammar: function() {
            var n, sn, rs;
            return this.input.idx,
                function() {
                    return this._form(function() {
                        return function() {
                            return this._applyWithArgs("exactly", "Grammar"), n = this._apply("anything"), sn = this._apply("anything"), rs = this._many(function() {
                                return this._apply("optimizeRule")
                            })
                        }.call(this)
                    }), ["Grammar", n, sn].concat(rs)
                }.call(this)
        },
        optimizeRule: function() {
            var r;
            return this.input.idx,
                function() {
                    return r = this._apply("anything"), this._or(function() {
                        return r = this._applyWithArgs("foreign", BSSeqInliner, "optimize", r)
                    }, function() {
                        return this._apply("empty")
                    }), this._many(function() {
                        return this._or(function() {
                            return r = this._applyWithArgs("foreign", BSAssociativeOptimization, "optimize", r)
                        }, function() {
                            return r = this._applyWithArgs("foreign", BSJumpTableOptimization, "optimize", r)
                        })
                    }), r
                }.call(this)
        }
    }), LKJSParser = objectThatDelegatesTo(BSJSParser, {
        regexp: function() {
            var cs, fs, flag;
            return function() {
                return this._applyWithArgs("exactly", "/"), cs = this._many(function() {
                    return this._or(function() {
                        return this._apply("escapeChar")
                    }, function() {
                        return function() {
                            return this._not(function() {
                                return this._applyWithArgs("exactly", "/")
                            }), this._not(function() {
                                return this._applyWithArgs("exactly", "\n")
                            }), this._apply("char")
                        }.call(this)
                    })
                }), this._applyWithArgs("exactly", "/"), flag = this._or(function() {
                    return function() {
                        return fs = this._many1(function() {
                            return function() {
                                switch (this._apply("anything")) {
                                    case "m":
                                        return "m";
                                    case "g":
                                        return "g";
                                    case "i":
                                        return "i";
                                    case "y":
                                        return "y";
                                    default:
                                        throw fail
                                }
                            }.call(this)
                        }), fs.join("")
                    }.call(this)
                }, function() {
                    return function() {
                        return this._apply("empty"), ""
                    }.call(this)
                }), ["regexp", "/" + cs.join("") + "/" + flag]
            }.call(this)
        },
        tok: function() {
            return function() {
                return this._apply("spaces"), this._or(function() {
                    return this._apply("name")
                }, function() {
                    return this._apply("keyword")
                }, function() {
                    return this._apply("number")
                }, function() {
                    return this._apply("str")
                }, function() {
                    return this._apply("regexp")
                }, function() {
                    return this._apply("special")
                })
            }.call(this)
        },
        relExpr: function() {
            var x, y, y, y, y, y, y;
            return this._or(function() {
                return function() {
                    return x = this._apply("relExpr"), this._or(function() {
                        return function() {
                            return this._applyWithArgs("token", ">"), y = this._apply("addExpr"), ["binop", ">", x, y]
                        }.call(this)
                    }, function() {
                        return function() {
                            return this._applyWithArgs("token", ">="), y = this._apply("addExpr"), ["binop", ">=", x, y]
                        }.call(this)
                    }, function() {
                        return function() {
                            return this._applyWithArgs("token", "<"), y = this._apply("addExpr"), ["binop", "<", x, y]
                        }.call(this)
                    }, function() {
                        return function() {
                            return this._applyWithArgs("token", "<="), y = this._apply("addExpr"), ["binop", "<=", x, y]
                        }.call(this)
                    }, function() {
                        return function() {
                            return this._applyWithArgs("token", "instanceof"), y = this._apply("addExpr"), ["binop", "instanceof", x, y]
                        }.call(this)
                    }, function() {
                        return function() {
                            return this._applyWithArgs("token", "in"), y = this._apply("addExpr"), ["binop", "in", x, y]
                        }.call(this)
                    })
                }.call(this)
            }, function() {
                return this._apply("addExpr")
            })
        },
        primExprHd: function() {
            var e, n, n, s, r, n, f, n, name, as, newExpr, as, es;
            return this._or(function() {
                return function() {
                    return this._applyWithArgs("token", "("), e = this._apply("expr"), this._applyWithArgs("token", ")"), e
                }.call(this)
            }, function() {
                return function() {
                    return this._applyWithArgs("token", "this"), ["this"]
                }.call(this)
            }, function() {
                return function() {
                    return n = this._applyWithArgs("token", "name"), ["get", n]
                }.call(this)
            }, function() {
                return function() {
                    return n = this._applyWithArgs("token", "number"), ["number", n]
                }.call(this)
            }, function() {
                return function() {
                    return s = this._applyWithArgs("token", "string"), ["string", s]
                }.call(this)
            }, function() {
                return function() {
                    return r = this._applyWithArgs("token", "regexp"), ["regexp", r]
                }.call(this)
            }, function() {
                return function() {
                    return this._applyWithArgs("token", "function"), this._apply("funcRest")
                }.call(this)
            }, function() {
                return function() {
                    return this._applyWithArgs("token", "function"), n = this._applyWithArgs("token", "name"), f = this._apply("funcRest"), ["var", n, f]
                }.call(this)
            }, function() {
                return function() {
                    return this._applyWithArgs("token", "new"), name = this._many(function() {
                        return function() {
                            return n = this._applyWithArgs("token", "name"), this._or(function() {
                                return function() {
                                    switch (this._apply("anything")) {
                                        case ".":
                                            return ".";
                                        default:
                                            throw fail
                                    }
                                }.call(this)
                            }, function() {
                                return this._apply("empty")
                            }), n
                        }.call(this)
                    }), this._applyWithArgs("token", "("), as = this._applyWithArgs("listOf", "expr", ","), this._applyWithArgs("token", ")"), ["new", name.join(".")].concat(as)
                }.call(this)
            }, function() {
                return function() {
                    return this._applyWithArgs("token", "new"), this._applyWithArgs("token", "("), newExpr = this._apply("expr"), this._applyWithArgs("token", ")"), this._applyWithArgs("token", "("), as = this._applyWithArgs("listOf", "expr", ","), this._applyWithArgs("token", ")"), ["newExpr", newExpr].concat(as)
                }.call(this)
            }, function() {
                return function() {
                    return this._applyWithArgs("token", "["), es = this._applyWithArgs("listOf", "expr", ","), this._or(function() {
                        return function() {
                            switch (this._apply("anything")) {
                                case ",":
                                    return ",";
                                default:
                                    throw fail
                            }
                        }.call(this)
                    }, function() {
                        return this._apply("empty")
                    }), this._applyWithArgs("token", "]"), ["arr"].concat(es)
                }.call(this)
            }, function() {
                return this._apply("json")
            })
        },
        json: function() {
            var bs;
            return function() {
                return this._applyWithArgs("token", "{"), bs = this._applyWithArgs("listOf", "jsonBinding", ","), this._or(function() {
                    return function() {
                        switch (this._apply("anything")) {
                            case ",":
                                return ",";
                            default:
                                throw fail
                        }
                    }.call(this)
                }, function() {
                    return this._apply("empty")
                }), this._applyWithArgs("token", "}"), ["json"].concat(bs)
            }.call(this)
        },
        varBinding: function() {
            var n, v;
            return function() {
                return n = this._applyWithArgs("token", "name"), v = this._or(function() {
                    return function() {
                        return this._applyWithArgs("token", "="), this._apply("expr")
                    }.call(this)
                }, function() {
                    return function() {
                        return this._apply("empty"), ["get", "undefined"]
                    }.call(this)
                }), ["var", n, v]
            }.call(this)
        },
        stmt: function() {
            var bs, c, t, f, c, s, s, c, vars, i, c, u, s, n, v, e, s, e, c, cs, cs, cs, e, t, e, c, ca, f, e, x, s, e;
            return this._or(function() {
                return this._apply("block")
            }, function() {
                return function() {
                    return this._applyWithArgs("token", "var"), bs = this._applyWithArgs("listOf", "varBinding", ","), this._apply("sc"), ["begin"].concat(bs)
                }.call(this)
            }, function() {
                return function() {
                    return this._applyWithArgs("token", "if"), this._applyWithArgs("token", "("), c = this._apply("expr"), this._applyWithArgs("token", ")"), t = this._apply("stmt"), f = this._or(function() {
                        return function() {
                            return this._applyWithArgs("token", "else"), this._apply("stmt")
                        }.call(this)
                    }, function() {
                        return function() {
                            return this._apply("empty"), ["get", "undefined"]
                        }.call(this)
                    }), ["if", c, t, f]
                }.call(this)
            }, function() {
                return function() {
                    return this._applyWithArgs("token", "while"), this._applyWithArgs("token", "("), c = this._apply("expr"), this._applyWithArgs("token", ")"), s = this._apply("stmt"), ["while", c, s]
                }.call(this)
            }, function() {
                return function() {
                    return this._applyWithArgs("token", "do"), s = this._apply("stmt"), this._applyWithArgs("token", "while"), this._applyWithArgs("token", "("), c = this._apply("expr"), this._applyWithArgs("token", ")"), this._apply("sc"), ["doWhile", s, c]
                }.call(this)
            }, function() {
                return function() {
                    return this._applyWithArgs("token", "for"), this._applyWithArgs("token", "("), i = this._or(function() {
                        return function() {
                            return this._applyWithArgs("token", "var"), vars = this._applyWithArgs("listOf", "varBinding", ","), ["multiVar", vars]
                        }.call(this)
                    }, function() {
                        return this._apply("expr")
                    }, function() {
                        return function() {
                            return this._apply("empty"), ["get", "undefined"]
                        }.call(this)
                    }), this._applyWithArgs("token", ";"), c = this._or(function() {
                        return this._apply("expr")
                    }, function() {
                        return function() {
                            return this._apply("empty"), ["get", "true"]
                        }.call(this)
                    }), this._applyWithArgs("token", ";"), u = this._or(function() {
                        return this._apply("expr")
                    }, function() {
                        return function() {
                            return this._apply("empty"), ["get", "undefined"]
                        }.call(this)
                    }), this._applyWithArgs("token", ")"), s = this._apply("stmt"), ["for", i, c, u, s]
                }.call(this)
            }, function() {
                return function() {
                    return this._applyWithArgs("token", "for"), this._applyWithArgs("token", "("), v = this._or(function() {
                        return function() {
                            return this._applyWithArgs("token", "var"), n = this._applyWithArgs("token", "name"), ["var", n, ["get", "undefined"]]
                        }.call(this)
                    }, function() {
                        return this._apply("expr")
                    }), this._applyWithArgs("token", "in"), e = this._apply("expr"), this._applyWithArgs("token", ")"), s = this._apply("stmt"), ["forIn", v, e, s]
                }.call(this)
            }, function() {
                return function() {
                    return this._applyWithArgs("token", "switch"), this._applyWithArgs("token", "("), e = this._apply("expr"), this._applyWithArgs("token", ")"), this._applyWithArgs("token", "{"), cs = this._many(function() {
                        return this._or(function() {
                            return function() {
                                return this._applyWithArgs("token", "case"), c = this._apply("expr"), this._applyWithArgs("token", ":"), cs = this._apply("srcElems"), ["case", c, cs]
                            }.call(this)
                        }, function() {
                            return function() {
                                return this._applyWithArgs("token", "default"), this._applyWithArgs("token", ":"), cs = this._apply("srcElems"), ["default", cs]
                            }.call(this)
                        })
                    }), this._applyWithArgs("token", "}"), ["switch", e].concat(cs)
                }.call(this)
            }, function() {
                return function() {
                    return this._applyWithArgs("token", "break"), this._apply("sc"), ["break"]
                }.call(this)
            }, function() {
                return function() {
                    return this._applyWithArgs("token", "continue"), this._apply("sc"), ["continue"]
                }.call(this)
            }, function() {
                return function() {
                    return this._applyWithArgs("token", "throw"), this._apply("spacesNoNl"), e = this._apply("expr"), this._apply("sc"), ["throw", e]
                }.call(this)
            }, function() {
                return function() {
                    return this._applyWithArgs("token", "try"), t = this._apply("block"), ca = this._or(function() {
                        return function() {
                            return this._applyWithArgs("token", "catch"), this._applyWithArgs("token", "("), e = this._applyWithArgs("token", "name"), this._applyWithArgs("token", ")"), c = this._apply("block"), [e, c]
                        }.call(this)
                    }, function() {
                        return function() {
                            return this._apply("empty"), ["", ["get", "undefined"]]
                        }.call(this)
                    }), f = this._or(function() {
                        return function() {
                            return this._applyWithArgs("token", "finally"), this._apply("block")
                        }.call(this)
                    }, function() {
                        return function() {
                            return this._apply("empty"), ["get", "undefined"]
                        }.call(this)
                    }), ["try", t].concat(ca).concat([f])
                }.call(this)
            }, function() {
                return function() {
                    return this._applyWithArgs("token", "return"), e = this._or(function() {
                        return this._apply("expr")
                    }, function() {
                        return function() {
                            return this._apply("empty"), ["get", "undefined"]
                        }.call(this)
                    }), this._apply("sc"), ["return", e]
                }.call(this)
            }, function() {
                return function() {
                    return this._applyWithArgs("token", "with"), this._applyWithArgs("token", "("), x = this._apply("expr"), this._applyWithArgs("token", ")"), s = this._apply("stmt"), ["with", x, s]
                }.call(this)
            }, function() {
                return function() {
                    return e = this._apply("expr"), this._apply("sc"), e
                }.call(this)
            }, function() {
                return function() {
                    return this._applyWithArgs("token", ";"), ["get", "undefined"]
                }.call(this)
            })
        }
    }), LKJSTranslator = objectThatDelegatesTo(BSJSTranslator, {
        regexp: function() {
            var re;
            return function() {
                return re = this._apply("anything")
            }.call(this)
        },
        preopSpace: function() {
            var op, x;
            return function() {
                return op = this._apply("anything"), x = this._apply("trans"), op + " " + x
            }.call(this)
        },
        newExpr: function() {
            var newExpr, args;
            return function() {
                return newExpr = this._apply("trans"), args = this._many(function() {
                    return this._apply("trans")
                }), "new (" + newExpr + ")(" + args.join(",") + ")"
            }.call(this)
        },
        singleVar: function() {
            var name, val;
            return function() {
                return this._form(function() {
                    return function() {
                        return this._applyWithArgs("exactly", "var"), name = this._apply("anything"), val = this._apply("trans")
                    }.call(this)
                }), name + "=" + val
            }.call(this)
        },
        multiVar: function() {
            var xs;
            return function() {
                return this._form(function() {
                    return xs = this._many(function() {
                        return this._apply("singleVar")
                    })
                }), "var " + xs.join(",")
            }.call(this)
        },
        "try": function() {
            var x, name, c, f;
            return function() {
                return x = this._apply("curlyTrans"), name = this._apply("anything"), c = this._apply("curlyTrans"), f = this._apply("curlyTrans"), "try " + x + (name ? "catch(" + name + ")" + c : "") + "finally" + f
            }.call(this)
        }
    }), LKOMetaParser = objectThatDelegatesTo(BSOMetaParser, {
        hostExpr: function() {
            var r;
            return function() {
                return r = this._applyWithArgs("foreign", LKJSParser, "expr"), this._applyWithArgs("foreign", BSJSTranslator, "trans", r)
            }.call(this)
        },
        atomicHostExpr: function() {
            var r;
            return function() {
                return r = this._applyWithArgs("foreign", LKJSParser, "semAction"), this._applyWithArgs("foreign", BSJSTranslator, "trans", r)
            }.call(this)
        },
        curlyHostExpr: function() {
            var r;
            return function() {
                return r = this._applyWithArgs("foreign", LKJSParser, "curlySemAction"), this._applyWithArgs("foreign", BSJSTranslator, "trans", r)
            }.call(this)
        }
    }), LKOMetaJSParser = objectThatDelegatesTo(LKJSParser, {
        srcElem: function() {
            var r;
            return this._or(function() {
                return function() {
                    return this._apply("spaces"), r = this._applyWithArgs("foreign", LKOMetaParser, "grammar"), this._apply("sc"), r
                }.call(this)
            }, function() {
                return LKJSParser._superApplyWithArgs(this, "srcElem")
            })
        }
    }), LKOMetaJSTranslator = objectThatDelegatesTo(LKJSTranslator, {
        Grammar: function() {
            return this._applyWithArgs("foreign", BSOMetaTranslator, "Grammar")
        }
    }), module("lively.Ometa").requires("lively.Network", "ometa.lively").toRun(function() {
        Object.subclass("OMetaSupport"), Object.extend(OMetaSupport, {
            ometaGrammarDir: URL.codeBase,
            fromFile: function(fileName) {
                var src = OMetaSupport.fileContent(fileName),
                    grammar = OMetaSupport.ometaEval(src);
                return grammar
            },
            translateAndWrite: function(sourceFileName, destFileName, additionalRequirements) {
                var requirementsString = additionalRequirements ? ",'" + additionalRequirements.join("','") + "'" : "",
                    str = Strings.format("module('%s').requires('ometa.lively'%s).toRun(function() {\n%s\n});", destFileName.replace(/\.js$/, "").replace(/\//g, "."), requirementsString, OMetaSupport.translateToJs(OMetaSupport.fileContent(sourceFileName)));
                OMetaSupport.writeGrammar(destFileName, str), lively.morphic.World.current().setStatusMessage(Strings.format("Successfully compiled OMeta grammar %s to %s", sourceFileName, destFileName), Color.green, 3)
            },
            translate: function(source, additionalRequirements, destFileName) {
                destFileName = destFileName || "anonymousOMetaModule";
                var requirementsString = additionalRequirements ? ",'" + additionalRequirements.join("','") + "'" : "",
                    str = Strings.format("module('%s').requires('ometa.lively'%s).toRun(function() {\n%s\n});", destFileName.replace(/\.js$/, "").replace(/\//g, "."), requirementsString, OMetaSupport.translateToJs(source));
                return lively.morphic.World.current().setStatusMessage(Strings.format("Successfully compiled OMeta grammar %s", source.truncate(300)), Color.green, 3), str
            },
            ometaEval: function(src) {
                var jsSrc = OMetaSupport.translateToJs(src);
                return eval(jsSrc)
            },
            translateToJs: function(src) {
                var ometaSrc = OMetaSupport.matchAllWithGrammar(BSOMetaJSParser, "topLevel", src);
                if (!ometaSrc) throw new Error("Problem in translateToJs: Cannot create OMeta Ast from source");
                var jsSrc = OMetaSupport.matchWithGrammar(BSOMetaJSTranslator, "trans", ometaSrc);
                return jsSrc
            },
            matchAllWithGrammar: function(grammar, rule, src, errorHandling) {
                var errorFunc;
                return errorFunc = errorHandling ? errorHandling instanceof Function ? errorHandling : OMetaSupport.handleErrorDebug : OMetaSupport.handleErrorDebug, grammar.matchAll(src, rule, null, errorFunc.curry(src, rule))
            },
            matchWithGrammar: function(grammar, rule, src, errorHandling) {
                var errorFunc;
                return errorFunc = errorHandling ? errorHandling instanceof Function ? errorHandling : OMetaSupport.handleErrorDebug : OMetaSupport.handleErrorDebug, grammar.match(src, rule, null, errorFunc.curry(src, rule))
            },
            handleErrorDebug: function(src, rule, grammarInstance, errorIndex) {
                var charsBefore = 500,
                    charsAfter = 250,
                    msg = "OMeta Error -- " + rule + "\n",
                    startIndex = Math.max(0, errorIndex - charsBefore),
                    stopIndex = Math.min(src.length, errorIndex + charsAfter);
                return msg += src.constructor === Array ? "src = [" + src.toString() + "]" : src.substring(startIndex, errorIndex) + "<--Error-->" + src.substring(errorIndex, stopIndex), console.log(msg), msg
            },
            handleError: function() {},
            fileContent: function(fileName) {
                var url = URL.root.withFilename(fileName);
                return new WebResource(url).get().content
            },
            writeGrammar: function(fileName, src) {
                var url = URL.root.withFilename(fileName);
                return new WebResource(url).put(src)
            }
        })
    }), module("users.timfelgentreff.jsinterpreter.generated.Nodes").requires().toRun(function() {
        Object.subclass("users.timfelgentreff.jsinterpreter.Node"), users.timfelgentreff.jsinterpreter.Node.subclass("users.timfelgentreff.jsinterpreter.Sequence", "testing", {
            isSequence: !0
        }, "initializing", {
            initialize: function($super, pos, children) {
                this.pos = pos, this.children = children, children.forEach(function(node) {
                    node.setParent(this)
                }, this)
            }
        }, "debugging", {
            printConstruction: function() {
                return this.printConstructorCall(this.pos, this.children)
            },
            toString: function() {
                return Strings.format("%s(%s)", this.constructor.name, this.children.join(","))
            }
        }, "conversion", {
            asJS: function(depth) {
                var indent = this.indent(depth || 0);
                return depth = depth || -1, this.children.invoke("asJS", depth + 1).join(";\n" + indent)
            }
        }, "insertion", {
            insertBefore: function(newNode, existingNode) {
                for (var i = 0; i < this.children.length && !(this.children[i].nodesMatching(function(node) {
                        return node === existingNode
                    }).length > 0); i++);
                if (!this.children[i]) throw dbgOn(new Error("insertBefore: " + existingNode + " not in " + this));
                return this.insertAt(newNode, i)
            },
            insertAt: function(newNode, idx) {
                return this.children.pushAt(newNode, idx), newNode.setParent(this), newNode
            }
        }, "accessing", {
            parentSequence: function() {
                return this
            }
        }, "stepping", {
            firstStatement: function() {
                return this.children.length > 0 ? this.children[0].firstStatement() : this
            },
            nextStatement: function($super, node) {
                var idx = this.children.indexOf(node);
                return idx >= 0 && idx < this.children.length - 1 ? this.children[idx + 1] : $super(this)
            },
            isComposite: function() {
                return !0
            }
        }, "visiting", {
            accept: function(visitor) {
                return visitor.visitSequence(this)
            }
        }), users.timfelgentreff.jsinterpreter.Node.subclass("users.timfelgentreff.jsinterpreter.Number", "testing", {
            isNumber: !0
        }, "initializing", {
            initialize: function($super, pos, value) {
                this.pos = pos, this.value = value
            }
        }, "debugging", {
            printConstruction: function() {
                return this.printConstructorCall(this.pos, this.pos, this.value)
            },
            toString: function() {
                return Strings.format("%s(%s)", this.constructor.name, this.value)
            }
        }, "conversion", {
            asJS: function() {
                return this.value
            }
        }, "visiting", {
            accept: function(visitor) {
                return visitor.visitNumber(this)
            }
        }), users.timfelgentreff.jsinterpreter.Node.subclass("users.timfelgentreff.jsinterpreter.String", "testing", {
            isString: !0
        }, "initializing", {
            initialize: function($super, pos, value) {
                this.pos = pos, this.value = value
            }
        }, "debugging", {
            printConstruction: function() {
                return this.printConstructorCall(this.pos, '"' + this.value + '"')
            },
            toString: function() {
                return Strings.format("%s(%s)", this.constructor.name, this.value)
            }
        }, "conversion", {
            asJS: function() {
                return '"' + this.value + '"'
            }
        }, "visiting", {
            accept: function(visitor) {
                return visitor.visitString(this)
            }
        }), users.timfelgentreff.jsinterpreter.Node.subclass("users.timfelgentreff.jsinterpreter.Cond", "testing", {
            isCond: !0
        }, "initializing", {
            initialize: function($super, pos, condExpr, trueExpr, falseExpr) {
                this.pos = pos, this.condExpr = condExpr, this.trueExpr = trueExpr, this.falseExpr = falseExpr, condExpr.setParent(this), trueExpr.setParent(this), falseExpr.setParent(this)
            }
        }, "debugging", {
            printConstruction: function() {
                return this.printConstructorCall(this.pos, this.condExpr, this.trueExpr, this.falseExpr)
            },
            toString: function() {
                return Strings.format("%s(%s?%s:%s)", this.constructor.name, this.condExpr, this.trueExpr, this.falseExpr)
            }
        }, "conversion", {
            asJS: function(depth) {
                return Strings.format("(%s) ? (%s) : (%s)", this.condExpr.asJS(depth), this.trueExpr.asJS(depth), this.falseExpr.asJS(depth))
            }
        }, "visiting", {
            accept: function(visitor) {
                return visitor.visitCond(this)
            }
        }), users.timfelgentreff.jsinterpreter.Node.subclass("users.timfelgentreff.jsinterpreter.If", "testing", {
            isIf: !0
        }, "initializing", {
            initialize: function($super, pos, condExpr, trueExpr, falseExpr) {
                this.pos = pos, this.condExpr = condExpr, this.trueExpr = trueExpr.isSequence || this.isUndefined(trueExpr) ? trueExpr : new users.timfelgentreff.jsinterpreter.Sequence(trueExpr.pos, [trueExpr]), this.falseExpr = falseExpr.isSequence || this.isUndefined(falseExpr) ? falseExpr : new users.timfelgentreff.jsinterpreter.Sequence(trueExpr.pos, [falseExpr]), condExpr.setParent(this), this.trueExpr.setParent(this), this.falseExpr.setParent(this)
            }
        }, "debugging", {
            printConstruction: function() {
                return this.printConstructorCall(this.pos, this.condExpr, this.trueExpr, this.falseExpr)
            },
            toString: function() {
                return Strings.format("%s(%s?%s:%s)", this.constructor.name, this.condExpr, this.trueExpr, this.falseExpr)
            }
        }, "conversion", {
            asJS: function(depth) {
                var str = Strings.format("if (%s) {%s}", this.condExpr.asJS(depth), this.trueExpr.asJS(depth));
                return this.isUndefined(this.falseExpr) || (str += " else {" + this.falseExpr.asJS(depth) + "}"), str
            }
        }, "stepping", {
            firstStatement: function() {
                return this.condExpr.firstStatement()
            },
            nextStatement: function($super, node) {
                return node === this.condExpr ? this.trueExpr : $super(this)
            },
            isComposite: function() {
                return !0
            }
        }, "visiting", {
            accept: function(visitor) {
                return visitor.visitIf(this)
            }
        }), users.timfelgentreff.jsinterpreter.Node.subclass("users.timfelgentreff.jsinterpreter.While", "testing", {
            isWhile: !0
        }, "initializing", {
            initialize: function($super, pos, condExpr, body) {
                this.pos = pos, this.condExpr = condExpr, this.body = body, condExpr.setParent(this), body.setParent(this)
            }
        }, "debugging", {
            printConstruction: function() {
                return this.printConstructorCall(this.pos, this.condExpr, this.body)
            },
            toString: function() {
                return Strings.format("%s(%s?%s)", this.constructor.name, this.condExpr, this.body)
            }
        }, "conversion", {
            asJS: function(depth) {
                return Strings.format("while (%s) {%s}", this.condExpr.asJS(depth), this.body.asJS(depth))
            }
        }, "stepping", {
            firstStatement: function() {
                return this.condExpr.firstStatement()
            },
            nextStatement: function($super, node) {
                return node === this.condExpr ? this.body : node === this.body ? this.condExpr : $super(this)
            },
            isComposite: function() {
                return !0
            }
        }, "visiting", {
            accept: function(visitor) {
                return visitor.visitWhile(this)
            }
        }), users.timfelgentreff.jsinterpreter.Node.subclass("users.timfelgentreff.jsinterpreter.DoWhile", "testing", {
            isDoWhile: !0
        }, "initializing", {
            initialize: function($super, pos, body, condExpr) {
                this.pos = pos, this.body = body, this.condExpr = condExpr, body.setParent(this), condExpr.setParent(this)
            }
        }, "debugging", {
            printConstruction: function() {
                return this.printConstructorCall(this.pos, this.body, this.condExpr)
            },
            toString: function() {
                return Strings.format("%s(%s while%s)", this.constructor.name, this.body, this.condExpr)
            }
        }, "conversion", {
            asJS: function(depth) {
                return Strings.format("do {%s} while (%s);", this.body.asJS(depth), this.condExpr.asJS(depth))
            }
        }, "stepping", {
            firstStatement: function() {
                return this.body.firstStatement()
            },
            nextStatement: function($super, node) {
                return node === this.condExpr ? this.body : node === this.body ? this.condExpr : $super(this)
            },
            isComposite: function() {
                return !0
            }
        }, "visiting", {
            accept: function(visitor) {
                return visitor.visitDoWhile(this)
            }
        }), users.timfelgentreff.jsinterpreter.Node.subclass("users.timfelgentreff.jsinterpreter.For", "testing", {
            isFor: !0
        }, "initializing", {
            initialize: function($super, pos, init, condExpr, body, upd) {
                this.pos = pos, this.init = init, this.condExpr = condExpr, this.body = body, this.upd = upd, init.setParent(this), condExpr.setParent(this), body.setParent(this), upd.setParent(this)
            }
        }, "debugging", {
            printConstruction: function() {
                return this.printConstructorCall(this.pos, this.init, this.condExpr, this.body, this.upd)
            },
            toString: function() {
                return Strings.format("%s(%s;%s;%s do %s)", this.constructor.name, this.init, this.condExpr, this.upd, this.body)
            }
        }, "conversion", {
            asJS: function(depth) {
                return Strings.format("for (%s; %s; %s) {%s}", this.init.asJS(depth), this.condExpr.asJS(depth), this.upd.asJS(depth), this.body.asJS(depth))
            }
        }, "stepping", {
            firstStatement: function() {
                return this.init.firstStatement()
            },
            nextStatement: function($super, node) {
                return node === this.init || node === this.upd ? this.condExpr : node === this.condExpr ? this.body : node === this.body ? this.upd : $super(this)
            },
            isComposite: function() {
                return !0
            }
        }, "visiting", {
            accept: function(visitor) {
                return visitor.visitFor(this)
            }
        }), users.timfelgentreff.jsinterpreter.Node.subclass("users.timfelgentreff.jsinterpreter.ForIn", "testing", {
            isForIn: !0
        }, "initializing", {
            initialize: function($super, pos, name, obj, body) {
                this.pos = pos, this.name = name, this.obj = obj, this.body = body, name.setParent(this), obj.setParent(this), body.setParent(this)
            }
        }, "debugging", {
            printConstruction: function() {
                return this.printConstructorCall(this.pos, this.name, this.obj, this.body)
            },
            toString: function() {
                return Strings.format("%s(%s in %s do %s)", this.constructor.name, this.name, this.obj, this.body)
            }
        }, "conversion", {
            asJS: function(depth) {
                return Strings.format("for (%s in %s) {%s}", this.name.asJS(depth), this.obj.asJS(depth), this.body.asJS(depth))
            }
        }, "visiting", {
            accept: function(visitor) {
                return visitor.visitForIn(this)
            }
        }), users.timfelgentreff.jsinterpreter.Node.subclass("users.timfelgentreff.jsinterpreter.Set", "testing", {
            isSet: !0
        }, "initializing", {
            initialize: function($super, pos, left, right) {
                this.pos = pos, this.left = left, this.right = right, left.setParent(this), right.setParent(this)
            }
        }, "debugging", {
            printConstruction: function() {
                return this.printConstructorCall(this.pos, this.left, this.right)
            },
            toString: function() {
                return Strings.format("%s(%s = %s)", this.constructor.name, this.left, this.right)
            }
        }, "conversion", {
            asJS: function(depth) {
                return this.left.asJS(depth) + " = " + this.right.asJS(depth)
            }
        }, "visiting", {
            accept: function(visitor) {
                return visitor.visitSet(this)
            }
        }), users.timfelgentreff.jsinterpreter.Node.subclass("users.timfelgentreff.jsinterpreter.ModifyingSet", "testing", {
            isModifyingSet: !0
        }, "initializing", {
            initialize: function($super, pos, left, name, right) {
                this.pos = pos, this.left = left, this.name = name, this.right = right, left.setParent(this), right.setParent(this)
            }
        }, "debugging", {
            printConstruction: function() {
                return this.printConstructorCall(this.pos, this.left, '"' + this.name + '"', this.right)
            },
            toString: function() {
                return Strings.format("%s(%s %s %s)", this.constructor.name, this.left, this.name, this.right)
            }
        }, "conversion", {
            asJS: function(depth) {
                return this.left.asJS(depth) + " " + this.name + "= " + this.right.asJS(depth)
            }
        }, "visiting", {
            accept: function(visitor) {
                return visitor.visitModifyingSet(this)
            }
        }), users.timfelgentreff.jsinterpreter.Node.subclass("users.timfelgentreff.jsinterpreter.BinaryOp", "testing", {
            isBinaryOp: !0
        }, "initializing", {
            initialize: function($super, pos, name, left, right) {
                this.pos = pos, this.name = name, this.left = left, this.right = right, left.setParent(this), right.setParent(this)
            }
        }, "debugging", {
            printConstruction: function() {
                return this.printConstructorCall(this.pos, '"' + this.name + '"', this.left, this.right)
            },
            toString: function() {
                return Strings.format("%s(%s %s %s)", this.constructor.name, this.left, this.name, this.right)
            }
        }, "conversion", {
            asJS: function(depth) {
                return "(" + this.left.asJS(depth) + ") " + this.name + " (" + this.right.asJS(depth) + ")"
            }
        }, "visiting", {
            accept: function(visitor) {
                return visitor.visitBinaryOp(this)
            }
        }), users.timfelgentreff.jsinterpreter.Node.subclass("users.timfelgentreff.jsinterpreter.UnaryOp", "testing", {
            isUnaryOp: !0
        }, "initializing", {
            initialize: function($super, pos, name, expr) {
                this.pos = pos, this.name = name, this.expr = expr, expr.setParent(this)
            }
        }, "debugging", {
            printConstruction: function() {
                return this.printConstructorCall(this.pos, '"' + this.name + '"', this.expr)
            },
            toString: function() {
                return Strings.format("%s(%s%s)", this.constructor.name, this.name, this.expr)
            }
        }, "conversion", {
            asJS: function(depth) {
                return "(" + this.name + this.expr.asJS(depth) + ")"
            }
        }, "visiting", {
            accept: function(visitor) {
                return visitor.visitUnaryOp(this)
            }
        }), users.timfelgentreff.jsinterpreter.Node.subclass("users.timfelgentreff.jsinterpreter.PreOp", "testing", {
            isPreOp: !0
        }, "initializing", {
            initialize: function($super, pos, name, expr) {
                this.pos = pos, this.name = name, this.expr = expr, expr.setParent(this)
            }
        }, "debugging", {
            printConstruction: function() {
                return this.printConstructorCall(this.pos, '"' + this.name + '"', this.expr)
            },
            toString: function() {
                return Strings.format("%s(%s%s)", this.constructor.name, this.name, this.expr)
            }
        }, "conversion", {
            asJS: function(depth) {
                return "(" + this.name + this.expr.asJS(depth) + ")"
            }
        }, "visiting", {
            accept: function(visitor) {
                return visitor.visitPreOp(this)
            }
        }), users.timfelgentreff.jsinterpreter.Node.subclass("users.timfelgentreff.jsinterpreter.PostOp", "testing", {
            isPostOp: !0
        }, "initializing", {
            initialize: function($super, pos, name, expr) {
                this.pos = pos, this.name = name, this.expr = expr, expr.setParent(this)
            }
        }, "debugging", {
            printConstruction: function() {
                return this.printConstructorCall(this.pos, '"' + this.name + '"', this.expr)
            },
            toString: function() {
                return Strings.format("%s(%s%s)", this.constructor.name, this.expr, this.name)
            }
        }, "conversion", {
            asJS: function(depth) {
                return "(" + this.expr.asJS(depth) + this.name + ")"
            }
        }, "visiting", {
            accept: function(visitor) {
                return visitor.visitPostOp(this)
            }
        }), users.timfelgentreff.jsinterpreter.Node.subclass("users.timfelgentreff.jsinterpreter.This", "testing", {
            isThis: !0
        }, "initializing", {
            initialize: function($super, pos) {
                this.pos = pos
            }
        }, "debugging", {
            printConstruction: function() {
                return this.printConstructorCall(this.pos)
            },
            toString: function() {
                return this.constructor.name
            }
        }, "conversion", {
            asJS: function() {
                return "this"
            }
        }, "visiting", {
            accept: function(visitor) {
                return visitor.visitThis(this)
            }
        }), users.timfelgentreff.jsinterpreter.Node.subclass("users.timfelgentreff.jsinterpreter.Variable", "testing", {
            isVariable: !0
        }, "initializing", {
            initialize: function($super, pos, name) {
                this.pos = pos, this.name = name
            }
        }, "debugging", {
            printConstruction: function() {
                return this.printConstructorCall(this.pos, '"' + this.name + '"')
            },
            toString: function() {
                return Strings.format("%s(%s)", this.constructor.name, this.name)
            }
        }, "conversion", {
            asJS: function() {
                return this.name
            }
        }, "visiting", {
            accept: function(visitor) {
                return visitor.visitVariable(this)
            }
        }), users.timfelgentreff.jsinterpreter.Node.subclass("users.timfelgentreff.jsinterpreter.GetSlot", "testing", {
            isGetSlot: !0
        }, "initializing", {
            initialize: function($super, pos, slotName, obj) {
                this.pos = pos, this.slotName = slotName, this.obj = obj, slotName.setParent(this), obj.setParent(this)
            }
        }, "debugging", {
            printConstruction: function() {
                return this.printConstructorCall(this.pos, this.slotName, this.obj)
            },
            toString: function() {
                return Strings.format("%s(%s[%s])", this.constructor.name, this.obj, this.slotName)
            }
        }, "conversion", {
            asJS: function(depth) {
                var objJS = this.obj.asJS(depth);
                return this.obj.isFunction && (objJS = "(" + objJS + ")"), objJS + "[" + this.slotName.asJS(depth) + "]"
            }
        }, "visiting", {
            accept: function(visitor) {
                return visitor.visitGetSlot(this)
            }
        }), users.timfelgentreff.jsinterpreter.Node.subclass("users.timfelgentreff.jsinterpreter.Break", "testing", {
            isBreak: !0
        }, "initializing", {
            initialize: function($super, pos, label) {
                this.pos = pos, this.label = label || new users.timfelgentreff.jsinterpreter.Label([pos[1], pos[1]], ""), this.label.setParent(this)
            }
        }, "debugging", {
            printConstruction: function() {
                return this.printConstructorCall(this.pos, this.label)
            }
        }, "conversion", {
            asJS: function() {
                return "break" + this.label.asJS()
            }
        }, "visiting", {
            accept: function(visitor) {
                return visitor.visitBreak(this)
            }
        }), users.timfelgentreff.jsinterpreter.Node.subclass("users.timfelgentreff.jsinterpreter.Debugger", "testing", {
            isDebugger: !0
        }, "initializing", {
            initialize: function($super, pos) {
                this.pos = pos
            }
        }, "debugging", {
            printConstruction: function() {
                return this.printConstructorCall(this.pos)
            }
        }, "conversion", {
            asJS: function() {
                return "debugger"
            }
        }, "visiting", {
            accept: function(visitor) {
                return visitor.visitDebugger(this)
            }
        }), users.timfelgentreff.jsinterpreter.Node.subclass("users.timfelgentreff.jsinterpreter.Continue", "testing", {
            isContinue: !0
        }, "initializing", {
            initialize: function($super, pos, label) {
                this.pos = pos, this.label = label || new users.timfelgentreff.jsinterpreter.Label([pos[1], pos[1]], ""), this.label.setParent(this)
            }
        }, "debugging", {
            printConstruction: function() {
                return this.printConstructorCall(this.pos, this.label)
            }
        }, "conversion", {
            asJS: function() {
                return "continue" + this.label.asJS()
            }
        }, "visiting", {
            accept: function(visitor) {
                return visitor.visitContinue(this)
            }
        }), users.timfelgentreff.jsinterpreter.Node.subclass("users.timfelgentreff.jsinterpreter.ArrayLiteral", "testing", {
            isArrayLiteral: !0
        }, "initializing", {
            initialize: function($super, pos, elements) {
                this.pos = pos, this.elements = elements, elements.forEach(function(node) {
                    node.setParent(this)
                }, this)
            }
        }, "debugging", {
            printConstruction: function() {
                return this.printConstructorCall(this.pos, this.elements)
            },
            toString: function() {
                return Strings.format("%s(%s)", this.constructor.name, this.elements.join(","))
            }
        }, "conversion", {
            asJS: function() {
                return "[" + this.elements.invoke("asJS").join(",") + "]"
            }
        }, "visiting", {
            accept: function(visitor) {
                return visitor.visitArrayLiteral(this)
            }
        }), users.timfelgentreff.jsinterpreter.Node.subclass("users.timfelgentreff.jsinterpreter.Return", "testing", {
            isReturn: !0
        }, "initializing", {
            initialize: function($super, pos, expr) {
                this.pos = pos, this.expr = expr, expr.setParent(this)
            }
        }, "debugging", {
            printConstruction: function() {
                return this.printConstructorCall(this.pos, this.expr)
            },
            toString: function() {
                return Strings.format("%s(%s)", this.constructor.name, this.expr)
            }
        }, "conversion", {
            asJS: function(depth) {
                return "return " + this.expr.asJS(depth)
            }
        }, "visiting", {
            accept: function(visitor) {
                return visitor.visitReturn(this)
            }
        }), users.timfelgentreff.jsinterpreter.Node.subclass("users.timfelgentreff.jsinterpreter.With", "testing", {
            isWith: !0
        }, "initializing", {
            initialize: function($super, pos, obj, body) {
                this.pos = pos, this.obj = obj, this.body = body, obj.setParent(this), body.setParent(this)
            }
        }, "debugging", {
            printConstruction: function() {
                return this.printConstructorCall(this.pos, this.obj, this.body)
            },
            toString: function() {
                return Strings.format("%s(%s %s)", this.constructor.name, this.obj, this.body)
            }
        }, "conversion", {
            asJS: function(depth) {
                return "with (" + this.obj.asJS(depth) + ") {" + this.body.asJS(depth) + "}"
            }
        }, "visiting", {
            accept: function(visitor) {
                return visitor.visitWith(this)
            }
        }), users.timfelgentreff.jsinterpreter.Node.subclass("users.timfelgentreff.jsinterpreter.Send", "testing", {
            isSend: !0
        }, "initializing", {
            initialize: function($super, pos, property, recv, args) {
                this.pos = pos, this.property = property, this.recv = recv, this.args = args, args.forEach(function(node) {
                    node.setParent(this)
                }, this), property.setParent(this), recv.setParent(this)
            }
        }, "debugging", {
            printConstruction: function() {
                return this.printConstructorCall(this.pos, this.property, this.recv, this.args)
            },
            toString: function() {
                return Strings.format("%s(%s[%s](%s))", this.constructor.name, this.recv, this.property, this.args.join(","))
            }
        }, "conversion", {
            asJS: function(depth) {
                var recvJS = this.recv.asJS(depth);
                return this.recv.isFunction && (recvJS = "(" + recvJS + ")"), Strings.format("%s[%s](%s)", recvJS, this.property.asJS(depth), this.args.invoke("asJS").join(","))
            }
        }, "accessing", {
            getName: function() {
                return this.property
            }
        }, "visiting", {
            accept: function(visitor) {
                return visitor.visitSend(this)
            }
        }), users.timfelgentreff.jsinterpreter.Node.subclass("users.timfelgentreff.jsinterpreter.Call", "testing", {
            isCall: !0
        }, "initializing", {
            initialize: function($super, pos, fn, args) {
                this.pos = pos, this.fn = fn, this.args = args, args.forEach(function(node) {
                    node.setParent(this)
                }, this), fn.setParent(this)
            }
        }, "debugging", {
            printConstruction: function() {
                return this.printConstructorCall(this.pos, this.fn, this.args)
            },
            toString: function() {
                return Strings.format("%s(%s(%s))", this.constructor.name, this.fn, this.args.join(","))
            }
        }, "conversion", {
            asJS: function(depth) {
                return Strings.format("%s(%s)", this.fn.asJS(depth), this.args.invoke("asJS").join(","))
            }
        }, "accessing", {
            getName: function() {
                return this.fn.name
            }
        }, "visiting", {
            accept: function(visitor) {
                return visitor.visitCall(this)
            }
        }), users.timfelgentreff.jsinterpreter.Node.subclass("users.timfelgentreff.jsinterpreter.New", "testing", {
            isNew: !0
        }, "initializing", {
            initialize: function($super, pos, clsExpr) {
                this.pos = pos, this.clsExpr = clsExpr, clsExpr.setParent(this)
            }
        }, "debugging", {
            printConstruction: function() {
                return this.printConstructorCall(this.pos, this.clsExpr)
            },
            toString: function() {
                return Strings.format("%s(%s)", this.constructor.name, this.clsExpr)
            }
        }, "conversion", {
            asJS: function(depth) {
                return "new " + this.clsExpr.asJS(depth)
            }
        }, "visiting", {
            accept: function(visitor) {
                return visitor.visitNew(this)
            }
        }), users.timfelgentreff.jsinterpreter.Node.subclass("users.timfelgentreff.jsinterpreter.VarDeclaration", "testing", {
            isVarDeclaration: !0
        }, "initializing", {
            initialize: function($super, pos, name, val) {
                this.pos = pos, this.name = name, this.val = val, val.setParent(this)
            }
        }, "debugging", {
            printConstruction: function() {
                return this.printConstructorCall(this.pos, '"' + this.name + '"', this.val)
            },
            toString: function() {
                return Strings.format("%s(%s = %s)", this.constructor.name, this.name, this.val)
            }
        }, "conversion", {
            asJS: function(depth) {
                return Strings.format("var %s = %s", this.name, this.val.asJS(depth))
            }
        }, "visiting", {
            accept: function(visitor) {
                return visitor.visitVarDeclaration(this)
            }
        }), users.timfelgentreff.jsinterpreter.Node.subclass("users.timfelgentreff.jsinterpreter.Throw", "testing", {
            isThrow: !0
        }, "initializing", {
            initialize: function($super, pos, expr) {
                this.pos = pos, this.expr = expr, expr.setParent(this)
            }
        }, "debugging", {
            printConstruction: function() {
                return this.printConstructorCall(this.pos, this.expr)
            },
            toString: function() {
                return Strings.format("%s(%s)", this.constructor.name, this.expr)
            }
        }, "conversion", {
            asJS: function(depth) {
                return "throw " + this.expr.asJS(depth)
            }
        }, "visiting", {
            accept: function(visitor) {
                return visitor.visitThrow(this)
            }
        }), users.timfelgentreff.jsinterpreter.Node.subclass("users.timfelgentreff.jsinterpreter.TryCatchFinally", "testing", {
            isTryCatchFinally: !0
        }, "initializing", {
            initialize: function($super, pos, trySeq, err, catchSeq, finallySeq) {
                this.pos = pos, this.trySeq = trySeq, this.err = err, this.catchSeq = catchSeq, this.finallySeq = finallySeq, trySeq.setParent(this), err.setParent(this), catchSeq.setParent(this), finallySeq.setParent(this)
            }
        }, "debugging", {
            printConstruction: function() {
                return this.printConstructorCall(this.pos, this.trySeq, '"' + this.err.name + '"', this.catchSeq, this.finallySeq)
            },
            toString: function() {
                return Strings.format("%s(%s %s %s)", this.constructor.name, this.trySeq, this.catchSeq, this.finallySeq)
            }
        }, "conversion", {
            asJS: function(depth) {
                var baseIndent = this.indent(depth - 1),
                    indent = this.indent(depth),
                    str = "try {\n" + indent + this.trySeq.asJS(depth) + "\n" + baseIndent + "}";
                return this.isUndefined(this.catchSeq) || (str += " catch(" + this.err.name + ") {\n" + indent + this.catchSeq.asJS(depth) + "\n" + baseIndent + "}"), this.isUndefined(this.finallySeq) || (str += " finally {\n" + indent + this.finallySeq.asJS(depth) + "\n" + baseIndent + "}"), str
            }
        }, "visiting", {
            accept: function(visitor) {
                return visitor.visitTryCatchFinally(this)
            }
        }), users.timfelgentreff.jsinterpreter.Node.subclass("users.timfelgentreff.jsinterpreter.Function", "testing", {
            isFunction: !0
        }, "initializing", {
            initialize: function($super, pos, body, args) {
                this.pos = pos, this.body = body, this.args = args, args.forEach(function(node) {
                    node.setParent(this)
                }, this), body.setParent(this)
            }
        }, "debugging", {
            printConstruction: function() {
                return this.printConstructorCall(this.pos, this.body, this.args.collect(function(ea) {
                    return '"' + ea.name + '"'
                }))
            },
            toString: function() {
                return Strings.format("%s(function %s(%s) %s)", this.constructor.name, this.name(), this.argNames().join(","), this.body)
            }
        }, "conversion", {
            asJS: function(depth) {
                return Strings.format("function%s(%s) {\n%s\n}", this.name() ? " " + this.name() : "", this.argNames().join(","), this.indent(depth + 1) + this.body.asJS(depth + 1))
            }
        }, "accessing", {
            name: function() {
                return this._parent && this._parent.isVarDeclaration ? this._parent.name : void 0
            },
            parentFunction: function() {
                return this
            },
            argNames: function() {
                return this.args.collect(function(a) {
                    return a.name
                })
            },
            statements: function() {
                return this.body.children
            }
        }, "stepping", {
            firstStatement: function() {
                return this.body.firstStatement()
            },
            nextStatement: function() {
                return null
            },
            isComposite: function() {
                return !0
            }
        }, "evaluation", {
            eval: function() {
                return new Function(this.argNames().join(","), this.body.asJS())
            }
        }, "visiting", {
            accept: function(visitor) {
                return visitor.visitFunction(this)
            }
        }), users.timfelgentreff.jsinterpreter.Node.subclass("users.timfelgentreff.jsinterpreter.ObjectLiteral", "testing", {
            isObjectLiteral: !0
        }, "initializing", {
            initialize: function($super, pos, properties) {
                this.pos = pos, this.properties = properties, properties.forEach(function(node) {
                    node.setParent(this)
                }, this)
            }
        }, "debugging", {
            printConstruction: function() {
                return this.printConstructorCall(this.pos, this.properties)
            },
            toString: function() {
                return Strings.format("%s({%s})", this.constructor.name, this.properties.join(","))
            }
        }, "conversion", {
            asJS: function() {
                return "{" + this.properties.invoke("asJS").join(",") + "}"
            }
        }, "visiting", {
            accept: function(visitor) {
                return visitor.visitObjectLiteral(this)
            }
        }), users.timfelgentreff.jsinterpreter.Node.subclass("users.timfelgentreff.jsinterpreter.ObjProperty", "testing", {
            isObjProperty: !0
        }, "initializing", {
            initialize: function($super, pos, name, property) {
                this.pos = pos, this.name = name, this.property = property, property.setParent(this)
            }
        }, "debugging", {
            printConstruction: function() {
                return this.printConstructorCall(this.pos, '"' + this.name + '"', this.property)
            },
            toString: function() {
                return Strings.format("%s(%s: %s)", this.constructor.name, this.name, this.property)
            }
        }, "conversion", {
            asJS: function(depth) {
                return Strings.format('"%s": %s', this.name, this.property.asJS(depth))
            }
        }, "visiting", {
            accept: function(visitor) {
                return visitor.visitObjProperty(this)
            }
        }), users.timfelgentreff.jsinterpreter.Node.subclass("users.timfelgentreff.jsinterpreter.ObjPropertyGet", "testing", {
            isObjPropertyGet: !0
        }, "initializing", {
            initialize: function($super, pos, name, body) {
                this.pos = pos, this.name = name, this.body = body, body.setParent(this)
            }
        }, "debugging", {
            printConstruction: function() {
                return this.printConstructorCall(this.pos, '"' + this.name + '"', this.body)
            },
            toString: function() {
                return Strings.format("%s(%s() { %s })", this.constructor.name, this.name, this.body)
            }
        }, "conversion", {
            asJS: function(depth) {
                return Strings.format('get "%s"() { %s }', this.name, this.body.asJS(depth))
            }
        }, "visiting", {
            accept: function(visitor) {
                return visitor.visitObjPropertyGet(this)
            }
        }), users.timfelgentreff.jsinterpreter.Node.subclass("users.timfelgentreff.jsinterpreter.ObjPropertySet", "testing", {
            isObjPropertySet: !0
        }, "initializing", {
            initialize: function($super, pos, name, body, arg) {
                this.pos = pos, this.name = name, this.body = body, this.arg = arg, body.setParent(this)
            }
        }, "debugging", {
            printConstruction: function() {
                return this.printConstructorCall(this.pos, '"' + this.name + '"', this.body, this.arg)
            },
            toString: function() {
                return Strings.format("%s(%s(%s) { %s })", this.constructor.name, this.name, this.arg, this.body)
            }
        }, "conversion", {
            asJS: function(depth) {
                return Strings.format('set "%s"(%s) { %s }', this.name, this.arg, this.body.asJS(depth))
            }
        }, "visiting", {
            accept: function(visitor) {
                return visitor.visitObjPropertySet(this)
            }
        }), users.timfelgentreff.jsinterpreter.Node.subclass("users.timfelgentreff.jsinterpreter.Switch", "testing", {
            isSwitch: !0
        }, "initializing", {
            initialize: function($super, pos, expr, cases) {
                this.pos = pos, this.expr = expr, this.cases = cases, cases.forEach(function(node) {
                    node.setParent(this)
                }, this), expr.setParent(this)
            }
        }, "debugging", {
            printConstruction: function() {
                return this.printConstructorCall(this.pos, this.expr, this.cases)
            },
            toString: function() {
                return Strings.format("%s(%s %s)", this.constructor.name, this.expr, this.cases.join("\n"))
            }
        }, "conversion", {
            asJS: function(depth) {
                return Strings.format("switch (%s) {%s}", this.expr.asJS(depth), this.cases.invoke("asJS").join("\n"))
            }
        }, "visiting", {
            accept: function(visitor) {
                return visitor.visitSwitch(this)
            }
        }), users.timfelgentreff.jsinterpreter.Node.subclass("users.timfelgentreff.jsinterpreter.Case", "testing", {
            isCase: !0
        }, "initializing", {
            initialize: function($super, pos, condExpr, thenExpr) {
                this.pos = pos, this.condExpr = condExpr, this.thenExpr = thenExpr, condExpr.setParent(this), thenExpr.setParent(this)
            }
        }, "debugging", {
            printConstruction: function() {
                return this.printConstructorCall(this.pos, this.condExpr, this.thenExpr)
            },
            toString: function() {
                return Strings.format("%s(%s: %s)", this.constructor.name, this.condExpr, this.thenExpr)
            }
        }, "conversion", {
            asJS: function(depth) {
                return "case " + this.condExpr.asJS(depth) + ": " + this.thenExpr.asJS(depth)
            }
        }, "visiting", {
            accept: function(visitor) {
                return visitor.visitCase(this)
            }
        }), users.timfelgentreff.jsinterpreter.Node.subclass("users.timfelgentreff.jsinterpreter.Default", "testing", {
            isDefault: !0
        }, "initializing", {
            initialize: function($super, pos, defaultExpr) {
                this.pos = pos, this.defaultExpr = defaultExpr, defaultExpr.setParent(this)
            }
        }, "debugging", {
            printConstruction: function() {
                return this.printConstructorCall(this.pos, this.defaultExpr)
            },
            toString: function() {
                return Strings.format("%s(default: %s)", this.constructor.name, this.defaultExpr)
            }
        }, "conversion", {
            asJS: function(depth) {
                return "default: " + this.defaultExpr.asJS(depth)
            }
        }, "visiting", {
            accept: function(visitor) {
                return visitor.visitDefault(this)
            }
        }), users.timfelgentreff.jsinterpreter.Node.subclass("users.timfelgentreff.jsinterpreter.Regex", "testing", {
            isRegex: !0
        }, "initializing", {
            initialize: function($super, pos, exprString, flags) {
                this.pos = pos, this.exprString = exprString, this.flags = flags
            }
        }, "debugging", {
            printConstruction: function() {
                return this.printConstructorCall(this.pos, this.exprString, this.flags)
            },
            toString: function() {
                return Strings.format("(/%s/%s)", this.exprString, this.flags)
            }
        }, "conversion", {
            asJS: function() {
                return "/" + this.exprString + "/" + this.flags
            }
        }, "visiting", {
            accept: function(visitor) {
                return visitor.visitRegex(this)
            }
        }), users.timfelgentreff.jsinterpreter.Node.subclass("users.timfelgentreff.jsinterpreter.Label", "testing", {
            isLabel: !0
        }, "initializing", {
            initialize: function($super, pos, name) {
                this.pos = pos, this.name = name
            }
        }, "debugging", {
            printConstruction: function() {
                return this.printConstructorCall(this.pos, '"' + this.name + '"')
            },
            toString: function() {
                return Strings.format("%s(%s)", this.constructor.name, this.name)
            }
        }, "conversion", {
            asJS: function() {
                return this.name
            }
        }, "visiting", {
            accept: function(visitor) {
                return visitor.visitLabel(this)
            }
        }), users.timfelgentreff.jsinterpreter.Node.subclass("users.timfelgentreff.jsinterpreter.LabelDeclaration", "testing", {
            isLabelDeclaration: !0
        }, "initializing", {
            initialize: function($super, pos, name, expr) {
                this.pos = pos, this.name = name, this.expr = expr, expr.setParent(this)
            }
        }, "debugging", {
            printConstruction: function() {
                return this.printConstructorCall(this.pos, '"' + this.name + '"', this.expr)
            },
            toString: function() {
                return Strings.format("%s(%s is %s)", this.constructor.name, this.name, this.expr)
            }
        }, "conversion", {
            asJS: function(depth) {
                return this.name + ": " + this.expr.asJS(depth)
            }
        }, "visiting", {
            accept: function(visitor) {
                return visitor.visitLabelDeclaration(this)
            }
        }), Object.subclass("users.timfelgentreff.jsinterpreter.Visitor", "visiting", {
            visit: function(node) {
                return node.accept(this)
            },
            visitSequence: function() {},
            visitNumber: function() {},
            visitString: function() {},
            visitCond: function() {},
            visitIf: function() {},
            visitWhile: function() {},
            visitDoWhile: function() {},
            visitFor: function() {},
            visitForIn: function() {},
            visitSet: function() {},
            visitModifyingSet: function() {},
            visitBinaryOp: function() {},
            visitUnaryOp: function() {},
            visitPreOp: function() {},
            visitPostOp: function() {},
            visitThis: function() {},
            visitVariable: function() {},
            visitGetSlot: function() {},
            visitBreak: function() {},
            visitDebugger: function() {},
            visitContinue: function() {},
            visitArrayLiteral: function() {},
            visitReturn: function() {},
            visitWith: function() {},
            visitSend: function() {},
            visitCall: function() {},
            visitNew: function() {},
            visitVarDeclaration: function() {},
            visitThrow: function() {},
            visitTryCatchFinally: function() {},
            visitFunction: function() {},
            visitObjectLiteral: function() {},
            visitObjProperty: function() {},
            visitObjPropertyGet: function() {},
            visitObjPropertySet: function() {},
            visitSwitch: function() {},
            visitCase: function() {},
            visitDefault: function() {},
            visitRegex: function() {},
            visitLabel: function() {},
            visitLabelDeclaration: function() {}
        })
    }), module("users.timfelgentreff.jsinterpreter.generated.Translator").requires("ometa.lively").toRun(function() {
        JSTranslator = objectThatDelegatesTo(Parser, {
            trans: function() {
                var t, ans;
                return function() {
                    return this._form(function() {
                        return function() {
                            return t = this._apply("anything"), ans = this._applyWithArgs("apply", t)
                        }.call(this)
                    }), ans
                }.call(this)
            },
            begin: function() {
                var pos, children;
                return function() {
                    return pos = this._apply("anything"), children = this._many(function() {
                        return this._apply("trans")
                    }), this._apply("end"), new users.timfelgentreff.jsinterpreter.Sequence(pos, children)
                }.call(this)
            },
            number: function() {
                var pos, value;
                return function() {
                    return pos = this._apply("anything"), value = this._apply("anything"), new users.timfelgentreff.jsinterpreter.Number(pos, value)
                }.call(this)
            },
            string: function() {
                var pos, value;
                return function() {
                    return pos = this._apply("anything"), value = this._apply("anything"), new users.timfelgentreff.jsinterpreter.String(pos, value)
                }.call(this)
            },
            condExpr: function() {
                var pos, condExpr, trueExpr, falseExpr;
                return function() {
                    return pos = this._apply("anything"), condExpr = this._apply("trans"), trueExpr = this._apply("trans"), falseExpr = this._apply("trans"), new users.timfelgentreff.jsinterpreter.Cond(pos, condExpr, trueExpr, falseExpr)
                }.call(this)
            },
            "if": function() {
                var pos, condExpr, trueExpr, falseExpr;
                return function() {
                    return pos = this._apply("anything"), condExpr = this._apply("trans"), trueExpr = this._apply("trans"), falseExpr = this._apply("trans"), new users.timfelgentreff.jsinterpreter.If(pos, condExpr, trueExpr, falseExpr)
                }.call(this)
            },
            "while": function() {
                var pos, condExpr, body;
                return function() {
                    return pos = this._apply("anything"), condExpr = this._apply("trans"), body = this._apply("trans"), new users.timfelgentreff.jsinterpreter.While(pos, condExpr, body)
                }.call(this)
            },
            doWhile: function() {
                var pos, body, condExpr;
                return function() {
                    return pos = this._apply("anything"), body = this._apply("trans"), condExpr = this._apply("trans"), new users.timfelgentreff.jsinterpreter.DoWhile(pos, body, condExpr)
                }.call(this)
            },
            "for": function() {
                var pos, init, condExpr, body, upd;
                return function() {
                    return pos = this._apply("anything"), init = this._apply("trans"), condExpr = this._apply("trans"), body = this._apply("trans"), upd = this._apply("trans"), new users.timfelgentreff.jsinterpreter.For(pos, init, condExpr, body, upd)
                }.call(this)
            },
            forIn: function() {
                var pos, name, obj, body;
                return function() {
                    return pos = this._apply("anything"), name = this._apply("trans"), obj = this._apply("trans"), body = this._apply("trans"), new users.timfelgentreff.jsinterpreter.ForIn(pos, name, obj, body)
                }.call(this)
            },
            set: function() {
                var pos, left, right;
                return function() {
                    return pos = this._apply("anything"), left = this._apply("trans"), right = this._apply("trans"), new users.timfelgentreff.jsinterpreter.Set(pos, left, right)
                }.call(this)
            },
            mset: function() {
                var pos, left, name, right;
                return function() {
                    return pos = this._apply("anything"), left = this._apply("trans"), name = this._apply("anything"), right = this._apply("trans"), new users.timfelgentreff.jsinterpreter.ModifyingSet(pos, left, name, right)
                }.call(this)
            },
            binop: function() {
                var pos, name, left, right;
                return function() {
                    return pos = this._apply("anything"), name = this._apply("anything"), left = this._apply("trans"), right = this._apply("trans"), new users.timfelgentreff.jsinterpreter.BinaryOp(pos, name, left, right)
                }.call(this)
            },
            unop: function() {
                var pos, name, expr;
                return function() {
                    return pos = this._apply("anything"), name = this._apply("anything"), expr = this._apply("trans"), new users.timfelgentreff.jsinterpreter.UnaryOp(pos, name, expr)
                }.call(this)
            },
            preop: function() {
                var pos, name, expr;
                return function() {
                    return pos = this._apply("anything"), name = this._apply("anything"), expr = this._apply("trans"), new users.timfelgentreff.jsinterpreter.PreOp(pos, name, expr)
                }.call(this)
            },
            postop: function() {
                var pos, name, expr;
                return function() {
                    return pos = this._apply("anything"), name = this._apply("anything"), expr = this._apply("trans"), new users.timfelgentreff.jsinterpreter.PostOp(pos, name, expr)
                }.call(this)
            },
            "this": function() {
                var pos;
                return function() {
                    return pos = this._apply("anything"), new users.timfelgentreff.jsinterpreter.This(pos)
                }.call(this)
            },
            get: function() {
                var pos, name;
                return function() {
                    return pos = this._apply("anything"), name = this._apply("anything"), new users.timfelgentreff.jsinterpreter.Variable(pos, name)
                }.call(this)
            },
            getp: function() {
                var pos, slotName, obj;
                return function() {
                    return pos = this._apply("anything"), slotName = this._apply("trans"), obj = this._apply("trans"), new users.timfelgentreff.jsinterpreter.GetSlot(pos, slotName, obj)
                }.call(this)
            },
            "break": function() {
                var pos;
                return function() {
                    return pos = this._apply("anything"), new users.timfelgentreff.jsinterpreter.Break(pos)
                }.call(this)
            },
            "debugger": function() {
                var pos;
                return function() {
                    return pos = this._apply("anything"), new users.timfelgentreff.jsinterpreter.Debugger(pos)
                }.call(this)
            },
            "continue": function() {
                var pos;
                return function() {
                    return pos = this._apply("anything"), new users.timfelgentreff.jsinterpreter.Continue(pos)
                }.call(this)
            },
            arr: function() {
                var pos, elements;
                return function() {
                    return pos = this._apply("anything"), elements = this._many(function() {
                        return this._apply("trans")
                    }), new users.timfelgentreff.jsinterpreter.ArrayLiteral(pos, elements)
                }.call(this)
            },
            "return": function() {
                var pos, expr;
                return function() {
                    return pos = this._apply("anything"), expr = this._apply("trans"), new users.timfelgentreff.jsinterpreter.Return(pos, expr)
                }.call(this)
            },
            "with": function() {
                var pos, obj, body;
                return function() {
                    return pos = this._apply("anything"), obj = this._apply("trans"), body = this._apply("trans"), new users.timfelgentreff.jsinterpreter.With(pos, obj, body)
                }.call(this)
            },
            send: function() {
                var pos, property, recv, args;
                return function() {
                    return pos = this._apply("anything"), property = this._apply("trans"), recv = this._apply("trans"), args = this._many(function() {
                        return this._apply("trans")
                    }), new users.timfelgentreff.jsinterpreter.Send(pos, property, recv, args)
                }.call(this)
            },
            call: function() {
                var pos, fn, args;
                return function() {
                    return pos = this._apply("anything"), fn = this._apply("trans"), args = this._many(function() {
                        return this._apply("trans")
                    }), new users.timfelgentreff.jsinterpreter.Call(pos, fn, args)
                }.call(this)
            },
            "new": function() {
                var pos, clsExpr;
                return function() {
                    return pos = this._apply("anything"), clsExpr = this._apply("trans"), new users.timfelgentreff.jsinterpreter.New(pos, clsExpr)
                }.call(this)
            },
            "var": function() {
                var pos, name, val;
                return function() {
                    return pos = this._apply("anything"), name = this._apply("anything"), val = this._apply("trans"), new users.timfelgentreff.jsinterpreter.VarDeclaration(pos, name, val)
                }.call(this)
            },
            "throw": function() {
                var pos, expr;
                return function() {
                    return pos = this._apply("anything"), expr = this._apply("trans"), new users.timfelgentreff.jsinterpreter.Throw(pos, expr)
                }.call(this)
            },
            "try": function() {
                var pos, trySeq, err, catchSeq, finallySeq;
                return function() {
                    return pos = this._apply("anything"), trySeq = this._apply("trans"), err = this._apply("trans"), catchSeq = this._apply("trans"), finallySeq = this._apply("trans"), new users.timfelgentreff.jsinterpreter.TryCatchFinally(pos, trySeq, err, catchSeq, finallySeq)
                }.call(this)
            },
            func: function() {
                var pos, body, args;
                return function() {
                    return pos = this._apply("anything"), body = this._apply("trans"), args = this._many(function() {
                        return this._apply("trans")
                    }), new users.timfelgentreff.jsinterpreter.Function(pos, body, args)
                }.call(this)
            },
            json: function() {
                var pos, properties;
                return function() {
                    return pos = this._apply("anything"), properties = this._many(function() {
                        return this._apply("trans")
                    }), new users.timfelgentreff.jsinterpreter.ObjectLiteral(pos, properties)
                }.call(this)
            },
            binding: function() {
                var pos, name, property;
                return function() {
                    return pos = this._apply("anything"), name = this._apply("anything"), property = this._apply("trans"), new users.timfelgentreff.jsinterpreter.ObjProperty(pos, name, property)
                }.call(this)
            },
            jsonGetter: function() {
                var pos, name, body;
                return function() {
                    return pos = this._apply("anything"), name = this._apply("anything"), body = this._apply("trans"), new users.timfelgentreff.jsinterpreter.ObjPropertyGet(pos, name, body)
                }.call(this)
            },
            jsonSetter: function() {
                var pos, name, body, arg;
                return function() {
                    return pos = this._apply("anything"), name = this._apply("anything"), body = this._apply("trans"), arg = this._apply("anything"), new users.timfelgentreff.jsinterpreter.ObjPropertySet(pos, name, body, arg)
                }.call(this)
            },
            "switch": function() {
                var pos, expr, cases;
                return function() {
                    return pos = this._apply("anything"), expr = this._apply("trans"), cases = this._many(function() {
                        return this._apply("trans")
                    }), new users.timfelgentreff.jsinterpreter.Switch(pos, expr, cases)
                }.call(this)
            },
            "case": function() {
                var pos, condExpr, thenExpr;
                return function() {
                    return pos = this._apply("anything"), condExpr = this._apply("trans"), thenExpr = this._apply("trans"), new users.timfelgentreff.jsinterpreter.Case(pos, condExpr, thenExpr)
                }.call(this)
            },
            "default": function() {
                var pos, defaultExpr;
                return function() {
                    return pos = this._apply("anything"), defaultExpr = this._apply("trans"), new users.timfelgentreff.jsinterpreter.Default(pos, defaultExpr)
                }.call(this)
            },
            regex: function() {
                var pos, exprString, flags;
                return function() {
                    return pos = this._apply("anything"), exprString = this._apply("anything"), flags = this._apply("anything"), new users.timfelgentreff.jsinterpreter.Regex(pos, exprString, flags)
                }.call(this)
            }
        })
    }), module("users.timfelgentreff.jsinterpreter.LivelyJSParser").requires("ometa.lively").toRun(function() {
        LivelyJSParser = objectThatDelegatesTo(Parser, {
            whereAreYou: function() {
                return function() {
                    var charsBefore = 120,
                        charsAfter = 120,
                        src = this._originalInput.arr,
                        startIndex = Math.max(0, this.pos() - charsBefore),
                        stopIndex = Math.min(src.length, this.pos() + charsAfter),
                        msg = src.substring(startIndex, this.pos()) + "<--I am here-->" + src.substring(this.pos(), stopIndex);
                    return msg += "\nRules: " + this._ruleStack, msg += "\nStack: " + this.stack, alert(msg), !0
                }.call(this)
            },
            fromTo: function() {
                var x, y;
                return function() {
                    return x = this._apply("anything"), y = this._apply("anything"), this._applyWithArgs("seq", x), this._many(function() {
                        return function() {
                            return this._not(function() {
                                return this._applyWithArgs("seq", y)
                            }), this._apply("char")
                        }.call(this)
                    }), this._applyWithArgs("seq", y)
                }.call(this)
            },
            fromToWithout: function() {
                var x, y;
                return function() {
                    return x = this._apply("anything"), y = this._apply("anything"), this._applyWithArgs("seq", x), this._many(function() {
                        return function() {
                            return this._not(function() {
                                return this._applyWithArgs("seq", y)
                            }), this._apply("char")
                        }.call(this)
                    })
                }.call(this)
            },
            space: function() {
                return this._or(function() {
                    return Parser._superApplyWithArgs(this, "space")
                }, function() {
                    return this._applyWithArgs("fromToWithout", "//", "\n")
                }, function() {
                    return this._applyWithArgs("fromTo", "//", "end")
                }, function() {
                    return this._applyWithArgs("fromTo", "/*", "*/")
                })
            },
            nameFirst: function() {
                return this._or(function() {
                    return this._apply("letter")
                }, function() {
                    return function() {
                        switch (this._apply("anything")) {
                            case "$":
                                return "$";
                            case "_":
                                return "_";
                            default:
                                throw fail
                        }
                    }.call(this)
                })
            },
            nameRest: function() {
                return this._or(function() {
                    return this._apply("nameFirst")
                }, function() {
                    return this._apply("digit")
                })
            },
            iName: function() {
                var r;
                return function() {
                    return r = this._applyWithArgs("firstAndRest", "nameFirst", "nameRest"), r.join("")
                }.call(this)
            },
            isKeyword: function() {
                var x;
                return function() {
                    return x = this._apply("anything"), this._pred(LivelyJSParser._isKeyword(x))
                }.call(this)
            },
            name: function() {
                var p1, n, p2;
                return function() {
                    return p1 = this._apply("pos"), n = this._apply("iName"), this._not(function() {
                        return this._applyWithArgs("isKeyword", n)
                    }), p2 = this._apply("pos"), ["name", [p1, p2], n]
                }.call(this)
            },
            keyword: function() {
                var p1, k, p2;
                return function() {
                    return p1 = this._apply("pos"), k = this._apply("iName"), this._applyWithArgs("isKeyword", k), p2 = this._apply("pos"), [k, [p1, p2], k]
                }.call(this)
            },
            hexDigit: function() {
                var x, v;
                return function() {
                    return x = this._apply("char"), v = this.hexDigits.indexOf(x.toLowerCase()), this._pred(v >= 0), v
                }.call(this)
            },
            hexLit: function() {
                var n, d;
                return this._or(function() {
                    return function() {
                        return n = this._apply("hexLit"), d = this._apply("hexDigit"), 16 * n + d
                    }.call(this)
                }, function() {
                    return this._apply("hexDigit")
                })
            },
            number: function() {
                var p1, n, p2, fs, p2, ws, fs, sig, exp, p2;
                return function() {
                    return p1 = this._apply("pos"), this._or(function() {
                        return function() {
                            switch (this._apply("anything")) {
                                case "0":
                                    return function() {
                                        return this._applyWithArgs("exactly", "x"), n = this._apply("hexLit"), p2 = this._apply("pos"), ["number", [p1, p2], n]
                                    }.call(this);
                                case ".":
                                    return function() {
                                        return fs = this._many1(function() {
                                            return this._apply("digit")
                                        }), p2 = this._apply("pos"), ["number", [p1, p2], parseFloat("." + fs.join(""))]
                                    }.call(this);
                                default:
                                    throw fail
                            }
                        }.call(this)
                    }, function() {
                        return function() {
                            return ws = this._many1(function() {
                                return this._apply("digit")
                            }), fs = this._or(function() {
                                return function() {
                                    switch (this._apply("anything")) {
                                        case ".":
                                            return this._many1(function() {
                                                return this._apply("digit")
                                            });
                                        default:
                                            throw fail
                                    }
                                }.call(this)
                            }, function() {
                                return function() {
                                    return this._apply("empty"), []
                                }.call(this)
                            }), exp = this._or(function() {
                                return function() {
                                    switch (this._apply("anything")) {
                                        case "e":
                                            return function() {
                                                return sig = this._or(function() {
                                                    return function() {
                                                        switch (this._apply("anything")) {
                                                            case "+":
                                                                return "+";
                                                            case "-":
                                                                return "-";
                                                            default:
                                                                throw fail
                                                        }
                                                    }.call(this)
                                                }, function() {
                                                    return function() {
                                                        return this._apply("empty"), ""
                                                    }.call(this)
                                                }), this._many1(function() {
                                                    return this._apply("digit")
                                                })
                                            }.call(this);
                                        default:
                                            throw fail
                                    }
                                }.call(this)
                            }, function() {
                                return function() {
                                    return this._apply("empty"), []
                                }.call(this)
                            }), p2 = this._apply("pos"), ["number", [p1, p2], parseFloat(ws.join("") + "." + fs.join("") + "e" + sig + exp.join(""))]
                        }.call(this)
                    })
                }.call(this)
            },
            escapeChar: function() {
                var c;
                return function() {
                    return this._applyWithArgs("exactly", "\\"), c = this._apply("char"), ometaUnescape("\\" + c)
                }.call(this)
            },
            str: function() {
                var p1, cs, p2, cs, p2, cs, p2, n, p2;
                return function() {
                    return p1 = this._apply("pos"), this._or(function() {
                        return function() {
                            switch (this._apply("anything")) {
                                case '"':
                                    return this._or(function() {
                                        return function() {
                                            switch (this._apply("anything")) {
                                                case '"':
                                                    return function() {
                                                        return this._applyWithArgs("exactly", '"'), cs = this._many(function() {
                                                            return this._or(function() {
                                                                return this._apply("escapeChar")
                                                            }, function() {
                                                                return function() {
                                                                    return this._not(function() {
                                                                        return function() {
                                                                            return this._applyWithArgs("exactly", '"'), this._applyWithArgs("exactly", '"'), this._applyWithArgs("exactly", '"'), '"""'
                                                                        }.call(this)
                                                                    }), this._apply("char")
                                                                }.call(this)
                                                            })
                                                        }), this._applyWithArgs("exactly", '"'), this._applyWithArgs("exactly", '"'), this._applyWithArgs("exactly", '"'), p2 = this._apply("pos"), ["string", [p1, p2], cs.join("")]
                                                    }.call(this);
                                                default:
                                                    throw fail
                                            }
                                        }.call(this)
                                    }, function() {
                                        return function() {
                                            return cs = this._many(function() {
                                                return this._or(function() {
                                                    return this._apply("escapeChar")
                                                }, function() {
                                                    return function() {
                                                        return this._not(function() {
                                                            return this._applyWithArgs("exactly", '"')
                                                        }), this._apply("char")
                                                    }.call(this)
                                                })
                                            }), this._applyWithArgs("exactly", '"'), p2 = this._apply("pos"), ["string", [p1, p2], cs.join("")]
                                        }.call(this)
                                    });
                                case "'":
                                    return function() {
                                        return cs = this._many(function() {
                                            return this._or(function() {
                                                return this._apply("escapeChar")
                                            }, function() {
                                                return function() {
                                                    return this._not(function() {
                                                        return this._applyWithArgs("exactly", "'")
                                                    }), this._apply("char")
                                                }.call(this)
                                            })
                                        }), this._applyWithArgs("exactly", "'"), p2 = this._apply("pos"), ["string", [p1, p2], cs.join("")]
                                    }.call(this);
                                default:
                                    throw fail
                            }
                        }.call(this)
                    }, function() {
                        return function() {
                            return function() {
                                switch (this._apply("anything")) {
                                    case "#":
                                        return "#";
                                    case "`":
                                        return "`";
                                    default:
                                        throw fail
                                }
                            }.call(this), n = this._apply("iName"), p2 = this._apply("pos"), ["string", [p1, p2], n]
                        }.call(this)
                    })
                }.call(this)
            },
            special: function() {
                var p1, s, p2;
                return function() {
                    return p1 = this._apply("pos"), s = function() {
                        switch (this._apply("anything")) {
                            case "(":
                                return "(";
                            case ")":
                                return ")";
                            case "{":
                                return "{";
                            case "}":
                                return "}";
                            case "[":
                                return "[";
                            case "]":
                                return "]";
                            case ",":
                                return ",";
                            case ";":
                                return ";";
                            case "?":
                                return "?";
                            case ":":
                                return ":";
                            case "!":
                                return this._or(function() {
                                    return function() {
                                        switch (this._apply("anything")) {
                                            case "=":
                                                return this._or(function() {
                                                    return function() {
                                                        switch (this._apply("anything")) {
                                                            case "=":
                                                                return "!==";
                                                            default:
                                                                throw fail
                                                        }
                                                    }.call(this)
                                                }, function() {
                                                    return "!="
                                                });
                                            default:
                                                throw fail
                                        }
                                    }.call(this)
                                }, function() {
                                    return "!"
                                });
                            case "=":
                                return this._or(function() {
                                    return function() {
                                        switch (this._apply("anything")) {
                                            case "=":
                                                return this._or(function() {
                                                    return function() {
                                                        switch (this._apply("anything")) {
                                                            case "=":
                                                                return "===";
                                                            default:
                                                                throw fail
                                                        }
                                                    }.call(this)
                                                }, function() {
                                                    return "=="
                                                });
                                            default:
                                                throw fail
                                        }
                                    }.call(this)
                                }, function() {
                                    return "="
                                });
                            case ">":
                                return this._or(function() {
                                    return function() {
                                        switch (this._apply("anything")) {
                                            case ">":
                                                return this._or(function() {
                                                    return function() {
                                                        switch (this._apply("anything")) {
                                                            case ">":
                                                                return ">>>";
                                                            case "=":
                                                                return ">>=";
                                                            default:
                                                                throw fail
                                                        }
                                                    }.call(this)
                                                }, function() {
                                                    return ">>"
                                                });
                                            case "=":
                                                return ">=";
                                            default:
                                                throw fail
                                        }
                                    }.call(this)
                                }, function() {
                                    return ">"
                                });
                            case "<":
                                return this._or(function() {
                                    return function() {
                                        switch (this._apply("anything")) {
                                            case "<":
                                                return this._or(function() {
                                                    return function() {
                                                        switch (this._apply("anything")) {
                                                            case "=":
                                                                return "<<=";
                                                            default:
                                                                throw fail
                                                        }
                                                    }.call(this)
                                                }, function() {
                                                    return "<<"
                                                });
                                            case "=":
                                                return "<=";
                                            default:
                                                throw fail
                                        }
                                    }.call(this)
                                }, function() {
                                    return "<"
                                });
                            case "+":
                                return this._or(function() {
                                    return function() {
                                        switch (this._apply("anything")) {
                                            case "+":
                                                return "++";
                                            case "=":
                                                return "+=";
                                            default:
                                                throw fail
                                        }
                                    }.call(this)
                                }, function() {
                                    return "+"
                                });
                            case "-":
                                return this._or(function() {
                                    return function() {
                                        switch (this._apply("anything")) {
                                            case "-":
                                                return "--";
                                            case "=":
                                                return "-=";
                                            default:
                                                throw fail
                                        }
                                    }.call(this)
                                }, function() {
                                    return "-"
                                });
                            case "*":
                                return this._or(function() {
                                    return function() {
                                        switch (this._apply("anything")) {
                                            case "=":
                                                return "*=";
                                            default:
                                                throw fail
                                        }
                                    }.call(this)
                                }, function() {
                                    return "*"
                                });
                            case "~":
                                return "~";
                            case "/":
                                return this._or(function() {
                                    return function() {
                                        switch (this._apply("anything")) {
                                            case "=":
                                                return "/=";
                                            default:
                                                throw fail
                                        }
                                    }.call(this)
                                }, function() {
                                    return "/"
                                });
                            case "%":
                                return this._or(function() {
                                    return function() {
                                        switch (this._apply("anything")) {
                                            case "=":
                                                return "%=";
                                            default:
                                                throw fail
                                        }
                                    }.call(this)
                                }, function() {
                                    return "%"
                                });
                            case "&":
                                return this._or(function() {
                                    return function() {
                                        switch (this._apply("anything")) {
                                            case "&":
                                                return this._or(function() {
                                                    return function() {
                                                        switch (this._apply("anything")) {
                                                            case "=":
                                                                return "&&=";
                                                            default:
                                                                throw fail
                                                        }
                                                    }.call(this)
                                                }, function() {
                                                    return "&&"
                                                });
                                            default:
                                                throw fail
                                        }
                                    }.call(this)
                                }, function() {
                                    return "&"
                                });
                            case "|":
                                return this._or(function() {
                                    return function() {
                                        switch (this._apply("anything")) {
                                            case "|":
                                                return this._or(function() {
                                                    return function() {
                                                        switch (this._apply("anything")) {
                                                            case "=":
                                                                return "||=";
                                                            default:
                                                                throw fail
                                                        }
                                                    }.call(this)
                                                }, function() {
                                                    return "||"
                                                });
                                            default:
                                                throw fail
                                        }
                                    }.call(this)
                                }, function() {
                                    return "|"
                                });
                            case ".":
                                return ".";
                            case "^":
                                return "^";
                            default:
                                throw fail
                        }
                    }.call(this), p2 = this._apply("pos"), [s, [p1, p2], s]
                }.call(this)
            },
            tok: function() {
                return function() {
                    return this._apply("spaces"), this._or(function() {
                        return this._apply("name")
                    }, function() {
                        return this._apply("keyword")
                    }, function() {
                        return this._apply("number")
                    }, function() {
                        return this._apply("str")
                    }, function() {
                        return this._apply("special")
                    })
                }.call(this)
            },
            toks: function() {
                var ts;
                return function() {
                    return ts = this._many(function() {
                        return this._apply("token")
                    }), this._apply("spaces"), this._apply("end"), ts
                }.call(this)
            },
            token: function() {
                var tt, t;
                return function() {
                    return tt = this._apply("anything"), t = this._apply("tok"), this._pred(t[0] == tt), t[2]
                }.call(this)
            },
            spacesNoNl: function() {
                return this._many(function() {
                    return function() {
                        return this._not(function() {
                            return this._applyWithArgs("exactly", "\n")
                        }), this._apply("space")
                    }.call(this)
                })
            },
            expr: function() {
                var p1, f, s, p2;
                return this._or(function() {
                    return function() {
                        return p1 = this._apply("pos"), f = this._apply("exprPart"), this._applyWithArgs("token", ","), s = this._apply("expr"), p2 = this._apply("pos"), ["begin", [p1, p2], f, s]
                    }.call(this)
                }, function() {
                    return this._apply("exprPart")
                })
            },
            exprPart: function() {
                var p1, e, t, f, p2, rhs, p2, rhs, p2, rhs, p2, rhs, p2, rhs, p2, rhs, p2, rhs, p2, rhs, p2, rhs, p2, rhs, p2, rhs, p2, rhs, p2, rhs, p2, rhs, p2;
                return function() {
                    return p1 = this._apply("pos"), e = this._apply("ternaryExpr"), this._or(function() {
                        return function() {
                            return this._applyWithArgs("token", "?"), t = this._apply("exprPart"), this._applyWithArgs("token", ":"), f = this._apply("exprPart"), p2 = this._apply("pos"), ["condExpr", [p1, p2], e, t, f]
                        }.call(this)
                    }, function() {
                        return function() {
                            return this._applyWithArgs("token", "="), rhs = this._apply("exprPart"), p2 = this._apply("pos"), ["set", [p1, p2], e, rhs]
                        }.call(this)
                    }, function() {
                        return function() {
                            return this._applyWithArgs("token", "+="), rhs = this._apply("exprPart"), p2 = this._apply("pos"), ["mset", [p1, p2], e, "+", rhs]
                        }.call(this)
                    }, function() {
                        return function() {
                            return this._applyWithArgs("token", "-="), rhs = this._apply("exprPart"), p2 = this._apply("pos"), ["mset", [p1, p2], e, "-", rhs]
                        }.call(this)
                    }, function() {
                        return function() {
                            return this._applyWithArgs("token", "*="), rhs = this._apply("exprPart"), p2 = this._apply("pos"), ["mset", [p1, p2], e, "*", rhs]
                        }.call(this)
                    }, function() {
                        return function() {
                            return this._applyWithArgs("token", "/="), rhs = this._apply("exprPart"), p2 = this._apply("pos"), ["mset", [p1, p2], e, "/", rhs]
                        }.call(this)
                    }, function() {
                        return function() {
                            return this._applyWithArgs("token", "%="), rhs = this._apply("exprPart"), p2 = this._apply("pos"), ["mset", [p1, p2], e, "%", rhs]
                        }.call(this)
                    }, function() {
                        return function() {
                            return this._applyWithArgs("token", "&="), rhs = this._apply("exprPart"), p2 = this._apply("pos"), ["mset", [p1, p2], e, "&", rhs]
                        }.call(this)
                    }, function() {
                        return function() {
                            return this._applyWithArgs("token", "&&="), rhs = this._apply("exprPart"), p2 = this._apply("pos"), ["mset", [p1, p2], e, "&&", rhs]
                        }.call(this)
                    }, function() {
                        return function() {
                            return this._applyWithArgs("token", "|="), rhs = this._apply("exprPart"), p2 = this._apply("pos"), ["mset", [p1, p2], e, "|", rhs]
                        }.call(this)
                    }, function() {
                        return function() {
                            return this._applyWithArgs("token", "||="), rhs = this._apply("exprPart"), p2 = this._apply("pos"), ["mset", [p1, p2], e, "||", rhs]
                        }.call(this)
                    }, function() {
                        return function() {
                            return this._applyWithArgs("token", "^="), rhs = this._apply("exprPart"), p2 = this._apply("pos"), ["mset", [p1, p2], e, "^", rhs]
                        }.call(this)
                    }, function() {
                        return function() {
                            return this._applyWithArgs("token", ">>="), rhs = this._apply("exprPart"), p2 = this._apply("pos"), ["mset", [p1, p2], e, ">>", rhs]
                        }.call(this)
                    }, function() {
                        return function() {
                            return this._applyWithArgs("token", "<<="), rhs = this._apply("exprPart"), p2 = this._apply("pos"), ["mset", [p1, p2], e, "<<", rhs]
                        }.call(this)
                    }, function() {
                        return function() {
                            return this._applyWithArgs("token", ">>>="), rhs = this._apply("exprPart"), p2 = this._apply("pos"), ["mset", [p1, p2], e, ">>>", rhs]
                        }.call(this)
                    }, function() {
                        return function() {
                            return this._apply("empty"), e
                        }.call(this)
                    })
                }.call(this)
            },
            ternaryExpr: function() {
                var p1, e, t, f, p2;
                return function() {
                    return p1 = this._apply("pos"), e = this._apply("orExpr"), this._or(function() {
                        return function() {
                            return this._applyWithArgs("token", "?"), t = this._apply("orExpr"), this._applyWithArgs("token", ":"), f = this._apply("orExpr"), p2 = this._apply("pos"), ["condExpr", [p1, p2], e, t, f]
                        }.call(this)
                    }, function() {
                        return function() {
                            return this._apply("empty"), e
                        }.call(this)
                    })
                }.call(this)
            },
            orExpr: function() {
                var p1, x, y, p2;
                return this._or(function() {
                    return function() {
                        return p1 = this._apply("pos"), x = this._apply("orExpr"), this._applyWithArgs("token", "||"), y = this._apply("andExpr"), p2 = this._apply("pos"), ["binop", [p1, p2], "||", x, y]
                    }.call(this)
                }, function() {
                    return this._apply("andExpr")
                })
            },
            andExpr: function() {
                var p1, x, y, p2;
                return this._or(function() {
                    return function() {
                        return p1 = this._apply("pos"), x = this._apply("andExpr"), this._applyWithArgs("token", "&&"), y = this._apply("bitOrExpr"), p2 = this._apply("pos"), ["binop", [p1, p2], "&&", x, y]
                    }.call(this)
                }, function() {
                    return this._apply("bitOrExpr")
                })
            },
            bitOrExpr: function() {
                var p1, x, y, p2;
                return this._or(function() {
                    return function() {
                        return p1 = this._apply("pos"), x = this._apply("bitXorExpr"), this._applyWithArgs("token", "|"), y = this._apply("bitOrExpr"), p2 = this._apply("pos"), ["binop", [p1, p2], "|", x, y]
                    }.call(this)
                }, function() {
                    return this._apply("bitXorExpr")
                })
            },
            bitXorExpr: function() {
                var p1, x, y, p2;
                return this._or(function() {
                    return function() {
                        return p1 = this._apply("pos"), x = this._apply("bitAndExpr"), this._applyWithArgs("token", "^"), y = this._apply("bitXorExpr"), p2 = this._apply("pos"), ["binop", [p1, p2], "^", x, y]
                    }.call(this)
                }, function() {
                    return this._apply("bitAndExpr")
                })
            },
            bitAndExpr: function() {
                var p1, x, y, p2;
                return this._or(function() {
                    return function() {
                        return p1 = this._apply("pos"), x = this._apply("eqExpr"), this._applyWithArgs("token", "&"), y = this._apply("bitAndExpr"), p2 = this._apply("pos"), ["binop", [p1, p2], "&", x, y]
                    }.call(this)
                }, function() {
                    return this._apply("eqExpr")
                })
            },
            eqExpr: function() {
                var p1, x, op, y, p2;
                return this._or(function() {
                    return function() {
                        return p1 = this._apply("pos"), x = this._apply("eqExpr"), op = this._or(function() {
                            return this._applyWithArgs("token", "==")
                        }, function() {
                            return this._applyWithArgs("token", "!=")
                        }, function() {
                            return this._applyWithArgs("token", "===")
                        }, function() {
                            return this._applyWithArgs("token", "!==")
                        }), y = this._apply("relExpr"), p2 = this._apply("pos"), ["binop", [p1, p2], op, x, y]
                    }.call(this)
                }, function() {
                    return this._apply("relExpr")
                })
            },
            relExpr: function() {
                var p1, x, op, y, p2;
                return this._or(function() {
                    return function() {
                        return p1 = this._apply("pos"), x = this._apply("relExpr"), op = this._or(function() {
                            return this._applyWithArgs("token", ">")
                        }, function() {
                            return this._applyWithArgs("token", ">=")
                        }, function() {
                            return this._applyWithArgs("token", "<")
                        }, function() {
                            return this._applyWithArgs("token", "<=")
                        }, function() {
                            return this._applyWithArgs("token", "instanceof")
                        }, function() {
                            return this._applyWithArgs("token", "in")
                        }), y = this._apply("shiftExpr"), p2 = this._apply("pos"), ["binop", [p1, p2], op, x, y]
                    }.call(this)
                }, function() {
                    return this._apply("shiftExpr")
                })
            },
            shiftExpr: function() {
                var p1, x, op, y, p2;
                return this._or(function() {
                    return function() {
                        return p1 = this._apply("pos"), x = this._apply("shiftExpr"), op = this._or(function() {
                            return this._applyWithArgs("token", ">>")
                        }, function() {
                            return this._applyWithArgs("token", "<<")
                        }, function() {
                            return this._applyWithArgs("token", ">>>")
                        }), y = this._apply("addExpr"), p2 = this._apply("pos"), ["binop", [p1, p2], op, x, y]
                    }.call(this)
                }, function() {
                    return this._apply("addExpr")
                })
            },
            addExpr: function() {
                var p1, x, op, y, p2;
                return this._or(function() {
                    return function() {
                        return p1 = this._apply("pos"), x = this._apply("addExpr"), op = this._or(function() {
                            return this._applyWithArgs("token", "+")
                        }, function() {
                            return this._applyWithArgs("token", "-")
                        }), y = this._apply("mulExpr"), p2 = this._apply("pos"), ["binop", [p1, p2], op, x, y]
                    }.call(this)
                }, function() {
                    return this._apply("mulExpr")
                })
            },
            mulExpr: function() {
                var p1, x, op, y, p2;
                return this._or(function() {
                    return function() {
                        return p1 = this._apply("pos"), x = this._apply("mulExpr"), op = this._or(function() {
                            return this._applyWithArgs("token", "*")
                        }, function() {
                            return this._applyWithArgs("token", "/")
                        }, function() {
                            return this._applyWithArgs("token", "%")
                        }), y = this._apply("unary"), p2 = this._apply("pos"), ["binop", [p1, p2], op, x, y]
                    }.call(this)
                }, function() {
                    return this._apply("unary")
                })
            },
            unary: function() {
                var p1, p, p2, p, p2, p, p2, p, p2, p, p2, p, p2, p, p2, p, p2, p, p2;
                return this._or(function() {
                    return function() {
                        return p1 = this._apply("pos"), this._or(function() {
                            return function() {
                                return this._applyWithArgs("token", "-"), p = this._apply("postfix"), p2 = this._apply("pos"), ["unop", [p1, p2], "-", p]
                            }.call(this)
                        }, function() {
                            return function() {
                                return this._applyWithArgs("token", "+"), p = this._apply("postfix"), p2 = this._apply("pos"), ["unop", [p1, p2], "+", p]
                            }.call(this)
                        }, function() {
                            return function() {
                                return this._applyWithArgs("token", "++"), p = this._apply("postfix"), p2 = this._apply("pos"), ["preop", [p1, p2], "++", p]
                            }.call(this)
                        }, function() {
                            return function() {
                                return this._applyWithArgs("token", "--"), p = this._apply("postfix"), p2 = this._apply("pos"), ["preop", [p1, p2], "--", p]
                            }.call(this)
                        }, function() {
                            return function() {
                                return this._applyWithArgs("token", "!"), p = this._apply("unary"), p2 = this._apply("pos"), ["unop", [p1, p2], "!", p]
                            }.call(this)
                        }, function() {
                            return function() {
                                return this._applyWithArgs("token", "~"), p = this._apply("unary"), p2 = this._apply("pos"), ["unop", [p1, p2], "~", p]
                            }.call(this)
                        }, function() {
                            return function() {
                                return this._applyWithArgs("token", "void"), p = this._apply("unary"), p2 = this._apply("pos"), ["unop", [p1, p2], "void", p]
                            }.call(this)
                        }, function() {
                            return function() {
                                return this._applyWithArgs("token", "delete"), p = this._apply("unary"), p2 = this._apply("pos"), ["unop", [p1, p2], "delete", p]
                            }.call(this)
                        }, function() {
                            return function() {
                                return this._applyWithArgs("token", "typeof"), p = this._apply("unary"), p2 = this._apply("pos"), ["unop", [p1, p2], "typeof", p]
                            }.call(this)
                        })
                    }.call(this)
                }, function() {
                    return this._apply("postfix")
                })
            },
            postfix: function() {
                var p1, p, p2, p2;
                return function() {
                    return p1 = this._apply("pos"), p = this._apply("callExpr"), this._or(function() {
                        return function() {
                            return this._apply("spacesNoNl"), this._applyWithArgs("token", "++"), p2 = this._apply("pos"), ["postop", [p1, p2], "++", p]
                        }.call(this)
                    }, function() {
                        return function() {
                            return this._apply("spacesNoNl"), this._applyWithArgs("token", "--"), p2 = this._apply("pos"), ["postop", [p1, p2], "--", p]
                        }.call(this)
                    }, function() {
                        return function() {
                            return this._apply("empty"), p
                        }.call(this)
                    })
                }.call(this)
            },
            args: function() {
                var as;
                return function() {
                    return this._applyWithArgs("token", "("), as = this._applyWithArgs("listOf", "exprPart", ","), this._applyWithArgs("token", ")"), as
                }.call(this)
            },
            callExpr: function() {
                var p1, p, as, p2, p3, m, p4, as, p2, i, as, p2, i, p2, p3, f, p2;
                return this._or(function() {
                    return function() {
                        return p1 = this._apply("pos"), p = this._apply("callExpr"), this._or(function() {
                            return function() {
                                return as = this._apply("args"), p2 = this._apply("pos"), ["call", [p1, p2], p].concat(as)
                            }.call(this)
                        }, function() {
                            return function() {
                                return this._applyWithArgs("token", "."), p3 = this._apply("pos"), m = this._applyWithArgs("token", "name"), p4 = this._apply("pos"), as = this._apply("args"), p2 = this._apply("pos"), ["send", [p1, p2],
                                    ["string", [p3, p4], m], p
                                ].concat(as)
                            }.call(this)
                        }, function() {
                            return function() {
                                return this._applyWithArgs("token", "["), i = this._apply("expr"), this._applyWithArgs("token", "]"), as = this._apply("args"), p2 = this._apply("pos"), ["send", [p1, p2], i, p].concat(as)
                            }.call(this)
                        }, function() {
                            return function() {
                                return this._applyWithArgs("token", "["), i = this._apply("expr"), this._applyWithArgs("token", "]"), p2 = this._apply("pos"), ["getp", [p1, p2], i, p]
                            }.call(this)
                        }, function() {
                            return function() {
                                return this._applyWithArgs("token", "."), p3 = this._apply("pos"), f = this._applyWithArgs("token", "name"), p2 = this._apply("pos"), ["getp", [p1, p2],
                                    ["string", [p3, p2], f], p
                                ]
                            }.call(this)
                        })
                    }.call(this)
                }, function() {
                    return this._apply("primExpr")
                })
            },
            memberExpr: function() {
                var p1, p, i, p2, p3, f, p2;
                return this._or(function() {
                    return function() {
                        return p1 = this._apply("pos"), p = this._apply("memberExpr"), this._or(function() {
                            return function() {
                                return this._applyWithArgs("token", "["), i = this._apply("expr"), this._applyWithArgs("token", "]"), p2 = this._apply("pos"), ["getp", [p1, p2], i, p]
                            }.call(this)
                        }, function() {
                            return function() {
                                return this._applyWithArgs("token", "."), p3 = this._apply("pos"), f = this._applyWithArgs("token", "name"), p2 = this._apply("pos"), ["getp", [p1, p2],
                                    ["string", [p3, p2], f], p
                                ]
                            }.call(this)
                        })
                    }.call(this)
                }, function() {
                    return this._apply("primExpr")
                })
            },
            primExpr: function() {
                var e, p1, p2, p3, e, as, p2, n, p2, n, p2, s, p2, es, p2, e, f, p2;
                return this._or(function() {
                    return function() {
                        return this._applyWithArgs("token", "("), e = this._apply("expr"), this._applyWithArgs("token", ")"), e
                    }.call(this)
                }, function() {
                    return function() {
                        return this._apply("spaces"), p1 = this._apply("pos"), this._or(function() {
                            return function() {
                                return this._applyWithArgs("token", "this"), p2 = this._apply("pos"), ["this", [p1, p2]]
                            }.call(this)
                        }, function() {
                            return function() {
                                return this._applyWithArgs("token", "new"), p3 = this._apply("pos"), e = this._apply("memberExpr"), as = this._or(function() {
                                    return this._apply("args")
                                }, function() {
                                    return function() {
                                        return this._apply("empty"), []
                                    }.call(this)
                                }), p2 = this._apply("pos"), ["new", [p1, p2],
                                    ["call", [p3, p2], e].concat(as)
                                ]
                            }.call(this)
                        }, function() {
                            return function() {
                                return n = this._applyWithArgs("token", "name"), p2 = this._apply("pos"), ["get", [p1, p2], n]
                            }.call(this)
                        }, function() {
                            return function() {
                                return n = this._applyWithArgs("token", "number"), p2 = this._apply("pos"), ["number", [p1, p2], n]
                            }.call(this)
                        }, function() {
                            return function() {
                                return s = this._applyWithArgs("token", "string"), p2 = this._apply("pos"), ["string", [p1, p2], s]
                            }.call(this)
                        }, function() {
                            return function() {
                                return this._applyWithArgs("token", "function"), this._or(function() {
                                    return this._applyWithArgs("token", "name")
                                }, function() {
                                    return this._apply("empty")
                                }), this._apply("funcRest")
                            }.call(this)
                        }, function() {
                            return function() {
                                return this._applyWithArgs("token", "["), es = this._applyWithArgs("listOf", "exprPart", ","), this._or(function() {
                                    return this._applyWithArgs("token", ",")
                                }, function() {
                                    return this._apply("empty")
                                }), this._applyWithArgs("token", "]"), p2 = this._apply("pos"), ["arr", [p1, p2]].concat(es)
                            }.call(this)
                        }, function() {
                            return function() {
                                return this._applyWithArgs("token", "/"), e = this._many(function() {
                                    return this._or(function() {
                                        return this._apply("escapeChar")
                                    }, function() {
                                        return function() {
                                            return this._not(function() {
                                                return this._applyWithArgs("exactly", "/")
                                            }), this._apply("char")
                                        }.call(this)
                                    })
                                }), this._applyWithArgs("token", "/"), f = this._many(function() {
                                    return this._apply("letter")
                                }), p2 = this._apply("pos"), ["regex", [p1, p2], e.join(""), f.join("")]
                            }.call(this)
                        })
                    }.call(this)
                }, function() {
                    return this._apply("json")
                })
            },
            json: function() {
                var p1, bs, p2;
                return function() {
                    return p1 = this._apply("pos"), this._applyWithArgs("token", "{"), bs = this._applyWithArgs("listOf", "jsonBinding", ","), this._or(function() {
                        return this._applyWithArgs("token", ",")
                    }, function() {
                        return this._apply("empty")
                    }), this._applyWithArgs("token", "}"), p2 = this._apply("pos"), ["json", [p1, p2]].concat(bs)
                }.call(this)
            },
            jsonBinding: function() {
                var p1, n, v, p2;
                return this._or(function() {
                    return this._apply("jsonGetter")
                }, function() {
                    return this._apply("jsonSetter")
                }, function() {
                    return function() {
                        return p1 = this._apply("pos"), n = this._apply("jsonPropName"), this._applyWithArgs("token", ":"), v = this._apply("exprPart"), p2 = this._apply("pos"), ["binding", [p1, p2], n, v]
                    }.call(this)
                })
            },
            jsonGetter: function() {
                var p1, n, body, p2;
                return function() {
                    return this._apply("spaces"), p1 = this._apply("pos"), this._applyWithArgs("exactly", "g"), this._applyWithArgs("exactly", "e"), this._applyWithArgs("exactly", "t"), n = this._apply("jsonPropName"), this._applyWithArgs("token", "("), this._applyWithArgs("token", ")"), this._applyWithArgs("token", "{"), body = this._apply("srcElems"), this._applyWithArgs("token", "}"), p2 = this._apply("pos"), ["jsonGetter", [p1, p2], n, body]
                }.call(this)
            },
            jsonSetter: function() {
                var p1, n, arg, body, p2;
                return function() {
                    return this._apply("spaces"), p1 = this._apply("pos"), this._applyWithArgs("exactly", "s"), this._applyWithArgs("exactly", "e"), this._applyWithArgs("exactly", "t"), n = this._apply("jsonPropName"), this._applyWithArgs("token", "("), arg = this._applyWithArgs("token", "name"), this._applyWithArgs("token", ")"), this._applyWithArgs("token", "{"), body = this._apply("srcElems"), this._applyWithArgs("token", "}"), p2 = this._apply("pos"), ["jsonSetter", [p1, p2], n, body, arg]
                }.call(this)
            },
            jsonPropName: function() {
                return this._or(function() {
                    return this._applyWithArgs("token", "name")
                }, function() {
                    return this._applyWithArgs("token", "number")
                }, function() {
                    return this._applyWithArgs("token", "string")
                })
            },
            memberFragment: function() {
                var jb;
                return function() {
                    return this._apply("spaces"), jb = this._apply("jsonBinding"), this._or(function() {
                        return function() {
                            switch (this._apply("anything")) {
                                case ",":
                                    return ",";
                                default:
                                    throw fail
                            }
                        }.call(this)
                    }, function() {
                        return this._apply("empty")
                    }), this._apply("spaces"), this._apply("end"), jb
                }.call(this)
            },
            categoryFragment: function() {
                var p1, es, p2;
                return function() {
                    return this._apply("spaces"), p1 = this._apply("pos"), es = this._applyWithArgs("listOf", "exprPart", ","), p2 = this._apply("pos"), this._or(function() {
                        return this._applyWithArgs("token", ",")
                    }, function() {
                        return this._apply("empty")
                    }), this._apply("spaces"), this._apply("end"), ["arr", [p1, p2]].concat(es)
                }.call(this)
            },
            traitFragment: function() {
                var p1, es, p2;
                return function() {
                    return this._apply("spaces"), p1 = this._apply("pos"), this._applyWithArgs("token", "name"), this._applyWithArgs("token", "("), this._apply("spaces"), es = this._applyWithArgs("listOf", "exprPart", ","), this._apply("spaces"), this._applyWithArgs("token", ")"), this._apply("spaces"), this._apply("sc"), p2 = this._apply("pos"), this._apply("spaces"), this._apply("end"), ["arr", [p1, p2]].concat(es)
                }.call(this)
            },
            formal: function() {
                var p1, n, p2;
                return function() {
                    return this._apply("spaces"), p1 = this._apply("pos"), n = this._applyWithArgs("token", "name"), p2 = this._apply("pos"), ["get", [p1, p2], n]
                }.call(this)
            },
            funcRest: function() {
                var p1, args, body, p2;
                return function() {
                    return p1 = this._apply("pos"), this._applyWithArgs("token", "("), args = this._applyWithArgs("listOf", "formal", ","), this._applyWithArgs("token", ")"), this._applyWithArgs("token", "{"), body = this._apply("srcElems"), this._applyWithArgs("token", "}"), p2 = this._apply("pos"), ["func", [p1, p2], body].concat(args)
                }.call(this)
            },
            sc: function() {
                return this._or(function() {
                    return function() {
                        return this._apply("spacesNoNl"), this._or(function() {
                            return function() {
                                switch (this._apply("anything")) {
                                    case "\n":
                                        return "\n";
                                    default:
                                        throw fail
                                }
                            }.call(this)
                        }, function() {
                            return this._lookahead(function() {
                                return this._applyWithArgs("exactly", "}")
                            })
                        }, function() {
                            return this._apply("end")
                        })
                    }.call(this)
                }, function() {
                    return this._applyWithArgs("token", ";")
                })
            },
            binding: function() {
                var p1, n, p, v, p2;
                return function() {
                    return p1 = this._apply("pos"), n = this._applyWithArgs("token", "name"), v = this._or(function() {
                        return function() {
                            return this._applyWithArgs("token", "="), this._apply("exprPart")
                        }.call(this)
                    }, function() {
                        return function() {
                            return this._apply("empty"), p = this._apply("pos"), ["get", [p, p], "undefined"]
                        }.call(this)
                    }), p2 = this._apply("pos"), ["var", [p1, p2], n, v]
                }.call(this)
            },
            bindingList: function() {
                var p1, bs, p2;
                return function() {
                    return p1 = this._apply("pos"), bs = this._applyWithArgs("listOf", "binding", ","), p2 = this._apply("pos"), ["begin", [p1, p2]].concat(bs)
                }.call(this)
            },
            block: function() {
                var ss;
                return function() {
                    return this._applyWithArgs("token", "{"), ss = this._apply("srcElems"), this._applyWithArgs("token", "}"), ss
                }.call(this)
            },
            stmt: function() {
                var p1, bs, p2, c, t, p, f, p2, c, s, p2, s, c, p2, p, i, p, c, p, u, s, p2, p3, n, p4, n, p4, v, e, s, p2, e, p3, c, cs, p4, p3, cs, p4, cs, p2, p2, p2, p2, e, p2, t, e, p, e, c, p, f, p2, p, e, p2, x, s, p2, e, p2;
                return this._or(function() {
                    return this._apply("block")
                }, function() {
                    return function() {
                        return this._apply("spaces"), p1 = this._apply("pos"), this._or(function() {
                            return function() {
                                return this._applyWithArgs("token", "var"), bs = this._apply("bindingList"), this._apply("sc"), p2 = this._apply("pos"), bs
                            }.call(this)
                        }, function() {
                            return function() {
                                return this._applyWithArgs("token", "if"), this._applyWithArgs("token", "("), c = this._apply("expr"), this._applyWithArgs("token", ")"), t = this._apply("stmt"), f = this._or(function() {
                                    return function() {
                                        return this._applyWithArgs("token", "else"), this._apply("stmt")
                                    }.call(this)
                                }, function() {
                                    return function() {
                                        return this._apply("empty"), p = this._apply("pos"), ["get", [p, p], "undefined"]
                                    }.call(this)
                                }), this._or(function() {
                                    return this._apply("sc")
                                }, function() {
                                    return this._apply("empty")
                                }), p2 = this._apply("pos"), ["if", [p1, p2], c, t, f]
                            }.call(this)
                        }, function() {
                            return function() {
                                return this._applyWithArgs("token", "while"), this._applyWithArgs("token", "("), c = this._apply("expr"), this._applyWithArgs("token", ")"), s = this._apply("stmt"), p2 = this._apply("pos"), ["while", [p1, p2], c, s]
                            }.call(this)
                        }, function() {
                            return function() {
                                return this._applyWithArgs("token", "do"), s = this._apply("stmt"), this._applyWithArgs("token", "while"), this._applyWithArgs("token", "("), c = this._apply("expr"), this._applyWithArgs("token", ")"), this._apply("sc"), p2 = this._apply("pos"), ["doWhile", [p1, p2], s, c]
                            }.call(this)
                        }, function() {
                            return function() {
                                return this._applyWithArgs("token", "for"), this._applyWithArgs("token", "("), i = this._or(function() {
                                    return function() {
                                        return this._applyWithArgs("token", "var"), this._apply("bindingList")
                                    }.call(this)
                                }, function() {
                                    return this._apply("expr")
                                }, function() {
                                    return function() {
                                        return this._apply("empty"), p = this._apply("pos"), ["get", [p, p], "undefined"]
                                    }.call(this)
                                }), this._applyWithArgs("token", ";"), c = this._or(function() {
                                    return this._apply("expr")
                                }, function() {
                                    return function() {
                                        return this._apply("empty"), p = this._apply("pos"), ["get", [p, p], "true"]
                                    }.call(this)
                                }), this._applyWithArgs("token", ";"), u = this._or(function() {
                                    return this._apply("expr")
                                }, function() {
                                    return function() {
                                        return this._apply("empty"), p = this._apply("pos"), ["get", [p, p], "undefined"]
                                    }.call(this)
                                }), this._applyWithArgs("token", ")"), s = this._apply("stmt"), p2 = this._apply("pos"), ["for", [p1, p2], i, c, s, u]
                            }.call(this)
                        }, function() {
                            return function() {
                                return this._applyWithArgs("token", "for"), this._applyWithArgs("token", "("), v = this._or(function() {
                                    return function() {
                                        return p3 = this._apply("pos"), this._applyWithArgs("token", "var"), n = this._applyWithArgs("token", "name"), p4 = this._apply("pos"), ["var", [p3, p4], n, ["get", [p3, p3], "undefined"]]
                                    }.call(this)
                                }, function() {
                                    return function() {
                                        return n = this._applyWithArgs("token", "name"), p4 = this._apply("pos"), ["get", [p3, p4], n]
                                    }.call(this)
                                }), this._applyWithArgs("token", "in"), e = this._apply("expr"), this._applyWithArgs("token", ")"), s = this._apply("stmt"), p2 = this._apply("pos"), ["forIn", [p1, p2], v, e, s]
                            }.call(this)
                        }, function() {
                            return function() {
                                return this._applyWithArgs("token", "switch"), this._applyWithArgs("token", "("), e = this._apply("expr"), this._applyWithArgs("token", ")"), this._applyWithArgs("token", "{"), cs = this._many(function() {
                                    return this._or(function() {
                                        return function() {
                                            return p3 = this._apply("pos"), this._applyWithArgs("token", "case"), c = this._apply("expr"), this._applyWithArgs("token", ":"), cs = this._apply("srcElems"), p4 = this._apply("pos"), ["case", [p3, p4], c, cs]
                                        }.call(this)
                                    }, function() {
                                        return function() {
                                            return p3 = this._apply("pos"), this._applyWithArgs("token", "default"), this._applyWithArgs("token", ":"), cs = this._apply("srcElems"), p4 = this._apply("pos"), ["default", [p3, p4], cs]
                                        }.call(this)
                                    })
                                }), this._applyWithArgs("token", "}"), p2 = this._apply("pos"), ["switch", [p1, p2], e].concat(cs)
                            }.call(this)
                        }, function() {
                            return function() {
                                return this._applyWithArgs("token", "break"), this._apply("sc"), p2 = this._apply("pos"), ["break", [p1, p2]]
                            }.call(this)
                        }, function() {
                            return function() {
                                return this._applyWithArgs("token", "debugger"), this._apply("sc"), p2 = this._apply("pos"), ["debugger", [p1, p2]]
                            }.call(this)
                        }, function() {
                            return function() {
                                return this._applyWithArgs("token", "continue"), this._apply("sc"), p2 = this._apply("pos"), ["continue", [p1, p2]]
                            }.call(this)
                        }, function() {
                            return function() {
                                return this._applyWithArgs("token", "throw"), this._apply("spacesNoNl"), e = this._apply("expr"), this._apply("sc"), p2 = this._apply("pos"), ["throw", [p1, p2], e]
                            }.call(this)
                        }, function() {
                            return function() {
                                return this._applyWithArgs("token", "try"), t = this._apply("block"), c = this._or(function() {
                                    return function() {
                                        return this._applyWithArgs("token", "catch"), this._applyWithArgs("token", "("), e = this._apply("formal"), this._applyWithArgs("token", ")"), this._apply("block")
                                    }.call(this)
                                }, function() {
                                    return e = function() {
                                        return this._apply("empty"), p = this._apply("pos"), ["get", [p, p], "undefined"]
                                    }.call(this)
                                }), f = this._or(function() {
                                    return function() {
                                        return this._applyWithArgs("token", "finally"), this._apply("block")
                                    }.call(this)
                                }, function() {
                                    return function() {
                                        return this._apply("empty"), p = this._apply("pos"), ["get", [p, p], "undefined"]
                                    }.call(this)
                                }), p2 = this._apply("pos"), ["try", [p1, p2], t, e, c, f]
                            }.call(this)
                        }, function() {
                            return function() {
                                return this._applyWithArgs("token", "return"), e = this._or(function() {
                                    return this._apply("expr")
                                }, function() {
                                    return function() {
                                        return this._apply("empty"), p = this._apply("pos"), ["get", [p, p], "undefined"]
                                    }.call(this)
                                }), this._apply("sc"), p2 = this._apply("pos"), ["return", [p1, p2], e]
                            }.call(this)
                        }, function() {
                            return function() {
                                return this._applyWithArgs("token", "with"), this._applyWithArgs("token", "("), x = this._apply("expr"), this._applyWithArgs("token", ")"), s = this._apply("stmt"), p2 = this._apply("pos"), ["with", [p1, p2], x, s]
                            }.call(this)
                        }, function() {
                            return function() {
                                return e = this._apply("expr"), this._apply("sc"), e
                            }.call(this)
                        }, function() {
                            return function() {
                                return this._applyWithArgs("token", ";"), p2 = this._apply("pos"), ["get", [p1, p2], "undefined"]
                            }.call(this)
                        })
                    }.call(this)
                })
            },
            functionDef: function() {
                var p1, n, f, p2;
                return function() {
                    return p1 = this._apply("pos"), this._applyWithArgs("token", "function"), n = this._applyWithArgs("token", "name"), f = this._apply("funcRest"), p2 = this._apply("pos"), ["var", [p1, p2], n, f]
                }.call(this)
            },
            functionDefFragment: function() {
                var f;
                return function() {
                    return f = this._apply("functionDef"), this._apply("spaces"), this._apply("end"), f
                }.call(this)
            },
            functionDefsFragment: function() {
                var p1, fs, p2;
                return function() {
                    return p1 = this._apply("pos"), fs = this._many(function() {
                        return this._apply("functionDef")
                    }), p2 = this._apply("pos"), this._apply("spaces"), this._apply("end"), ["arr", [p1, p2]].concat(fs)
                }.call(this)
            },
            srcElem: function() {
                return this._or(function() {
                    return this._apply("functionDef")
                }, function() {
                    return this._apply("stmt")
                })
            },
            srcElems: function() {
                var p1, ss, p2;
                return function() {
                    return p1 = this._apply("pos"), ss = this._many(function() {
                        return this._apply("srcElem")
                    }), p2 = this._apply("pos"), ["begin", [p1, p2]].concat(ss)
                }.call(this)
            },
            topLevel: function() {
                var r;
                return function() {
                    return r = this._apply("srcElems"), this._apply("spaces"), this._apply("end"), r
                }.call(this)
            }
        })
    }), module("users.timfelgentreff.jsinterpreter.Parser").requires("lively.Ometa", "users.timfelgentreff.jsinterpreter.generated.Translator", "users.timfelgentreff.jsinterpreter.generated.Nodes", "users.timfelgentreff.jsinterpreter.LivelyJSParser").toRun(function() {
        Object.extend(LivelyJSParser, {
            hexDigits: "0123456789abcdef",
            keywords: function() {
                for (var keywordWithIdx = {}, keywords = ["break", "case", "catch", "continue", "default", "delete", "do", "else", "finally", "for", "function", "if", "in", "instanceof", "new", "return", "switch", "this", "throw", "try", "typeof", "var", "void", "while", "with", "ometa", "debugger"], idx = 0; idx < keywords.length; idx++) keywordWithIdx[keywords[idx]] = !0;
                return keywordWithIdx
            }(),
            _isKeyword: function(k) {
                return this.keywords[k] === !0
            }
        }), Object.extend(users.timfelgentreff.jsinterpreter.Parser, {
            jsParser: LivelyJSParser,
            astTranslator: JSTranslator,
            basicParse: function(source, rule) {
                var errorHandler = function() {
                        throw Array.from(arguments)
                    },
                    intermediate = OMetaSupport.matchAllWithGrammar(this.jsParser, rule, source, errorHandler);
                if (!intermediate || Object.isString(intermediate)) throw [source, rule, "Could not parse JS source code", 0, intermediate];
                var ast = OMetaSupport.matchWithGrammar(this.astTranslator, "trans", intermediate);
                if (!ast || Object.isString(ast)) throw [source, rule, "Could not translate symbolic AST tree", 0, intermediate, ast];
                return ast.source = source, ast
            },
            parse: function(src, optRule) {
                return this.basicParse(src, optRule || "topLevel")
            }
        }), users.timfelgentreff.jsinterpreter.Node.addMethods("accessing", {
            setParent: function(parentNode) {
                return this._parent = parentNode
            },
            getParent: function() {
                return this._parent
            },
            hasParent: function() {
                return void 0 != this._parent
            },
            parentSequence: function() {
                return this.hasParent() && this.getParent().parentSequence()
            },
            parentFunction: function() {
                return this.hasParent() && this.getParent().parentFunction()
            },
            astIndex: function() {
                var parentFunc = this.parentFunction();
                if (!parentFunc) throw new Error("astIndex: cannot get parent fucntion of " + this);
                return parentFunc.linearlyListNodesWithoutNestedFunctions().indexOf(this)
            },
            nodeForAstIndex: function(idx) {
                return this.linearlyListNodesWithoutNestedFunctions()[idx]
            }
        }, "testing", {
            isASTNode: !0,
            isUndefined: function(expr) {
                return expr.isVariable && "undefined" === expr.name
            }
        }, "enumerating", {
            withAllChildNodesDo: function(func, parent, nameInParent, depth) {
                var node = this,
                    shouldContinue = func(node, parent, nameInParent, depth || 0);
                shouldContinue && this.doForAllChildNodes(function(childNode, nameInParent) {
                    childNode.withAllChildNodesDo(func, node, nameInParent, depth ? depth + 1 : 1)
                })
            },
            withAllChildNodesDoPostOrder: function(func, stopFunc, parent, nameInParent, depth) {
                var node = this,
                    shouldStop = stopFunc && stopFunc(node, parent, nameInParent, depth || 0);
                shouldStop || (this.doForAllChildNodes(function(childNode, nameInParent) {
                    childNode.withAllChildNodesDoPostOrder(func, stopFunc, node, nameInParent, depth ? depth + 1 : 1)
                }), func(node, parent, nameInParent, depth || 0))
            },
            doForAllChildNodes: function(func) {
                for (var name in this)
                    if (this.hasOwnProperty(name) && "_parent" != name) {
                        var value = this[name];
                        value.isASTNode ? func(value, name, null) : Object.isArray(value) && value.forEach(function(item, i) {
                            item.isASTNode && func(item, name, i)
                        })
                    }
            },
            nodesMatching: function(matchFunc) {
                var result = [];
                return this.withAllChildNodesDo(function(node, parent, nameInParent, depth) {
                    return matchFunc(node, parent, nameInParent, depth) && result.push(node), !0
                }), result
            },
            linearlyListNodes: function() {
                var nodes = [];
                return this.withAllChildNodesDoPostOrder(function(node) {
                    nodes.push(node)
                }), nodes
            },
            linearlyListNodesWithoutNestedFunctions: function() {
                var root = this,
                    nodes = [];
                return this.withAllChildNodesDoPostOrder(function(node) {
                    nodes.push(node)
                }, function(node) {
                    return node.isFunction && node !== root
                }), nodes
            },
            isAfter: function(other) {
                var that = this,
                    first = null;
                return this.parentFunction().body.withAllChildNodesDo(function(node) {
                    return first || (node === that && (first = that), node === other && (first = other)), !first
                }), first === other
            }
        }, "replacing", {
            replaceNodesMatching: function(testFunc, replacementNodeOrFunction) {
                var nodes = this.nodesMatching(testFunc);
                return nodes.forEach(function(node) {
                    var parent = node.getParent();
                    if (!parent) throw new Error("No parent for node in replaceNodesMatching " + node);
                    var replacementNode = "function" == typeof replacementNodeOrFunction ? replacementNodeOrFunction(node) : replacementNodeOrFunction;
                    parent.replaceChildNode(node, replacementNode)
                }), this
            },
            replaceWith: function(otherNode) {
                if (!this.hasParent()) throw new Error("Need parent node for replaceWith but cannot find it " + this);
                return this.getParent().replaceChildNode(this, otherNode), otherNode
            },
            replaceChildNode: function(childNode, newNode) {
                var slotName, idx;
                if (this.doForAllChildNodes(function(node, nameInParent, i) {
                        node === childNode && (slotName = nameInParent, idx = i)
                    }), void 0 === slotName) throw new Error("Cannot find childNode in me! (#replaceChildNode)");
                void 0 === idx || null === idx ? this[slotName] = newNode : this[slotName][idx] = newNode, newNode.setParent(this)
            }
        }, "evaluation", {
            eval: function() {
                var result, js;
                try {
                    js = this.asJS();
                    var src = "(" + js + ")";
                    result = eval(src)
                } catch (e) {
                    alert("Could not eval " + js + " because:\n" + e + "\n" + e.stack)
                }
                return result
            }
        }, "debugging", {
            error: function(msg) {
                throw new Error(msg)
            },
            indent: function(depth) {
                return Strings.indent("", " ", depth)
            },
            toString: function() {
                return this.constructor.name
            },
            printTree: function(postOrder) {
                var nodeStrings = [],
                    idx = 0,
                    enumFunc = postOrder ? "withAllChildNodesDoPostOrder" : "withAllChildNodesDo";
                return this[enumFunc](function(node, parent, nameInParent, depth) {
                    return nodeStrings.push(idx.toString() + " " + Strings.indent(node.constructor.name + "(" + nameInParent + ")", " ", depth)), idx++, !0
                }), nodeStrings.join("\n")
            },
            printConstructorCall: function() {
                for (var call = "new " + this.constructor.type + "(", argCalls = [], i = 0; i < arguments.length; i++) {
                    var arg = arguments[i],
                        argCall = "";
                    Object.isArray(arg) ? (argCall += "[", argCall += arg.collect(function(ea) {
                        return ea.isASTNode ? ea.printConstruction() : ea
                    }).join(","), argCall += "]") : argCall += arg.isASTNode ? arg.printConstruction() : arg, argCalls.push(argCall)
                }
                return call += argCalls.join(","), call += ")"
            }
        }, "stepping", {
            firstStatement: function() {
                return this
            },
            nextStatement: function() {
                var stmt = this.getParent().nextStatement(this);
                return stmt ? stmt.firstStatement() : null
            },
            isComposite: function() {
                return !1
            }
        }, "matching", {
            match: function(patternAst) {
                var matchedPlaceholder = !0;
                for (var key in patternAst) {
                    var result = this.matchVal(key, this[key], patternAst[key]);
                    result !== !0 && (matchedPlaceholder = result)
                }
                return matchedPlaceholder
            },
            matchVal: function(key, value, pattern) {
                if (pattern === users.timfelgentreff.jsinterpreter.Node.placeholder) return value;
                if (value == pattern) return !0;
                if (Object.isString(pattern)) {
                    if (value.toString() == pattern) return !0;
                    if (value.value == pattern) return !0;
                    if (value.name == pattern) return !0
                }
                if (Object.isArray(pattern) && Object.isArray(value)) {
                    for (var matchedPlaceholder = !0, i = 0; i < pattern.length; i++) {
                        for (var success = !1, lastError = null, j = 0; j < value.length; j++) try {
                            var res = this.matchVal(key, value[j], pattern[i]);
                            res !== !0 && (matchedPlaceholder = res), success = !0
                        } catch (e) {
                            lastError = e
                        }
                        if (!success) throw lastError
                    }
                    if (value.length !== pattern.length) throw {
                        key: key,
                        err: "count",
                        expected: pattern.length,
                        actual: value.length
                    };
                    return matchedPlaceholder
                }
                if (Object.isObject(pattern) && value.isASTNode) return value.match(pattern);
                throw {
                    key: key,
                    err: "missmatch",
                    expected: String(pattern),
                    actual: String(value)
                }
            }
        }), Object.subclass("users.timfelgentreff.jsinterpreter.SourceGenerator", "documentation", {
            usage: "gen = new users.timfelgentreff.jsinterpreter.SourceGenerator();\ngen.writeAndEvalTranslator();\ngen.evalAndWriteClasses();\nusers.timfelgentreff.jsinterpreter.Parser.astTranslator = JSTranslator;\nusers.timfelgentreff.jsinterpreter.Parser.jsParser = LivelyJSParser;",
            showUsage: function() {
                $world.addTextWindow({
                    content: this.usage,
                    title: "users.timfelgentreff.jsinterpreter.SourceGenerator usage"
                })
            }
        }, "settings", {
            customRules: function() {
                return ["trans = [:t apply(t):ans] -> ans,"]
            },
            customClasses: function() {
                return ["Object.subclass('" + this.rootNodeClassName + "')"]
            },
            translatorRules: function() {
                var names = this.constructor.categories["translator rules"],
                    result = {};
                return names.forEach(function(name) {
                    result[name] = this[name]
                }, this), result
            },
            modulePath: "users.timfelgentreff.jsinterpreter.",
            rootNodeClassName: "users.timfelgentreff.jsinterpreter.Node",
            visitorClassName: "users.timfelgentreff.jsinterpreter.Visitor"
        }, "translator rules", {
            begin: {
                className: "Sequence",
                rules: [":pos", "trans*:children", "end"],
                debugging: {
                    printConstruction: function() {
                        return this.printConstructorCall(this.pos, this.children)
                    },
                    toString: function() {
                        return Strings.format("%s(%s)", this.constructor.name, this.children.join(","))
                    }
                },
                conversion: {
                    asJS: function(depth) {
                        var indent = this.indent(depth || 0);
                        return depth = depth || -1, this.children.invoke("asJS", depth + 1).join(";\n" + indent)
                    }
                },
                insertion: {
                    insertBefore: function(newNode, existingNode) {
                        for (var i = 0; i < this.children.length && !(this.children[i].nodesMatching(function(node) {
                                return node === existingNode
                            }).length > 0); i++);
                        if (!this.children[i]) throw dbgOn(new Error("insertBefore: " + existingNode + " not in " + this));
                        return this.insertAt(newNode, i)
                    },
                    insertAt: function(newNode, idx) {
                        return this.children.pushAt(newNode, idx), newNode.setParent(this), newNode
                    }
                },
                accessing: {
                    parentSequence: function() {
                        return this
                    }
                },
                stepping: {
                    firstStatement: function() {
                        return this.children.length > 0 ? this.children[0].firstStatement() : this
                    },
                    nextStatement: function($super, node) {
                        var idx = this.children.indexOf(node);
                        return idx >= 0 && idx < this.children.length - 1 ? this.children[idx + 1] : $super(this)
                    },
                    isComposite: function() {
                        return !0
                    }
                }
            },
            number: {
                className: "Number",
                rules: [":pos", ":value"],
                debugging: {
                    printConstruction: function() {
                        return this.printConstructorCall(this.pos, this.pos, this.value)
                    },
                    toString: function() {
                        return Strings.format("%s(%s)", this.constructor.name, this.value)
                    }
                },
                conversion: {
                    asJS: function() {
                        return this.value
                    }
                }
            },
            string: {
                className: "String",
                rules: [":pos", ":value"],
                debugging: {
                    printConstruction: function() {
                        return this.printConstructorCall(this.pos, '"' + this.value + '"')
                    },
                    toString: function() {
                        return Strings.format("%s(%s)", this.constructor.name, this.value)
                    }
                },
                conversion: {
                    asJS: function() {
                        return '"' + this.value + '"'
                    }
                }
            },
            condExpr: {
                className: "Cond",
                rules: [":pos", "trans:condExpr", "trans:trueExpr", "trans:falseExpr"],
                debugging: {
                    printConstruction: function() {
                        return this.printConstructorCall(this.pos, this.condExpr, this.trueExpr, this.falseExpr)
                    },
                    toString: function() {
                        return Strings.format("%s(%s?%s:%s)", this.constructor.name, this.condExpr, this.trueExpr, this.falseExpr)
                    }
                },
                conversion: {
                    asJS: function(depth) {
                        return Strings.format("(%s) ? (%s) : (%s)", this.condExpr.asJS(depth), this.trueExpr.asJS(depth), this.falseExpr.asJS(depth))
                    }
                }
            },
            "if": {
                className: "If",
                rules: [":pos", "trans:condExpr", "trans:trueExpr", "trans:falseExpr"],
                initializing: {
                    initialize: function($super, pos, condExpr, trueExpr, falseExpr) {
                        this.pos = pos, this.condExpr = condExpr, this.trueExpr = trueExpr.isSequence || this.isUndefined(trueExpr) ? trueExpr : new users.timfelgentreff.jsinterpreter.Sequence(trueExpr.pos, [trueExpr]), this.falseExpr = falseExpr.isSequence || this.isUndefined(falseExpr) ? falseExpr : new users.timfelgentreff.jsinterpreter.Sequence(trueExpr.pos, [falseExpr]), condExpr.setParent(this), this.trueExpr.setParent(this), this.falseExpr.setParent(this)
                    }
                },
                debugging: {
                    printConstruction: function() {
                        return this.printConstructorCall(this.pos, this.condExpr, this.trueExpr, this.falseExpr)
                    },
                    toString: function() {
                        return Strings.format("%s(%s?%s:%s)", this.constructor.name, this.condExpr, this.trueExpr, this.falseExpr)
                    }
                },
                conversion: {
                    asJS: function(depth) {
                        var str = Strings.format("if (%s) {%s}", this.condExpr.asJS(depth), this.trueExpr.asJS(depth));
                        return this.isUndefined(this.falseExpr) || (str += " else {" + this.falseExpr.asJS(depth) + "}"), str
                    }
                },
                stepping: {
                    firstStatement: function() {
                        return this.condExpr.firstStatement()
                    },
                    nextStatement: function($super, node) {
                        return node === this.condExpr ? this.trueExpr : $super(this)
                    },
                    isComposite: function() {
                        return !0
                    }
                }
            },
            "while": {
                className: "While",
                rules: [":pos", "trans:condExpr", "trans:body"],
                debugging: {
                    printConstruction: function() {
                        return this.printConstructorCall(this.pos, this.condExpr, this.body)
                    },
                    toString: function() {
                        return Strings.format("%s(%s?%s)", this.constructor.name, this.condExpr, this.body)
                    }
                },
                conversion: {
                    asJS: function(depth) {
                        return Strings.format("while (%s) {%s}", this.condExpr.asJS(depth), this.body.asJS(depth))
                    }
                },
                stepping: {
                    firstStatement: function() {
                        return this.condExpr.firstStatement()
                    },
                    nextStatement: function($super, node) {
                        return node === this.condExpr ? this.body : node === this.body ? this.condExpr : $super(this)
                    },
                    isComposite: function() {
                        return !0
                    }
                }
            },
            doWhile: {
                className: "DoWhile",
                rules: [":pos", "trans:body", "trans:condExpr"],
                debugging: {
                    printConstruction: function() {
                        return this.printConstructorCall(this.pos, this.body, this.condExpr)
                    },
                    toString: function() {
                        return Strings.format("%s(%s while%s)", this.constructor.name, this.body, this.condExpr)
                    }
                },
                conversion: {
                    asJS: function(depth) {
                        return Strings.format("do {%s} while (%s);", this.body.asJS(depth), this.condExpr.asJS(depth))
                    }
                },
                stepping: {
                    firstStatement: function() {
                        return this.body.firstStatement()
                    },
                    nextStatement: function($super, node) {
                        return node === this.condExpr ? this.body : node === this.body ? this.condExpr : $super(this)
                    },
                    isComposite: function() {
                        return !0
                    }
                }
            },
            "for": {
                className: "For",
                rules: [":pos", "trans:init", "trans:condExpr", "trans:body", "trans:upd"],
                debugging: {
                    printConstruction: function() {
                        return this.printConstructorCall(this.pos, this.init, this.condExpr, this.body, this.upd)
                    },
                    toString: function() {
                        return Strings.format("%s(%s;%s;%s do %s)", this.constructor.name, this.init, this.condExpr, this.upd, this.body)
                    }
                },
                conversion: {
                    asJS: function(depth) {
                        return Strings.format("for (%s; %s; %s) {%s}", this.init.asJS(depth), this.condExpr.asJS(depth), this.upd.asJS(depth), this.body.asJS(depth))
                    }
                },
                stepping: {
                    firstStatement: function() {
                        return this.init.firstStatement()
                    },
                    nextStatement: function($super, node) {
                        return node === this.init || node === this.upd ? this.condExpr : node === this.condExpr ? this.body : node === this.body ? this.upd : $super(this)
                    },
                    isComposite: function() {
                        return !0
                    }
                }
            },
            forIn: {
                className: "ForIn",
                rules: [":pos", "trans:name", "trans:obj", "trans:body"],
                debugging: {
                    printConstruction: function() {
                        return this.printConstructorCall(this.pos, this.name, this.obj, this.body)
                    },
                    toString: function() {
                        return Strings.format("%s(%s in %s do %s)", this.constructor.name, this.name, this.obj, this.body)
                    }
                },
                conversion: {
                    asJS: function(depth) {
                        return Strings.format("for (%s in %s) {%s}", this.name.asJS(depth), this.obj.asJS(depth), this.body.asJS(depth))
                    }
                }
            },
            set: {
                className: "Set",
                rules: [":pos", "trans:left", "trans:right"],
                debugging: {
                    printConstruction: function() {
                        return this.printConstructorCall(this.pos, this.left, this.right)
                    },
                    toString: function() {
                        return Strings.format("%s(%s = %s)", this.constructor.name, this.left, this.right)
                    }
                },
                conversion: {
                    asJS: function(depth) {
                        return this.left.asJS(depth) + " = " + this.right.asJS(depth)
                    }
                }
            },
            mset: {
                className: "ModifyingSet",
                rules: [":pos", "trans:left", ":name", "trans:right"],
                debugging: {
                    printConstruction: function() {
                        return this.printConstructorCall(this.pos, this.left, '"' + this.name + '"', this.right)
                    },
                    toString: function() {
                        return Strings.format("%s(%s %s %s)", this.constructor.name, this.left, this.name, this.right)
                    }
                },
                conversion: {
                    asJS: function(depth) {
                        return this.left.asJS(depth) + " " + this.name + "= " + this.right.asJS(depth)
                    }
                }
            },
            binop: {
                className: "BinaryOp",
                rules: [":pos", ":name", "trans:left", "trans:right"],
                debugging: {
                    printConstruction: function() {
                        return this.printConstructorCall(this.pos, '"' + this.name + '"', this.left, this.right)
                    },
                    toString: function() {
                        return Strings.format("%s(%s %s %s)", this.constructor.name, this.left, this.name, this.right)
                    }
                },
                conversion: {
                    asJS: function(depth) {
                        return "(" + this.left.asJS(depth) + ") " + this.name + " (" + this.right.asJS(depth) + ")"
                    }
                }
            },
            unop: {
                className: "UnaryOp",
                rules: [":pos", ":name", "trans:expr"],
                debugging: {
                    printConstruction: function() {
                        return this.printConstructorCall(this.pos, '"' + this.name + '"', this.expr)
                    },
                    toString: function() {
                        return Strings.format("%s(%s%s)", this.constructor.name, this.name, this.expr)
                    }
                },
                conversion: {
                    asJS: function(depth) {
                        return "(" + this.name + this.expr.asJS(depth) + ")"
                    }
                }
            },
            preop: {
                className: "PreOp",
                rules: [":pos", ":name", "trans:expr"],
                debugging: {
                    printConstruction: function() {
                        return this.printConstructorCall(this.pos, '"' + this.name + '"', this.expr)
                    },
                    toString: function() {
                        return Strings.format("%s(%s%s)", this.constructor.name, this.name, this.expr)
                    }
                },
                conversion: {
                    asJS: function(depth) {
                        return "(" + this.name + this.expr.asJS(depth) + ")"
                    }
                }
            },
            postop: {
                className: "PostOp",
                rules: [":pos", ":name", "trans:expr"],
                debugging: {
                    printConstruction: function() {
                        return this.printConstructorCall(this.pos, '"' + this.name + '"', this.expr)
                    },
                    toString: function() {
                        return Strings.format("%s(%s%s)", this.constructor.name, this.expr, this.name)
                    }
                },
                conversion: {
                    asJS: function(depth) {
                        return "(" + this.expr.asJS(depth) + this.name + ")"
                    }
                }
            },
            "this": {
                className: "This",
                rules: [":pos"],
                debugging: {
                    printConstruction: function() {
                        return this.printConstructorCall(this.pos)
                    },
                    toString: function() {
                        return this.constructor.name
                    }
                },
                conversion: {
                    asJS: function() {
                        return "this"
                    }
                }
            },
            get: {
                className: "Variable",
                rules: [":pos", ":name"],
                debugging: {
                    printConstruction: function() {
                        return this.printConstructorCall(this.pos, '"' + this.name + '"')
                    },
                    toString: function() {
                        return Strings.format("%s(%s)", this.constructor.name, this.name)
                    }
                },
                conversion: {
                    asJS: function() {
                        return this.name
                    }
                }
            },
            getp: {
                className: "GetSlot",
                rules: [":pos", "trans:slotName", "trans:obj"],
                debugging: {
                    printConstruction: function() {
                        return this.printConstructorCall(this.pos, this.slotName, this.obj)
                    },
                    toString: function() {
                        return Strings.format("%s(%s[%s])", this.constructor.name, this.obj, this.slotName)
                    }
                },
                conversion: {
                    asJS: function(depth) {
                        var objJS = this.obj.asJS(depth);
                        return this.obj.isFunction && (objJS = "(" + objJS + ")"), objJS + "[" + this.slotName.asJS(depth) + "]"
                    }
                }
            },
            "break": {
                className: "Break",
                rules: [":pos", "trans:label"],
                initializing: {
                    initialize: function($super, pos, label) {
                        this.pos = pos, this.label = label || new users.timfelgentreff.jsinterpreter.Label([pos[1], pos[1]], ""), this.label.setParent(this)
                    }
                },
                debugging: {
                    printConstruction: function() {
                        return this.printConstructorCall(this.pos, this.label)
                    }
                },
                conversion: {
                    asJS: function() {
                        return "break" + this.label.asJS()
                    }
                }
            },
            "debugger": {
                className: "Debugger",
                rules: [":pos"],
                debugging: {
                    printConstruction: function() {
                        return this.printConstructorCall(this.pos)
                    }
                },
                conversion: {
                    asJS: function() {
                        return "debugger"
                    }
                }
            },
            "continue": {
                className: "Continue",
                rules: [":pos", "trans:label"],
                initializing: {
                    initialize: function($super, pos, label) {
                        this.pos = pos, this.label = label || new users.timfelgentreff.jsinterpreter.Label([pos[1], pos[1]], ""), this.label.setParent(this)
                    }
                },
                debugging: {
                    printConstruction: function() {
                        return this.printConstructorCall(this.pos, this.label)
                    }
                },
                conversion: {
                    asJS: function() {
                        return "continue" + this.label.asJS()
                    }
                }
            },
            arr: {
                className: "ArrayLiteral",
                rules: [":pos", "trans*:elements"],
                debugging: {
                    printConstruction: function() {
                        return this.printConstructorCall(this.pos, this.elements)
                    },
                    toString: function() {
                        return Strings.format("%s(%s)", this.constructor.name, this.elements.join(","))
                    }
                },
                conversion: {
                    asJS: function() {
                        return "[" + this.elements.invoke("asJS").join(",") + "]"
                    }
                }
            },
            "return": {
                className: "Return",
                rules: [":pos", "trans:expr"],
                debugging: {
                    printConstruction: function() {
                        return this.printConstructorCall(this.pos, this.expr)
                    },
                    toString: function() {
                        return Strings.format("%s(%s)", this.constructor.name, this.expr)
                    }
                },
                conversion: {
                    asJS: function(depth) {
                        return "return " + this.expr.asJS(depth)
                    }
                }
            },
            "with": {
                className: "With",
                rules: [":pos", "trans:obj", "trans:body"],
                debugging: {
                    printConstruction: function() {
                        return this.printConstructorCall(this.pos, this.obj, this.body)
                    },
                    toString: function() {
                        return Strings.format("%s(%s %s)", this.constructor.name, this.obj, this.body)
                    }
                },
                conversion: {
                    asJS: function(depth) {
                        return "with (" + this.obj.asJS(depth) + ") {" + this.body.asJS(depth) + "}"
                    }
                }
            },
            send: {
                className: "Send",
                rules: [":pos", "trans:property", "trans:recv", "trans*:args"],
                debugging: {
                    printConstruction: function() {
                        return this.printConstructorCall(this.pos, this.property, this.recv, this.args)
                    },
                    toString: function() {
                        return Strings.format("%s(%s[%s](%s))", this.constructor.name, this.recv, this.property, this.args.join(","))
                    }
                },
                conversion: {
                    asJS: function(depth) {
                        var recvJS = this.recv.asJS(depth);
                        return this.recv.isFunction && (recvJS = "(" + recvJS + ")"), Strings.format("%s[%s](%s)", recvJS, this.property.asJS(depth), this.args.invoke("asJS").join(","))
                    }
                },
                accessing: {
                    getName: function() {
                        return this.property
                    }
                }
            },
            call: {
                className: "Call",
                rules: [":pos", "trans:fn", "trans*:args"],
                debugging: {
                    printConstruction: function() {
                        return this.printConstructorCall(this.pos, this.fn, this.args)
                    },
                    toString: function() {
                        return Strings.format("%s(%s(%s))", this.constructor.name, this.fn, this.args.join(","))
                    }
                },
                conversion: {
                    asJS: function(depth) {
                        return Strings.format("%s(%s)", this.fn.asJS(depth), this.args.invoke("asJS").join(","))
                    }
                },
                accessing: {
                    getName: function() {
                        return this.fn.name
                    }
                }
            },
            "new": {
                className: "New",
                rules: [":pos", "trans:clsExpr"],
                debugging: {
                    printConstruction: function() {
                        return this.printConstructorCall(this.pos, this.clsExpr)
                    },
                    toString: function() {
                        return Strings.format("%s(%s)", this.constructor.name, this.clsExpr)
                    }
                },
                conversion: {
                    asJS: function(depth) {
                        return "new " + this.clsExpr.asJS(depth)
                    }
                }
            },
            "var": {
                className: "VarDeclaration",
                rules: [":pos", ":name", "trans:val"],
                debugging: {
                    printConstruction: function() {
                        return this.printConstructorCall(this.pos, '"' + this.name + '"', this.val)
                    },
                    toString: function() {
                        return Strings.format("%s(%s = %s)", this.constructor.name, this.name, this.val)
                    }
                },
                conversion: {
                    asJS: function(depth) {
                        return Strings.format("var %s = %s", this.name, this.val.asJS(depth))
                    }
                }
            },
            "throw": {
                className: "Throw",
                rules: [":pos", "trans:expr"],
                debugging: {
                    printConstruction: function() {
                        return this.printConstructorCall(this.pos, this.expr)
                    },
                    toString: function() {
                        return Strings.format("%s(%s)", this.constructor.name, this.expr)
                    }
                },
                conversion: {
                    asJS: function(depth) {
                        return "throw " + this.expr.asJS(depth)
                    }
                }
            },
            "try": {
                className: "TryCatchFinally",
                rules: [":pos", "trans:trySeq", "trans:err", "trans:catchSeq", "trans:finallySeq"],
                debugging: {
                    printConstruction: function() {
                        return this.printConstructorCall(this.pos, this.trySeq, '"' + this.err.name + '"', this.catchSeq, this.finallySeq)
                    },
                    toString: function() {
                        return Strings.format("%s(%s %s %s)", this.constructor.name, this.trySeq, this.catchSeq, this.finallySeq)
                    }
                },
                conversion: {
                    asJS: function(depth) {
                        var baseIndent = this.indent(depth - 1),
                            indent = this.indent(depth),
                            str = "try {\n" + indent + this.trySeq.asJS(depth) + "\n" + baseIndent + "}";
                        return this.isUndefined(this.catchSeq) || (str += " catch(" + this.err.name + ") {\n" + indent + this.catchSeq.asJS(depth) + "\n" + baseIndent + "}"), this.isUndefined(this.finallySeq) || (str += " finally {\n" + indent + this.finallySeq.asJS(depth) + "\n" + baseIndent + "}"), str
                    }
                }
            },
            func: {
                className: "Function",
                rules: [":pos", "trans:body", "trans*:args"],
                debugging: {
                    printConstruction: function() {
                        return this.printConstructorCall(this.pos, this.body, this.args.collect(function(ea) {
                            return '"' + ea.name + '"'
                        }))
                    },
                    toString: function() {
                        return Strings.format("%s(function %s(%s) %s)", this.constructor.name, this.name(), this.argNames().join(","), this.body)
                    }
                },
                conversion: {
                    asJS: function(depth) {
                        return Strings.format("function%s(%s) {\n%s\n}", this.name() ? " " + this.name() : "", this.argNames().join(","), this.indent(depth + 1) + this.body.asJS(depth + 1))
                    }
                },
                accessing: {
                    name: function() {
                        return this._parent && this._parent.isVarDeclaration ? this._parent.name : void 0
                    },
                    parentFunction: function() {
                        return this
                    },
                    argNames: function() {
                        return this.args.collect(function(a) {
                            return a.name
                        })
                    },
                    statements: function() {
                        return this.body.children
                    }
                },
                stepping: {
                    firstStatement: function() {
                        return this.body.firstStatement()
                    },
                    nextStatement: function() {
                        return null
                    },
                    isComposite: function() {
                        return !0
                    }
                },
                evaluation: {
                    eval: function() {
                        return new Function(this.argNames().join(","), this.body.asJS())
                    }
                }
            },
            json: {
                className: "ObjectLiteral",
                rules: [":pos", "trans*:properties"],
                debugging: {
                    printConstruction: function() {
                        return this.printConstructorCall(this.pos, this.properties)
                    },
                    toString: function() {
                        return Strings.format("%s({%s})", this.constructor.name, this.properties.join(","))
                    }
                },
                conversion: {
                    asJS: function() {
                        return "{" + this.properties.invoke("asJS").join(",") + "}"
                    }
                }
            },
            binding: {
                className: "ObjProperty",
                rules: [":pos", ":name", "trans:property"],
                debugging: {
                    printConstruction: function() {
                        return this.printConstructorCall(this.pos, '"' + this.name + '"', this.property)
                    },
                    toString: function() {
                        return Strings.format("%s(%s: %s)", this.constructor.name, this.name, this.property)
                    }
                },
                conversion: {
                    asJS: function(depth) {
                        return Strings.format('"%s": %s', this.name, this.property.asJS(depth))
                    }
                }
            },
            jsonGetter: {
                className: "ObjPropertyGet",
                rules: [":pos", ":name", "trans:body"],
                debugging: {
                    printConstruction: function() {
                        return this.printConstructorCall(this.pos, '"' + this.name + '"', this.body)
                    },
                    toString: function() {
                        return Strings.format("%s(%s() { %s })", this.constructor.name, this.name, this.body)
                    }
                },
                conversion: {
                    asJS: function(depth) {
                        return Strings.format('get "%s"() { %s }', this.name, this.body.asJS(depth))
                    }
                }
            },
            jsonSetter: {
                className: "ObjPropertySet",
                rules: [":pos", ":name", "trans:body", ":arg"],
                debugging: {
                    printConstruction: function() {
                        return this.printConstructorCall(this.pos, '"' + this.name + '"', this.body, this.arg)
                    },
                    toString: function() {
                        return Strings.format("%s(%s(%s) { %s })", this.constructor.name, this.name, this.arg, this.body)
                    }
                },
                conversion: {
                    asJS: function(depth) {
                        return Strings.format('set "%s"(%s) { %s }', this.name, this.arg, this.body.asJS(depth))
                    }
                }
            },
            "switch": {
                className: "Switch",
                rules: [":pos", "trans:expr", "trans*:cases"],
                debugging: {
                    printConstruction: function() {
                        return this.printConstructorCall(this.pos, this.expr, this.cases)
                    },
                    toString: function() {
                        return Strings.format("%s(%s %s)", this.constructor.name, this.expr, this.cases.join("\n"))
                    }
                },
                conversion: {
                    asJS: function(depth) {
                        return Strings.format("switch (%s) {%s}", this.expr.asJS(depth), this.cases.invoke("asJS").join("\n"))
                    }
                }
            },
            "case": {
                className: "Case",
                rules: [":pos", "trans:condExpr", "trans:thenExpr"],
                debugging: {
                    printConstruction: function() {
                        return this.printConstructorCall(this.pos, this.condExpr, this.thenExpr)
                    },
                    toString: function() {
                        return Strings.format("%s(%s: %s)", this.constructor.name, this.condExpr, this.thenExpr)
                    }
                },
                conversion: {
                    asJS: function(depth) {
                        return "case " + this.condExpr.asJS(depth) + ": " + this.thenExpr.asJS(depth)
                    }
                }
            },
            "default": {
                className: "Default",
                rules: [":pos", "trans:defaultExpr"],
                debugging: {
                    printConstruction: function() {
                        return this.printConstructorCall(this.pos, this.defaultExpr)
                    },
                    toString: function() {
                        return Strings.format("%s(default: %s)", this.constructor.name, this.defaultExpr)
                    }
                },
                conversion: {
                    asJS: function(depth) {
                        return "default: " + this.defaultExpr.asJS(depth)
                    }
                }
            },
            regex: {
                className: "Regex",
                rules: [":pos", ":exprString", ":flags"],
                debugging: {
                    printConstruction: function() {
                        return this.printConstructorCall(this.pos, this.exprString, this.flags)
                    },
                    toString: function() {
                        return Strings.format("(/%s/%s)", this.exprString, this.flags)
                    }
                },
                conversion: {
                    asJS: function() {
                        return "/" + this.exprString + "/" + this.flags
                    }
                }
            },
            label: {
                className: "Label",
                rules: [":pos", ":name"],
                debugging: {
                    printConstruction: function() {
                        return this.printConstructorCall(this.pos, '"' + this.name + '"')
                    },
                    toString: function() {
                        return Strings.format("%s(%s)", this.constructor.name, this.name)
                    }
                },
                conversion: {
                    asJS: function() {
                        return this.name
                    }
                }
            },
            labelDcl: {
                className: "LabelDeclaration",
                rules: [":pos", ":name", "trans:expr"],
                debugging: {
                    printConstruction: function() {
                        return this.printConstructorCall(this.pos, '"' + this.name + '"', this.expr)
                    },
                    toString: function() {
                        return Strings.format("%s(%s is %s)", this.constructor.name, this.name, this.expr)
                    }
                },
                conversion: {
                    asJS: function(depth) {
                        return this.name + ": " + this.expr.asJS(depth)
                    }
                }
            }
        }, "rule helper", {
            rulesReturningSomething: function(ruleSpec) {
                return ruleSpec.rules ? ruleSpec.rules.reject(function(ea) {
                    return ea.startsWith(":") || !ea.include(":")
                }) : []
            },
            forCollectionRulesDo: function(ruleSpec, func) {
                var rules = this.rulesReturningSomething(ruleSpec),
                    collectionRules = rules.select(function(ea) {
                        return ea.include("*:")
                    });
                return collectionRules.forEach(function(rule) {
                    var ruleParts = rule.split("*:");
                    func.apply(this, ruleParts)
                }, this), collectionRules
            },
            forSimpleRulesDo: function(ruleSpec, func) {
                var rules = this.rulesReturningSomething(ruleSpec),
                    collectionRules = rules.select(function(ea) {
                        return ea.include("*:")
                    }),
                    simpleRules = rules.without.apply(rules, collectionRules);
                return simpleRules.forEach(function(rule) {
                    var ruleParts = rule.split(":");
                    func.apply(this, ruleParts)
                }, this), simpleRules
            }
        }, "file handling", {
            writeToFile: function(fileName, content) {
                var baseURL = URL.codeBase.withFilename(this.modulePath.replace(/\./g, "/")),
                    url = baseURL.withFilename("generated/" + fileName);
                new WebResource(url).put(content)
            }
        }, "rule creation", {
            createRule: function(name, spec) {
                var ownRules = spec.rules || [],
                    argNames = this.argsFromRules(ownRules),
                    className = this.modulePath + spec.className,
                    ruleAppString = ownRules.length > 0 ? " " + ownRules.join(" ") + "\n" : "",
                    ruleStart = name + " =\n",
                    ruleReturn = Strings.format(" -> { new %s(%s) },", className, argNames.join(", "));
                return ruleStart + ruleAppString + ruleReturn
            },
            argsFromRules: function(rules) {
                return rules ? rules.select(function(ea) {
                    return ea.include(":")
                }).collect(function(ea) {
                    return ea.split(":").last()
                }) : []
            },
            createJSTranslatorSource: function() {
                var rules = this.customRules();
                Properties.forEachOwn(this.translatorRules(), function(name, ruleSpec) {
                    rules.push(this.createRule(name, ruleSpec))
                }, this);
                var head = "ometa JSTranslator <: Parser {\n",
                    body = rules.join("\n"),
                    end = "\n}";
                return body = body.substring(0, body.length - 1), head + body + end
            },
            writeAndEvalTranslator: function() {
                var source = this.createJSTranslatorSource(),
                    translated = OMetaSupport.translateToJs(source);
                eval(translated);
                var content = Strings.format("module('users.timfelgentreff.jsinterpreter.generated.Translator').requires('ometa.lively').toRun(function() {\n%s\n});", translated);
                this.writeToFile("Translator.ometa", source), this.writeToFile("Translator.js", content)
            }
        }, "class creation", {
            assignmentsFromArgs: function(argNames) {
                return argNames.collect(function(ea) {
                    return Strings.format("   this.%s = %s;", ea, ea)
                }).join("\n")
            },
            parentCallsFromRules: function(ruleSpec) {
                var parentCalls = [];
                return this.forCollectionRulesDo(ruleSpec, function(rule, ruleVarName) {
                    var str = Strings.format("    %s.forEach(function(node) { node.setParent(this) }, this);", ruleVarName);
                    parentCalls.push(str)
                }), this.forSimpleRulesDo(ruleSpec, function(rule, ruleVarName) {
                    var str = Strings.format("    %s.setParent(this);", ruleVarName);
                    parentCalls.push(str)
                }), parentCalls.join("\n")
            },
            createASTClass: function(ruleSpec) {
                var className = this.modulePath + ruleSpec.className,
                    superclassName = this.rootNodeClassName,
                    args = this.argsFromRules(ruleSpec.rules),
                    setParentCalls = this.parentCallsFromRules(ruleSpec),
                    assignments = this.assignmentsFromArgs(args),
                    categories = [];
                categories.push(Strings.format("\n'testing', {\n  %s: true,\n}", this.genTypeProperty(ruleSpec.className))), args.length > 0 && !Properties.own(ruleSpec).include("initializing") && categories.push(Strings.format("\n'initializing', {\n  initialize: function($super, %s) {\n%s\n%s\n  },\n}", args.join(", "), assignments, setParentCalls)), Properties.own(ruleSpec).without("className", "rules").forEach(function(catName) {
                    var src = "\n'" + catName + "', {\n",
                        category = ruleSpec[catName],
                        functionNames = Functions.own(category);
                    functionNames.forEach(function(name) {
                        src += Strings.format(" %s: %s,\n", name, category[name])
                    }), src += "}", categories.push(src)
                }), categories.push(this.visitingCategoryForNode(ruleSpec));
                var body = categories.join(","),
                    def = Strings.format("%s.subclass('%s',%s)", superclassName, className, body);
                return def
            },
            genTypeProperty: function(className) {
                return "is" + className
            },
            createASTClassSourcesFromRules: function() {
                var classDefs = this.customClasses();
                return Properties.forEachOwn(this.translatorRules(), function(name, ruleSpec) {
                    classDefs.push(this.createASTClass(ruleSpec))
                }, this), classDefs.join(";\n\n")
            },
            evalAndWriteClasses: function() {
                var src = this.createASTClassSourcesFromRules();
                src += ";\n\n", src += this.abstractVisitorClassSource(), eval(src);
                var baseName = "Nodes",
                    moduleName = this.modulePath + "generated." + baseName,
                    fileName = baseName + ".js",
                    content = Strings.format("module('%s').requires().toRun(function() {\n%s\n});", moduleName, src);
                this.writeToFile(fileName, content)
            }
        }, "visitor creation", {
            abstractVisitorClassSource: function() {
                var categories = [this.visitingCategoryForAbstractVisitor()];
                return Strings.format("Object.subclass('%s',%s)", this.visitorClassName, categories.join(",\n"))
            },
            visitingCategoryForAbstractVisitor: function() {
                var src = "\n'visiting', {\n";
                return src += " visit: function(node) { return node.accept(this) },\n", Properties.forEachOwn(this.translatorRules(), function(name, ruleSpec) {
                    src += Strings.format(" visit%s: function(node) {},\n", ruleSpec.className)
                }), src += "\n}"
            },
            doubleDispatchCategoryForVisitor: function() {
                var createVisitAndAcceptCalls = function(ruleSpec) {
                        var calls = [];
                        return calls.push("   his.visit(node);"), this.forCollectionRulesDo(ruleSpec, function(rule, ruleVarName) {
                            var str = Strings.format("    node.%s.forEach(function(ea) { this.visit(ea) }, this);", ruleVarName);
                            calls.push(str)
                        }), this.forSimpleRulesDo(ruleSpec, function(rule, ruleVarName) {
                            var str = Strings.format("    this.visit(node.%s);", ruleVarName);
                            calls.push(str)
                        }), calls.join("\n")
                    }.bind(this),
                    src = "\n'double dispatch', {\n";
                return Properties.forEachOwn(this.translatorRules(), function(name, ruleSpec) {
                    src += Strings.format(" accept%s: function(node) {\n%s\n  },\n", ruleSpec.className, createVisitAndAcceptCalls(ruleSpec))
                }), src += "\n}"
            },
            visitingCategoryForNode: function(ruleSpec) {
                return "\n'visiting', {\n    accept: function(visitor) {\n        return visitor.visit" + ruleSpec.className + "(this);\n    }\n }"
            }
        }), Object.extend(users.timfelgentreff.jsinterpreter.Node, {
            placeholder: {}
        })
    }), module("users.timfelgentreff.jsinterpreter.Meta").requires("users.timfelgentreff.jsinterpreter.Parser").toRun(function() {
        Function.addMethods("meta programming interface", {
            toSource: function() {
                if (!this.source) {
                    var name = this.methodName || this.name || "anonymous";
                    this.source = this.toString().replace(/^function[^\(]*/, "function " + name)
                }
                return this.source
            },
            browse: function() {
                throw this.sourceModule && this.methodName && this.declaredClass && require("lively.ide.SystemCodeBrowser").toRun(function() {
                    return lively.ide.browse(this.declaredClass, this.methodName, this.sourceModule.name())
                }.bind(this)), new Error("Cannot browse anonymous function " + this)
            },
            updateSource: function(source) {
                var ast = users.timfelgentreff.jsinterpreter.Parser.parse(source, "functionDef"),
                    newFun = ast.val.eval();
                newFun.declaredClass = this.declaredClass, newFun.methodName = this.methodName, newFun.sourceModule = this.sourceModule, newFun.source = source, newFun.locallyChanged = !0, this.getClass().prototype[this.methodName] = newFun, lively.bindings.signal(this, "localSource", newFun), users.timfelgentreff.jsinterpreter.Meta.ChangeSet.getCurrent().addChange(newFun)
            },
            getClass: function() {
                return lively.Class.forName(this.declaredClass)
            }
        }), Object.subclass("users.timfelgentreff.jsinterpreter.Meta.ChangeSet", "initializing", {
            initialize: function() {
                this.changes = []
            }
        }, "managing", {
            addChange: function(fun) {
                this.changes.push(fun), lively.bindings.signal(this.constructor, "current", this)
            }
        }, "persistence", {
            commit: function() {
                throw new Error("not implemented yet")
            }
        }, "merging", {
            mergeWithCurrent: function() {
                throw new Error("not implemented yet")
            }
        }), Object.extend(users.timfelgentreff.jsinterpreter.Meta.ChangeSet, {
            current: null,
            getCurrent: function() {
                return this.current || (this.current = new this), this.current
            }
        })
    }), module("users.timfelgentreff.jsinterpreter.Rewriting").requires("users.timfelgentreff.jsinterpreter.Parser").toRun(function() {
        Object.extend(users.timfelgentreff.jsinterpreter, {
            oldEval: eval
        }), Object.extend(users.timfelgentreff.jsinterpreter.Rewriting, {
            table: []
        }), users.timfelgentreff.jsinterpreter.Visitor.subclass("users.timfelgentreff.jsinterpreter.Rewriting.Transformation", "helping", {
            visitNodes: function(nodes) {
                for (var result = [], i = 0; i < nodes.length; i++) {
                    var res = this.visit(nodes[i]);
                    res && result.push(res)
                }
                return result
            }
        }, "visiting", {
            visitSequence: function(node) {
                return new users.timfelgentreff.jsinterpreter.Sequence(node.pos, this.visitNodes(node.children))
            },
            visitNumber: function(node) {
                return new users.timfelgentreff.jsinterpreter.Number(node.pos, node.value)
            },
            visitString: function(node) {
                return new users.timfelgentreff.jsinterpreter.String(node.pos, node.value)
            },
            visitCond: function(node) {
                return new users.timfelgentreff.jsinterpreter.Cond(node.pos, this.visit(node.condExpr), this.visit(node.trueExpr), this.visit(node.falseExpr))
            },
            visitIf: function(node) {
                return new users.timfelgentreff.jsinterpreter.If(node.pos, this.visit(node.condExpr), this.visit(node.trueExpr), this.visit(node.falseExpr))
            },
            visitWhile: function(node) {
                return new users.timfelgentreff.jsinterpreter.While(node.pos, this.visit(node.condExpr), this.visit(node.body))
            },
            visitDoWhile: function(node) {
                return new users.timfelgentreff.jsinterpreter.DoWhile(node.pos, this.visit(node.body), this.visit(node.condExpr))
            },
            visitFor: function(node) {
                return new users.timfelgentreff.jsinterpreter.For(node.pos, this.visit(node.init), this.visit(node.condExpr), this.visit(node.body), this.visit(node.upd))
            },
            visitForIn: function(node) {
                return new users.timfelgentreff.jsinterpreter.ForIn(node.pos, this.visit(node.name), this.visit(node.obj), this.visit(node.body))
            },
            visitSet: function(node) {
                return new users.timfelgentreff.jsinterpreter.Set(node.pos, this.visit(node.left), this.visit(node.right))
            },
            visitModifyingSet: function(node) {
                return new users.timfelgentreff.jsinterpreter.ModifyingSet(node.pos, this.visit(node.left), node.name, this.visit(node.right))
            },
            visitBinaryOp: function(node) {
                return new users.timfelgentreff.jsinterpreter.BinaryOp(node.pos, node.name, this.visit(node.left), this.visit(node.right))
            },
            visitUnaryOp: function(node) {
                return new users.timfelgentreff.jsinterpreter.UnaryOp(node.pos, node.name, this.visit(node.expr))
            },
            visitPreOp: function(node) {
                return new users.timfelgentreff.jsinterpreter.PreOp(node.pos, node.name, this.visit(node.expr))
            },
            visitPostOp: function(node) {
                return new users.timfelgentreff.jsinterpreter.PostOp(node.pos, node.name, this.visit(node.expr))
            },
            visitThis: function(node) {
                return new users.timfelgentreff.jsinterpreter.This(node.pos)
            },
            visitVariable: function(node) {
                return new users.timfelgentreff.jsinterpreter.Variable(node.pos, node.name)
            },
            visitGetSlot: function(node) {
                return new users.timfelgentreff.jsinterpreter.GetSlot(node.pos, this.visit(node.slotName), this.visit(node.obj))
            },
            visitBreak: function(node) {
                return new users.timfelgentreff.jsinterpreter.Break(node.pos)
            },
            visitDebugger: function(node) {
                return new users.timfelgentreff.jsinterpreter.Debugger(node.pos)
            },
            visitContinue: function(node) {
                return new users.timfelgentreff.jsinterpreter.Continue(node.pos)
            },
            visitArrayLiteral: function(node) {
                return new users.timfelgentreff.jsinterpreter.ArrayLiteral(node.pos, this.visitNodes(node.elements))
            },
            visitReturn: function(node) {
                return new users.timfelgentreff.jsinterpreter.Return(node.pos, this.visit(node.expr))
            },
            visitWith: function() {
                throw new Error("with statement not supported")
            },
            visitSend: function(node) {
                return new users.timfelgentreff.jsinterpreter.Send(node.pos, this.visit(node.property), this.visit(node.recv), this.visitNodes(node.args))
            },
            visitCall: function(node) {
                return new users.timfelgentreff.jsinterpreter.Call(node.pos, this.visit(node.fn), this.visitNodes(node.args))
            },
            visitNew: function(node) {
                return new users.timfelgentreff.jsinterpreter.New(node.pos, this.visit(node.clsExpr))
            },
            visitVarDeclaration: function(node) {
                return new users.timfelgentreff.jsinterpreter.VarDeclaration(node.pos, node.name, this.visit(node.val))
            },
            visitThrow: function(node) {
                return new users.timfelgentreff.jsinterpreter.Throw(node.pos, this.visit(node.expr))
            },
            visitTryCatchFinally: function(node) {
                return new users.timfelgentreff.jsinterpreter.TryCatchFinally(node.pos, this.visit(node.trySeq), node.err, this.visit(node.catchSeq), this.visit(node.finallySeq))
            },
            visitFunction: function(node) {
                return new users.timfelgentreff.jsinterpreter.Function(node.pos, this.visit(node.body), this.visitNodes(node.args))
            },
            visitObjectLiteral: function(node) {
                return new users.timfelgentreff.jsinterpreter.ObjectLiteral(node.pos, this.visitNodes(node.properties))
            },
            visitObjProperty: function(node) {
                return new users.timfelgentreff.jsinterpreter.ObjProperty(node.pos, node.name, this.visit(node.property))
            },
            visitSwitch: function(node) {
                return new users.timfelgentreff.jsinterpreter.Switch(node.pos, this.visit(node.expr), this.visitNodes(node.cases))
            },
            visitCase: function(node) {
                return new users.timfelgentreff.jsinterpreter.Case(node.pos, this.visit(node.condExpr), this.visit(node.thenExpr))
            },
            visitDefault: function(node) {
                return new users.timfelgentreff.jsinterpreter.Case(node.pos, this.visit(node.defaultExpr))
            },
            visitRegex: function(node) {
                return new users.timfelgentreff.jsinterpreter.Regex(node.pos, node.exprString, node.flags)
            },
            visitObjPropertyGet: function(node) {
                return new users.timfelgentreff.jsinterpreter.ObjPropertyGet(node.pos, node.name, this.visit(node.body))
            },
            visitObjPropertySet: function(node) {
                return new users.timfelgentreff.jsinterpreter.ObjPropertySet(node.pos, node.name, this.visit(node.body), node.arg)
            }
        }), users.timfelgentreff.jsinterpreter.Rewriting.Transformation.subclass("users.timfelgentreff.jsinterpreter.Rewriting.RemoveDebugger", "visiting", {
            visitDebugger: function() {
                return void 0
            }
        }), users.timfelgentreff.jsinterpreter.Rewriting.Transformation.subclass("users.timfelgentreff.jsinterpreter.Rewriting.Rewriter", "initializing", {
            initialize: function($super) {
                $super(), this.scopes = []
            }
        }, "scoping", {
            enterScope: function() {
                this.scopes.push([])
            },
            registerVar: function(name) {
                0 != this.scopes.length && this.scopes.last().push(name)
            },
            referenceVar: function(name) {
                for (var i = this.scopes.length - 1; i >= 0; i--)
                    if (this.scopes[i].include(name)) return i;
                return void 0
            },
            exitScope: function() {
                this.scopes.pop()
            }
        }, "helping", {
            computationFrame: function() {
                return new users.timfelgentreff.jsinterpreter.Variable([0, 0], "_")
            },
            localFrame: function(i) {
                return new users.timfelgentreff.jsinterpreter.Variable([0, 0], "_" + i)
            },
            frame: function(i) {
                return 0 > i ? new users.timfelgentreff.jsinterpreter.Variable([0, 0], "Global") : new users.timfelgentreff.jsinterpreter.Variable([0, 0], "__" + i)
            },
            storeComputationResult: function(node) {
                if (0 == this.scopes.length) return node;
                var name = new users.timfelgentreff.jsinterpreter.String(node.pos, node.position()),
                    target = new users.timfelgentreff.jsinterpreter.GetSlot(node.pos, name, this.computationFrame());
                return new users.timfelgentreff.jsinterpreter.Set(node.pos, target, node)
            },
            registerArguments: function(func) {
                for (var args = [], i = 0; i < func.args.length; i++) {
                    var arg = func.args[i];
                    this.registerVar(arg.name), args.push(new users.timfelgentreff.jsinterpreter.Variable(arg.pos, arg.name))
                }
                return args
            },
            registerLocals: function(func) {
                var that = this;
                func.body.withAllChildNodesDo(function(node) {
                    return node.isFunction ? !1 : (node.isVarDeclaration && that.registerVar(node.name), !0)
                })
            }
        }, "rewriting", {
            wrapVar: function(pos, name) {
                var scope = this.referenceVar(name);
                return void 0 === scope ? new users.timfelgentreff.jsinterpreter.Variable(pos, name) : new users.timfelgentreff.jsinterpreter.GetSlot(pos, new users.timfelgentreff.jsinterpreter.String(pos, name), this.localFrame(scope))
            },
            rewriteVarDeclaration: function(pos, name, expr) {
                return new users.timfelgentreff.jsinterpreter.Set(pos, this.wrapVar(pos, name), expr)
            },
            emptyObj: function() {
                return new users.timfelgentreff.jsinterpreter.ObjectLiteral([0, 0], [])
            },
            argsInitObj: function(args) {
                for (var properties = [], i = 0; i < args.length; i++) {
                    var arg = args[i].name,
                        argVal = new users.timfelgentreff.jsinterpreter.Variable([0, 0], arg);
                    properties.push(new users.timfelgentreff.jsinterpreter.ObjProperty([0, 0], arg, argVal))
                }
                return new users.timfelgentreff.jsinterpreter.ObjectLiteral([0, 0], properties)
            },
            addPreamble: function(astIdx, body, args) {
                var p = body.pos,
                    level = this.scopes.length,
                    initComputationFrame = new users.timfelgentreff.jsinterpreter.VarDeclaration(p, "_", this.emptyObj()),
                    initLocalFrame = new users.timfelgentreff.jsinterpreter.VarDeclaration(p, "_" + level, this.argsInitObj(args)),
                    frame = new users.timfelgentreff.jsinterpreter.ArrayLiteral(p, [this.computationFrame(), this.localFrame(level), new users.timfelgentreff.jsinterpreter.Number(p, astIdx), this.frame(level - 1)]),
                    initFrame = new users.timfelgentreff.jsinterpreter.VarDeclaration(p, "__" + level, frame);
                return new users.timfelgentreff.jsinterpreter.Sequence(p, [initComputationFrame, initLocalFrame, initFrame, body])
            },
            catchExceptions: function(astIdx, body) {
                var p = body.pos,
                    level = this.scopes.length,
                    throwStmt = new users.timfelgentreff.jsinterpreter.Throw(p, new users.timfelgentreff.jsinterpreter.Variable(p, "ex")),
                    shiftStmt = new users.timfelgentreff.jsinterpreter.Send(p, new users.timfelgentreff.jsinterpreter.String(p, "shiftFrame"), new users.timfelgentreff.jsinterpreter.Variable(p, "ex"), [new users.timfelgentreff.jsinterpreter.This(p), new users.timfelgentreff.jsinterpreter.Variable(p, "__" + level)]),
                    isUnwind = new users.timfelgentreff.jsinterpreter.GetSlot(p, new users.timfelgentreff.jsinterpreter.String(p, "isUnwindException"), new users.timfelgentreff.jsinterpreter.Variable(p, "e")),
                    classExpr = new users.timfelgentreff.jsinterpreter.GetSlot(p, new users.timfelgentreff.jsinterpreter.String(p, "UnwindExecption"), new users.timfelgentreff.jsinterpreter.GetSlot(p, new users.timfelgentreff.jsinterpreter.String(p, "Rewriting"), new users.timfelgentreff.jsinterpreter.GetSlot(p, new users.timfelgentreff.jsinterpreter.String(p, "ast"), new users.timfelgentreff.jsinterpreter.Variable(p, "lively")))),
                    newUnwind = new users.timfelgentreff.jsinterpreter.New(p, new users.timfelgentreff.jsinterpreter.Call(p, classExpr, [new users.timfelgentreff.jsinterpreter.Variable(p, "e")])),
                    cond = new users.timfelgentreff.jsinterpreter.Cond(p, isUnwind, new users.timfelgentreff.jsinterpreter.Variable(p, "e"), newUnwind),
                    catchSeq = new users.timfelgentreff.jsinterpreter.Sequence(p, [new users.timfelgentreff.jsinterpreter.VarDeclaration(p, "ex", cond), shiftStmt, throwStmt]),
                    noop = new users.timfelgentreff.jsinterpreter.Variable(body.pos, "undefined"),
                    error = new users.timfelgentreff.jsinterpreter.Variable(body.pos, "e");
                return new users.timfelgentreff.jsinterpreter.TryCatchFinally(body.pos, body, error, catchSeq, noop)
            },
            wrapFunctionBody: function(astIdx, body, args) {
                return this.catchExceptions(astIdx, this.addPreamble(astIdx, body, args))
            },
            wrapClosure: function(idx, node) {
                var fn = new users.timfelgentreff.jsinterpreter.Variable(node.pos, "__createClosure"),
                    scope = this.frame(this.scopes.length - 1),
                    astIdx = new users.timfelgentreff.jsinterpreter.Number([0, 0], idx);
                return new users.timfelgentreff.jsinterpreter.Call(node.pos, fn, [astIdx, scope, node])
            }
        }, "visiting", {
            visitVarDeclaration: function(node) {
                return this.registerVar(node.name.value), this.storeComputationResult(this.rewriteVarDeclaration(node.pos, node.name, this.visit(node.val)))
            },
            visitVariable: function(node) {
                return this.wrapVar(node.pos, node.name)
            },
            visitDebugger: function(node) {
                var ret = new users.timfelgentreff.jsinterpreter.Return(node.pos, new users.timfelgentreff.jsinterpreter.String(node.pos, "Debuggger")),
                    returnDebugger = new users.timfelgentreff.jsinterpreter.Function(node.pos, new users.timfelgentreff.jsinterpreter.Sequence(node.pos, [ret]), []),
                    ast = this.storeComputationResult(returnDebugger),
                    toString = new users.timfelgentreff.jsinterpreter.ObjProperty(node.pos, "toString", ast);
                return new users.timfelgentreff.jsinterpreter.Throw(node.pos, new users.timfelgentreff.jsinterpreter.ObjectLiteral(node.pos, [toString]))
            },
            visitSet: function($super, node) {
                return this.storeComputationResult($super(node))
            },
            visitCall: function($super, node) {
                return this.storeComputationResult($super(node))
            },
            visitSend: function($super, node) {
                return this.storeComputationResult($super(node))
            },
            visitModifyingSet: function($super, node) {
                return this.storeComputationResult($super(node))
            },
            visitPreOp: function($super, node) {
                return this.storeComputationResult($super(node))
            },
            visitPostOp: function($super, node) {
                return this.storeComputationResult($super(node))
            },
            visitNew: function(node) {
                var clsExpr = this.visit(node.clsExpr);
                return clsExpr.isSet && (clsExpr = clsExpr.right), this.storeComputationResult(new users.timfelgentreff.jsinterpreter.New(node.pos, clsExpr))
            },
            visitFunction: function($super, node) {
                this.enterScope();
                var args = this.registerArguments(node);
                this.registerLocals(node);
                var rewritten = new users.timfelgentreff.jsinterpreter.Function(node.pos, this.visit(node.body), args);
                this.exitScope(), users.timfelgentreff.jsinterpreter.Rewriting.table.push(node);
                var idx = users.timfelgentreff.jsinterpreter.Rewriting.table.length - 1;
                return rewritten.body = this.wrapFunctionBody(idx, rewritten.body, rewritten.args), this.storeComputationResult(this.wrapClosure(idx, rewritten))
            }
        }), Object.subclass("users.timfelgentreff.jsinterpreter.Rewriting.UnwindExecption", "settings", {
            isUnwindException: !0
        }, "initializing", {
            initialize: function(error) {
                this.error = error
            }
        }, "printing", {
            toString: function() {
                return this.error.toString()
            }
        }, "frames", {
            shiftFrame: function(thiz, frame) {
                var computationFrame = frame[0],
                    localFrame = frame[1];
                localFrame["this"] = thiz;
                var astIndex = frame[2],
                    scope = frame[3],
                    stackFrame = [computationFrame, localFrame, astIndex, Global, scope];
                return this.top ? (this.last[3] = stackFrame, this.last = stackFrame, void 0) : (this.top = this.last = stackFrame, void 0)
            }
        }), Object.extend(Global, {
            __createClosure: function(idx, scope, f) {
                return f._cachedAst = users.timfelgentreff.jsinterpreter.Rewriting.table[idx], f._cachedScope = scope, f
            },
            eval2: function(src) {
                var ast = users.timfelgentreff.jsinterpreter.Parser.parse(src, "topLevel"),
                    wrapped = new users.timfelgentreff.jsinterpreter.Function([0, 0], ast, []);
                wrapped.source = src;
                var rewriter = new users.timfelgentreff.jsinterpreter.Rewriting.Rewriter,
                    rewrittenAst = rewriter.visit(wrapped);
                return users.timfelgentreff.jsinterpreter.oldEval(rewrittenAst.asJS())()
            }
        }), Object.extend(JSLoader, {
            loadJs2: function(url, onLoadCb, loadSync, okToUseCache, cacheQuery) {
                var exactUrl = url;
                exactUrl.indexOf("!svn") <= 0 && !okToUseCache && (exactUrl = this.makeUncached(exactUrl, cacheQuery)), $.ajax(exactUrl, {
                    success: users.timfelgentreff.jsinterpreter.Rewriting.loadJS.bind(users.timfelgentreff.jsinterpreter.Rewriting, onLoadCb)
                })
            }
        }), Object.extend(users.timfelgentreff.jsinterpreter.Rewriting, {
            loadJS: function(cb, src) {
                src || (src = cb, cb = null), eval(src), cb && cb()
            }
        })
    }), module("users.timfelgentreff.jsinterpreter.Interpreter").requires("users.timfelgentreff.jsinterpreter.Parser", "users.timfelgentreff.jsinterpreter.Meta", "users.timfelgentreff.jsinterpreter.Rewriting").toRun(function() {
        Object.subclass("users.timfelgentreff.jsinterpreter.Interpreter.Frame", "initialization", {
            initialize: function(func, mapping) {
                this.func = func, this.mapping = mapping || {}, this.returnTriggered = !1, this.breakTriggered = !1, this.continueTriggered = !1, this.findSetterMode = !1, this.breakAtCalls = !1, this.pc = null, this.bp = null, this.values = {}
            },
            newScope: function(mapping) {
                var newFrame = new users.timfelgentreff.jsinterpreter.Interpreter.Frame(mapping);
                return newFrame.setContainingScope(this), newFrame
            },
            breakAtFirstStatement: function() {
                this.bp = this.func.ast().firstStatement()
            }
        }, "accessing", {
            setContainingScope: function(frame) {
                return this.containingScope = frame
            },
            getContainingScope: function() {
                return this.containingScope
            },
            getCaller: function() {
                return this.caller
            },
            setCaller: function(caller) {
                caller && (this.caller = caller, caller.callee = this, caller.breakAtCalls && this.breakAtFirstStatement())
            },
            setThis: function(thisObj) {
                return this.addToMapping("this", thisObj), thisObj
            },
            getThis: function() {
                return this.mapping["this"] ? this.mapping["this"] : Global
            },
            setArguments: function(argValues) {
                for (var argNames = this.func.ast().argNames(), i = 0; i < argNames.length; i++) this.addToMapping(argNames[i], argValues[i]);
                return this.arguments = argValues
            },
            getArguments: function() {
                return this.arguments
            },
            getFuncName: function() {
                return this.func ? this.func.getOriginal().qualifiedMethodName() : "frame has no function!"
            },
            getFuncSource: function() {
                return this.func ? this.func.getOriginal().toSource() : "frame has no function!"
            },
            findFrame: function(name) {
                if (this.mapping.hasOwnProperty(name)) return {
                    val: this.mapping[name],
                    frame: this
                };
                if (this.mapping === Global) throw new ReferenceError(name + " is not defined");
                var mapping = this.func.getVarMapping();
                if (mapping && mapping.hasOwnProperty(name)) return {
                    val: mapping[name],
                    frame: this
                };
                var containingScope = this.getContainingScope();
                return containingScope ? containingScope.findFrame(name) : null
            },
            lookup: function(name) {
                if ("undefined" === name) return void 0;
                if ("null" === name) return null;
                if ("true" === name) return !0;
                if ("false" === name) return !1;
                if ("NaN" === name) return 0 / 0;
                if ("arguments" === name) return this.getArguments();
                var frame = this.findFrame(name);
                return frame ? frame.val : void 0
            },
            addToMapping: function(name, value) {
                return this.mapping[name] = value
            },
            addAllToMapping: function(otherMapping) {
                for (var name in otherMapping) otherMapping.hasOwnProperty(name) && (this.mapping[name] = otherMapping[name])
            },
            triggerReturn: function() {
                this.returnTriggered = !0
            },
            triggerBreak: function() {
                this.breakTriggered = !0
            },
            stopBreak: function() {
                this.breakTriggered = !1
            },
            triggerContinue: function() {
                this.continueTriggered = !0
            },
            stopContinue: function() {
                this.continueTriggered = !1
            }
        }, "accessing for UI", {
            listItemsForIntrospection: function() {
                var items = Properties.forEachOwn(this.mapping, function(name, value) {
                    return {
                        isListItem: !0,
                        string: name + ": " + String(value).truncate(50),
                        value: value
                    }
                });
                return this.containingScope && (items.push({
                    isListItem: !0,
                    string: "[[containing scope]]"
                }), items.pushAll(this.containingScope.listItemsForIntrospection())), items
            }
        }, "program counter", {
            halt: function() {
                if (this.unbreak(), users.timfelgentreff.jsinterpreter.halt(this)) throw {
                    isUnwindException: !0,
                    topFrame: this,
                    toString: function() {
                        return "Debugger"
                    }
                }
            },
            haltAtNextStatement: function() {
                if (this.pc === this.func.ast()) {
                    var caller = this.getCaller();
                    caller && caller.isResuming() && caller.haltAtNextStatement()
                } else {
                    var nextStmt = this.pc.nextStatement();
                    this.bp = nextStmt ? nextStmt : this.func.ast()
                }
            },
            stepToNextStatement: function(breakAtCalls) {
                return this.haltAtNextStatement(), this.resume(breakAtCalls)
            },
            hasNextStatement: function() {
                return null != this.pc.nextStatement()
            },
            restart: function() {
                this.initialize(this.func, this.mapping), this.breakAtFirstStatement(), this.resume()
            }
        }, "resuming", {
            isResuming: function() {
                return null !== this.pc || null !== this.bp
            },
            resumesNow: function() {
                this.pc = null
            },
            isBreakingAt: function(node) {
                return null === this.bp ? !1 : this.bp === node ? !0 : this.bp == node.nextStatement() ? !1 : node.isAfter(this.bp)
            },
            findPC: function() {
                if (!Object.isEmpty(this.values)) {
                    var last = Object.keys(this.values).max(function(k) {
                            var fromTo = k.split("-");
                            return +fromTo[1] << 23 - +fromTo[0]
                        }),
                        node = this.func.ast().nodesMatching(function(node) {
                            return last == node.position()
                        })[0];
                    if (node.isDebugger) return this.pc = node;
                    var pc = null,
                        foundNode = !1;
                    this.func.ast().withAllChildNodesDoPostOrder(function(n) {
                        if (foundNode) {
                            if (n.isCall || n.isSend || n.isSet || n.isModifyingSet || n.isPreOp || n.isPostOp) return pc = n, !1
                        } else n === node && (foundNode = !0);
                        return !0
                    }), this.pc = pc || this.func.ast()
                }
            },
            setPC: function(node) {
                this.pc = node.isFunction ? node : node.firstStatement(), this.isBreakingAt(node) && this.halt()
            },
            getValue: function(node) {
                var value = this.values[node.position()];
                return value ? value : this.setPC(node)
            },
            putValue: function(node, value) {
                return this.values[node.position()] = {
                    val: value
                }
            },
            removeValue: function(node) {
                var that = this;
                node.withAllChildNodesDo(function(child) {
                    return delete that.values[child.position()], !0
                })
            },
            resume: function(breakAtCalls) {
                this.breakAtCalls = breakAtCalls ? !0 : !1;
                var result = this.func.ast().resume(this);
                return this.getCaller() && this.getCaller().isResuming() && this.getCaller().putValue(this.getCaller().pc, result), this.setPC(this.func.ast()), this.getCaller() && this.getCaller().isResuming() ? this.getCaller().resume(breakAtCalls) : result
            },
            unbreak: function() {
                this.bp = null, this.getCaller() && this.getCaller().unbreak()
            }
        }, "debugging", {
            toString: function() {
                var mappings = [];
                for (var name in this.mapping) this.mapping.hasOwnProperty(name) && mappings.push(name + ": " + this.mapping[name]);
                var mappingString = "{" + mappings.join(",") + "}";
                return "Frame(" + mappingString + ")"
            }
        }), Object.extend(users.timfelgentreff.jsinterpreter.Interpreter.Frame, {
            create: function(func, mapping) {
                return new users.timfelgentreff.jsinterpreter.Interpreter.Frame(func, mapping || {})
            },
            global: function() {
                return this.create(null, Global)
            },
            fromTraceNode: function(trace) {
                var frame;
                return trace.frame ? frame = trace.frame : (frame = users.timfelgentreff.jsinterpreter.Interpreter.Frame.create(trace.method), frame.setThis(trace.itsThis), frame.setArguments(trace.args)), trace.caller && !trace.caller.isRoot && frame.setCaller(users.timfelgentreff.jsinterpreter.Interpreter.Frame.fromTraceNode(trace.caller)), frame
            },
            fromScope: function(scope, callstack) {
                if (scope === Global) return users.timfelgentreff.jsinterpreter.Interpreter.Frame.global();
                var ast = users.timfelgentreff.jsinterpreter.Rewriting.table[scope[2]],
                    frame = new users.timfelgentreff.jsinterpreter.Interpreter.Frame(ast.asFunction(), scope[1]),
                    parent = users.timfelgentreff.jsinterpreter.Interpreter.Frame.fromScope(scope[3], callstack);
                return callstack ? (frame.values = scope[0], frame.findPC(), scope[3] !== Global && frame.setCaller(parent), scope[4] !== Global && frame.setContainingScope(users.timfelgentreff.jsinterpreter.Interpreter.Frame.fromScope(scope[4]))) : frame.setContainingScope(parent), frame
            }
        }), users.timfelgentreff.jsinterpreter.Visitor.subclass("users.timfelgentreff.jsinterpreter.InterpreterVisitor", "interface", {
            run: function(node, optMapping) {
                return this.runWithFrame(node, users.timfelgentreff.jsinterpreter.Interpreter.Frame.create(null, optMapping))
            },
            runWithFrame: function(node, frame) {
                return this.currentFrame = frame, this.visit(node)
            }
        }, "invoking", {
            isNative: function(func) {
                return this._nativeFuncRegex || (this._nativeFuncRegex = /\{\s+\[native\scode\]\s+\}$/), this._nativeFuncRegex.test(func.toString())
            },
            shouldInterpret: function(frame, func) {
                return this.isNative(func) ? !1 : func.hasOwnProperty("forInterpretation") || frame.breakAtCalls || func.containsDebugger()
            },
            invoke: function(node, recv, func, argValues) {
                var isNew = node._parent && node._parent.isNew;
                if (this.currentFrame.setPC(node), recv && Object.isFunction(recv) && func === Function.prototype.apply && (func = recv, recv = argValues.shift(), argValues = argValues[0]), this.shouldInterpret(this.currentFrame, func) && (func = func.forInterpretation()), isNew) {
                    if (this.isNative(func)) return new func;
                    recv = this.newObject(func)
                }
                var result = func.apply(recv, argValues);
                return isNew ? recv : result
            },
            newObject: function(func) {
                function constructor() {}
                var proto = func.prototype;
                constructor.prototype = proto;
                var newObj = new constructor;
                return newObj.constructor = func, newObj
            }
        }, "visiting", {
            visit: function(node) {
                var value = this.currentFrame.getValue(node);
                return value || (value = this.currentFrame.putValue(node, node.accept(this))), value.val
            },
            visitSequence: function(node) {
                for (var result, frame = this.currentFrame, i = 0; i < node.children.length; i++)
                    if (result = this.visit(node.children[i]), frame.returnTriggered || frame.breakTriggered || frame.continueTriggered) return result;
                return result
            },
            visitNumber: function(node) {
                return node.value
            },
            visitString: function(node) {
                return node.value
            },
            visitCond: function(node) {
                var condVal = (this.currentFrame, this.visit(node.condExpr));
                return condVal ? this.visit(node.trueExpr) : this.visit(node.falseExpr)
            },
            visitIf: function(node) {
                return this.visitCond(node)
            },
            visitWhile: function(node) {
                for (var result, frame = this.currentFrame; this.visit(node.condExpr);) {
                    if (result = this.visit(node.body), frame.continueTriggered && frame.stopContinue(), frame.breakTriggered) {
                        frame.stopBreak();
                        break
                    }
                    if (frame.returnTriggered) return result;
                    frame.removeValue(node.condExpr), frame.removeValue(node.body)
                }
                return result
            },
            visitDoWhile: function(node) {
                var result, condResult, frame = this.currentFrame;
                do {
                    if (frame.removeValue(node.condExpr), result = this.visit(node.body), frame.continueTriggered && frame.stopContinue(), frame.breakTriggered) {
                        frame.stopBreak();
                        break
                    }
                    if (frame.returnTriggered) return result;
                    condResult = this.visit(node.condExpr), frame.removeValue(node.body)
                } while (condResult);
                return result
            },
            visitFor: function(node) {
                var result, frame = this.currentFrame;
                for (this.visit(node.init); this.visit(node.condExpr);) {
                    if (result = this.visit(node.body), frame.continueTriggered && frame.stopContinue(), frame.breakTriggered) {
                        frame.stopBreak();
                        break
                    }
                    if (frame.returnTriggered) return result;
                    this.visit(node.upd), frame.removeValue(node.condExpr), frame.removeValue(node.body), frame.removeValue(node.upd)
                }
                return result
            },
            visitForIn: function(node) {
                var result, frame = this.currentFrame,
                    varPart = node.name,
                    obj = this.visit(node.obj);
                varPart.isVarDeclaration && (varPart.val.name = varPart.name);
                for (var name in obj) {
                    if (frame.addToMapping(varPart.name, name), result = this.visit(node.body), frame.continueTriggered && frame.stopContinue(), frame.breakTriggered) {
                        frame.stopBreak();
                        break
                    }
                    if (frame.returnTriggered) return result;
                    frame.removeValue(node.body)
                }
                return result
            },
            visitSet: function(node) {
                var frame = this.currentFrame;
                return node.left.set(this.visit(node.right), frame, this)
            },
            visitModifyingSet: function(node) {
                var newValue, frame = this.currentFrame,
                    op = node.name + "=",
                    oldValue = this.visit(node.left);
                switch (op) {
                    case "+=":
                        newValue = oldValue + this.visit(node.right);
                        break;
                    case "-=":
                        newValue = oldValue - this.visit(node.right);
                        break;
                    case "*=":
                        newValue = oldValue * this.visit(node.right);
                        break;
                    case "/=":
                        newValue = oldValue / this.visit(node.right);
                        break;
                    case ">>=":
                        newValue = oldValue >>= this.visit(node.right);
                        break;
                    case "<<=":
                        newValue = oldValue <<= this.visit(node.right);
                        break;
                    case ">>>=":
                        newValue = oldValue >>> this.visit(node.right);
                        break;
                    case "&=":
                        newValue = oldValue & this.visit(node.right);
                        break;
                    case "|=":
                        newValue = oldValue | this.visit(node.right);
                        break;
                    case "&=":
                        newValue = oldValue & this.visit(node.right);
                        break;
                    case "^=":
                        newValue = oldValue ^ this.visit(node.right);
                        break;
                    case "||=":
                        newValue = oldValue || this.visit(node.right);
                        break;
                    case "&&=":
                        newValue = oldValue && this.visit(node.right);
                        break;
                    default:
                        throw new Error("Modifying set has unknown operation " + op)
                }
                return node.left.set(newValue, frame, this)
            },
            visitBinaryOp: function(node) {
                var leftVal = (this.currentFrame, this.visit(node.left));
                switch (node.name) {
                    case "||":
                        return leftVal || this.visit(node.right);
                    case "&&":
                        return leftVal && this.visit(node.right)
                }
                var rightVal = this.visit(node.right);
                switch (node.name) {
                    case "+":
                        return leftVal + rightVal;
                    case "-":
                        return leftVal - rightVal;
                    case "*":
                        return leftVal * rightVal;
                    case "/":
                        return leftVal / rightVal;
                    case "%":
                        return leftVal % rightVal;
                    case "<":
                        return rightVal > leftVal;
                    case "<=":
                        return rightVal >= leftVal;
                    case ">":
                        return leftVal > rightVal;
                    case ">=":
                        return leftVal >= rightVal;
                    case "==":
                        return leftVal == rightVal;
                    case "===":
                        return leftVal === rightVal;
                    case "!=":
                        return leftVal != rightVal;
                    case "!==":
                        return leftVal !== rightVal;
                    case "&":
                        return leftVal & rightVal;
                    case "|":
                        return leftVal | rightVal;
                    case "^":
                        return leftVal ^ rightVal;
                    case ">>":
                        return leftVal >> rightVal;
                    case "<<":
                        return leftVal << rightVal;
                    case ">>>":
                        return leftVal >>> rightVal;
                    case "in":
                        return leftVal in rightVal;
                    case "instanceof":
                        return leftVal instanceof rightVal;
                    default:
                        throw new Error("No semantics for binary op " + node.name)
                }
            },
            visitUnaryOp: function(node) {
                var val = (this.currentFrame, this.visit(node.expr));
                switch (node.name) {
                    case "-":
                        return -val;
                    case "!":
                        return !val;
                    case "~":
                        return ~val;
                    case "typeof":
                        return typeof val;
                    default:
                        throw new Error("No semantics for unary op " + node.name)
                }
            },
            visitPreOp: function(node) {
                var frame = this.currentFrame,
                    setExpr = node.expr;
                if (!setExpr.isVariable && !setExpr.isGetSlot) throw new Error("Invalid expr in pre op " + setExpr);
                var newValue, value = this.visit(setExpr);
                switch (node.name) {
                    case "++":
                        newValue = value + 1;
                        break;
                    case "--":
                        newValue = value - 1;
                        break;
                    default:
                        throw new Error("No semantics for pre op " + node.name)
                }
                return setExpr.set(newValue, frame, this), newValue
            },
            visitPostOp: function(node) {
                var frame = this.currentFrame,
                    setExpr = node.expr;
                if (!setExpr.isVariable && !setExpr.isGetSlot) throw dbgOn(new Error("Invalid expr in post op " + setExpr));
                var newValue, value = this.visit(setExpr);
                switch (node.name) {
                    case "++":
                        newValue = value + 1;
                        break;
                    case "--":
                        newValue = value - 1;
                        break;
                    default:
                        throw new Error("No semantics for post op " + node.name)
                }
                return setExpr.set(newValue, frame, this), value
            },
            visitThis: function() {
                return this.currentFrame.getThis()
            },
            visitVariable: function(node) {
                return this.currentFrame.lookup(node.name)
            },
            visitGetSlot: function(node) {
                var obj = this.visit(node.obj),
                    name = this.visit(node.slotName),
                    value = obj[name];
                return value
            },
            visitBreak: function() {
                this.currentFrame.triggerBreak()
            },
            visitContinue: function() {
                this.currentFrame.triggerContinue()
            },
            visitDebugger: function($super, node) {
                this.currentFrame.putValue(node, 1), this.currentFrame.halt(node, !0)
            },
            visitArrayLiteral: function(node) {
                for (var result = new Array(node.elements.length), i = 0; i < node.elements.length; i++) result[i] = this.visit(node.elements[i]);
                return result
            },
            visitReturn: function(node) {
                var frame = this.currentFrame,
                    val = this.visit(node.expr);
                return frame.triggerReturn(), val
            },
            visitWith: function() {
                throw new Error("with statement not yet supported")
            },
            visitSend: function(node) {
                var recv = this.visit(node.recv),
                    property = this.visit(node.property),
                    argValues = node.args.collect(function(ea) {
                        return this.visit(ea)
                    }, this);
                return this.invoke(node, recv, recv[property], argValues)
            },
            visitCall: function(node) {
                var func = this.visit(node.fn),
                    argValues = node.args.collect(function(ea) {
                        return this.visit(ea)
                    }, this);
                return this.invoke(node, void 0, func, argValues)
            },
            visitNew: function(node) {
                return this.visit(node.clsExpr)
            },
            visitVarDeclaration: function(node) {
                var frame = this.currentFrame,
                    val = this.visit(node.val);
                return frame.addToMapping(node.name, val), val
            },
            visitThrow: function(node) {
                var exceptionObj = (this.currentFrame, this.visit(node.expr));
                throw exceptionObj
            },
            visitTryCatchFinally: function(node) {
                var result, frame = this.currentFrame;
                try {
                    result = this.visit(node.trySeq)
                } catch (e) {
                    frame.addToMapping(node.err.name, e), result = this.visit(node.catchSeq)
                } finally {
                    node.finallySeq.isVariable && "undefined" == node.finallySeq.name || (result = this.visit(node.finallySeq))
                }
                return result
            },
            visitFunction: function(node) {
                var frame = this.currentFrame;
                return Object.isString(node.name) && frame.addToMapping(node.name, node), node.prototype || (node.prototype = {}), node.lexicalScope = frame, node.asFunction()
            },
            visitObjectLiteral: function(node) {
                for (var obj = (this.currentFrame, {}), i = 0; i < node.properties.length; i++) {
                    var name = node.properties[i].name,
                        prop = this.visit(node.properties[i].property);
                    obj[name] = prop
                }
                return obj
            },
            visitObjProperty: function() {
                throw new Error("?????")
            },
            visitSwitch: function(node) {
                for (var result, frame = this.currentFrame, val = this.visit(node.expr), caseMatched = !1, i = 0; i < node.cases.length; i++)
                    if (node.cases[i].prevCaseMatched = caseMatched, node.cases[i].switchValue = val, result = this.visit(node.cases[i]), caseMatched = void 0 !== result, frame.breakTriggered) {
                        frame.stopBreak();
                        break
                    }
                return result
            },
            visitCase: function(node) {
                return node.prevCaseMatched || node.switchValue == this.visit(node.condExpr) ? this.visit(node.thenExpr) : void 0
            },
            visitDefault: function(node) {
                return node.prevCaseMatched ? void 0 : this.visit(node.defaultExpr)
            },
            visitRegex: function(node) {
                return new RegExp(node.exprString, node.flags)
            }
        }), users.timfelgentreff.jsinterpreter.Node.addMethods("interpretation", {
            position: function() {
                return this.pos[0] + "-" + this.pos[1]
            },
            startInterpretation: function(optMapping) {
                var interpreter = new users.timfelgentreff.jsinterpreter.InterpreterVisitor;
                return interpreter.run(this, optMapping)
            },
            toSource: function() {
                return this.toString()
            },
            parentSource: function() {
                return this.source ? this.source : this.hasParent() ? this.getParent().parentSource() : this.toSource()
            }
        }), users.timfelgentreff.jsinterpreter.Variable.addMethods("interpretation", {
            set: function(value, frame) {
                var search = frame.findFrame(this.name),
                    scope = search ? search.frame : users.timfelgentreff.jsinterpreter.Interpreter.Frame.global();
                return scope.addToMapping(this.name, value)
            }
        }), users.timfelgentreff.jsinterpreter.GetSlot.addMethods("interpretation", {
            set: function(value, frame, interpreter) {
                var obj = interpreter.visit(this.obj),
                    name = interpreter.visit(this.slotName);
                return obj[name] = value
            }
        }), users.timfelgentreff.jsinterpreter.Function.addMethods("interpretation", {
            position: function() {
                return this.pos[0] + "-" + this.pos[1]
            },
            basicApply: function(frame) {
                var interpreter = new users.timfelgentreff.jsinterpreter.InterpreterVisitor;
                try {
                    return users.timfelgentreff.jsinterpreter.Interpreter.Frame.top = frame, interpreter.runWithFrame(this.body, frame)
                } finally {
                    users.timfelgentreff.jsinterpreter.Interpreter.Frame.top = null
                }
            },
            apply: function(thisObj, argValues, startHalted) {
                var calledFunction = this.asFunction(),
                    mapping = Object.extend({}, calledFunction.getVarMapping()),
                    argNames = this.argNames();
                mapping.$super && "$super" == argNames[0] && argValues.unshift(mapping.$super);
                var scope = this.lexicalScope ? this.lexicalScope : users.timfelgentreff.jsinterpreter.Interpreter.Frame.global(),
                    newFrame = scope.newScope(calledFunction, mapping);
                return void 0 !== thisObj && newFrame.setThis(thisObj), newFrame.setArguments(argValues), newFrame.setCaller(users.timfelgentreff.jsinterpreter.Interpreter.Frame.top), startHalted && newFrame.breakAtFirstStatement(), this.basicApply(newFrame)
            },
            asFunction: function(optFunc) {
                function fn() {
                    return that.apply(this, Array.from(arguments))
                }
                if (this._chachedFunction) return this._chachedFunction;
                var that = this;
                return fn.methodName = this.name(), fn.forInterpretation = function() {
                    return fn
                }, fn.ast = function() {
                    return that
                }, fn.startHalted = function() {
                    return function() {
                        return that.apply(this, Array.from(arguments), !0)
                    }
                }, fn.evaluatedSource = function() {
                    return that.parentSource()
                }, optFunc && (fn.source = optFunc.toSource(), fn.varMapping = optFunc.getVarMapping(), fn.prototype = optFunc.prototype, optFunc.declaredClass && (fn.declaredClass = optFunc.declaredClass), optFunc.methodName && (fn.methodName = optFunc.methodName), optFunc.sourceModule && (fn.sourceModule = optFunc.sourceModule), optFunc.declaredObject && (fn.declaredObject = optFunc.declaredObject), optFunc.name && (fn.methodName = optFunc.name)), this._chachedFunction = fn
            }
        }, "continued interpretation", {
            resume: function(frame) {
                return this.basicApply(frame)
            }
        }), Object.extend(users.timfelgentreff.jsinterpreter, {
            halt: function() {
                return !1
            },
            doWithHalt: function(func, halt) {
                var oldHalt = users.timfelgentreff.jsinterpreter.halt;
                users.timfelgentreff.jsinterpreter.halt = halt || Functions.True;
                try {
                    func()
                } finally {
                    users.timfelgentreff.jsinterpreter.halt = oldHalt
                }
            }
        }), users.timfelgentreff.jsinterpreter.Visitor.subclass("users.timfelgentreff.jsinterpreter.ContainsDebuggerVisitor", "visiting", {
            visitSequence: function(node) {
                for (var i = 0; i < node.children.length; i++)
                    if (this.visit(node.children[i])) return !0;
                return !1
            },
            visitNumber: function() {
                return !1
            },
            visitString: function() {
                return !1
            },
            visitCond: function(node) {
                return this.visit(node.condExpr) || this.visit(node.trueExpr) || this.visit(node.falseExpr)
            },
            visitIf: function(node) {
                return this.visitCond(node)
            },
            visitWhile: function(node) {
                return this.visit(node.condExpr) || this.visit(node.body)
            },
            visitDoWhile: function(node) {
                return this.visit(node.body) || this.visit(node.condExpr)
            },
            visitFor: function(node) {
                return this.visit(node.init) || this.visit(node.condExpr) || this.visit(node.body) || this.visit(node.upd)
            },
            visitForIn: function(node) {
                return this.visit(node.obj) || this.visit(node.body)
            },
            visitSet: function(node) {
                return this.visit(node.left) || this.visit(node.right)
            },
            visitModifyingSet: function(node) {
                return this.visit(node.left) || this.visit(node.right)
            },
            visitBinaryOp: function(node) {
                return this.visit(node.left) || this.visit(node.right)
            },
            visitUnaryOp: function(node) {
                return this.visit(node.expr)
            },
            visitPreOp: function(node) {
                return this.visit(node.expr)
            },
            visitPostOp: function(node) {
                return this.visit(node.expr)
            },
            visitThis: function() {
                return !1
            },
            visitVariable: function() {
                return !1
            },
            visitGetSlot: function() {
                return !1
            },
            visitBreak: function() {
                return !1
            },
            visitDebugger: function() {
                return !0
            },
            visitContinue: function() {
                return !1
            },
            visitArrayLiteral: function(node) {
                for (var i = 0; i < node.elements.length; i++)
                    if (this.visit(node.elements[i])) return !0;
                return !1
            },
            visitReturn: function(node) {
                return this.visit(node.expr)
            },
            visitWith: function() {
                throw new Error("with statement not yet supported")
            },
            visitSend: function(node) {
                if (this.visit(node.recv)) return !0;
                for (var i = 0; i < node.args.length; i++)
                    if (this.visit(node.args[i])) return !0;
                return !1
            },
            visitCall: function(node) {
                if (this.visit(node.fn)) return !0;
                for (var i = 0; i < node.args.length; i++)
                    if (this.visit(node.args[i])) return !0;
                return !1
            },
            visitNew: function(node) {
                return this.visit(node.clsExpr)
            },
            visitVarDeclaration: function(node) {
                return this.visit(node.val)
            },
            visitThrow: function(node) {
                return this.visit(node.expr)
            },
            visitTryCatchFinally: function(node) {
                return this.visit(node.trySeq) || this.visit(node.catchSeq) || this.visit(node.finallySeq)
            },
            visitFunction: function(node) {
                return this.visit(node.body)
            },
            visitObjectLiteral: function(node) {
                for (var i = 0; i < node.properties.length; i++)
                    if (this.visit(node.properties[i].property)) return !0;
                return !1
            },
            visitObjProperty: function() {
                return !1
            },
            visitSwitch: function(node) {
                if (this.visit(node.expr)) return !0;
                for (var i = 0; i < node.cases.length; i++)
                    if (this.visit(node.cases[i])) return !0;
                return !1
            },
            visitCase: function(node) {
                return this.visit(node.condExpr) || this.visit(node.thenExpr)
            },
            visitDefault: function(node) {
                return this.visit(node.defaultExpr)
            },
            visitRegex: function() {
                return !1
            }
        }), Function.addMethods("ast", {
            evaluatedSource: function() {
                return this.toSource()
            },
            ast: function() {
                if (this._cachedAst) return this._cachedAst;
                var parseResult = users.timfelgentreff.jsinterpreter.Parser.parse(this.toSource(), "topLevel");
                return !parseResult || Object.isString(parseResult) ? parseResult : (parseResult = parseResult.children[0], this._cachedAst = parseResult.isVarDeclaration && parseResult.val.isFunction ? parseResult.val : parseResult)
            }
        }, "debugging", {
            forInterpretation: function() {
                var funcAst = this.ast();
                return !funcAst.lexicalScope && this._cachedScope && (funcAst.lexicalScope = users.timfelgentreff.jsinterpreter.Interpreter.Frame.fromScope(this._cachedScope)), funcAst.asFunction(this)
            },
            containsDebugger: function() {
                return (new users.timfelgentreff.jsinterpreter.ContainsDebuggerVisitor).visit(this.ast())
            }
        })
    }), module("users.timfelgentreff.babelsberg.core_ext").requires().toRun(function() {
        Function.addMethods({
            varMap: function(obj) {
                return this.varMapping = obj, this
            },
            recursionGuard: function(obj, key) {
                if (!obj[key]) try {
                    obj[key] = !0, this()
                } finally {
                    obj[key] = !1
                }
            }
        }), Object.subclass("Guard", {
            initialize: function() {
                return this.counter = 0, this.lastCall = {}, this.cachedResult, this
            },
            call: function(id, func) {
                return this.counter !== this.lastCall[id] && (this.cachedResult = func(), this.lastCall[id] = this.counter), this.cachedResult
            },
            tick: function(arg) {
                arg ? this.counter = arg : this.counter++
            }
        }), Object.extend(Strings, {
            safeToString: function(obj) {
                var str, toS = Object.prototype.toString;
                try {
                    obj.toString && (str = obj.toString())
                } catch (e) {
                    str = toS.apply(obj)
                }
                return str
            }
        })
    }), module("users.timfelgentreff.babelsberg.constraintinterpreter").requires("users.timfelgentreff.jsinterpreter.Interpreter", "cop.Layers", "users.timfelgentreff.babelsberg.cassowary_ext", "users.timfelgentreff.babelsberg.deltablue_ext", "users.timfelgentreff.babelsberg.csp_ext", "users.timfelgentreff.babelsberg.core_ext", "users.timfelgentreff.babelsberg.src_transform", "users.timfelgentreff.babelsberg.babelsberg-lively", "users.timfelgentreff.sutherland.relax_bbb").toRun(function() {
        Object.subclass("Babelsberg", {
            initialize: function() {
                this.defaultSolvers = [], this.callbacks = []
            },
            isConstraintObject: !0,
            unconstrain: function(obj, accessor) {
                if (obj) {
                    var cvar = ConstrainedVariable.findConstraintVariableFor(obj, accessor);
                    if (cvar) {
                        var cGetter = obj.__lookupGetter__(accessor),
                            cSetter = obj.__lookupSetter__(accessor);
                        if (cGetter || cSetter) {
                            if (!cGetter.isConstraintAccessor || !cSetter.isConstraintAccessor) throw "too many accessors - unconstrain only works for the very simple case now";
                            ConstrainedVariable.deleteConstraintVariableFor(obj, accessor);
                            var newName = cvar.newIvarname,
                                existingSetter = obj.__lookupSetter__(newName),
                                existingGetter = obj.__lookupGetter__(newName);
                            existingGetter && obj.__defineGetter__(accessor, existingGetter), existingSetter && obj.__defineSetter__(accessor, existingSetter), existingSetter && existingGetter || delete obj[accessor], obj[accessor] = obj[newName], delete obj[newName];
                            var child = obj[accessor];
                            bbb.unconstrainAll(child)
                        }
                    }
                }
            },
            unconstrainAll: function(obj) {
                obj && obj instanceof Object && Object.keys(obj).each(function(property) {
                    var cvar = ConstrainedVariable.findConstraintVariableFor(obj, property);
                    if (cvar) {
                        var cGetter = obj.__lookupGetter__(property),
                            cSetter = obj.__lookupSetter__(property);
                        (cGetter || cSetter) && cGetter.isConstraintAccessor && cSetter.isConstraintAccessor && bbb.unconstrain(obj, property)
                    }
                })
            },
            edit: function(obj, accessors) {
                var extVars = {},
                    cVars = {},
                    solvers = [],
                    callback = function(newObj) {
                        if (newObj) {
                            var newEditConstants = newObj;
                            Object.isArray(newObj) || (newEditConstants = accessors.map(function(accessor) {
                                return newObj[accessor]
                            })), solvers.invoke("resolveArray", newEditConstants), accessors.each(function(a) {
                                cVars[a].suggestValue(cVars[a].externalValue)
                            })
                        } else {
                            for (var prop in extVars) extVars[prop].each(function(evar) {
                                evar.finishEdit()
                            });
                            solvers.invoke("endEdit")
                        }
                    };
                return accessors.each(function(accessor) {
                    var cvar = ConstrainedVariable.findConstraintVariableFor(obj, accessor);
                    if (!cvar) throw "Cannot edit " + obj + '["' + accessor + "\"], because it isn't constrained";
                    var evars = Properties.values(cvar._externalVariables);
                    if (evars.compact().length < evars.length) throw "Cannot edit " + obj + '["' + accessor + '"], because it is in a recalculate relation';
                    var hasEditSolver = cvar.solvers.any(function(s) {
                        return !Object.isFunction(s.beginEdit)
                    });
                    if (hasEditSolver) throw "Cannot edit " + obj + '["' + accessor + '"], because it is in a no-edit solver';
                    cVars[accessor] = cvar, extVars[accessor] = evars, solvers = solvers.concat(cvar.solvers).uniq(), evars.each(function(evar) {
                        evar.prepareEdit()
                    })
                }), solvers.invoke("beginEdit"), callback
            },
            readonly: function(obj) {
                return obj.isConstraintObject ? obj.setReadonly(!0) : Constraint.current && Constraint.current.solver && Properties.own(obj).each(function(ea) {
                    var cvar = ConstrainedVariable.newConstraintVariableFor(obj, ea);
                    cvar.addToConstraint(Constraint.current), cvar.ensureExternalVariableFor(Constraint.current.solver), cvar.isSolveable() && bbb.readonly(cvar.externalVariables(Constraint.current.solver))
                }), obj
            },
            always: function(opts, func) {
                var constraint = null,
                    solvers = this.chooseSolvers(opts.solver),
                    errors = [];
                return func.allowTests = opts.allowTests === !0, func.allowUnsolvableOperations = opts.allowUnsolvableOperations === !0, func.debugging = opts.debugging, func.onError = opts.onError, solvers.some(function(solver) {
                    try {
                        constraint = solver.always(opts, func)
                    } catch (e) {
                        return errors.push(e), !1
                    }
                    try {
                        opts.postponeEnabling || constraint.enable()
                    } catch (e) {
                        return errors.push(e), constraint.disable(), constraint = null, !1
                    }
                    return !0
                }), constraint || ("function" == typeof opts.onError ? bbb.addCallback(opts.onError, opts.onError.constraint, errors) : bbb.addCallback(function(e) {
                    throw e = e || new Error("No solver available!"), e.errors = Array.from(arguments), e
                }, null, errors)), bbb.processCallbacks(), constraint
            },
            stay: function(opts, func) {
                func.allowTests = opts.allowTests === !0, func.allowUnsolvableOperations = opts.allowUnsolvableOperations === !0, func.debugging = opts.debugging, func.onError = opts.onError, func.varMapping = opts.ctx;
                var solver = opts.solver || this.defaultSolver,
                    c = new Constraint(func, solver);
                return c.constraintvariables.each(function(cv) {
                    try {
                        cv.externalVariables(solver).stay(opts.priority)
                    } catch (e) {
                        console.log("Warning: could not add stay to " + cv.ivarname)
                    }
                }.bind(this)), !0
            },
            once: function(opts, func) {
                var constraint = this.always(opts, func);
                return constraint.disable(), constraint
            },
            chooseSolvers: function(optSolver) {
                return optSolver ? [optSolver] : this.defaultSolver ? [this.defaultSolver] : this.defaultSolvers.length > 0 ? this.defaultSolvers : []
            },
            addCallback: function(func, context, args) {
                this.callbacks.push({
                    func: func,
                    context: context,
                    args: args || []
                })
            },
            processCallbacks: function() {
                (function() {
                    for (; bbb.callbacks.length > 0;) {
                        var cb = bbb.callbacks.shift();
                        cb.func.apply(cb.context, cb.args)
                    }
                }).recursionGuard(bbb, "isProcessingCallbacks")
            }
        }), Object.extend(Global, {
            bbb: new Babelsberg
        }), users.timfelgentreff.jsinterpreter.Send.addMethods({get args() {
                return this._$args || []
            },
            set args(value) {
                this._$args = value
            }
        }), cop.create("ConstraintConstructionLayer").refineObject(users.timfelgentreff.jsinterpreter, {get InterpreterVisitor() {
                return ConstraintInterpreterVisitor
            }
        }).refineClass(users.timfelgentreff.jsinterpreter.Send, {
            asFunction: function(optFunc) {
                var initializer = optFunc.prototype.initialize.ast().asFunction();
                return initializer.original = optFunc, initializer
            }
        }).refineClass(users.timfelgentreff.jsinterpreter.GetSlot, {
            set: function(value, frame, interpreter) {
                var obj = interpreter.visit(this.obj),
                    name = interpreter.visit(this.slotName);
                return obj === Global || obj instanceof lively.Module ? obj[name] = value : (obj && obj.isConstraintObject && (obj = this.getConstraintObjectValue(obj)), obj[name] = value, cvar = ConstrainedVariable.newConstraintVariableFor(obj, name), Constraint.current && (cvar.ensureExternalVariableFor(Constraint.current.solver), cvar.addToConstraint(Constraint.current), cvar.isSolveable() && Constraint.current.addPrimitiveConstraint(cvar.externalVariable.cnEquals(value))), void 0)
            }
        }), Object.subclass("Constraint", {
            initialize: function(predicate, solver) {
                var constraintObject;
                this._enabled = !1, this._predicate = predicate, "function" == typeof predicate.onError && (this.onError = predicate.onError, this.onError.constraint = this), this.constraintobjects = [], this.constraintvariables = [], this.solver = solver;
                try {
                    Constraint.current = this, constraintObject = cop.withLayers([ConstraintConstructionLayer], function() {
                        return predicate.forInterpretation().apply(void 0, [])
                    })
                } finally {
                    Constraint.current = null
                }
                this.addPrimitiveConstraint(constraintObject)
            },
            addPrimitiveConstraint: function(obj) {
                "undefined" == typeof obj || this.constraintobjects.include(obj) || (obj.enable || this.haltIfDebugging(), this.constraintobjects.push(obj))
            },
            addConstraintVariable: function(v) {
                v && !this.constraintvariables.include(v) && this.constraintvariables.push(v)
            },
            get predicate() {
                return this._predicate
            },
            get allowUnsolvableOperations() {
                return this.haltIfDebugging(), !!this.predicate.allowUnsolvableOperations
            },
            haltIfDebugging: function() {
                this.predicate.debugging
            },
            get allowTests() {
                return this.haltIfDebugging(), !!this.predicate.allowTests
            },
            get priority() {
                return this._priority
            },
            set priority(value) {
                var enabled = this._enabled;
                enabled && this.disable(), this._priority = value, enabled && this.enable()
            },
            get value() {
                return this.constraintobjects.last()
            },
            enable: function() {
                if (!this._enabled) {
                    if (Constraint.enabledConstraintsGuard.tick(), this.constraintobjects.each(function(ea) {
                            this.enableConstraintObject(ea)
                        }.bind(this)), 0 === this.constraintobjects.length) throw new Error("BUG: No constraintobjects were created.");
                    this._enabled = !0, this.solver.solve(), this.constraintvariables.each(function(ea) {
                        var value = ea.getValue();
                        value != this.storedValue && (ea.updateDownstreamExternalVariables(value), ea.solveForConnectedVariables(value))
                    })
                }
            },
            enableConstraintObject: function(obj, optPriority) {
                if (obj === !0) {
                    if (!this.allowTests) throw new Error("Constraint expression returned true, but was not marked as test. If you expected this to be solveable, check that there are no operations in this that cannot be solved by the selected solver (e.g. Cassowary does not support `<', only `<='). Otherwise, if you think this is ok, you must pass `allowTests: true' as option to the constraint.");
                    this.isTest = !0
                } else if (obj === !1) {
                    if (!this.allowFailing) throw new Error("Constraint expression returned false, no solver available to fix it")
                } else {
                    if (!obj.enable) {
                        var e = new Error("Constraint expression returned an object that does not respond to #enable");
                        throw e.obj = obj, e.constraint = this, e
                    }
                    obj.solver = this.solver, obj.enable(optPriority || this._priority)
                }
            },
            disable: function() {
                this._enabled && (Constraint.enabledConstraintsGuard.tick(), this.constraintobjects.each(function(ea) {
                    try {
                        ea.disable()
                    } catch (e) {}
                }), this._enabled = !1)
            },
            recalculate: function() {
                if (this._enabled) {
                    this.isTest && !this.solver;
                    var assignments, enabled = this._enabled,
                        cvars = this.constraintvariables,
                        self = this;
                    if (enabled && this.disable(), this.initialize(this.predicate, this.solver), cvars.select(function(ea) {
                            return !this.constraintvariables.include(ea) && ea.isSolveable()
                        }.bind(this)).each(function(ea) {
                            return ea.externalVariable.removeStay()
                        }), enabled) {
                        assignments = this.constraintvariables.select(function(ea) {
                            return !cvars.include(ea) && ea.isSolveable()
                        }).collect(function(ea) {
                            return ea.externalVariable.cnIdentical(ea.getValue())
                        }), assignments.each(function(ea) {
                            try {
                                self.enableConstraintObject(ea)
                            } catch (_) {
                                self.enableConstraintObject(ea, self.solver.strength.strong)
                            }
                        });
                        try {
                            this.enable()
                        } catch (_) {
                            this._enabled = !0, this.disable(), assignments.invoke("disable"), assignments.invoke("enable", this.solver.strength && this.solver.strength.strong), this.enable()
                        } finally {
                            assignments.invoke("disable")
                        }
                    }
                }
            }
        }), Object.extend(Constraint, {set current(p) {
                return this._previous || (this._previous = []), null === p ? (this._current = this._previous.length > 0 ? this._previous.pop() : null, void 0) : (this._current && this._previous.push(this._current), this._current = p, void 0)
            },
            get current() {
                return this._current
            },
            enabledConstraintsGuard: new Guard
        }), Object.subclass("ConstrainedVariable", {
            initialize: function(obj, ivarname, optParentCVar) {
                this.__uuid__ = Strings.newUUID(), this.obj = obj, this.ivarname = ivarname, this.newIvarname = "$1$1" + ivarname, this.parentConstrainedVariable = optParentCVar, this._constraints = [], this._externalVariables = {}, this._isSolveable = !1, this._definingSolver = null;
                var solver = (obj[ivarname], this.currentSolver);
                dbgOn(!solver), this.ensureExternalVariableFor(solver), this.wrapProperties(obj, solver)
            },
            wrapProperties: function(obj, solver) {
                var existingSetter = obj.__lookupSetter__(this.ivarname),
                    existingGetter = obj.__lookupGetter__(this.ivarname);
                existingGetter && !existingGetter.isConstraintAccessor && obj.__defineGetter__(this.newIvarname, existingGetter), existingSetter && !existingSetter.isConstraintAccessor && obj.__defineSetter__(this.newIvarname, existingSetter), existingGetter || existingSetter || !this.obj.hasOwnProperty(this.ivarname) || this.setValue(obj[this.ivarname]);
                try {
                    obj.__defineGetter__(this.ivarname, function() {
                        return this.getValue()
                    }.bind(this))
                } catch (e) {}
                var newGetter = obj.__lookupGetter__(this.ivarname);
                if (!newGetter) return this.externalVariables(solver, null), void 0;
                obj.__defineSetter__(this.ivarname, function(newValue) {
                    return this.suggestValue(newValue, "source")
                }.bind(this));
                var newSetter = obj.__lookupSetter__(this.ivarname);
                newSetter && (newSetter.isConstraintAccessor = !0), newGetter && (newGetter.isConstraintAccessor = !0)
            },
            ensureExternalVariableFor: function(solver) {
                var eVar = this.externalVariables(solver),
                    value = this.obj[this.ivarname];
                eVar || null === eVar || this.externalVariables(solver, solver.constraintVariableFor(value, this.ivarname, this))
            },
            get currentSolver() {
                return Constraint.current ? Constraint.current.solver : null
            },
            suggestValue: function(value, source, force) {
                if (ConstrainedVariable.$$callingSetters) return value;
                if (force || value !== this.storedValue) {
                    var callSetters = !ConstrainedVariable.$$optionalSetters,
                        oldValue = this.storedValue,
                        solver = this.definingSolver;
                    ConstrainedVariable.$$optionalSetters = ConstrainedVariable.$$optionalSetters || [];
                    try {
                        this.solveForPrimarySolver(value, oldValue, solver, source, force), this.solveForConnectedVariables(value, oldValue, solver, source, force), this.findAndOptionallyCallSetters(callSetters)
                    } catch (e) {
                        console.error(e);
                        if (this.getValue() !== oldValue) throw "solving failed, but variable changed to " + this.getValue() + " from " + oldValue;
                        this.addErrorCallback(e)
                    } finally {
                        this.ensureClearSetters(callSetters), solver && source && this.bumpSolverWeight(solver, "down")
                    }
                    bbb.processCallbacks()
                }
                return value
            },
            solveForPrimarySolver: function(value, priorValue, solver, source) {
                this.isSolveable() && function() {
                    var wasReadonly = !1,
                        eVar = this.definingExternalVariable;
                    try {
                        solver && source && this.bumpSolverWeight(solver, "up"), wasReadonly = eVar.isReadonly(), eVar.setReadonly(!1), eVar.suggestValue(value)
                    } finally {
                        eVar.setReadonly(wasReadonly)
                    }
                }.bind(this).recursionGuard(ConstrainedVariable.isSuggestingValue, this.__uuid__)
            },
            bumpSolverWeight: function(solver, direction) {
                "up" == direction ? solver.weight += 987654321 : solver.weight -= 987654321, this.findTransitiveConnectedVariables().each(function(cvar) {
                    cvar.setDownstreamReadonly("up" == direction)
                })
            },
            solveForConnectedVariables: function(value, priorValue, solver, source, force) {
                (force || value !== this.storedValue) && function() {
                    try {
                        this.updateDownstreamVariables(value, solver), this.updateConnectedVariables(value, solver)
                    } catch (e) {
                        throw source && (this.$$isStoring = !1, this.suggestValue(priorValue, source, "force")), e
                    }
                }.bind(this).recursionGuard(this, "$$isStoring")
            },
            findAndOptionallyCallSetters: function(callSetters) {
                if (this.isSolveable()) {
                    var getterSetterPair = this.findOptionalSetter();
                    getterSetterPair && ConstrainedVariable.$$optionalSetters.push(getterSetterPair)
                }
                callSetters && this.callSetters.recursionGuard(ConstrainedVariable, "$$callingSetters")
            },
            addErrorCallback: function(e) {
                var catchingConstraint = this._constraints.find(function(constraint) {
                    return "function" == typeof constraint.onError
                });
                if (!catchingConstraint) throw e;
                bbb.addCallback(catchingConstraint.onError, catchingConstraint, [e])
            },
            callSetters: function() {
                var recvs = [],
                    setters = [];
                ConstrainedVariable.$$optionalSetters.each(function(ea) {
                    var recvIdx = recvs.indexOf(ea.recv);
                    if (-1 === recvIdx && (recvIdx = recvs.length, recvs.push(ea.recv)), setters[recvIdx] = setters[recvIdx] || [], -1 === setters[recvIdx].indexOf(ea.setter)) {
                        setters[recvIdx].push(ea.setter);
                        try {
                            ea.recv[ea.setter](ea.recv[ea.getter]())
                        } catch (e) {
                            alert(e)
                        }
                    }
                })
            },
            findOptionalSetter: function() {
                return this.setterObj ? this.setterObj : (this.setter ? this.setterObj = {
                    recv: this.recv,
                    getter: this.getter,
                    setter: this.setter
                } : this.parentConstrainedVariable && (this.setterObj = this.parentConstrainedVariable.findOptionalSetter()), this.setterObj)
            },
            ensureClearSetters: function(callSetters) {
                callSetters && (ConstrainedVariable.$$optionalSetters = null)
            },
            get getter() {
                return this.$getter
            },
            get recv() {
                return this.$recv
            },
            set getter(value) {
                if (this.$getter = value, this.recv) {
                    var setter = value.replace("get", "set");
                    Object.isFunction(this.recv[setter]) && (this.setter = setter)
                }
            },
            set recv(value) {
                if (this.$recv = value, this.getter) {
                    var setter = this.getter.replace("get", "set");
                    Object.isFunction(value[setter]) && (this.setter = setter)
                }
            },
            setDownstreamReadonly: function(bool) {
                if (bool && !this.$$downstreamReadonlyVars) {
                    var defVar = this.definingExternalVariable;
                    this.$$downstreamReadonlyVars = [], this.eachExternalVariableDo(function(eVar) {
                        eVar !== defVar && (eVar.isReadonly() || (eVar.setReadonly(!0), this.$$downstreamReadonlyVars.push(eVar)))
                    }.bind(this))
                } else !bool && this.$$downstreamReadonlyVars && (this.$$downstreamReadonlyVars.each(function(eVar) {
                    eVar.setReadonly(!1)
                }.bind(this)), this.$$downstreamReadonlyVars = null)
            },
            findTransitiveConnectedVariables: function(ary) {
                return Constraint.enabledConstraintsGuard.call(this.__uuid__, function() {
                    return this._findTransitiveConnectedVariables(ary || [])
                }.bind(this))
            },
            _findTransitiveConnectedVariables: function(ary) {
                return -1 === ary.indexOf(this) ? (ary.push(this), this._constraints.each(function(c) {
                    return c.constraintvariables.each(function(cvar) {
                        cvar.findTransitiveConnectedVariables(ary)
                    })
                }), ary) : void 0
            },
            updateConnectedVariables: function() {
                this._constraints.collect(function(c) {
                    return c.constraintvariables
                }).flatten().uniq().each(function(cvar) {
                    cvar.suggestValue(cvar.getValue())
                })
            },
            updateDownstreamVariables: function(value) {
                this.updateDownstreamExternalVariables(value), this.updateDownstreamUnsolvableVariables(value)
            },
            updateDownstreamExternalVariables: function(value) {
                var defVar = this.definingExternalVariable;
                this.eachExternalVariableDo(function(ea) {
                    if (ea !== defVar) {
                        var wasReadonly = ea.isReadonly();
                        ea.setReadonly(!1), ea.suggestValue(value), ea.setReadonly(wasReadonly)
                    }
                })
            },
            updateDownstreamUnsolvableVariables: function(value) {
                this.isValueClass() ? this.updateValueClassParts(value) : this.recalculateDownstreamConstraints(value)
            },
            recalculateDownstreamConstraints: function(value) {
                this.setValue(value), this._constraints.each(function(c) {
                    var eVar = this.externalVariables(c.solver);
                    eVar || c.recalculate()
                }.bind(this))
            },
            updateValueClassParts: function(value) {
                (function() {
                    for (key in this.storedValue[ConstrainedVariable.AttrName]) {
                        var cvar = this.storedValue[ConstrainedVariable.AttrName][key];
                        cvar.suggestValue(value[key])
                    }
                }).bind(this).recursionGuard(this, "$$valueClassUpdate")
            },
            addToConstraint: function(constraint) {
                this._constraints.include(constraint) || this._constraints.push(constraint), constraint.addConstraintVariable(this)
            },
            get definingSolver() {
                return Constraint.current || this._hasMultipleSolvers ? (this._definingSolver = null, this._searchDefiningSolver()) : this._definingSolver ? this._definingSolver : this._definingSolver = this._searchDefiningSolver()
            },
            _searchDefiningSolver: function() {
                var solver = {
                    weight: -1e3,
                    fake: !0
                };
                return this.eachExternalVariableDo(function(eVar) {
                    if (eVar) {
                        solver.fake || (this._hasMultipleSolvers = !0);
                        var s = eVar.__solver__;
                        s.weight > solver.weight && (solver = s)
                    }
                }.bind(this)), solver
            },
            get solvers() {
                var solvers = [];
                return this.eachExternalVariableDo(function(eVar) {
                    if (eVar) {
                        var s = eVar.__solver__;
                        solvers.push(s)
                    }
                }), solvers.uniq()
            },
            get definingExternalVariable() {
                return this.externalVariables(this.definingSolver)
            },
            isSolveable: function() {
                return Constraint.current ? !!this.externalVariable : this._isSolveable
            },
            _resetIsSolveable: function() {
                this._isSolveable = !!this.definingExternalVariable
            },
            isValueClass: function() {
                return !this.isSolveable() && this.storedValue instanceof lively.Point
            },
            get storedValue() {
                return this.obj[this.newIvarname]
            },
            get externalValue() {
                return this.pvtGetExternalValue(this.externalVariable)
            },
            pvtGetExternalValue: function(evar) {
                return "function" == typeof evar.value ? evar.value() : evar.value
            },
            setValue: function(value) {
                this.obj[this.newIvarname] = value
            },
            eachExternalVariableDo: function(func) {
                func.bind(this);
                for (var key in this._externalVariables) {
                    var eVar = this._externalVariables[key];
                    eVar && func(eVar)
                }
            },
            getValue: function() {
                return this.isSolveable() ? this.externalValue : this.storedValue
            },
            get externalVariable() {
                return this.currentSolver ? this.externalVariables(this.currentSolver) : this.definingExternalVariable
            },
            externalVariables: function(solver, value) {
                if (solver.__uuid__ || (solver.__uuid__ = Strings.newUUID()), 1 === arguments.length) return this._externalVariables[solver.__uuid__];
                if (value) {
                    if (value.__solver__ = value.__solver__ || solver, value.__cvar__ && value.__cvar__ !== this) throw "Inconsistent external variable. This should not happen!";
                    value.__cvar__ = this
                }
                this._externalVariables[solver.__uuid__] = value || null, this._resetIsSolveable()
            }
        }), users.timfelgentreff.jsinterpreter.InterpreterVisitor.subclass("ConstraintInterpreterVisitor", {
            binaryExpressionMap: {
                "+": ["plus", "plus"],
                "-": ["minus"],
                "*": ["times", "times"],
                "/": ["divide"],
                "%": ["modulo"],
                "==": ["cnEquals", "cnEquals"],
                "===": ["cnIdentical", "cnIdentical"],
                "<=": ["cnLeq", "cnGeq"],
                ">=": ["cnGeq", "cnLeq"],
                "<": ["cnLess", "cnGreater"],
                ">": ["cnGreater", "cnLess"],
                "||": ["cnOr", "cnOr"],
                "!=": ["cnNeq", "cnNeq"],
                "!==": ["cnNotIdentical", "cnNotIdentical"]
            },
            alternativeExpressionsMapTo: {
                "+": "-",
                "<=": "<",
                ">=": ">",
                "==": "==="
            },
            get alternativeExpressionsMap() {
                var map = {};
                return Properties.own(this.alternativeExpressionsMapTo).each(function(ea) {
                    map[this.alternativeExpressionsMapTo[ea]] = ea, map[ea] = this.alternativeExpressionsMapTo[ea]
                }.bind(this)), map
            },
            getConstraintObjectValue: function(o) {
                if (void 0 === o || !o.isConstraintObject) return o;
                var value = o.value;
                return "function" == typeof value ? value.apply(o) : value
            },
            errorIfUnsolvable: function(op, l, r, res) {
                if ("undefined" == typeof res && (res = r, r = void 0), !(l.isConstraintObject || r && r.isConstraintObject) || Constraint.current.allowUnsolvableOperations) return "function" == typeof res ? res() : res;
                var alternative, msg = "`" + op + "' not allowed on " + l;
                if (void 0 !== r) {
                    msg = "Binary op " + msg + " and " + r;
                    var altOp = this.alternativeExpressionsMap[op];
                    altOp && (l[this.binaryExpressionMap[altOp][0]] || r[this.binaryExpressionMap[altOp][1]]) && (alternative = altOp)
                }
                throw !alternative && Constraint.current.solver.alternativeOperationFor && (alternative = Constraint.current.solver.alternativeOperationFor(op)), msg += ". If you want to allow this, pass `allowUnsolvableOperations'to the constraint.", alternative && (msg += " You can also rewrite the code to use " + alternative + " instead."), new Error(msg)
            },
            visitVariable: function($super, node) {
                return $super(node)
            },
            visitCond: function($super, node) {
                var condVal = (this.currentFrame, this.visit(node.condExpr));
                if (condVal && condVal.isConstraintObject) {
                    var self = this;
                    condVal = this.getConstraintObjectValue(condVal), condVal || (condVal = cop.withoutLayers([ConstraintConstructionLayer], function() {
                        return self.visit(node.condExpr)
                    }))
                }
                return condVal ? this.visit(node.trueExpr) : this.visit(node.falseExpr)
            },
            visitUnaryOp: function($super, node) {
                var val = (this.currentFrame, this.visit(node.expr)),
                    rVal = this.getConstraintObjectValue(val),
                    msg = "Unary op `" + node.name + "'";
                switch (node.name) {
                    case "-":
                        return val && val.isConstraintObject && val.times ? val.times(-1) : this.errorIfUnsolvable(msg, val, -rVal);
                    case "!":
                        return val && val.isConstraintObject && val.not ? val.not() : !val;
                    case "~":
                        return this.errorIfUnsolvable(msg, val, ~rVal);
                    case "typeof":
                        return this.errorIfUnsolvable(msg, val, typeof rVal);
                    default:
                        throw new Error("No semantics for unary op " + node.name)
                }
            },
            invoke: function($super, node, recv, func, argValues) {
                if (!(func || recv && recv.isConstraintObject)) {
                    var error = "No such method: " + recv + "." + (node.property && node.property.value);
                    throw alert(error), new Error(error)
                }
                if (!recv || !recv.isConstraintObject) return func === Date ? new func : recv === Math ? func === Math.sqrt && argValues[0].pow || argValues[0].sqrt ? argValues[0].pow ? this.invoke(node, argValues[0], argValues[0].pow, [.5]) : this.invoke(node, argValues[0], argValues[0].sqrt, []) : func === Math.pow && argValues[0].pow ? this.invoke(node, argValues[0], argValues[0].pow, [argValues[1]]) : func === Math.sin && argValues[0].sin ? this.invoke(node, argValues[0], argValues[0].sin, []) : func === Math.cos && argValues[0].cos ? this.invoke(node, argValues[0], argValues[0].cos, []) : $super(node, recv, func, argValues.map(this.getConstraintObjectValue)) : cop.withLayers([ConstraintConstructionLayer], function() {
                    return $super(node, recv, func, argValues)
                });
                if (!func) return this.errorIfUnsolvable(node.property && node.property.value, recv, function() {
                    var value = this.getConstraintObjectValue(recv),
                        prop = this.visit(node.property);
                    return this.invoke(node, value, value[prop], argValues)
                }.bind(this));
                var forInterpretation = func.forInterpretation;
                func.forInterpretation = void 0;
                var prevNode = bbb.currentNode,
                    prevInterp = bbb.currentInterpreter;
                bbb.currentInterpreter = this, bbb.currentNode = node;
                try {
                    return cop.withoutLayers([ConstraintConstructionLayer], function() {
                        return $super(node, recv, func, argValues)
                    })
                } catch (e) {
                    return this.errorIfUnsolvable(node.property && node.property.value, recv, function() {
                        var value = this.getConstraintObjectValue(recv),
                            prop = this.visit(node.property);
                        return this.invoke(node, value, value[prop], argValues)
                    }.bind(this))
                } finally {
                    func.forInterpretation = forInterpretation, bbb.currentInterpreter = prevInterp, bbb.currentNode = prevNode
                }
            },
            visitBinaryOp: function($super, node) {
                var prevNode = bbb.currentNode,
                    prevInterp = bbb.currentInterpreter;
                bbb.currentInterpreter = this, bbb.currentNode = node;
                try {
                    return this.pvtVisitBinaryOp($super, node)
                } finally {
                    bbb.currentInterpreter = prevInterp, bbb.currentNode = prevNode
                }
            },
            pvtVisitBinaryOp: function(mySuper, node) {
                var op = node.name,
                    leftVal = this.visit(node.left),
                    rightVal = this.visit(node.right);
                void 0 === leftVal && (leftVal = 0), void 0 === rightVal && (rightVal = 0);
                var rLeftVal = leftVal && leftVal.isConstraintObject ? this.getConstraintObjectValue(leftVal) : leftVal,
                    rRightVal = rightVal && rightVal.isConstraintObject ? this.getConstraintObjectValue(rightVal) : rightVal;
                switch (node.name) {
                    case "&&":
                        if (!leftVal) return leftVal;
                        if (leftVal === !0 || leftVal.isConstraintObject) {
                            if ("function" == typeof leftVal.cnAnd) return leftVal.cnAnd(rightVal);
                            Constraint.current.addPrimitiveConstraint(leftVal)
                        } else Constraint.current.haltIfDebugging();
                        return rightVal;
                    case "-":
                        if (rightVal.isConstraintObject && rightVal.plus && Object.isNumber(leftVal)) return rightVal.plus(-leftVal);
                    case "in":
                        if ("-" != node.name) {
                            if (leftVal.isConstraintObject && leftVal.cnIn) return leftVal.cnIn(rightVal);
                            if (this.$finiteDomainProperty) {
                                var lV = this.$finiteDomainProperty;
                                if (delete this.$finiteDomainProperty, lV.cnIn) return lV.cnIn(rightVal)
                            }
                        }
                    default:
                        var method = this.binaryExpressionMap[node.name];
                        return method ? leftVal && leftVal.isConstraintObject && "function" == typeof leftVal[method[0]] ? leftVal[method[0]](rightVal) : rightVal && rightVal.isConstraintObject && "function" == typeof rightVal[method[1]] ? rightVal[method[1]](leftVal) : this.errorIfUnsolvable(op, leftVal, rightVal, eval("rLeftVal " + node.name + " rRightVal")) : this.errorIfUnsolvable(op, leftVal, rightVal, mySuper(node))
                }
            },
            visitGetSlot: function($super, node) {
                if (-1 === cop.currentLayers().indexOf(ConstraintConstructionLayer)) return $super(node);
                var cvar, obj = this.visit(node.obj),
                    name = this.visit(node.slotName),
                    cobj = obj ? obj[ConstrainedVariable.ThisAttrName] : void 0;
                if (obj === Global || obj instanceof lively.Module) return obj[name];
                if (name && name.isConstraintObject && (name = this.getConstraintObjectValue(name)), obj && obj.isConstraintObject) {
                    if (obj["cn" + name]) return obj["cn" + name];
                    "is" === name ? this.$finiteDomainProperty = obj : (cobj = obj.__cvar__, obj = this.getConstraintObjectValue(obj))
                }
                if (cvar = ConstrainedVariable.newConstraintVariableFor(obj, name, cobj), Constraint.current && (cvar.ensureExternalVariableFor(Constraint.current.solver), cvar.addToConstraint(Constraint.current)), cvar && cvar.isSolveable()) return cvar.externalVariable;
                var retval = obj[name];
                if (!retval || !retval.isConstraintObject) {
                    var objStr = Strings.safeToString(obj),
                        retStr = Strings.safeToString(retval);
                    console.log(Constraint.current.solver.constructor.name + " cannot reason about the variable", obj, name, "], a ", retStr, " of type " + ("object" == typeof retval ? retval.constructor.name : typeof retval)), Constraint.current.haltIfDebugging()
                }
                if (retval) switch (typeof retval) {
                    case "object":
                    case "function":
                        retval[ConstrainedVariable.ThisAttrName] = cvar;
                        break;
                    case "number":
                        new Number(retval)[ConstrainedVariable.ThisAttrName] = cvar;
                        break;
                    case "string":
                        new String(retval)[ConstrainedVariable.ThisAttrName] = cvar;
                        break;
                    case "boolean":
                        break;
                    default:
                        throw "Error - we cannot store the constrained var attribute on " + retval + " of type " + typeof retval
                }
                return retval
            },
            visitReturn: function($super, node) {
                var retVal = $super(node);
                if (retVal) {
                    var cvar = retVal[ConstrainedVariable.ThisAttrName];
                    if (retVal.isConstraintObject && (cvar = retVal.__cvar__), cvar) {
                        var parentFunc = node.parentFunction();
                        parentFunc && (cvar.getter = parentFunc.name(), cvar.recv = this.currentFrame.mapping["this"])
                    }
                }
                return retVal
            },
            shouldInterpret: function(frame, func) {
                if (func.sourceModule === Global.users.timfelgentreff.babelsberg.constraintinterpreter) return !1;
                if ("Babelsberg" === func.declaredClass) return !1;
                var nativeClass = lively.Class.isClass(func) && void 0 === func.superclass;
                return !(this.isNative(func) || nativeClass) && "function" == typeof func.forInterpretation
            },
            getCurrentScope: function() {
                for (var scope = {}, frame = this.currentFrame; frame;) {
                    if (frame.mapping === Global) return scope;
                    for (var key in frame.mapping) scope[key] = frame.mapping[key];
                    var mapping = frame.func.getVarMapping();
                    if (mapping)
                        for (var key in mapping) scope[key] = mapping[key];
                    frame = frame.getContainingScope()
                }
                return scope
            },
            newObject: function($super, func) {
                return func.original ? $super(func.original) : $super(func)
            }
        }), ConstrainedVariable.AttrName = "__constrainedVariables__", ConstrainedVariable.ThisAttrName = "__lastConstrainedVariableForThis__", Object.extend(ConstrainedVariable, {
            findConstraintVariableFor: function(obj, ivarname) {
                var l = obj[ConstrainedVariable.AttrName];
                return l && l[ivarname] ? l[ivarname] : null
            },
            newConstraintVariableFor: function(obj, ivarname, cobj) {
                var cvar = this.findConstraintVariableFor(obj, ivarname);
                return cvar || (cvar = new ConstrainedVariable(obj, ivarname, cobj), obj[ConstrainedVariable.AttrName] = obj[ConstrainedVariable.AttrName] || {}, obj[ConstrainedVariable.AttrName][ivarname] = cvar), cvar
            },
            deleteConstraintVariableFor: function(obj, ivarname) {
                var l = obj[ConstrainedVariable.AttrName];
                l && l[ivarname] && delete l[ivarname]
            },
            isSuggestingValue: {}
        }), Object.subclass("PrimitiveCObjectRegistry", {}), Object.extend(PrimitiveCObjectRegistry, {
            registry: {},
            set: function(obj, cobj) {
                PrimitiveCObjectRegistry.registry[obj] = cobj
            },
            get: function(obj) {
                return PrimitiveCObjectRegistry.registry[obj]
            }
        }), Number.prototype.__defineGetter__(ConstrainedVariable.ThisAttrName, function() {
            return PrimitiveCObjectRegistry.get(this + 0)
        }), Number.prototype.__defineGetter__(ConstrainedVariable.AttrName, function() {
            return {}
        }), Number.prototype.__defineSetter__(ConstrainedVariable.ThisAttrName, function(v) {
            PrimitiveCObjectRegistry.set(this + 0, v)
        }), String.prototype.__defineGetter__(ConstrainedVariable.ThisAttrName, function() {
            return PrimitiveCObjectRegistry.get(this + "")
        }), String.prototype.__defineGetter__(ConstrainedVariable.AttrName, function() {
            return {}
        }), String.prototype.__defineSetter__(ConstrainedVariable.ThisAttrName, function(v) {
            PrimitiveCObjectRegistry.set(this + "", v)
        })
    }),
    function(exports, global) {
        function array_to_hash(a) {
            for (var ret = Object.create(null), i = 0; i < a.length; ++i) ret[a[i]] = !0;
            return ret
        }

        function slice(a, start) {
            return Array.prototype.slice.call(a, start || 0)
        }

        function characters(str) {
            return str.split("")
        }

        function member(name, array) {
            for (var i = array.length; --i >= 0;)
                if (array[i] == name) return !0;
            return !1
        }

        function find_if(func, array) {
            for (var i = 0, n = array.length; n > i; ++i)
                if (func(array[i])) return array[i]
        }

        function repeat_string(str, i) {
            if (0 >= i) return "";
            if (1 == i) return str;
            var d = repeat_string(str, i >> 1);
            return d += d, 1 & i && (d += str), d
        }

        function DefaultsError(msg, defs) {
            this.msg = msg, this.defs = defs
        }

        function defaults(args, defs, croak) {
            args === !0 && (args = {});
            var ret = args || {};
            if (croak)
                for (var i in ret)
                    if (ret.hasOwnProperty(i) && !defs.hasOwnProperty(i)) throw new DefaultsError("`" + i + "` is not a supported option", defs);
            for (var i in defs) defs.hasOwnProperty(i) && (ret[i] = args && args.hasOwnProperty(i) ? args[i] : defs[i]);
            return ret
        }

        function merge(obj, ext) {
            for (var i in ext) ext.hasOwnProperty(i) && (obj[i] = ext[i]);
            return obj
        }

        function noop() {}

        function push_uniq(array, el) {
            array.indexOf(el) < 0 && array.push(el)
        }

        function string_template(text, props) {
            return text.replace(/\{(.+?)\}/g, function(str, p) {
                return props[p]
            })
        }

        function remove(array, el) {
            for (var i = array.length; --i >= 0;) array[i] === el && array.splice(i, 1)
        }

        function mergeSort(array, cmp) {
            function merge(a, b) {
                for (var r = [], ai = 0, bi = 0, i = 0; ai < a.length && bi < b.length;) r[i++] = cmp(a[ai], b[bi]) <= 0 ? a[ai++] : b[bi++];
                return ai < a.length && r.push.apply(r, a.slice(ai)), bi < b.length && r.push.apply(r, b.slice(bi)), r
            }

            function _ms(a) {
                if (a.length <= 1) return a;
                var m = Math.floor(a.length / 2),
                    left = a.slice(0, m),
                    right = a.slice(m);
                return left = _ms(left), right = _ms(right), merge(left, right)
            }
            return array.length < 2 ? array.slice() : _ms(array)
        }

        function set_difference(a, b) {
            return a.filter(function(el) {
                return b.indexOf(el) < 0
            })
        }

        function set_intersection(a, b) {
            return a.filter(function(el) {
                return b.indexOf(el) >= 0
            })
        }

        function makePredicate(words) {
            function compareTo(arr) {
                if (1 == arr.length) return f += "return str === " + JSON.stringify(arr[0]) + ";";
                f += "switch(str){";
                for (var i = 0; i < arr.length; ++i) f += "case " + JSON.stringify(arr[i]) + ":";
                f += "return true}return false;"
            }
            words instanceof Array || (words = words.split(" "));
            var f = "",
                cats = [];
            out: for (var i = 0; i < words.length; ++i) {
                for (var j = 0; j < cats.length; ++j)
                    if (cats[j][0].length == words[i].length) {
                        cats[j].push(words[i]);
                        continue out
                    }
                cats.push([words[i]])
            }
            if (cats.length > 3) {
                cats.sort(function(a, b) {
                    return b.length - a.length
                }), f += "switch(str.length){";
                for (var i = 0; i < cats.length; ++i) {
                    var cat = cats[i];
                    f += "case " + cat[0].length + ":", compareTo(cat)
                }
                f += "}"
            } else compareTo(words);
            return new Function("str", f)
        }

        function all(array, predicate) {
            for (var i = array.length; --i >= 0;)
                if (!predicate(array[i])) return !1;
            return !0
        }

        function Dictionary() {
            this._values = Object.create(null), this._size = 0
        }

        function DEFNODE(type, props, methods, base) {
            arguments.length < 4 && (base = AST_Node), props = props ? props.split(/\s+/) : [];
            var self_props = props;
            base && base.PROPS && (props = props.concat(base.PROPS));
            for (var code = "return function AST_" + type + "(props){ if (props) { ", i = props.length; --i >= 0;) code += "this." + props[i] + " = props." + props[i] + ";";
            var proto = base && new base;
            (proto && proto.initialize || methods && methods.initialize) && (code += "this.initialize();"), code += "}}";
            var ctor = new Function(code)();
            if (proto && (ctor.prototype = proto, ctor.BASE = base), base && base.SUBCLASSES.push(ctor), ctor.prototype.CTOR = ctor, ctor.PROPS = props || null, ctor.SELF_PROPS = self_props, ctor.SUBCLASSES = [], type && (ctor.prototype.TYPE = ctor.TYPE = type), methods)
                for (i in methods) methods.hasOwnProperty(i) && (/^\$/.test(i) ? ctor[i.substr(1)] = methods[i] : ctor.prototype[i] = methods[i]);
            return ctor.DEFMETHOD = function(name, method) {
                this.prototype[name] = method
            }, ctor
        }

        function walk_body(node, visitor) {
            node.body instanceof AST_Statement ? node.body._walk(visitor) : node.body.forEach(function(stat) {
                stat._walk(visitor)
            })
        }

        function TreeWalker(callback) {
            this.visit = callback, this.stack = []
        }

        function is_letter(code) {
            return code >= 97 && 122 >= code || code >= 65 && 90 >= code || code >= 170 && UNICODE.letter.test(String.fromCharCode(code))
        }

        function is_digit(code) {
            return code >= 48 && 57 >= code
        }

        function is_alphanumeric_char(code) {
            return is_digit(code) || is_letter(code)
        }

        function is_unicode_combining_mark(ch) {
            return UNICODE.non_spacing_mark.test(ch) || UNICODE.space_combining_mark.test(ch)
        }

        function is_unicode_connector_punctuation(ch) {
            return UNICODE.connector_punctuation.test(ch)
        }

        function is_identifier(name) {
            return !RESERVED_WORDS(name) && /^[a-z_$][a-z0-9_$]*$/i.test(name)
        }

        function is_identifier_start(code) {
            return 36 == code || 95 == code || is_letter(code)
        }

        function is_identifier_char(ch) {
            var code = ch.charCodeAt(0);
            return is_identifier_start(code) || is_digit(code) || 8204 == code || 8205 == code || is_unicode_combining_mark(ch) || is_unicode_connector_punctuation(ch)
        }

        function is_identifier_string(str) {
            var i = str.length;
            if (0 == i) return !1;
            if (!is_identifier_start(str.charCodeAt(0))) return !1;
            for (; --i >= 0;)
                if (!is_identifier_char(str.charAt(i))) return !1;
            return !0
        }

        function parse_js_number(num) {
            return RE_HEX_NUMBER.test(num) ? parseInt(num.substr(2), 16) : RE_OCT_NUMBER.test(num) ? parseInt(num.substr(1), 8) : RE_DEC_NUMBER.test(num) ? parseFloat(num) : void 0
        }

        function JS_Parse_Error(message, line, col, pos) {
            this.message = message, this.line = line, this.col = col, this.pos = pos, this.stack = (new Error).stack
        }

        function js_error(message, filename, line, col, pos) {
            throw new JS_Parse_Error(message, line, col, pos)
        }

        function is_token(token, type, val) {
            return token.type == type && (null == val || token.value == val)
        }

        function tokenizer($TEXT, filename, html5_comments) {
            function peek() {
                return S.text.charAt(S.pos)
            }

            function next(signal_eof, in_string) {
                var ch = S.text.charAt(S.pos++);
                if (signal_eof && !ch) throw EX_EOF;
                return "\n" == ch ? (S.newline_before = S.newline_before || !in_string, ++S.line, S.col = 0) : ++S.col, ch
            }

            function forward(i) {
                for (; i-- > 0;) next()
            }

            function looking_at(str) {
                return S.text.substr(S.pos, str.length) == str
            }

            function find(what, signal_eof) {
                var pos = S.text.indexOf(what, S.pos);
                if (signal_eof && -1 == pos) throw EX_EOF;
                return pos
            }

            function start_token() {
                S.tokline = S.line, S.tokcol = S.col, S.tokpos = S.pos
            }

            function token(type, value, is_comment) {
                S.regex_allowed = "operator" == type && !UNARY_POSTFIX(value) || "keyword" == type && KEYWORDS_BEFORE_EXPRESSION(value) || "punc" == type && PUNC_BEFORE_EXPRESSION(value), prev_was_dot = "punc" == type && "." == value;
                var ret = {
                    type: type,
                    value: value,
                    line: S.tokline,
                    col: S.tokcol,
                    pos: S.tokpos,
                    endpos: S.pos,
                    nlb: S.newline_before,
                    file: filename
                };
                if (!is_comment) {
                    ret.comments_before = S.comments_before, S.comments_before = [];
                    for (var i = 0, len = ret.comments_before.length; len > i; i++) ret.nlb = ret.nlb || ret.comments_before[i].nlb
                }
                return S.newline_before = !1, new AST_Token(ret)
            }

            function skip_whitespace() {
                for (; WHITESPACE_CHARS(peek());) next()
            }

            function read_while(pred) {
                for (var ch, ret = "", i = 0;
                    (ch = peek()) && pred(ch, i++);) ret += next();
                return ret
            }

            function parse_error(err) {
                js_error(err, filename, S.tokline, S.tokcol, S.tokpos)
            }

            function read_num(prefix) {
                var has_e = !1,
                    after_e = !1,
                    has_x = !1,
                    has_dot = "." == prefix,
                    num = read_while(function(ch, i) {
                        var code = ch.charCodeAt(0);
                        switch (code) {
                            case 120:
                            case 88:
                                return has_x ? !1 : has_x = !0;
                            case 101:
                            case 69:
                                return has_x ? !0 : has_e ? !1 : has_e = after_e = !0;
                            case 45:
                                return after_e || 0 == i && !prefix;
                            case 43:
                                return after_e;
                            case after_e = !1, 46:
                                return has_dot || has_x || has_e ? !1 : has_dot = !0
                        }
                        return is_alphanumeric_char(code)
                    });
                prefix && (num = prefix + num);
                var valid = parse_js_number(num);
                return isNaN(valid) ? (parse_error("Invalid syntax: " + num), void 0) : token("num", valid)
            }

            function read_escaped_char(in_string) {
                var ch = next(!0, in_string);
                switch (ch.charCodeAt(0)) {
                    case 110:
                        return "\n";
                    case 114:
                        return "\r";
                    case 116:
                        return "  ";
                    case 98:
                        return "\b";
                    case 118:
                        return "";
                    case 102:
                        return "\f";
                    case 48:
                        return "\x00";
                    case 120:
                        return String.fromCharCode(hex_bytes(2));
                    case 117:
                        return String.fromCharCode(hex_bytes(4));
                    case 10:
                        return "";
                    default:
                        return ch
                }
            }

            function hex_bytes(n) {
                for (var num = 0; n > 0; --n) {
                    var digit = parseInt(next(!0), 16);
                    isNaN(digit) && parse_error("Invalid hex-character pattern in string"), num = num << 4 | digit
                }
                return num
            }

            function skip_line_comment(type) {
                var ret, regex_allowed = S.regex_allowed,
                    i = find("\n");
                return -1 == i ? (ret = S.text.substr(S.pos), S.pos = S.text.length) : (ret = S.text.substring(S.pos, i), S.pos = i), S.comments_before.push(token(type, ret, !0)), S.regex_allowed = regex_allowed, next_token()
            }

            function read_name() {
                for (var ch, hex, backslash = !1, name = "", escaped = !1; null != (ch = peek());)
                    if (backslash) "u" != ch && parse_error("Expecting UnicodeEscapeSequence -- uXXXX"), ch = read_escaped_char(), is_identifier_char(ch) || parse_error("Unicode char: " + ch.charCodeAt(0) + " is not valid in identifier"), name += ch, backslash = !1;
                    else if ("\\" == ch) escaped = backslash = !0, next();
                else {
                    if (!is_identifier_char(ch)) break;
                    name += next()
                }
                return KEYWORDS(name) && escaped && (hex = name.charCodeAt(0).toString(16).toUpperCase(), name = "\\u" + "0000".substr(hex.length) + hex + name.slice(1)), name
            }

            function read_operator(prefix) {
                function grow(op) {
                    if (!peek()) return op;
                    var bigger = op + peek();
                    return OPERATORS(bigger) ? (next(), grow(bigger)) : op
                }
                return token("operator", grow(prefix || next()))
            }

            function handle_slash() {
                switch (next(), peek()) {
                    case "/":
                        return next(), skip_line_comment("comment1");
                    case "*":
                        return next(), skip_multiline_comment()
                }
                return S.regex_allowed ? read_regexp("") : read_operator("/")
            }

            function handle_dot() {
                return next(), is_digit(peek().charCodeAt(0)) ? read_num(".") : token("punc", ".")
            }

            function read_word() {
                var word = read_name();
                return prev_was_dot ? token("name", word) : KEYWORDS_ATOM(word) ? token("atom", word) : KEYWORDS(word) ? OPERATORS(word) ? token("operator", word) : token("keyword", word) : token("name", word)
            }

            function with_eof_error(eof_error, cont) {
                return function(x) {
                    try {
                        return cont(x)
                    } catch (ex) {
                        if (ex !== EX_EOF) throw ex;
                        parse_error(eof_error)
                    }
                }
            }

            function next_token(force_regexp) {
                if (null != force_regexp) return read_regexp(force_regexp);
                if (skip_whitespace(), start_token(), html5_comments) {
                    if (looking_at("<!--")) return forward(4), skip_line_comment("comment3");
                    if (looking_at("-->") && S.newline_before) return forward(3), skip_line_comment("comment4")
                }
                var ch = peek();
                if (!ch) return token("eof");
                var code = ch.charCodeAt(0);
                switch (code) {
                    case 34:
                    case 39:
                        return read_string();
                    case 46:
                        return handle_dot();
                    case 47:
                        return handle_slash()
                }
                return is_digit(code) ? read_num() : PUNC_CHARS(ch) ? token("punc", next()) : OPERATOR_CHARS(ch) ? read_operator() : 92 == code || is_identifier_start(code) ? read_word() : (parse_error("Unexpected character '" + ch + "'"), void 0)
            }
            var S = {
                    text: $TEXT.replace(/\r\n?|[\n\u2028\u2029]/g, "\n").replace(/\uFEFF/g, ""),
                    filename: filename,
                    pos: 0,
                    tokpos: 0,
                    line: 1,
                    tokline: 0,
                    col: 0,
                    tokcol: 0,
                    newline_before: !1,
                    regex_allowed: !1,
                    comments_before: []
                },
                prev_was_dot = !1,
                read_string = with_eof_error("Unterminated string constant", function() {
                    for (var quote = next(), ret = "";;) {
                        var ch = next(!0);
                        if ("\\" == ch) {
                            var octal_len = 0,
                                first = null;
                            ch = read_while(function(ch) {
                                if (ch >= "0" && "7" >= ch) {
                                    if (!first) return first = ch, ++octal_len;
                                    if ("3" >= first && 2 >= octal_len) return ++octal_len;
                                    if (first >= "4" && 1 >= octal_len) return ++octal_len
                                }
                                return !1
                            }), ch = octal_len > 0 ? String.fromCharCode(parseInt(ch, 8)) : read_escaped_char(!0)
                        } else if (ch == quote) break;
                        ret += ch
                    }
                    return token("string", ret)
                }),
                skip_multiline_comment = with_eof_error("Unterminated multiline comment", function() {
                    var regex_allowed = S.regex_allowed,
                        i = find("*/", !0),
                        text = S.text.substring(S.pos, i),
                        a = text.split("\n"),
                        n = a.length;
                    S.pos = i + 2, S.line += n - 1, n > 1 ? S.col = a[n - 1].length : S.col += a[n - 1].length, S.col += 2;
                    var nlb = S.newline_before = S.newline_before || text.indexOf("\n") >= 0;
                    return S.comments_before.push(token("comment2", text, !0)), S.regex_allowed = regex_allowed, S.newline_before = nlb, next_token()
                }),
                read_regexp = with_eof_error("Unterminated regular expression", function(regexp) {
                    for (var ch, prev_backslash = !1, in_class = !1; ch = next(!0);)
                        if (prev_backslash) regexp += "\\" + ch, prev_backslash = !1;
                        else if ("[" == ch) in_class = !0, regexp += ch;
                    else if ("]" == ch && in_class) in_class = !1, regexp += ch;
                    else {
                        if ("/" == ch && !in_class) break;
                        "\\" == ch ? prev_backslash = !0 : regexp += ch
                    }
                    var mods = read_name();
                    return token("regexp", new RegExp(regexp, mods))
                });
            return next_token.context = function(nc) {
                return nc && (S = nc), S
            }, next_token
        }

        function parse($TEXT, options) {
            function is(type, value) {
                return is_token(S.token, type, value)
            }

            function peek() {
                return S.peeked || (S.peeked = S.input())
            }

            function next() {
                return S.prev = S.token, S.peeked ? (S.token = S.peeked, S.peeked = null) : S.token = S.input(), S.in_directives = S.in_directives && ("string" == S.token.type || is("punc", ";")), S.token
            }

            function prev() {
                return S.prev
            }

            function croak(msg, line, col, pos) {
                var ctx = S.input.context();
                js_error(msg, ctx.filename, null != line ? line : ctx.tokline, null != col ? col : ctx.tokcol, null != pos ? pos : ctx.tokpos)
            }

            function token_error(token, msg) {
                croak(msg, token.line, token.col)
            }

            function unexpected(token) {
                null == token && (token = S.token), token_error(token, "Unexpected token: " + token.type + " (" + token.value + ")")
            }

            function expect_token(type, val) {
                return is(type, val) ? next() : (token_error(S.token, "Unexpected token " + S.token.type + " «" + S.token.value + "», expected " + type + " «" + val + "»"), void 0)
            }

            function expect(punc) {
                return expect_token("punc", punc)
            }

            function can_insert_semicolon() {
                return !options.strict && (S.token.nlb || is("eof") || is("punc", "}"))
            }

            function semicolon() {
                is("punc", ";") ? next() : can_insert_semicolon() || unexpected()
            }

            function parenthesised() {
                expect("(");
                var exp = expression(!0);
                return expect(")"), exp
            }

            function embed_tokens(parser) {
                return function() {
                    var start = S.token,
                        expr = parser(),
                        end = prev();
                    return expr.start = start, expr.end = end, expr
                }
            }

            function handle_regexp() {
                (is("operator", "/") || is("operator", "/=")) && (S.peeked = null, S.token = S.input(S.token.value.substr(1)))
            }

            function labeled_statement() {
                var label = as_symbol(AST_Label);
                find_if(function(l) {
                    return l.name == label.name
                }, S.labels) && croak("Label " + label.name + " defined twice"), expect(":"), S.labels.push(label);
                var stat = statement();
                return S.labels.pop(), stat instanceof AST_IterationStatement || label.references.forEach(function(ref) {
                    ref instanceof AST_Continue && (ref = ref.label.start, croak("Continue label `" + label.name + "` refers to non-IterationStatement.", ref.line, ref.col, ref.pos))
                }), new AST_LabeledStatement({
                    body: stat,
                    label: label
                })
            }

            function simple_statement(tmp) {
                return new AST_SimpleStatement({
                    body: (tmp = expression(!0), semicolon(), tmp)
                })
            }

            function break_cont(type) {
                var ldef, label = null;
                can_insert_semicolon() || (label = as_symbol(AST_LabelRef, !0)), null != label ? (ldef = find_if(function(l) {
                    return l.name == label.name
                }, S.labels), ldef || croak("Undefined label " + label.name), label.thedef = ldef) : 0 == S.in_loop && croak(type.TYPE + " not inside a loop or switch"), semicolon();
                var stat = new type({
                    label: label
                });
                return ldef && ldef.references.push(stat), stat
            }

            function for_() {
                expect("(");
                var init = null;
                return !is("punc", ";") && (init = is("keyword", "var") ? (next(), var_(!0)) : expression(!0, !0), is("operator", "in")) ? (init instanceof AST_Var && init.definitions.length > 1 && croak("Only one variable declaration allowed in for..in loop"), next(), for_in(init)) : regular_for(init)
            }

            function regular_for(init) {
                expect(";");
                var test = is("punc", ";") ? null : expression(!0);
                expect(";");
                var step = is("punc", ")") ? null : expression(!0);
                return expect(")"), new AST_For({
                    init: init,
                    condition: test,
                    step: step,
                    body: in_loop(statement)
                })
            }

            function for_in(init) {
                var lhs = init instanceof AST_Var ? init.definitions[0].name : null,
                    obj = expression(!0);
                return expect(")"), new AST_ForIn({
                    init: init,
                    name: lhs,
                    object: obj,
                    body: in_loop(statement)
                })
            }

            function if_() {
                var cond = parenthesised(),
                    body = statement(),
                    belse = null;
                return is("keyword", "else") && (next(), belse = statement()), new AST_If({
                    condition: cond,
                    body: body,
                    alternative: belse
                })
            }

            function block_() {
                expect("{");
                for (var a = []; !is("punc", "}");) is("eof") && unexpected(), a.push(statement());
                return next(), a
            }

            function switch_body_() {
                expect("{");
                for (var tmp, a = [], cur = null, branch = null; !is("punc", "}");) is("eof") && unexpected(), is("keyword", "case") ? (branch && (branch.end = prev()), cur = [], branch = new AST_Case({
                    start: (tmp = S.token, next(), tmp),
                    expression: expression(!0),
                    body: cur
                }), a.push(branch), expect(":")) : is("keyword", "default") ? (branch && (branch.end = prev()), cur = [], branch = new AST_Default({
                    start: (tmp = S.token, next(), expect(":"), tmp),
                    body: cur
                }), a.push(branch)) : (cur || unexpected(), cur.push(statement()));
                return branch && (branch.end = prev()), next(), a
            }

            function try_() {
                var body = block_(),
                    bcatch = null,
                    bfinally = null;
                if (is("keyword", "catch")) {
                    var start = S.token;
                    next(), expect("(");
                    var name = as_symbol(AST_SymbolCatch);
                    expect(")"), bcatch = new AST_Catch({
                        start: start,
                        argname: name,
                        body: block_(),
                        end: prev()
                    })
                }
                if (is("keyword", "finally")) {
                    var start = S.token;
                    next(), bfinally = new AST_Finally({
                        start: start,
                        body: block_(),
                        end: prev()
                    })
                }
                return bcatch || bfinally || croak("Missing catch/finally blocks"), new AST_Try({
                    body: body,
                    bcatch: bcatch,
                    bfinally: bfinally
                })
            }

            function vardefs(no_in, in_const) {
                for (var a = []; a.push(new AST_VarDef({
                        start: S.token,
                        name: as_symbol(in_const ? AST_SymbolConst : AST_SymbolVar),
                        value: is("operator", "=") ? (next(), expression(!1, no_in)) : null,
                        end: prev()
                    })), is("punc", ",");) next();
                return a
            }

            function as_atom_node() {
                var ret, tok = S.token;
                switch (tok.type) {
                    case "name":
                        return as_symbol(AST_SymbolRef);
                    case "num":
                        ret = new AST_Number({
                            start: tok,
                            end: tok,
                            value: tok.value
                        });
                        break;
                    case "string":
                        ret = new AST_String({
                            start: tok,
                            end: tok,
                            value: tok.value
                        });
                        break;
                    case "regexp":
                        ret = new AST_RegExp({
                            start: tok,
                            end: tok,
                            value: tok.value
                        });
                        break;
                    case "atom":
                        switch (tok.value) {
                            case "false":
                                ret = new AST_False({
                                    start: tok,
                                    end: tok
                                });
                                break;
                            case "true":
                                ret = new AST_True({
                                    start: tok,
                                    end: tok
                                });
                                break;
                            case "null":
                                ret = new AST_Null({
                                    start: tok,
                                    end: tok
                                })
                        }
                }
                return next(), ret
            }

            function expr_list(closing, allow_trailing_comma, allow_empty) {
                for (var first = !0, a = []; !is("punc", closing) && (first ? first = !1 : expect(","), !allow_trailing_comma || !is("punc", closing));) is("punc", ",") && allow_empty ? a.push(new AST_Hole({
                    start: S.token,
                    end: S.token
                })) : a.push(expression(!1));
                return next(), a
            }

            function as_property_name() {
                var tmp = S.token;
                switch (next(), tmp.type) {
                    case "num":
                    case "string":
                    case "name":
                    case "operator":
                    case "keyword":
                    case "atom":
                        return tmp.value;
                    default:
                        unexpected()
                }
            }

            function as_name() {
                var tmp = S.token;
                switch (next(), tmp.type) {
                    case "name":
                    case "operator":
                    case "keyword":
                    case "atom":
                        return tmp.value;
                    default:
                        unexpected()
                }
            }

            function as_symbol(type, noerror) {
                if (!is("name")) return noerror || croak("Name expected"), null;
                var name = S.token.value,
                    sym = new("this" == name ? AST_This : type)({
                        name: String(S.token.value),
                        start: S.token,
                        end: S.token
                    });
                return next(), sym
            }

            function make_unary(ctor, op, expr) {
                return "++" != op && "--" != op || is_assignable(expr) || croak("Invalid use of " + op + " operator"), new ctor({
                    operator: op,
                    expression: expr
                })
            }

            function expr_ops(no_in) {
                return expr_op(maybe_unary(!0), 0, no_in)
            }

            function is_assignable(expr) {
                return options.strict ? expr instanceof AST_This ? !1 : expr instanceof AST_PropAccess || expr instanceof AST_Symbol : !0
            }

            function in_loop(cont) {
                ++S.in_loop;
                var ret = cont();
                return --S.in_loop, ret
            }
            options = defaults(options, {
                strict: !1,
                filename: null,
                toplevel: null,
                expression: !1,
                html5_comments: !0
            });
            var S = {
                input: "string" == typeof $TEXT ? tokenizer($TEXT, options.filename, options.html5_comments) : $TEXT,
                token: null,
                prev: null,
                peeked: null,
                in_function: 0,
                in_directives: !0,
                in_loop: 0,
                labels: []
            };
            S.token = next();
            var statement = embed_tokens(function() {
                    var tmp;
                    switch (handle_regexp(), S.token.type) {
                        case "string":
                            var dir = S.in_directives,
                                stat = simple_statement();
                            return dir && stat.body instanceof AST_String && !is("punc", ",") ? new AST_Directive({
                                value: stat.body.value
                            }) : stat;
                        case "num":
                        case "regexp":
                        case "operator":
                        case "atom":
                            return simple_statement();
                        case "name":
                            return is_token(peek(), "punc", ":") ? labeled_statement() : simple_statement();
                        case "punc":
                            switch (S.token.value) {
                                case "{":
                                    return new AST_BlockStatement({
                                        start: S.token,
                                        body: block_(),
                                        end: prev()
                                    });
                                case "[":
                                case "(":
                                    return simple_statement();
                                case ";":
                                    return next(), new AST_EmptyStatement;
                                default:
                                    unexpected()
                            }
                        case "keyword":
                            switch (tmp = S.token.value, next(), tmp) {
                                case "break":
                                    return break_cont(AST_Break);
                                case "continue":
                                    return break_cont(AST_Continue);
                                case "debugger":
                                    return semicolon(), new AST_Debugger;
                                case "do":
                                    return new AST_Do({
                                        body: in_loop(statement),
                                        condition: (expect_token("keyword", "while"), tmp = parenthesised(), semicolon(), tmp)
                                    });
                                case "while":
                                    return new AST_While({
                                        condition: parenthesised(),
                                        body: in_loop(statement)
                                    });
                                case "for":
                                    return for_();
                                case "function":
                                    return function_(!0);
                                case "if":
                                    return if_();
                                case "return":
                                    return 0 == S.in_function && croak("'return' outside of function"), new AST_Return({
                                        value: is("punc", ";") ? (next(), null) : can_insert_semicolon() ? null : (tmp = expression(!0), semicolon(), tmp)
                                    });
                                case "switch":
                                    return new AST_Switch({
                                        expression: parenthesised(),
                                        body: in_loop(switch_body_)
                                    });
                                case "throw":
                                    return S.token.nlb && croak("Illegal newline after 'throw'"), new AST_Throw({
                                        value: (tmp = expression(!0), semicolon(), tmp)
                                    });
                                case "try":
                                    return try_();
                                case "var":
                                    return tmp = var_(), semicolon(), tmp;
                                case "const":
                                    return tmp = const_(), semicolon(), tmp;
                                case "with":
                                    return new AST_With({
                                        expression: parenthesised(),
                                        body: statement()
                                    });
                                default:
                                    unexpected()
                            }
                    }
                }),
                function_ = function(in_statement, ctor) {
                    var is_accessor = ctor === AST_Accessor,
                        name = is("name") ? as_symbol(in_statement ? AST_SymbolDefun : is_accessor ? AST_SymbolAccessor : AST_SymbolLambda) : is_accessor && (is("string") || is("num")) ? as_atom_node() : null;
                    return in_statement && !name && unexpected(), expect("("), ctor || (ctor = in_statement ? AST_Defun : AST_Function), new ctor({
                        name: name,
                        argnames: function(first, a) {
                            for (; !is("punc", ")");) first ? first = !1 : expect(","), a.push(as_symbol(AST_SymbolFunarg));
                            return next(), a
                        }(!0, []),
                        body: function(loop, labels) {
                            ++S.in_function, S.in_directives = !0, S.in_loop = 0, S.labels = [];
                            var a = block_();
                            return --S.in_function, S.in_loop = loop, S.labels = labels, a
                        }(S.in_loop, S.labels)
                    })
                },
                var_ = function(no_in) {
                    return new AST_Var({
                        start: prev(),
                        definitions: vardefs(no_in, !1),
                        end: prev()
                    })
                },
                const_ = function() {
                    return new AST_Const({
                        start: prev(),
                        definitions: vardefs(!1, !0),
                        end: prev()
                    })
                },
                new_ = function() {
                    var start = S.token;
                    expect_token("operator", "new");
                    var args, newexp = expr_atom(!1);
                    return is("punc", "(") ? (next(), args = expr_list(")")) : args = [], subscripts(new AST_New({
                        start: start,
                        expression: newexp,
                        args: args,
                        end: prev()
                    }), !0)
                },
                expr_atom = function(allow_calls) {
                    if (is("operator", "new")) return new_();
                    var start = S.token;
                    if (is("punc")) {
                        switch (start.value) {
                            case "(":
                                next();
                                var ex = expression(!0);
                                return ex.start = start, ex.end = S.token, expect(")"), subscripts(ex, allow_calls);
                            case "[":
                                return subscripts(array_(), allow_calls);
                            case "{":
                                return subscripts(object_(), allow_calls)
                        }
                        unexpected()
                    }
                    if (is("keyword", "function")) {
                        next();
                        var func = function_(!1);
                        return func.start = start, func.end = prev(), subscripts(func, allow_calls)
                    }
                    return ATOMIC_START_TOKEN[S.token.type] ? subscripts(as_atom_node(), allow_calls) : (unexpected(), void 0)
                },
                array_ = embed_tokens(function() {
                    return expect("["), new AST_Array({
                        elements: expr_list("]", !options.strict, !0)
                    })
                }),
                object_ = embed_tokens(function() {
                    expect("{");
                    for (var first = !0, a = []; !is("punc", "}") && (first ? first = !1 : expect(","), options.strict || !is("punc", "}"));) {
                        var start = S.token,
                            type = start.type,
                            name = as_property_name();
                        if ("name" == type && !is("punc", ":")) {
                            if ("get" == name) {
                                a.push(new AST_ObjectGetter({
                                    start: start,
                                    key: name,
                                    value: function_(!1, AST_Accessor),
                                    end: prev()
                                }));
                                continue
                            }
                            if ("set" == name) {
                                a.push(new AST_ObjectSetter({
                                    start: start,
                                    key: name,
                                    value: function_(!1, AST_Accessor),
                                    end: prev()
                                }));
                                continue
                            }
                        }
                        expect(":"), a.push(new AST_ObjectKeyVal({
                            start: start,
                            key: name,
                            value: expression(!1),
                            end: prev()
                        }))
                    }
                    return next(), new AST_Object({
                        properties: a
                    })
                }),
                subscripts = function(expr, allow_calls) {
                    var start = expr.start;
                    if (is("punc", ".")) return next(), subscripts(new AST_Dot({
                        start: start,
                        expression: expr,
                        property: as_name(),
                        end: prev()
                    }), allow_calls);
                    if (is("punc", "[")) {
                        next();
                        var prop = expression(!0);
                        return expect("]"), subscripts(new AST_Sub({
                            start: start,
                            expression: expr,
                            property: prop,
                            end: prev()
                        }), allow_calls)
                    }
                    return allow_calls && is("punc", "(") ? (next(), subscripts(new AST_Call({
                        start: start,
                        expression: expr,
                        args: expr_list(")"),
                        end: prev()
                    }), !0)) : expr
                },
                maybe_unary = function(allow_calls) {
                    var start = S.token;
                    if (is("operator") && UNARY_PREFIX(start.value)) {
                        next(), handle_regexp();
                        var ex = make_unary(AST_UnaryPrefix, start.value, maybe_unary(allow_calls));
                        return ex.start = start, ex.end = prev(), ex
                    }
                    for (var val = expr_atom(allow_calls); is("operator") && UNARY_POSTFIX(S.token.value) && !S.token.nlb;) val = make_unary(AST_UnaryPostfix, S.token.value, val), val.start = start, val.end = S.token, next();
                    return val
                },
                expr_op = function(left, min_prec, no_in) {
                    var op = is("operator") ? S.token.value : null;
                    "in" == op && no_in && (op = null);
                    var prec = null != op ? PRECEDENCE[op] : null;
                    if (null != prec && prec > min_prec) {
                        next();
                        var right = expr_op(maybe_unary(!0), prec, no_in);
                        return expr_op(new AST_Binary({
                            start: left.start,
                            left: left,
                            operator: op,
                            right: right,
                            end: right.end
                        }), min_prec, no_in)
                    }
                    return left
                },
                maybe_conditional = function(no_in) {
                    var start = S.token,
                        expr = expr_ops(no_in);
                    if (is("operator", "?")) {
                        next();
                        var yes = expression(!1);
                        return expect(":"), new AST_Conditional({
                            start: start,
                            condition: expr,
                            consequent: yes,
                            alternative: expression(!1, no_in),
                            end: peek()
                        })
                    }
                    return expr
                },
                maybe_assign = function(no_in) {
                    var start = S.token,
                        left = maybe_conditional(no_in),
                        val = S.token.value;
                    if (is("operator") && ASSIGNMENT(val)) {
                        if (is_assignable(left)) return next(), new AST_Assign({
                            start: start,
                            left: left,
                            operator: val,
                            right: maybe_assign(no_in),
                            end: prev()
                        });
                        croak("Invalid assignment")
                    }
                    return left
                },
                expression = function(commas, no_in) {
                    var start = S.token,
                        expr = maybe_assign(no_in);
                    return commas && is("punc", ",") ? (next(), new AST_Seq({
                        start: start,
                        car: expr,
                        cdr: expression(!0, no_in),
                        end: peek()
                    })) : expr
                };
            return options.expression ? expression(!0) : function() {
                for (var start = S.token, body = []; !is("eof");) body.push(statement());
                var end = prev(),
                    toplevel = options.toplevel;
                return toplevel ? (toplevel.body = toplevel.body.concat(body), toplevel.end = end) : toplevel = new AST_Toplevel({
                    start: start,
                    body: body,
                    end: end
                }), toplevel
            }()
        }

        function TreeTransformer(before, after) {
            TreeWalker.call(this), this.before = before, this.after = after
        }

        function SymbolDef(scope, index, orig) {
            this.name = orig.name, this.orig = [orig], this.scope = scope, this.references = [], this.global = !1, this.mangled_name = null, this.undeclared = !1, this.constant = !1, this.index = index
        }

        function OutputStream(options) {
            function to_ascii(str, identifier) {
                return str.replace(/[\u0080-\uffff]/g, function(ch) {
                    var code = ch.charCodeAt(0).toString(16);
                    if (code.length <= 2 && !identifier) {
                        for (; code.length < 2;) code = "0" + code;
                        return "\\x" + code
                    }
                    for (; code.length < 4;) code = "0" + code;
                    return "\\u" + code
                })
            }

            function make_string(str) {
                var dq = 0,
                    sq = 0;
                return str = str.replace(/[\\\b\f\n\r\t\x22\x27\u2028\u2029\0]/g, function(s) {
                    switch (s) {
                        case "\\":
                            return "\\\\";
                        case "\b":
                            return "\\b";
                        case "\f":
                            return "\\f";
                        case "\n":
                            return "\\n";
                        case "\r":
                            return "\\r";
                        case "\u2028":
                            return "\\u2028";
                        case "\u2029":
                            return "\\u2029";
                        case '"':
                            return ++dq, '"';
                        case "'":
                            return ++sq, "'";
                        case "\x00":
                            return "\\x00"
                    }
                    return s
                }), options.ascii_only && (str = to_ascii(str)), dq > sq ? "'" + str.replace(/\x27/g, "\\'") + "'" : '"' + str.replace(/\x22/g, '\\"') + '"'
            }

            function encode_string(str) {
                var ret = make_string(str);
                return options.inline_script && (ret = ret.replace(/<\x2fscript([>\/\t\n\f\r ])/gi, "<\\/script$1")), ret
            }

            function make_name(name) {
                return name = name.toString(), options.ascii_only && (name = to_ascii(name, !0)), name
            }

            function make_indent(back) {
                return repeat_string(" ", options.indent_start + indentation - back * options.indent_level)
            }

            function last_char() {
                return last.charAt(last.length - 1)
            }

            function maybe_newline() {
                options.max_line_len && current_col > options.max_line_len && print("\n")
            }

            function print(str) {
                str = String(str);
                var ch = str.charAt(0);
                if (might_need_semicolon && (ch && !(";}".indexOf(ch) < 0) || /[;]$/.test(last) || (options.semicolons || requireSemicolonChars(ch) ? (OUTPUT += ";", current_col++, current_pos++) : (OUTPUT += "\n", current_pos++, current_line++, current_col = 0), options.beautify || (might_need_space = !1)), might_need_semicolon = !1, maybe_newline()), !options.beautify && options.preserve_line && stack[stack.length - 1])
                    for (var target_line = stack[stack.length - 1].start.line; target_line > current_line;) OUTPUT += "\n", current_pos++, current_line++, current_col = 0, might_need_space = !1;
                if (might_need_space) {
                    var prev = last_char();
                    (is_identifier_char(prev) && (is_identifier_char(ch) || "\\" == ch) || /^[\+\-\/]$/.test(ch) && ch == prev) && (OUTPUT += " ", current_col++, current_pos++), might_need_space = !1
                }
                var a = str.split(/\r?\n/),
                    n = a.length - 1;
                current_line += n, 0 == n ? current_col += a[n].length : current_col = a[n].length, current_pos += str.length, last = str, OUTPUT += str
            }

            function force_semicolon() {
                might_need_semicolon = !1, print(";")
            }

            function next_indent() {
                return indentation + options.indent_level
            }

            function with_block(cont) {
                var ret;
                return print("{"), newline(), with_indent(next_indent(), function() {
                    ret = cont()
                }), indent(), print("}"), ret
            }

            function with_parens(cont) {
                print("(");
                var ret = cont();
                return print(")"), ret
            }

            function with_square(cont) {
                print("[");
                var ret = cont();
                return print("]"), ret
            }

            function comma() {
                print(","), space()
            }

            function colon() {
                print(":"), options.space_colon && space()
            }

            function get() {
                return OUTPUT
            }
            options = defaults(options, {
                indent_start: 0,
                indent_level: 4,
                quote_keys: !1,
                space_colon: !0,
                ascii_only: !1,
                inline_script: !1,
                width: 80,
                max_line_len: 32e3,
                beautify: !1,
                source_map: null,
                bracketize: !1,
                semicolons: !0,
                comments: !1,
                preserve_line: !1,
                screw_ie8: !1
            }, !0);
            var indentation = 0,
                current_col = 0,
                current_line = 1,
                current_pos = 0,
                OUTPUT = "",
                might_need_space = !1,
                might_need_semicolon = !1,
                last = null,
                requireSemicolonChars = makePredicate("( [ + * / - , ."),
                space = options.beautify ? function() {
                    print(" ")
                } : function() {
                    might_need_space = !0
                },
                indent = options.beautify ? function(half) {
                    options.beautify && print(make_indent(half ? .5 : 0))
                } : noop,
                with_indent = options.beautify ? function(col, cont) {
                    col === !0 && (col = next_indent());
                    var save_indentation = indentation;
                    indentation = col;
                    var ret = cont();
                    return indentation = save_indentation, ret
                } : function(col, cont) {
                    return cont()
                },
                newline = options.beautify ? function() {
                    print("\n")
                } : noop,
                semicolon = options.beautify ? function() {
                    print(";")
                } : function() {
                    might_need_semicolon = !0
                },
                add_mapping = options.source_map ? function(token, name) {
                    try {
                        token && options.source_map.add(token.file || "?", current_line, current_col, token.line, token.col, name || "name" != token.type ? name : token.value)
                    } catch (ex) {
                        AST_Node.warn("Couldn't figure out mapping for {file}:{line},{col} → {cline},{ccol} [{name}]", {
                            file: token.file,
                            line: token.line,
                            col: token.col,
                            cline: current_line,
                            ccol: current_col,
                            name: name || ""
                        })
                    }
                } : noop,
                stack = [];
            return {
                get: get,
                toString: get,
                indent: indent,
                indentation: function() {
                    return indentation
                },
                current_width: function() {
                    return current_col - indentation
                },
                should_break: function() {
                    return options.width && this.current_width() >= options.width
                },
                newline: newline,
                print: print,
                space: space,
                comma: comma,
                colon: colon,
                last: function() {
                    return last
                },
                semicolon: semicolon,
                force_semicolon: force_semicolon,
                to_ascii: to_ascii,
                print_name: function(name) {
                    print(make_name(name))
                },
                print_string: function(str) {
                    print(encode_string(str))
                },
                next_indent: next_indent,
                with_indent: with_indent,
                with_block: with_block,
                with_parens: with_parens,
                with_square: with_square,
                add_mapping: add_mapping,
                option: function(opt) {
                    return options[opt]
                },
                line: function() {
                    return current_line
                },
                col: function() {
                    return current_col
                },
                pos: function() {
                    return current_pos
                },
                push_node: function(node) {
                    stack.push(node)
                },
                pop_node: function() {
                    return stack.pop()
                },
                stack: function() {
                    return stack
                },
                parent: function(n) {
                    return stack[stack.length - 2 - (n || 0)]
                }
            }
        }

        function Compressor(options, false_by_default) {
            return this instanceof Compressor ? (TreeTransformer.call(this, this.before, this.after), this.options = defaults(options, {
                sequences: !false_by_default,
                properties: !false_by_default,
                dead_code: !false_by_default,
                drop_debugger: !false_by_default,
                unsafe: !1,
                unsafe_comps: !1,
                conditionals: !false_by_default,
                comparisons: !false_by_default,
                evaluate: !false_by_default,
                booleans: !false_by_default,
                loops: !false_by_default,
                unused: !false_by_default,
                hoist_funs: !false_by_default,
                hoist_vars: !1,
                if_return: !false_by_default,
                join_vars: !false_by_default,
                cascade: !false_by_default,
                side_effects: !false_by_default,
                pure_getters: !1,
                pure_funcs: null,
                negate_iife: !false_by_default,
                screw_ie8: !1,
                warnings: !0,
                global_defs: {}
            }, !0), void 0) : new Compressor(options, false_by_default)
        }

        function SourceMap(options) {
            function add(source, gen_line, gen_col, orig_line, orig_col, name) {
                if (orig_map) {
                    var info = orig_map.originalPositionFor({
                        line: orig_line,
                        column: orig_col
                    });
                    source = info.source, orig_line = info.line, orig_col = info.column, name = info.name
                }
                generator.addMapping({
                    generated: {
                        line: gen_line,
                        column: gen_col
                    },
                    original: {
                        line: orig_line,
                        column: orig_col
                    },
                    source: source,
                    name: name
                })
            }
            options = defaults(options, {
                file: null,
                root: null,
                orig: null
            });
            var generator = new MOZ_SourceMap.SourceMapGenerator({
                    file: options.file,
                    sourceRoot: options.root
                }),
                orig_map = options.orig && new MOZ_SourceMap.SourceMapConsumer(options.orig);
            return {
                add: add,
                get: function() {
                    return generator
                },
                toString: function() {
                    return generator.toString()
                }
            }
        }
        global.UglifyJS = exports;
        var MAP = function() {
            function MAP(a, f, backwards) {
                function doit() {
                    var val = f(a[i], i),
                        is_last = val instanceof Last;
                    return is_last && (val = val.v), val instanceof AtTop ? (val = val.v, val instanceof Splice ? top.push.apply(top, backwards ? val.v.slice().reverse() : val.v) : top.push(val)) : val !== skip && (val instanceof Splice ? ret.push.apply(ret, backwards ? val.v.slice().reverse() : val.v) : ret.push(val)), is_last
                }
                var i, ret = [],
                    top = [];
                if (a instanceof Array)
                    if (backwards) {
                        for (i = a.length; --i >= 0 && !doit(););
                        ret.reverse(), top.reverse()
                    } else
                        for (i = 0; i < a.length && !doit(); ++i);
                else
                    for (i in a)
                        if (a.hasOwnProperty(i) && doit()) break; return top.concat(ret)
            }

            function AtTop(val) {
                this.v = val
            }

            function Splice(val) {
                this.v = val
            }

            function Last(val) {
                this.v = val
            }
            MAP.at_top = function(val) {
                return new AtTop(val)
            }, MAP.splice = function(val) {
                return new Splice(val)
            }, MAP.last = function(val) {
                return new Last(val)
            };
            var skip = MAP.skip = {};
            return MAP
        }();
        Dictionary.prototype = {
            set: function(key, val) {
                return this.has(key) || ++this._size, this._values["$" + key] = val, this
            },
            add: function(key, val) {
                return this.has(key) ? this.get(key).push(val) : this.set(key, [val]), this
            },
            get: function(key) {
                return this._values["$" + key]
            },
            del: function(key) {
                return this.has(key) && (--this._size, delete this._values["$" + key]), this
            },
            has: function(key) {
                return "$" + key in this._values
            },
            each: function(f) {
                for (var i in this._values) f(this._values[i], i.substr(1))
            },
            size: function() {
                return this._size
            },
            map: function(f) {
                var ret = [];
                for (var i in this._values) ret.push(f(this._values[i], i.substr(1)));
                return ret
            }
        };
        var AST_Token = DEFNODE("Token", "type value line col pos endpos nlb comments_before file", {}, null),
            AST_Node = DEFNODE("Node", "start end", {
                clone: function() {
                    return new this.CTOR(this)
                },
                $documentation: "Base class of all AST nodes",
                $propdoc: {
                    start: "[AST_Token] The first token of this node",
                    end: "[AST_Token] The last token of this node"
                },
                _walk: function(visitor) {
                    return visitor._visit(this)
                },
                walk: function(visitor) {
                    return this._walk(visitor)
                }
            }, null);
        AST_Node.warn_function = null, AST_Node.warn = function(txt, props) {
            AST_Node.warn_function && AST_Node.warn_function(string_template(txt, props))
        };
        var AST_Statement = DEFNODE("Statement", null, {
                $documentation: "Base class of all statements"
            }),
            AST_Debugger = DEFNODE("Debugger", null, {
                $documentation: "Represents a debugger statement"
            }, AST_Statement),
            AST_Directive = DEFNODE("Directive", "value scope", {
                $documentation: 'Represents a directive, like "use strict";',
                $propdoc: {
                    value: "[string] The value of this directive as a plain string (it's not an AST_String!)",
                    scope: "[AST_Scope/S] The scope that this directive affects"
                }
            }, AST_Statement),
            AST_SimpleStatement = DEFNODE("SimpleStatement", "body", {
                $documentation: "A statement consisting of an expression, i.e. a = 1 + 2",
                $propdoc: {
                    body: "[AST_Node] an expression node (should not be instanceof AST_Statement)"
                },
                _walk: function(visitor) {
                    return visitor._visit(this, function() {
                        this.body._walk(visitor)
                    })
                }
            }, AST_Statement),
            AST_Block = DEFNODE("Block", "body", {
                $documentation: "A body of statements (usually bracketed)",
                $propdoc: {
                    body: "[AST_Statement*] an array of statements"
                },
                _walk: function(visitor) {
                    return visitor._visit(this, function() {
                        walk_body(this, visitor)
                    })
                }
            }, AST_Statement),
            AST_BlockStatement = DEFNODE("BlockStatement", null, {
                $documentation: "A block statement"
            }, AST_Block),
            AST_EmptyStatement = DEFNODE("EmptyStatement", null, {
                $documentation: "The empty statement (empty block or simply a semicolon)",
                _walk: function(visitor) {
                    return visitor._visit(this)
                }
            }, AST_Statement),
            AST_StatementWithBody = DEFNODE("StatementWithBody", "body", {
                $documentation: "Base class for all statements that contain one nested body: `For`, `ForIn`, `Do`, `While`, `With`",
                $propdoc: {
                    body: "[AST_Statement] the body; this should always be present, even if it's an AST_EmptyStatement"
                },
                _walk: function(visitor) {
                    return visitor._visit(this, function() {
                        this.body._walk(visitor)
                    })
                }
            }, AST_Statement),
            AST_LabeledStatement = DEFNODE("LabeledStatement", "label", {
                $documentation: "Statement with a label",
                $propdoc: {
                    label: "[AST_Label] a label definition"
                },
                _walk: function(visitor) {
                    return visitor._visit(this, function() {
                        this.label._walk(visitor), this.body._walk(visitor)
                    })
                }
            }, AST_StatementWithBody),
            AST_IterationStatement = DEFNODE("IterationStatement", null, {
                $documentation: "Internal class.  All loops inherit from it."
            }, AST_StatementWithBody),
            AST_DWLoop = DEFNODE("DWLoop", "condition", {
                $documentation: "Base class for do/while statements",
                $propdoc: {
                    condition: "[AST_Node] the loop condition.  Should not be instanceof AST_Statement"
                },
                _walk: function(visitor) {
                    return visitor._visit(this, function() {
                        this.condition._walk(visitor), this.body._walk(visitor)
                    })
                }
            }, AST_IterationStatement),
            AST_Do = DEFNODE("Do", null, {
                $documentation: "A `do` statement"
            }, AST_DWLoop),
            AST_While = DEFNODE("While", null, {
                $documentation: "A `while` statement"
            }, AST_DWLoop),
            AST_For = DEFNODE("For", "init condition step", {
                $documentation: "A `for` statement",
                $propdoc: {
                    init: "[AST_Node?] the `for` initialization code, or null if empty",
                    condition: "[AST_Node?] the `for` termination clause, or null if empty",
                    step: "[AST_Node?] the `for` update clause, or null if empty"
                },
                _walk: function(visitor) {
                    return visitor._visit(this, function() {
                        this.init && this.init._walk(visitor), this.condition && this.condition._walk(visitor), this.step && this.step._walk(visitor), this.body._walk(visitor)
                    })
                }
            }, AST_IterationStatement),
            AST_ForIn = DEFNODE("ForIn", "init name object", {
                $documentation: "A `for ... in` statement",
                $propdoc: {
                    init: "[AST_Node] the `for/in` initialization code",
                    name: "[AST_SymbolRef?] the loop variable, only if `init` is AST_Var",
                    object: "[AST_Node] the object that we're looping through"
                },
                _walk: function(visitor) {
                    return visitor._visit(this, function() {
                        this.init._walk(visitor), this.object._walk(visitor), this.body._walk(visitor)
                    })
                }
            }, AST_IterationStatement),
            AST_With = DEFNODE("With", "expression", {
                $documentation: "A `with` statement",
                $propdoc: {
                    expression: "[AST_Node] the `with` expression"
                },
                _walk: function(visitor) {
                    return visitor._visit(this, function() {
                        this.expression._walk(visitor), this.body._walk(visitor)
                    })
                }
            }, AST_StatementWithBody),
            AST_Scope = DEFNODE("Scope", "directives variables functions uses_with uses_eval parent_scope enclosed cname", {
                $documentation: "Base class for all statements introducing a lexical scope",
                $propdoc: {
                    directives: "[string*/S] an array of directives declared in this scope",
                    variables: "[Object/S] a map of name -> SymbolDef for all variables/functions defined in this scope",
                    functions: "[Object/S] like `variables`, but only lists function declarations",
                    uses_with: "[boolean/S] tells whether this scope uses the `with` statement",
                    uses_eval: "[boolean/S] tells whether this scope contains a direct call to the global `eval`",
                    parent_scope: "[AST_Scope?/S] link to the parent scope",
                    enclosed: "[SymbolDef*/S] a list of all symbol definitions that are accessed from this scope or any subscopes",
                    cname: "[integer/S] current index for mangling variables (used internally by the mangler)"
                }
            }, AST_Block),
            AST_Toplevel = DEFNODE("Toplevel", "globals", {
                $documentation: "The toplevel scope",
                $propdoc: {
                    globals: "[Object/S] a map of name -> SymbolDef for all undeclared names"
                },
                wrap_enclose: function(arg_parameter_pairs) {
                    var self = this,
                        args = [],
                        parameters = [];
                    arg_parameter_pairs.forEach(function(pair) {
                        var split = pair.split(":");
                        args.push(split[0]), parameters.push(split[1])
                    });
                    var wrapped_tl = "(function(" + parameters.join(",") + "){ '$ORIG'; })(" + args.join(",") + ")";
                    return wrapped_tl = parse(wrapped_tl), wrapped_tl = wrapped_tl.transform(new TreeTransformer(function(node) {
                        return node instanceof AST_Directive && "$ORIG" == node.value ? MAP.splice(self.body) : void 0
                    }))
                },
                wrap_commonjs: function(name, export_all) {
                    var self = this,
                        to_export = [];
                    export_all && (self.figure_out_scope(), self.walk(new TreeWalker(function(node) {
                        node instanceof AST_SymbolDeclaration && node.definition().global && (find_if(function(n) {
                            return n.name == node.name
                        }, to_export) || to_export.push(node))
                    })));
                    var wrapped_tl = "(function(exports, global){ global['" + name + "'] = exports; '$ORIG'; '$EXPORTS'; }({}, (function(){return this}())))";
                    return wrapped_tl = parse(wrapped_tl), wrapped_tl = wrapped_tl.transform(new TreeTransformer(function(node) {
                        if (node instanceof AST_SimpleStatement && (node = node.body, node instanceof AST_String)) switch (node.getValue()) {
                            case "$ORIG":
                                return MAP.splice(self.body);
                            case "$EXPORTS":
                                var body = [];
                                return to_export.forEach(function(sym) {
                                    body.push(new AST_SimpleStatement({
                                        body: new AST_Assign({
                                            left: new AST_Sub({
                                                expression: new AST_SymbolRef({
                                                    name: "exports"
                                                }),
                                                property: new AST_String({
                                                    value: sym.name
                                                })
                                            }),
                                            operator: "=",
                                            right: new AST_SymbolRef(sym)
                                        })
                                    }))
                                }), MAP.splice(body)
                        }
                    }))
                }
            }, AST_Scope),
            AST_Lambda = DEFNODE("Lambda", "name argnames uses_arguments", {
                $documentation: "Base class for functions",
                $propdoc: {
                    name: "[AST_SymbolDeclaration?] the name of this function",
                    argnames: "[AST_SymbolFunarg*] array of function arguments",
                    uses_arguments: "[boolean/S] tells whether this function accesses the arguments array"
                },
                _walk: function(visitor) {
                    return visitor._visit(this, function() {
                        this.name && this.name._walk(visitor), this.argnames.forEach(function(arg) {
                            arg._walk(visitor)
                        }), walk_body(this, visitor)
                    })
                }
            }, AST_Scope),
            AST_Accessor = DEFNODE("Accessor", null, {
                $documentation: "A setter/getter function"
            }, AST_Lambda),
            AST_Function = DEFNODE("Function", null, {
                $documentation: "A function expression"
            }, AST_Lambda),
            AST_Defun = DEFNODE("Defun", null, {
                $documentation: "A function definition"
            }, AST_Lambda),
            AST_Jump = DEFNODE("Jump", null, {
                $documentation: "Base class for “jumps” (for now that's `return`, `throw`, `break` and `continue`)"
            }, AST_Statement),
            AST_Exit = DEFNODE("Exit", "value", {
                $documentation: "Base class for “exits” (`return` and `throw`)",
                $propdoc: {
                    value: "[AST_Node?] the value returned or thrown by this statement; could be null for AST_Return"
                },
                _walk: function(visitor) {
                    return visitor._visit(this, this.value && function() {
                        this.value._walk(visitor)
                    })
                }
            }, AST_Jump),
            AST_Return = DEFNODE("Return", null, {
                $documentation: "A `return` statement"
            }, AST_Exit),
            AST_Throw = DEFNODE("Throw", null, {
                $documentation: "A `throw` statement"
            }, AST_Exit),
            AST_LoopControl = DEFNODE("LoopControl", "label", {
                $documentation: "Base class for loop control statements (`break` and `continue`)",
                $propdoc: {
                    label: "[AST_LabelRef?] the label, or null if none"
                },
                _walk: function(visitor) {
                    return visitor._visit(this, this.label && function() {
                        this.label._walk(visitor)
                    })
                }
            }, AST_Jump),
            AST_Break = DEFNODE("Break", null, {
                $documentation: "A `break` statement"
            }, AST_LoopControl),
            AST_Continue = DEFNODE("Continue", null, {
                $documentation: "A `continue` statement"
            }, AST_LoopControl),
            AST_If = DEFNODE("If", "condition alternative", {
                $documentation: "A `if` statement",
                $propdoc: {
                    condition: "[AST_Node] the `if` condition",
                    alternative: "[AST_Statement?] the `else` part, or null if not present"
                },
                _walk: function(visitor) {
                    return visitor._visit(this, function() {
                        this.condition._walk(visitor), this.body._walk(visitor), this.alternative && this.alternative._walk(visitor)
                    })
                }
            }, AST_StatementWithBody),
            AST_Switch = DEFNODE("Switch", "expression", {
                $documentation: "A `switch` statement",
                $propdoc: {
                    expression: "[AST_Node] the `switch` “discriminant”"
                },
                _walk: function(visitor) {
                    return visitor._visit(this, function() {
                        this.expression._walk(visitor), walk_body(this, visitor)
                    })
                }
            }, AST_Block),
            AST_SwitchBranch = DEFNODE("SwitchBranch", null, {
                $documentation: "Base class for `switch` branches"
            }, AST_Block),
            AST_Default = DEFNODE("Default", null, {
                $documentation: "A `default` switch branch"
            }, AST_SwitchBranch),
            AST_Case = DEFNODE("Case", "expression", {
                $documentation: "A `case` switch branch",
                $propdoc: {
                    expression: "[AST_Node] the `case` expression"
                },
                _walk: function(visitor) {
                    return visitor._visit(this, function() {
                        this.expression._walk(visitor), walk_body(this, visitor)
                    })
                }
            }, AST_SwitchBranch),
            AST_Try = DEFNODE("Try", "bcatch bfinally", {
                $documentation: "A `try` statement",
                $propdoc: {
                    bcatch: "[AST_Catch?] the catch block, or null if not present",
                    bfinally: "[AST_Finally?] the finally block, or null if not present"
                },
                _walk: function(visitor) {
                    return visitor._visit(this, function() {
                        walk_body(this, visitor), this.bcatch && this.bcatch._walk(visitor), this.bfinally && this.bfinally._walk(visitor)
                    })
                }
            }, AST_Block),
            AST_Catch = DEFNODE("Catch", "argname", {
                $documentation: "A `catch` node; only makes sense as part of a `try` statement",
                $propdoc: {
                    argname: "[AST_SymbolCatch] symbol for the exception"
                },
                _walk: function(visitor) {
                    return visitor._visit(this, function() {
                        this.argname._walk(visitor), walk_body(this, visitor)
                    })
                }
            }, AST_Block),
            AST_Finally = DEFNODE("Finally", null, {
                $documentation: "A `finally` node; only makes sense as part of a `try` statement"
            }, AST_Block),
            AST_Definitions = DEFNODE("Definitions", "definitions", {
                $documentation: "Base class for `var` or `const` nodes (variable declarations/initializations)",
                $propdoc: {
                    definitions: "[AST_VarDef*] array of variable definitions"
                },
                _walk: function(visitor) {
                    return visitor._visit(this, function() {
                        this.definitions.forEach(function(def) {
                            def._walk(visitor)
                        })
                    })
                }
            }, AST_Statement),
            AST_Var = DEFNODE("Var", null, {
                $documentation: "A `var` statement"
            }, AST_Definitions),
            AST_Const = DEFNODE("Const", null, {
                $documentation: "A `const` statement"
            }, AST_Definitions),
            AST_VarDef = DEFNODE("VarDef", "name value", {
                $documentation: "A variable declaration; only appears in a AST_Definitions node",
                $propdoc: {
                    name: "[AST_SymbolVar|AST_SymbolConst] name of the variable",
                    value: "[AST_Node?] initializer, or null of there's no initializer"
                },
                _walk: function(visitor) {
                    return visitor._visit(this, function() {
                        this.name._walk(visitor), this.value && this.value._walk(visitor)
                    })
                }
            }),
            AST_Call = DEFNODE("Call", "expression args", {
                $documentation: "A function call expression",
                $propdoc: {
                    expression: "[AST_Node] expression to invoke as function",
                    args: "[AST_Node*] array of arguments"
                },
                _walk: function(visitor) {
                    return visitor._visit(this, function() {
                        this.expression._walk(visitor), this.args.forEach(function(arg) {
                            arg._walk(visitor)
                        })
                    })
                }
            }),
            AST_New = DEFNODE("New", null, {
                $documentation: "An object instantiation.  Derives from a function call since it has exactly the same properties"
            }, AST_Call),
            AST_Seq = DEFNODE("Seq", "car cdr", {
                $documentation: "A sequence expression (two comma-separated expressions)",
                $propdoc: {
                    car: "[AST_Node] first element in sequence",
                    cdr: "[AST_Node] second element in sequence"
                },
                $cons: function(x, y) {
                    var seq = new AST_Seq(x);
                    return seq.car = x, seq.cdr = y, seq
                },
                $from_array: function(array) {
                    if (0 == array.length) return null;
                    if (1 == array.length) return array[0].clone();
                    for (var list = null, i = array.length; --i >= 0;) list = AST_Seq.cons(array[i], list);
                    for (var p = list; p;) {
                        if (p.cdr && !p.cdr.cdr) {
                            p.cdr = p.cdr.car;
                            break
                        }
                        p = p.cdr
                    }
                    return list
                },
                to_array: function() {
                    for (var p = this, a = []; p;) {
                        if (a.push(p.car), p.cdr && !(p.cdr instanceof AST_Seq)) {
                            a.push(p.cdr);
                            break
                        }
                        p = p.cdr
                    }
                    return a
                },
                add: function(node) {
                    for (var p = this; p;) {
                        if (!(p.cdr instanceof AST_Seq)) {
                            var cell = AST_Seq.cons(p.cdr, node);
                            return p.cdr = cell
                        }
                        p = p.cdr
                    }
                },
                _walk: function(visitor) {
                    return visitor._visit(this, function() {
                        this.car._walk(visitor), this.cdr && this.cdr._walk(visitor)
                    })
                }
            }),
            AST_PropAccess = DEFNODE("PropAccess", "expression property", {
                $documentation: 'Base class for property access expressions, i.e. `a.foo` or `a["foo"]`',
                $propdoc: {
                    expression: "[AST_Node] the “container” expression",
                    property: "[AST_Node|string] the property to access.  For AST_Dot this is always a plain string, while for AST_Sub it's an arbitrary AST_Node"
                }
            }),
            AST_Dot = DEFNODE("Dot", null, {
                $documentation: "A dotted property access expression",
                _walk: function(visitor) {
                    return visitor._visit(this, function() {
                        this.expression._walk(visitor)
                    })
                }
            }, AST_PropAccess),
            AST_Sub = DEFNODE("Sub", null, {
                $documentation: 'Index-style property access, i.e. `a["foo"]`',
                _walk: function(visitor) {
                    return visitor._visit(this, function() {
                        this.expression._walk(visitor), this.property._walk(visitor)
                    })
                }
            }, AST_PropAccess),
            AST_Unary = DEFNODE("Unary", "operator expression", {
                $documentation: "Base class for unary expressions",
                $propdoc: {
                    operator: "[string] the operator",
                    expression: "[AST_Node] expression that this unary operator applies to"
                },
                _walk: function(visitor) {
                    return visitor._visit(this, function() {
                        this.expression._walk(visitor)
                    })
                }
            }),
            AST_UnaryPrefix = DEFNODE("UnaryPrefix", null, {
                $documentation: "Unary prefix expression, i.e. `typeof i` or `++i`"
            }, AST_Unary),
            AST_UnaryPostfix = DEFNODE("UnaryPostfix", null, {
                $documentation: "Unary postfix expression, i.e. `i++`"
            }, AST_Unary),
            AST_Binary = DEFNODE("Binary", "left operator right", {
                $documentation: "Binary expression, i.e. `a + b`",
                $propdoc: {
                    left: "[AST_Node] left-hand side expression",
                    operator: "[string] the operator",
                    right: "[AST_Node] right-hand side expression"
                },
                _walk: function(visitor) {
                    return visitor._visit(this, function() {
                        this.left._walk(visitor), this.right._walk(visitor)
                    })
                }
            }),
            AST_Conditional = DEFNODE("Conditional", "condition consequent alternative", {
                $documentation: "Conditional expression using the ternary operator, i.e. `a ? b : c`",
                $propdoc: {
                    condition: "[AST_Node]",
                    consequent: "[AST_Node]",
                    alternative: "[AST_Node]"
                },
                _walk: function(visitor) {
                    return visitor._visit(this, function() {
                        this.condition._walk(visitor), this.consequent._walk(visitor), this.alternative._walk(visitor)
                    })
                }
            }),
            AST_Assign = DEFNODE("Assign", null, {
                $documentation: "An assignment expression — `a = b + 5`"
            }, AST_Binary),
            AST_Array = DEFNODE("Array", "elements", {
                $documentation: "An array literal",
                $propdoc: {
                    elements: "[AST_Node*] array of elements"
                },
                _walk: function(visitor) {
                    return visitor._visit(this, function() {
                        this.elements.forEach(function(el) {
                            el._walk(visitor)
                        })
                    })
                }
            }),
            AST_Object = DEFNODE("Object", "properties", {
                $documentation: "An object literal",
                $propdoc: {
                    properties: "[AST_ObjectProperty*] array of properties"
                },
                _walk: function(visitor) {
                    return visitor._visit(this, function() {
                        this.properties.forEach(function(prop) {
                            prop._walk(visitor)
                        })
                    })
                }
            }),
            AST_ObjectProperty = DEFNODE("ObjectProperty", "key value", {
                $documentation: "Base class for literal object properties",
                $propdoc: {
                    key: "[string] the property name; it's always a plain string in our AST, no matter if it was a string, number or identifier in original code",
                    value: "[AST_Node] property value.  For setters and getters this is an AST_Function."
                },
                _walk: function(visitor) {
                    return visitor._visit(this, function() {
                        this.value._walk(visitor)
                    })
                }
            }),
            AST_ObjectKeyVal = DEFNODE("ObjectKeyVal", null, {
                $documentation: "A key: value object property"
            }, AST_ObjectProperty),
            AST_ObjectSetter = DEFNODE("ObjectSetter", null, {
                $documentation: "An object setter property"
            }, AST_ObjectProperty),
            AST_ObjectGetter = DEFNODE("ObjectGetter", null, {
                $documentation: "An object getter property"
            }, AST_ObjectProperty),
            AST_Symbol = DEFNODE("Symbol", "scope name thedef", {
                $propdoc: {
                    name: "[string] name of this symbol",
                    scope: "[AST_Scope/S] the current scope (not necessarily the definition scope)",
                    thedef: "[SymbolDef/S] the definition of this symbol"
                },
                $documentation: "Base class for all symbols"
            }),
            AST_SymbolAccessor = DEFNODE("SymbolAccessor", null, {
                $documentation: "The name of a property accessor (setter/getter function)"
            }, AST_Symbol),
            AST_SymbolDeclaration = DEFNODE("SymbolDeclaration", "init", {
                $documentation: "A declaration symbol (symbol in var/const, function name or argument, symbol in catch)",
                $propdoc: {
                    init: "[AST_Node*/S] array of initializers for this declaration."
                }
            }, AST_Symbol),
            AST_SymbolVar = DEFNODE("SymbolVar", null, {
                $documentation: "Symbol defining a variable"
            }, AST_SymbolDeclaration),
            AST_SymbolConst = DEFNODE("SymbolConst", null, {
                $documentation: "A constant declaration"
            }, AST_SymbolDeclaration),
            AST_SymbolFunarg = DEFNODE("SymbolFunarg", null, {
                $documentation: "Symbol naming a function argument"
            }, AST_SymbolVar),
            AST_SymbolDefun = DEFNODE("SymbolDefun", null, {
                $documentation: "Symbol defining a function"
            }, AST_SymbolDeclaration),
            AST_SymbolLambda = DEFNODE("SymbolLambda", null, {
                $documentation: "Symbol naming a function expression"
            }, AST_SymbolDeclaration),
            AST_SymbolCatch = DEFNODE("SymbolCatch", null, {
                $documentation: "Symbol naming the exception in catch"
            }, AST_SymbolDeclaration),
            AST_Label = DEFNODE("Label", "references", {
                $documentation: "Symbol naming a label (declaration)",
                $propdoc: {
                    references: "[AST_LoopControl*] a list of nodes referring to this label"
                },
                initialize: function() {
                    this.references = [], this.thedef = this
                }
            }, AST_Symbol),
            AST_SymbolRef = DEFNODE("SymbolRef", null, {
                $documentation: "Reference to some symbol (not definition/declaration)"
            }, AST_Symbol),
            AST_LabelRef = DEFNODE("LabelRef", null, {
                $documentation: "Reference to a label symbol"
            }, AST_Symbol),
            AST_This = DEFNODE("This", null, {
                $documentation: "The `this` symbol"
            }, AST_Symbol),
            AST_Constant = DEFNODE("Constant", null, {
                $documentation: "Base class for all constants",
                getValue: function() {
                    return this.value
                }
            }),
            AST_String = DEFNODE("String", "value", {
                $documentation: "A string literal",
                $propdoc: {
                    value: "[string] the contents of this string"
                }
            }, AST_Constant),
            AST_Number = DEFNODE("Number", "value", {
                $documentation: "A number literal",
                $propdoc: {
                    value: "[number] the numeric value"
                }
            }, AST_Constant),
            AST_RegExp = DEFNODE("RegExp", "value", {
                $documentation: "A regexp literal",
                $propdoc: {
                    value: "[RegExp] the actual regexp"
                }
            }, AST_Constant),
            AST_Atom = DEFNODE("Atom", null, {
                $documentation: "Base class for atoms"
            }, AST_Constant),
            AST_Null = DEFNODE("Null", null, {
                $documentation: "The `null` atom",
                value: null
            }, AST_Atom),
            AST_NaN = DEFNODE("NaN", null, {
                $documentation: "The impossible value",
                value: 0 / 0
            }, AST_Atom),
            AST_Undefined = DEFNODE("Undefined", null, {
                $documentation: "The `undefined` value",
                value: void 0
            }, AST_Atom),
            AST_Hole = DEFNODE("Hole", null, {
                $documentation: "A hole in an array",
                value: void 0
            }, AST_Atom),
            AST_Infinity = DEFNODE("Infinity", null, {
                $documentation: "The `Infinity` value",
                value: 1 / 0
            }, AST_Atom),
            AST_Boolean = DEFNODE("Boolean", null, {
                $documentation: "Base class for booleans"
            }, AST_Atom),
            AST_False = DEFNODE("False", null, {
                $documentation: "The `false` atom",
                value: !1
            }, AST_Boolean),
            AST_True = DEFNODE("True", null, {
                $documentation: "The `true` atom",
                value: !0
            }, AST_Boolean);
        TreeWalker.prototype = {
            _visit: function(node, descend) {
                this.stack.push(node);
                var ret = this.visit(node, descend ? function() {
                    descend.call(node)
                } : noop);
                return !ret && descend && descend.call(node), this.stack.pop(), ret
            },
            parent: function(n) {
                return this.stack[this.stack.length - 2 - (n || 0)]
            },
            push: function(node) {
                this.stack.push(node)
            },
            pop: function() {
                return this.stack.pop()
            },
            self: function() {
                return this.stack[this.stack.length - 1]
            },
            find_parent: function(type) {
                for (var stack = this.stack, i = stack.length; --i >= 0;) {
                    var x = stack[i];
                    if (x instanceof type) return x
                }
            },
            has_directive: function(type) {
                return this.find_parent(AST_Scope).has_directive(type)
            },
            in_boolean_context: function() {
                for (var stack = this.stack, i = stack.length, self = stack[--i]; i > 0;) {
                    var p = stack[--i];
                    if (p instanceof AST_If && p.condition === self || p instanceof AST_Conditional && p.condition === self || p instanceof AST_DWLoop && p.condition === self || p instanceof AST_For && p.condition === self || p instanceof AST_UnaryPrefix && "!" == p.operator && p.expression === self) return !0;
                    if (!(p instanceof AST_Binary) || "&&" != p.operator && "||" != p.operator) return !1;
                    self = p
                }
            },
            loopcontrol_target: function(label) {
                var stack = this.stack;
                if (label)
                    for (var i = stack.length; --i >= 0;) {
                        var x = stack[i];
                        if (x instanceof AST_LabeledStatement && x.label.name == label.name) return x.body
                    } else
                        for (var i = stack.length; --i >= 0;) {
                            var x = stack[i];
                            if (x instanceof AST_Switch || x instanceof AST_IterationStatement) return x
                        }
            }
        };
        var KEYWORDS = "break case catch const continue debugger default delete do else finally for function if in instanceof new return switch throw try typeof var void while with",
            KEYWORDS_ATOM = "false null true",
            RESERVED_WORDS = "abstract boolean byte char class double enum export extends final float goto implements import int interface long native package private protected public short static super synchronized this throws transient volatile " + KEYWORDS_ATOM + " " + KEYWORDS,
            KEYWORDS_BEFORE_EXPRESSION = "return new delete throw else case";
        KEYWORDS = makePredicate(KEYWORDS), RESERVED_WORDS = makePredicate(RESERVED_WORDS), KEYWORDS_BEFORE_EXPRESSION = makePredicate(KEYWORDS_BEFORE_EXPRESSION), KEYWORDS_ATOM = makePredicate(KEYWORDS_ATOM);
        var OPERATOR_CHARS = makePredicate(characters("+-*&%=<>!?|~^")),
            RE_HEX_NUMBER = /^0x[0-9a-f]+$/i,
            RE_OCT_NUMBER = /^0[0-7]+$/,
            RE_DEC_NUMBER = /^\d*\.?\d*(?:e[+-]?\d*(?:\d\.?|\.?\d)\d*)?$/i,
            OPERATORS = makePredicate(["in", "instanceof", "typeof", "new", "void", "delete", "++", "--", "+", "-", "!", "~", "&", "|", "^", "*", "/", "%", ">>", "<<", ">>>", "<", ">", "<=", ">=", "==", "===", "!=", "!==", "?", "=", "+=", "-=", "/=", "*=", "%=", ">>=", "<<=", ">>>=", "|=", "^=", "&=", "&&", "||"]),
            WHITESPACE_CHARS = makePredicate(characters("  \n\r \f​᠎             　")),
            PUNC_BEFORE_EXPRESSION = makePredicate(characters("[{(,.;:")),
            PUNC_CHARS = makePredicate(characters("[]{}(),;:")),
            REGEXP_MODIFIERS = makePredicate(characters("gmsiy")),
            UNICODE = {
                letter: new RegExp("[\\u0041-\\u005A\\u0061-\\u007A\\u00AA\\u00B5\\u00BA\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02C1\\u02C6-\\u02D1\\u02E0-\\u02E4\\u02EC\\u02EE\\u0370-\\u0374\\u0376\\u0377\\u037A-\\u037D\\u0386\\u0388-\\u038A\\u038C\\u038E-\\u03A1\\u03A3-\\u03F5\\u03F7-\\u0481\\u048A-\\u0523\\u0531-\\u0556\\u0559\\u0561-\\u0587\\u05D0-\\u05EA\\u05F0-\\u05F2\\u0621-\\u064A\\u066E\\u066F\\u0671-\\u06D3\\u06D5\\u06E5\\u06E6\\u06EE\\u06EF\\u06FA-\\u06FC\\u06FF\\u0710\\u0712-\\u072F\\u074D-\\u07A5\\u07B1\\u07CA-\\u07EA\\u07F4\\u07F5\\u07FA\\u0904-\\u0939\\u093D\\u0950\\u0958-\\u0961\\u0971\\u0972\\u097B-\\u097F\\u0985-\\u098C\\u098F\\u0990\\u0993-\\u09A8\\u09AA-\\u09B0\\u09B2\\u09B6-\\u09B9\\u09BD\\u09CE\\u09DC\\u09DD\\u09DF-\\u09E1\\u09F0\\u09F1\\u0A05-\\u0A0A\\u0A0F\\u0A10\\u0A13-\\u0A28\\u0A2A-\\u0A30\\u0A32\\u0A33\\u0A35\\u0A36\\u0A38\\u0A39\\u0A59-\\u0A5C\\u0A5E\\u0A72-\\u0A74\\u0A85-\\u0A8D\\u0A8F-\\u0A91\\u0A93-\\u0AA8\\u0AAA-\\u0AB0\\u0AB2\\u0AB3\\u0AB5-\\u0AB9\\u0ABD\\u0AD0\\u0AE0\\u0AE1\\u0B05-\\u0B0C\\u0B0F\\u0B10\\u0B13-\\u0B28\\u0B2A-\\u0B30\\u0B32\\u0B33\\u0B35-\\u0B39\\u0B3D\\u0B5C\\u0B5D\\u0B5F-\\u0B61\\u0B71\\u0B83\\u0B85-\\u0B8A\\u0B8E-\\u0B90\\u0B92-\\u0B95\\u0B99\\u0B9A\\u0B9C\\u0B9E\\u0B9F\\u0BA3\\u0BA4\\u0BA8-\\u0BAA\\u0BAE-\\u0BB9\\u0BD0\\u0C05-\\u0C0C\\u0C0E-\\u0C10\\u0C12-\\u0C28\\u0C2A-\\u0C33\\u0C35-\\u0C39\\u0C3D\\u0C58\\u0C59\\u0C60\\u0C61\\u0C85-\\u0C8C\\u0C8E-\\u0C90\\u0C92-\\u0CA8\\u0CAA-\\u0CB3\\u0CB5-\\u0CB9\\u0CBD\\u0CDE\\u0CE0\\u0CE1\\u0D05-\\u0D0C\\u0D0E-\\u0D10\\u0D12-\\u0D28\\u0D2A-\\u0D39\\u0D3D\\u0D60\\u0D61\\u0D7A-\\u0D7F\\u0D85-\\u0D96\\u0D9A-\\u0DB1\\u0DB3-\\u0DBB\\u0DBD\\u0DC0-\\u0DC6\\u0E01-\\u0E30\\u0E32\\u0E33\\u0E40-\\u0E46\\u0E81\\u0E82\\u0E84\\u0E87\\u0E88\\u0E8A\\u0E8D\\u0E94-\\u0E97\\u0E99-\\u0E9F\\u0EA1-\\u0EA3\\u0EA5\\u0EA7\\u0EAA\\u0EAB\\u0EAD-\\u0EB0\\u0EB2\\u0EB3\\u0EBD\\u0EC0-\\u0EC4\\u0EC6\\u0EDC\\u0EDD\\u0F00\\u0F40-\\u0F47\\u0F49-\\u0F6C\\u0F88-\\u0F8B\\u1000-\\u102A\\u103F\\u1050-\\u1055\\u105A-\\u105D\\u1061\\u1065\\u1066\\u106E-\\u1070\\u1075-\\u1081\\u108E\\u10A0-\\u10C5\\u10D0-\\u10FA\\u10FC\\u1100-\\u1159\\u115F-\\u11A2\\u11A8-\\u11F9\\u1200-\\u1248\\u124A-\\u124D\\u1250-\\u1256\\u1258\\u125A-\\u125D\\u1260-\\u1288\\u128A-\\u128D\\u1290-\\u12B0\\u12B2-\\u12B5\\u12B8-\\u12BE\\u12C0\\u12C2-\\u12C5\\u12C8-\\u12D6\\u12D8-\\u1310\\u1312-\\u1315\\u1318-\\u135A\\u1380-\\u138F\\u13A0-\\u13F4\\u1401-\\u166C\\u166F-\\u1676\\u1681-\\u169A\\u16A0-\\u16EA\\u1700-\\u170C\\u170E-\\u1711\\u1720-\\u1731\\u1740-\\u1751\\u1760-\\u176C\\u176E-\\u1770\\u1780-\\u17B3\\u17D7\\u17DC\\u1820-\\u1877\\u1880-\\u18A8\\u18AA\\u1900-\\u191C\\u1950-\\u196D\\u1970-\\u1974\\u1980-\\u19A9\\u19C1-\\u19C7\\u1A00-\\u1A16\\u1B05-\\u1B33\\u1B45-\\u1B4B\\u1B83-\\u1BA0\\u1BAE\\u1BAF\\u1C00-\\u1C23\\u1C4D-\\u1C4F\\u1C5A-\\u1C7D\\u1D00-\\u1DBF\\u1E00-\\u1F15\\u1F18-\\u1F1D\\u1F20-\\u1F45\\u1F48-\\u1F4D\\u1F50-\\u1F57\\u1F59\\u1F5B\\u1F5D\\u1F5F-\\u1F7D\\u1F80-\\u1FB4\\u1FB6-\\u1FBC\\u1FBE\\u1FC2-\\u1FC4\\u1FC6-\\u1FCC\\u1FD0-\\u1FD3\\u1FD6-\\u1FDB\\u1FE0-\\u1FEC\\u1FF2-\\u1FF4\\u1FF6-\\u1FFC\\u2071\\u207F\\u2090-\\u2094\\u2102\\u2107\\u210A-\\u2113\\u2115\\u2119-\\u211D\\u2124\\u2126\\u2128\\u212A-\\u212D\\u212F-\\u2139\\u213C-\\u213F\\u2145-\\u2149\\u214E\\u2183\\u2184\\u2C00-\\u2C2E\\u2C30-\\u2C5E\\u2C60-\\u2C6F\\u2C71-\\u2C7D\\u2C80-\\u2CE4\\u2D00-\\u2D25\\u2D30-\\u2D65\\u2D6F\\u2D80-\\u2D96\\u2DA0-\\u2DA6\\u2DA8-\\u2DAE\\u2DB0-\\u2DB6\\u2DB8-\\u2DBE\\u2DC0-\\u2DC6\\u2DC8-\\u2DCE\\u2DD0-\\u2DD6\\u2DD8-\\u2DDE\\u2E2F\\u3005\\u3006\\u3031-\\u3035\\u303B\\u303C\\u3041-\\u3096\\u309D-\\u309F\\u30A1-\\u30FA\\u30FC-\\u30FF\\u3105-\\u312D\\u3131-\\u318E\\u31A0-\\u31B7\\u31F0-\\u31FF\\u3400\\u4DB5\\u4E00\\u9FC3\\uA000-\\uA48C\\uA500-\\uA60C\\uA610-\\uA61F\\uA62A\\uA62B\\uA640-\\uA65F\\uA662-\\uA66E\\uA67F-\\uA697\\uA717-\\uA71F\\uA722-\\uA788\\uA78B\\uA78C\\uA7FB-\\uA801\\uA803-\\uA805\\uA807-\\uA80A\\uA80C-\\uA822\\uA840-\\uA873\\uA882-\\uA8B3\\uA90A-\\uA925\\uA930-\\uA946\\uAA00-\\uAA28\\uAA40-\\uAA42\\uAA44-\\uAA4B\\uAC00\\uD7A3\\uF900-\\uFA2D\\uFA30-\\uFA6A\\uFA70-\\uFAD9\\uFB00-\\uFB06\\uFB13-\\uFB17\\uFB1D\\uFB1F-\\uFB28\\uFB2A-\\uFB36\\uFB38-\\uFB3C\\uFB3E\\uFB40\\uFB41\\uFB43\\uFB44\\uFB46-\\uFBB1\\uFBD3-\\uFD3D\\uFD50-\\uFD8F\\uFD92-\\uFDC7\\uFDF0-\\uFDFB\\uFE70-\\uFE74\\uFE76-\\uFEFC\\uFF21-\\uFF3A\\uFF41-\\uFF5A\\uFF66-\\uFFBE\\uFFC2-\\uFFC7\\uFFCA-\\uFFCF\\uFFD2-\\uFFD7\\uFFDA-\\uFFDC]"),
                non_spacing_mark: new RegExp("[\\u0300-\\u036F\\u0483-\\u0487\\u0591-\\u05BD\\u05BF\\u05C1\\u05C2\\u05C4\\u05C5\\u05C7\\u0610-\\u061A\\u064B-\\u065E\\u0670\\u06D6-\\u06DC\\u06DF-\\u06E4\\u06E7\\u06E8\\u06EA-\\u06ED\\u0711\\u0730-\\u074A\\u07A6-\\u07B0\\u07EB-\\u07F3\\u0816-\\u0819\\u081B-\\u0823\\u0825-\\u0827\\u0829-\\u082D\\u0900-\\u0902\\u093C\\u0941-\\u0948\\u094D\\u0951-\\u0955\\u0962\\u0963\\u0981\\u09BC\\u09C1-\\u09C4\\u09CD\\u09E2\\u09E3\\u0A01\\u0A02\\u0A3C\\u0A41\\u0A42\\u0A47\\u0A48\\u0A4B-\\u0A4D\\u0A51\\u0A70\\u0A71\\u0A75\\u0A81\\u0A82\\u0ABC\\u0AC1-\\u0AC5\\u0AC7\\u0AC8\\u0ACD\\u0AE2\\u0AE3\\u0B01\\u0B3C\\u0B3F\\u0B41-\\u0B44\\u0B4D\\u0B56\\u0B62\\u0B63\\u0B82\\u0BC0\\u0BCD\\u0C3E-\\u0C40\\u0C46-\\u0C48\\u0C4A-\\u0C4D\\u0C55\\u0C56\\u0C62\\u0C63\\u0CBC\\u0CBF\\u0CC6\\u0CCC\\u0CCD\\u0CE2\\u0CE3\\u0D41-\\u0D44\\u0D4D\\u0D62\\u0D63\\u0DCA\\u0DD2-\\u0DD4\\u0DD6\\u0E31\\u0E34-\\u0E3A\\u0E47-\\u0E4E\\u0EB1\\u0EB4-\\u0EB9\\u0EBB\\u0EBC\\u0EC8-\\u0ECD\\u0F18\\u0F19\\u0F35\\u0F37\\u0F39\\u0F71-\\u0F7E\\u0F80-\\u0F84\\u0F86\\u0F87\\u0F90-\\u0F97\\u0F99-\\u0FBC\\u0FC6\\u102D-\\u1030\\u1032-\\u1037\\u1039\\u103A\\u103D\\u103E\\u1058\\u1059\\u105E-\\u1060\\u1071-\\u1074\\u1082\\u1085\\u1086\\u108D\\u109D\\u135F\\u1712-\\u1714\\u1732-\\u1734\\u1752\\u1753\\u1772\\u1773\\u17B7-\\u17BD\\u17C6\\u17C9-\\u17D3\\u17DD\\u180B-\\u180D\\u18A9\\u1920-\\u1922\\u1927\\u1928\\u1932\\u1939-\\u193B\\u1A17\\u1A18\\u1A56\\u1A58-\\u1A5E\\u1A60\\u1A62\\u1A65-\\u1A6C\\u1A73-\\u1A7C\\u1A7F\\u1B00-\\u1B03\\u1B34\\u1B36-\\u1B3A\\u1B3C\\u1B42\\u1B6B-\\u1B73\\u1B80\\u1B81\\u1BA2-\\u1BA5\\u1BA8\\u1BA9\\u1C2C-\\u1C33\\u1C36\\u1C37\\u1CD0-\\u1CD2\\u1CD4-\\u1CE0\\u1CE2-\\u1CE8\\u1CED\\u1DC0-\\u1DE6\\u1DFD-\\u1DFF\\u20D0-\\u20DC\\u20E1\\u20E5-\\u20F0\\u2CEF-\\u2CF1\\u2DE0-\\u2DFF\\u302A-\\u302F\\u3099\\u309A\\uA66F\\uA67C\\uA67D\\uA6F0\\uA6F1\\uA802\\uA806\\uA80B\\uA825\\uA826\\uA8C4\\uA8E0-\\uA8F1\\uA926-\\uA92D\\uA947-\\uA951\\uA980-\\uA982\\uA9B3\\uA9B6-\\uA9B9\\uA9BC\\uAA29-\\uAA2E\\uAA31\\uAA32\\uAA35\\uAA36\\uAA43\\uAA4C\\uAAB0\\uAAB2-\\uAAB4\\uAAB7\\uAAB8\\uAABE\\uAABF\\uAAC1\\uABE5\\uABE8\\uABED\\uFB1E\\uFE00-\\uFE0F\\uFE20-\\uFE26]"),
                space_combining_mark: new RegExp("[\\u0903\\u093E-\\u0940\\u0949-\\u094C\\u094E\\u0982\\u0983\\u09BE-\\u09C0\\u09C7\\u09C8\\u09CB\\u09CC\\u09D7\\u0A03\\u0A3E-\\u0A40\\u0A83\\u0ABE-\\u0AC0\\u0AC9\\u0ACB\\u0ACC\\u0B02\\u0B03\\u0B3E\\u0B40\\u0B47\\u0B48\\u0B4B\\u0B4C\\u0B57\\u0BBE\\u0BBF\\u0BC1\\u0BC2\\u0BC6-\\u0BC8\\u0BCA-\\u0BCC\\u0BD7\\u0C01-\\u0C03\\u0C41-\\u0C44\\u0C82\\u0C83\\u0CBE\\u0CC0-\\u0CC4\\u0CC7\\u0CC8\\u0CCA\\u0CCB\\u0CD5\\u0CD6\\u0D02\\u0D03\\u0D3E-\\u0D40\\u0D46-\\u0D48\\u0D4A-\\u0D4C\\u0D57\\u0D82\\u0D83\\u0DCF-\\u0DD1\\u0DD8-\\u0DDF\\u0DF2\\u0DF3\\u0F3E\\u0F3F\\u0F7F\\u102B\\u102C\\u1031\\u1038\\u103B\\u103C\\u1056\\u1057\\u1062-\\u1064\\u1067-\\u106D\\u1083\\u1084\\u1087-\\u108C\\u108F\\u109A-\\u109C\\u17B6\\u17BE-\\u17C5\\u17C7\\u17C8\\u1923-\\u1926\\u1929-\\u192B\\u1930\\u1931\\u1933-\\u1938\\u19B0-\\u19C0\\u19C8\\u19C9\\u1A19-\\u1A1B\\u1A55\\u1A57\\u1A61\\u1A63\\u1A64\\u1A6D-\\u1A72\\u1B04\\u1B35\\u1B3B\\u1B3D-\\u1B41\\u1B43\\u1B44\\u1B82\\u1BA1\\u1BA6\\u1BA7\\u1BAA\\u1C24-\\u1C2B\\u1C34\\u1C35\\u1CE1\\u1CF2\\uA823\\uA824\\uA827\\uA880\\uA881\\uA8B4-\\uA8C3\\uA952\\uA953\\uA983\\uA9B4\\uA9B5\\uA9BA\\uA9BB\\uA9BD-\\uA9C0\\uAA2F\\uAA30\\uAA33\\uAA34\\uAA4D\\uAA7B\\uABE3\\uABE4\\uABE6\\uABE7\\uABE9\\uABEA\\uABEC]"),
                connector_punctuation: new RegExp("[\\u005F\\u203F\\u2040\\u2054\\uFE33\\uFE34\\uFE4D-\\uFE4F\\uFF3F]")
            };
        JS_Parse_Error.prototype.toString = function() {
            return this.message + " (line: " + this.line + ", col: " + this.col + ", pos: " + this.pos + ")\n\n" + this.stack
        };
        var EX_EOF = {},
            UNARY_PREFIX = makePredicate(["typeof", "void", "delete", "--", "++", "!", "~", "-", "+"]),
            UNARY_POSTFIX = makePredicate(["--", "++"]),
            ASSIGNMENT = makePredicate(["=", "+=", "-=", "/=", "*=", "%=", ">>=", "<<=", ">>>=", "|=", "^=", "&="]),
            PRECEDENCE = function(a, ret) {
                for (var i = 0, n = 1; i < a.length; ++i, ++n)
                    for (var b = a[i], j = 0; j < b.length; ++j) ret[b[j]] = n;
                return ret
            }([
                ["||"],
                ["&&"],
                ["|"],
                ["^"],
                ["&"],
                ["==", "===", "!=", "!=="],
                ["<", ">", "<=", ">=", "in", "instanceof"],
                [">>", "<<", ">>>"],
                ["+", "-"],
                ["*", "/", "%"]
            ], {}),
            STATEMENTS_WITH_LABELS = array_to_hash(["for", "do", "while", "switch"]),
            ATOMIC_START_TOKEN = array_to_hash(["atom", "num", "string", "regexp", "name"]);
        TreeTransformer.prototype = new TreeWalker,
            function(undefined) {
                function _(node, descend) {
                    node.DEFMETHOD("transform", function(tw, in_list) {
                        var x, y;
                        return tw.push(this), tw.before && (x = tw.before(this, descend, in_list)), x === undefined && (tw.after ? (tw.stack[tw.stack.length - 1] = x = this.clone(), descend(x, tw), y = tw.after(x, in_list), y !== undefined && (x = y)) : (x = this, descend(x, tw))), tw.pop(), x
                    })
                }

                function do_list(list, tw) {
                    return MAP(list, function(node) {
                        return node.transform(tw, !0)
                    })
                }
                _(AST_Node, noop), _(AST_LabeledStatement, function(self, tw) {
                    self.label = self.label.transform(tw), self.body = self.body.transform(tw)
                }), _(AST_SimpleStatement, function(self, tw) {
                    self.body = self.body.transform(tw)
                }), _(AST_Block, function(self, tw) {
                    self.body = do_list(self.body, tw)
                }), _(AST_DWLoop, function(self, tw) {
                    self.condition = self.condition.transform(tw), self.body = self.body.transform(tw)
                }), _(AST_For, function(self, tw) {
                    self.init && (self.init = self.init.transform(tw)), self.condition && (self.condition = self.condition.transform(tw)), self.step && (self.step = self.step.transform(tw)), self.body = self.body.transform(tw)
                }), _(AST_ForIn, function(self, tw) {
                    self.init = self.init.transform(tw), self.object = self.object.transform(tw), self.body = self.body.transform(tw)
                }), _(AST_With, function(self, tw) {
                    self.expression = self.expression.transform(tw), self.body = self.body.transform(tw)
                }), _(AST_Exit, function(self, tw) {
                    self.value && (self.value = self.value.transform(tw))
                }), _(AST_LoopControl, function(self, tw) {
                    self.label && (self.label = self.label.transform(tw))
                }), _(AST_If, function(self, tw) {
                    self.condition = self.condition.transform(tw), self.body = self.body.transform(tw), self.alternative && (self.alternative = self.alternative.transform(tw))
                }), _(AST_Switch, function(self, tw) {
                    self.expression = self.expression.transform(tw), self.body = do_list(self.body, tw)
                }), _(AST_Case, function(self, tw) {
                    self.expression = self.expression.transform(tw), self.body = do_list(self.body, tw)
                }), _(AST_Try, function(self, tw) {
                    self.body = do_list(self.body, tw), self.bcatch && (self.bcatch = self.bcatch.transform(tw)), self.bfinally && (self.bfinally = self.bfinally.transform(tw))
                }), _(AST_Catch, function(self, tw) {
                    self.argname = self.argname.transform(tw), self.body = do_list(self.body, tw)
                }), _(AST_Definitions, function(self, tw) {
                    self.definitions = do_list(self.definitions, tw)
                }), _(AST_VarDef, function(self, tw) {
                    self.name = self.name.transform(tw), self.value && (self.value = self.value.transform(tw))
                }), _(AST_Lambda, function(self, tw) {
                    self.name && (self.name = self.name.transform(tw)), self.argnames = do_list(self.argnames, tw), self.body = do_list(self.body, tw)
                }), _(AST_Call, function(self, tw) {
                    self.expression = self.expression.transform(tw), self.args = do_list(self.args, tw)
                }), _(AST_Seq, function(self, tw) {
                    self.car = self.car.transform(tw), self.cdr = self.cdr.transform(tw)
                }), _(AST_Dot, function(self, tw) {
                    self.expression = self.expression.transform(tw)
                }), _(AST_Sub, function(self, tw) {
                    self.expression = self.expression.transform(tw), self.property = self.property.transform(tw)
                }), _(AST_Unary, function(self, tw) {
                    self.expression = self.expression.transform(tw)
                }), _(AST_Binary, function(self, tw) {
                    self.left = self.left.transform(tw), self.right = self.right.transform(tw)
                }), _(AST_Conditional, function(self, tw) {
                    self.condition = self.condition.transform(tw), self.consequent = self.consequent.transform(tw), self.alternative = self.alternative.transform(tw)
                }), _(AST_Array, function(self, tw) {
                    self.elements = do_list(self.elements, tw)
                }), _(AST_Object, function(self, tw) {
                    self.properties = do_list(self.properties, tw)
                }), _(AST_ObjectProperty, function(self, tw) {
                    self.value = self.value.transform(tw)
                })
            }(), SymbolDef.prototype = {
                unmangleable: function(options) {
                    return this.global && !(options && options.toplevel) || this.undeclared || !(options && options.eval) && (this.scope.uses_eval || this.scope.uses_with)
                },
                mangle: function(options) {
                    if (!this.mangled_name && !this.unmangleable(options)) {
                        var s = this.scope;
                        this.orig[0] instanceof AST_SymbolLambda && !options.screw_ie8 && (s = s.parent_scope), this.mangled_name = s.next_mangled(options)
                    }
                }
            }, AST_Toplevel.DEFMETHOD("figure_out_scope", function() {
                var self = this,
                    scope = self.parent_scope = null,
                    nesting = 0,
                    tw = new TreeWalker(function(node, descend) {
                        if (node instanceof AST_Scope) {
                            node.init_scope_vars(nesting);
                            var save_scope = node.parent_scope = scope;
                            return ++nesting, scope = node, descend(), scope = save_scope, --nesting, !0
                        }
                        if (node instanceof AST_Directive) return node.scope = scope, push_uniq(scope.directives, node.value), !0;
                        if (node instanceof AST_With)
                            for (var s = scope; s; s = s.parent_scope) s.uses_with = !0;
                        else if (node instanceof AST_Symbol && (node.scope = scope), node instanceof AST_SymbolLambda) scope.def_function(node);
                        else if (node instanceof AST_SymbolDefun)(node.scope = scope.parent_scope).def_function(node);
                        else if (node instanceof AST_SymbolVar || node instanceof AST_SymbolConst) {
                            var def = scope.def_variable(node);
                            def.constant = node instanceof AST_SymbolConst, def.init = tw.parent().value
                        } else node instanceof AST_SymbolCatch && scope.def_variable(node)
                    });
                self.walk(tw);
                var func = null,
                    globals = self.globals = new Dictionary,
                    tw = new TreeWalker(function(node, descend) {
                        if (node instanceof AST_Lambda) {
                            var prev_func = func;
                            return func = node, descend(), func = prev_func, !0
                        }
                        if (node instanceof AST_SymbolRef) {
                            var name = node.name,
                                sym = node.scope.find_variable(name);
                            if (sym) node.thedef = sym;
                            else {
                                var g;
                                if (globals.has(name) ? g = globals.get(name) : (g = new SymbolDef(self, globals.size(), node), g.undeclared = !0, g.global = !0, globals.set(name, g)), node.thedef = g, "eval" == name && tw.parent() instanceof AST_Call)
                                    for (var s = node.scope; s && !s.uses_eval; s = s.parent_scope) s.uses_eval = !0;
                                func && "arguments" == name && (func.uses_arguments = !0)
                            }
                            return node.reference(), !0
                        }
                    });
                self.walk(tw)
            }), AST_Scope.DEFMETHOD("init_scope_vars", function(nesting) {
                this.directives = [], this.variables = new Dictionary, this.functions = new Dictionary, this.uses_with = !1, this.uses_eval = !1, this.parent_scope = null, this.enclosed = [], this.cname = -1, this.nesting = nesting
            }), AST_Scope.DEFMETHOD("strict", function() {
                return this.has_directive("use strict")
            }), AST_Lambda.DEFMETHOD("init_scope_vars", function() {
                AST_Scope.prototype.init_scope_vars.apply(this, arguments), this.uses_arguments = !1
            }), AST_SymbolRef.DEFMETHOD("reference", function() {
                var def = this.definition();
                def.references.push(this);
                for (var s = this.scope; s && (push_uniq(s.enclosed, def), s !== def.scope);) s = s.parent_scope;
                this.frame = this.scope.nesting - def.scope.nesting
            }), AST_Scope.DEFMETHOD("find_variable", function(name) {
                return name instanceof AST_Symbol && (name = name.name), this.variables.get(name) || this.parent_scope && this.parent_scope.find_variable(name)
            }), AST_Scope.DEFMETHOD("has_directive", function(value) {
                return this.parent_scope && this.parent_scope.has_directive(value) || (this.directives.indexOf(value) >= 0 ? this : null)
            }), AST_Scope.DEFMETHOD("def_function", function(symbol) {
                this.functions.set(symbol.name, this.def_variable(symbol))
            }), AST_Scope.DEFMETHOD("def_variable", function(symbol) {
                var def;
                return this.variables.has(symbol.name) ? (def = this.variables.get(symbol.name), def.orig.push(symbol)) : (def = new SymbolDef(this, this.variables.size(), symbol), this.variables.set(symbol.name, def), def.global = !this.parent_scope), symbol.thedef = def
            }), AST_Scope.DEFMETHOD("next_mangled", function(options) {
                var ext = this.enclosed;
                out: for (;;) {
                    var m = base54(++this.cname);
                    if (is_identifier(m)) {
                        for (var i = ext.length; --i >= 0;) {
                            var sym = ext[i],
                                name = sym.mangled_name || sym.unmangleable(options) && sym.name;
                            if (m == name) continue out
                        }
                        return m
                    }
                }
            }), AST_Scope.DEFMETHOD("references", function(sym) {
                return sym instanceof AST_Symbol && (sym = sym.definition()), this.enclosed.indexOf(sym) < 0 ? null : sym
            }), AST_Symbol.DEFMETHOD("unmangleable", function(options) {
                return this.definition().unmangleable(options)
            }), AST_SymbolAccessor.DEFMETHOD("unmangleable", function() {
                return !0
            }), AST_Label.DEFMETHOD("unmangleable", function() {
                return !1
            }), AST_Symbol.DEFMETHOD("unreferenced", function() {
                return 0 == this.definition().references.length && !(this.scope.uses_eval || this.scope.uses_with)
            }), AST_Symbol.DEFMETHOD("undeclared", function() {
                return this.definition().undeclared
            }), AST_LabelRef.DEFMETHOD("undeclared", function() {
                return !1
            }), AST_Label.DEFMETHOD("undeclared", function() {
                return !1
            }), AST_Symbol.DEFMETHOD("definition", function() {
                return this.thedef
            }), AST_Symbol.DEFMETHOD("global", function() {
                return this.definition().global
            }), AST_Toplevel.DEFMETHOD("_default_mangler_options", function(options) {
                return defaults(options, {
                    except: [],
                    eval: !1,
                    sort: !1,
                    toplevel: !1,
                    screw_ie8: !1
                })
            }), AST_Toplevel.DEFMETHOD("mangle_names", function(options) {
                options = this._default_mangler_options(options);
                var lname = -1,
                    to_mangle = [],
                    tw = new TreeWalker(function(node, descend) {
                        if (node instanceof AST_LabeledStatement) {
                            var save_nesting = lname;
                            return descend(), lname = save_nesting, !0
                        }
                        if (node instanceof AST_Scope) {
                            var a = (tw.parent(), []);
                            return node.variables.each(function(symbol) {
                                options.except.indexOf(symbol.name) < 0 && a.push(symbol)
                            }), options.sort && a.sort(function(a, b) {
                                return b.references.length - a.references.length
                            }), to_mangle.push.apply(to_mangle, a), void 0
                        }
                        if (node instanceof AST_Label) {
                            var name;
                            do name = base54(++lname); while (!is_identifier(name));
                            return node.mangled_name = name, !0
                        }
                    });
                this.walk(tw), to_mangle.forEach(function(def) {
                    def.mangle(options)
                })
            }), AST_Toplevel.DEFMETHOD("compute_char_frequency", function(options) {
                options = this._default_mangler_options(options);
                var tw = new TreeWalker(function(node) {
                    node instanceof AST_Constant ? base54.consider(node.print_to_string()) : node instanceof AST_Return ? base54.consider("return") : node instanceof AST_Throw ? base54.consider("throw") : node instanceof AST_Continue ? base54.consider("continue") : node instanceof AST_Break ? base54.consider("break") : node instanceof AST_Debugger ? base54.consider("debugger") : node instanceof AST_Directive ? base54.consider(node.value) : node instanceof AST_While ? base54.consider("while") : node instanceof AST_Do ? base54.consider("do while") : node instanceof AST_If ? (base54.consider("if"), node.alternative && base54.consider("else")) : node instanceof AST_Var ? base54.consider("var") : node instanceof AST_Const ? base54.consider("const") : node instanceof AST_Lambda ? base54.consider("function") : node instanceof AST_For ? base54.consider("for") : node instanceof AST_ForIn ? base54.consider("for in") : node instanceof AST_Switch ? base54.consider("switch") : node instanceof AST_Case ? base54.consider("case") : node instanceof AST_Default ? base54.consider("default") : node instanceof AST_With ? base54.consider("with") : node instanceof AST_ObjectSetter ? base54.consider("set" + node.key) : node instanceof AST_ObjectGetter ? base54.consider("get" + node.key) : node instanceof AST_ObjectKeyVal ? base54.consider(node.key) : node instanceof AST_New ? base54.consider("new") : node instanceof AST_This ? base54.consider("this") : node instanceof AST_Try ? base54.consider("try") : node instanceof AST_Catch ? base54.consider("catch") : node instanceof AST_Finally ? base54.consider("finally") : node instanceof AST_Symbol && node.unmangleable(options) ? base54.consider(node.name) : node instanceof AST_Unary || node instanceof AST_Binary ? base54.consider(node.operator) : node instanceof AST_Dot && base54.consider(node.property)
                });
                this.walk(tw), base54.sort()
            });
        var base54 = function() {
            function reset() {
                frequency = Object.create(null), chars = string.split("").map(function(ch) {
                    return ch.charCodeAt(0)
                }), chars.forEach(function(ch) {
                    frequency[ch] = 0
                })
            }

            function base54(num) {
                var ret = "",
                    base = 54;
                do ret += String.fromCharCode(chars[num % base]), num = Math.floor(num / base), base = 64; while (num > 0);
                return ret
            }
            var chars, frequency, string = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$_0123456789";
            return base54.consider = function(str) {
                for (var i = str.length; --i >= 0;) {
                    var code = str.charCodeAt(i);
                    code in frequency && ++frequency[code]
                }
            }, base54.sort = function() {
                chars = mergeSort(chars, function(a, b) {
                    return is_digit(a) && !is_digit(b) ? 1 : is_digit(b) && !is_digit(a) ? -1 : frequency[b] - frequency[a]
                })
            }, base54.reset = reset, reset(), base54.get = function() {
                return chars
            }, base54.freq = function() {
                return frequency
            }, base54
        }();
        AST_Toplevel.DEFMETHOD("scope_warnings", function(options) {
                options = defaults(options, {
                    undeclared: !1,
                    unreferenced: !0,
                    assign_to_global: !0,
                    func_arguments: !0,
                    nested_defuns: !0,
                    eval: !0
                });
                var tw = new TreeWalker(function(node) {
                    if (options.undeclared && node instanceof AST_SymbolRef && node.undeclared() && AST_Node.warn("Undeclared symbol: {name} [{file}:{line},{col}]", {
                            name: node.name,
                            file: node.start.file,
                            line: node.start.line,
                            col: node.start.col
                        }), options.assign_to_global) {
                        var sym = null;
                        node instanceof AST_Assign && node.left instanceof AST_SymbolRef ? sym = node.left : node instanceof AST_ForIn && node.init instanceof AST_SymbolRef && (sym = node.init), sym && (sym.undeclared() || sym.global() && sym.scope !== sym.definition().scope) && AST_Node.warn("{msg}: {name} [{file}:{line},{col}]", {
                            msg: sym.undeclared() ? "Accidental global?" : "Assignment to global",
                            name: sym.name,
                            file: sym.start.file,
                            line: sym.start.line,
                            col: sym.start.col
                        })
                    }
                    options.eval && node instanceof AST_SymbolRef && node.undeclared() && "eval" == node.name && AST_Node.warn("Eval is used [{file}:{line},{col}]", node.start), options.unreferenced && (node instanceof AST_SymbolDeclaration || node instanceof AST_Label) && node.unreferenced() && AST_Node.warn("{type} {name} is declared but not referenced [{file}:{line},{col}]", {
                        type: node instanceof AST_Label ? "Label" : "Symbol",
                        name: node.name,
                        file: node.start.file,
                        line: node.start.line,
                        col: node.start.col
                    }), options.func_arguments && node instanceof AST_Lambda && node.uses_arguments && AST_Node.warn("arguments used in function {name} [{file}:{line},{col}]", {
                        name: node.name ? node.name.name : "anonymous",
                        file: node.start.file,
                        line: node.start.line,
                        col: node.start.col
                    }), options.nested_defuns && node instanceof AST_Defun && !(tw.parent() instanceof AST_Scope) && AST_Node.warn('Function {name} declared in nested statement "{type}" [{file}:{line},{col}]', {
                        name: node.name.name,
                        type: tw.parent().TYPE,
                        file: node.start.file,
                        line: node.start.line,
                        col: node.start.col
                    })
                });
                this.walk(tw)
            }),
            function() {
                function DEFPRINT(nodetype, generator) {
                    nodetype.DEFMETHOD("_codegen", generator)
                }

                function PARENS(nodetype, func) {
                    nodetype.DEFMETHOD("needs_parens", func)
                }

                function assign_and_conditional_paren_rules(output) {
                    var p = output.parent();
                    return p instanceof AST_Unary ? !0 : p instanceof AST_Binary && !(p instanceof AST_Assign) ? !0 : p instanceof AST_Call && p.expression === this ? !0 : p instanceof AST_Conditional && p.condition === this ? !0 : p instanceof AST_PropAccess && p.expression === this ? !0 : void 0
                }

                function display_body(body, is_toplevel, output) {
                    var last = body.length - 1;
                    body.forEach(function(stmt, i) {
                        stmt instanceof AST_EmptyStatement || (output.indent(), stmt.print(output), i == last && is_toplevel || (output.newline(), is_toplevel && output.newline()))
                    })
                }

                function print_bracketed(body, output) {
                    body.length > 0 ? output.with_block(function() {
                        display_body(body, !1, output)
                    }) : output.print("{}")
                }

                function make_then(self, output) {
                    if (output.option("bracketize")) return make_block(self.body, output), void 0;
                    if (!self.body) return output.force_semicolon();
                    if (self.body instanceof AST_Do && !output.option("screw_ie8")) return make_block(self.body, output), void 0;
                    for (var b = self.body;;)
                        if (b instanceof AST_If) {
                            if (!b.alternative) return make_block(self.body, output), void 0;
                            b = b.alternative
                        } else {
                            if (!(b instanceof AST_StatementWithBody)) break;
                            b = b.body
                        }
                    force_statement(self.body, output)
                }

                function parenthesize_for_noin(node, output, noin) {
                    if (noin) try {
                        node.walk(new TreeWalker(function(node) {
                            if (node instanceof AST_Binary && "in" == node.operator) throw output
                        })), node.print(output)
                    } catch (ex) {
                        if (ex !== output) throw ex;
                        node.print(output, !0)
                    } else node.print(output)
                }

                function force_statement(stat, output) {
                    output.option("bracketize") ? !stat || stat instanceof AST_EmptyStatement ? output.print("{}") : stat instanceof AST_BlockStatement ? stat.print(output) : output.with_block(function() {
                        output.indent(), stat.print(output), output.newline()
                    }) : !stat || stat instanceof AST_EmptyStatement ? output.force_semicolon() : stat.print(output)
                }

                function first_in_statement(output) {
                    for (var a = output.stack(), i = a.length, node = a[--i], p = a[--i]; i > 0;) {
                        if (p instanceof AST_Statement && p.body === node) return !0;
                        if (!(p instanceof AST_Seq && p.car === node || p instanceof AST_Call && p.expression === node && !(p instanceof AST_New) || p instanceof AST_Dot && p.expression === node || p instanceof AST_Sub && p.expression === node || p instanceof AST_Conditional && p.condition === node || p instanceof AST_Binary && p.left === node || p instanceof AST_UnaryPostfix && p.expression === node)) return !1;
                        node = p, p = a[--i]
                    }
                }

                function no_constructor_parens(self, output) {
                    return 0 == self.args.length && !output.option("beautify")
                }

                function best_of(a) {
                    for (var best = a[0], len = best.length, i = 1; i < a.length; ++i) a[i].length < len && (best = a[i], len = best.length);
                    return best
                }

                function make_num(num) {
                    var m, str = num.toString(10),
                        a = [str.replace(/^0\./, ".").replace("e+", "e")];
                    return Math.floor(num) === num ? (num >= 0 ? a.push("0x" + num.toString(16).toLowerCase(), "0" + num.toString(8)) : a.push("-0x" + (-num).toString(16).toLowerCase(), "-0" + (-num).toString(8)), (m = /^(.*?)(0+)$/.exec(num)) && a.push(m[1] + "e" + m[2].length)) : (m = /^0?\.(0+)(.*)$/.exec(num)) && a.push(m[2] + "e-" + (m[1].length + m[2].length), str.substr(str.indexOf("."))), best_of(a)
                }

                function make_block(stmt, output) {
                    return stmt instanceof AST_BlockStatement ? (stmt.print(output), void 0) : (output.with_block(function() {
                        output.indent(), stmt.print(output), output.newline()
                    }), void 0)
                }

                function DEFMAP(nodetype, generator) {
                    nodetype.DEFMETHOD("add_source_map", function(stream) {
                        generator(this, stream)
                    })
                }

                function basic_sourcemap_gen(self, output) {
                    output.add_mapping(self.start)
                }
                AST_Node.DEFMETHOD("print", function(stream, force_parens) {
                    function doit() {
                        self.add_comments(stream), self.add_source_map(stream), generator(self, stream)
                    }
                    var self = this,
                        generator = self._codegen;
                    stream.push_node(self), force_parens || self.needs_parens(stream) ? stream.with_parens(doit) : doit(), stream.pop_node()
                }), AST_Node.DEFMETHOD("print_to_string", function(options) {
                    var s = OutputStream(options);
                    return this.print(s), s.get()
                }), AST_Node.DEFMETHOD("add_comments", function(output) {
                    var c = output.option("comments"),
                        self = this;
                    if (c) {
                        var start = self.start;
                        if (start && !start._comments_dumped) {
                            start._comments_dumped = !0;
                            var comments = start.comments_before;
                            self instanceof AST_Exit && self.value && self.value.start.comments_before.length > 0 && (comments = (comments || []).concat(self.value.start.comments_before), self.value.start.comments_before = []), c.test ? comments = comments.filter(function(comment) {
                                return c.test(comment.value)
                            }) : "function" == typeof c && (comments = comments.filter(function(comment) {
                                return c(self, comment)
                            })), comments.forEach(function(c) {
                                /comment[134]/.test(c.type) ? (output.print("//" + c.value + "\n"), output.indent()) : "comment2" == c.type && (output.print("/*" + c.value + "*/"), start.nlb ? (output.print("\n"), output.indent()) : output.space())
                            })
                        }
                    }
                }), PARENS(AST_Node, function() {
                    return !1
                }), PARENS(AST_Function, function(output) {
                    return first_in_statement(output)
                }), PARENS(AST_Object, function(output) {
                    return first_in_statement(output)
                }), PARENS(AST_Unary, function(output) {
                    var p = output.parent();
                    return p instanceof AST_PropAccess && p.expression === this
                }), PARENS(AST_Seq, function(output) {
                    var p = output.parent();
                    return p instanceof AST_Call || p instanceof AST_Unary || p instanceof AST_Binary || p instanceof AST_VarDef || p instanceof AST_Dot || p instanceof AST_Array || p instanceof AST_ObjectProperty || p instanceof AST_Conditional
                }), PARENS(AST_Binary, function(output) {
                    var p = output.parent();
                    if (p instanceof AST_Call && p.expression === this) return !0;
                    if (p instanceof AST_Unary) return !0;
                    if (p instanceof AST_PropAccess && p.expression === this) return !0;
                    if (p instanceof AST_Binary) {
                        var po = p.operator,
                            pp = PRECEDENCE[po],
                            so = this.operator,
                            sp = PRECEDENCE[so];
                        if (pp > sp || pp == sp && this === p.right && (so != po || "*" != so && "&&" != so && "||" != so)) return !0
                    }
                }), PARENS(AST_PropAccess, function(output) {
                    var p = output.parent();
                    if (p instanceof AST_New && p.expression === this) try {
                        this.walk(new TreeWalker(function(node) {
                            if (node instanceof AST_Call) throw p
                        }))
                    } catch (ex) {
                        if (ex !== p) throw ex;
                        return !0
                    }
                }), PARENS(AST_Call, function(output) {
                    var p = output.parent();
                    return p instanceof AST_New && p.expression === this
                }), PARENS(AST_New, function(output) {
                    var p = output.parent();
                    return no_constructor_parens(this, output) && (p instanceof AST_PropAccess || p instanceof AST_Call && p.expression === this) ? !0 : void 0
                }), PARENS(AST_Number, function(output) {
                    var p = output.parent();
                    return this.getValue() < 0 && p instanceof AST_PropAccess && p.expression === this ? !0 : void 0
                }), PARENS(AST_NaN, function(output) {
                    var p = output.parent();
                    return p instanceof AST_PropAccess && p.expression === this ? !0 : void 0
                }), PARENS(AST_Assign, assign_and_conditional_paren_rules), PARENS(AST_Conditional, assign_and_conditional_paren_rules), DEFPRINT(AST_Directive, function(self, output) {
                    output.print_string(self.value), output.semicolon()
                }), DEFPRINT(AST_Debugger, function(self, output) {
                    output.print("debugger"), output.semicolon()
                }), AST_StatementWithBody.DEFMETHOD("_do_print_body", function(output) {
                    force_statement(this.body, output)
                }), DEFPRINT(AST_Statement, function(self, output) {
                    self.body.print(output), output.semicolon()
                }), DEFPRINT(AST_Toplevel, function(self, output) {
                    display_body(self.body, !0, output), output.print("")
                }), DEFPRINT(AST_LabeledStatement, function(self, output) {
                    self.label.print(output), output.colon(), self.body.print(output)
                }), DEFPRINT(AST_SimpleStatement, function(self, output) {
                    self.body.print(output), output.semicolon()
                }), DEFPRINT(AST_BlockStatement, function(self, output) {
                    print_bracketed(self.body, output)
                }), DEFPRINT(AST_EmptyStatement, function(self, output) {
                    output.semicolon()
                }), DEFPRINT(AST_Do, function(self, output) {
                    output.print("do"), output.space(), self._do_print_body(output), output.space(), output.print("while"), output.space(), output.with_parens(function() {
                        self.condition.print(output)
                    }), output.semicolon()
                }), DEFPRINT(AST_While, function(self, output) {
                    output.print("while"), output.space(), output.with_parens(function() {
                        self.condition.print(output)
                    }), output.space(), self._do_print_body(output)
                }), DEFPRINT(AST_For, function(self, output) {
                    output.print("for"), output.space(), output.with_parens(function() {
                        self.init ? (self.init instanceof AST_Definitions ? self.init.print(output) : parenthesize_for_noin(self.init, output, !0), output.print(";"), output.space()) : output.print(";"), self.condition ? (self.condition.print(output), output.print(";"), output.space()) : output.print(";"), self.step && self.step.print(output)
                    }), output.space(), self._do_print_body(output)
                }), DEFPRINT(AST_ForIn, function(self, output) {
                    output.print("for"), output.space(), output.with_parens(function() {
                        self.init.print(output), output.space(), output.print("in"), output.space(), self.object.print(output)
                    }), output.space(), self._do_print_body(output)
                }), DEFPRINT(AST_With, function(self, output) {
                    output.print("with"), output.space(), output.with_parens(function() {
                        self.expression.print(output)
                    }), output.space(), self._do_print_body(output)
                }), AST_Lambda.DEFMETHOD("_do_print", function(output, nokeyword) {
                    var self = this;
                    nokeyword || output.print("function"), self.name && (output.space(), self.name.print(output)), output.with_parens(function() {
                        self.argnames.forEach(function(arg, i) {
                            i && output.comma(), arg.print(output)
                        })
                    }), output.space(), print_bracketed(self.body, output)
                }), DEFPRINT(AST_Lambda, function(self, output) {
                    self._do_print(output)
                }), AST_Exit.DEFMETHOD("_do_print", function(output, kind) {
                    output.print(kind), this.value && (output.space(), this.value.print(output)), output.semicolon()
                }), DEFPRINT(AST_Return, function(self, output) {
                    self._do_print(output, "return")
                }), DEFPRINT(AST_Throw, function(self, output) {
                    self._do_print(output, "throw")
                }), AST_LoopControl.DEFMETHOD("_do_print", function(output, kind) {
                    output.print(kind), this.label && (output.space(), this.label.print(output)), output.semicolon()
                }), DEFPRINT(AST_Break, function(self, output) {
                    self._do_print(output, "break")
                }), DEFPRINT(AST_Continue, function(self, output) {
                    self._do_print(output, "continue")
                }), DEFPRINT(AST_If, function(self, output) {
                    output.print("if"), output.space(), output.with_parens(function() {
                        self.condition.print(output)
                    }), output.space(), self.alternative ? (make_then(self, output), output.space(), output.print("else"), output.space(), force_statement(self.alternative, output)) : self._do_print_body(output)
                }), DEFPRINT(AST_Switch, function(self, output) {
                    output.print("switch"), output.space(), output.with_parens(function() {
                        self.expression.print(output)
                    }), output.space(), self.body.length > 0 ? output.with_block(function() {
                        self.body.forEach(function(stmt, i) {
                            i && output.newline(), output.indent(!0), stmt.print(output)
                        })
                    }) : output.print("{}")
                }), AST_SwitchBranch.DEFMETHOD("_do_print_body", function(output) {
                    this.body.length > 0 && (output.newline(), this.body.forEach(function(stmt) {
                        output.indent(), stmt.print(output), output.newline()
                    }))
                }), DEFPRINT(AST_Default, function(self, output) {
                    output.print("default:"), self._do_print_body(output)
                }), DEFPRINT(AST_Case, function(self, output) {
                    output.print("case"), output.space(), self.expression.print(output), output.print(":"), self._do_print_body(output)
                }), DEFPRINT(AST_Try, function(self, output) {
                    output.print("try"), output.space(), print_bracketed(self.body, output), self.bcatch && (output.space(), self.bcatch.print(output)), self.bfinally && (output.space(), self.bfinally.print(output))
                }), DEFPRINT(AST_Catch, function(self, output) {
                    output.print("catch"), output.space(), output.with_parens(function() {
                        self.argname.print(output)
                    }), output.space(), print_bracketed(self.body, output)
                }), DEFPRINT(AST_Finally, function(self, output) {
                    output.print("finally"), output.space(), print_bracketed(self.body, output)
                }), AST_Definitions.DEFMETHOD("_do_print", function(output, kind) {
                    output.print(kind), output.space(), this.definitions.forEach(function(def, i) {
                        i && output.comma(), def.print(output)
                    });
                    var p = output.parent(),
                        in_for = p instanceof AST_For || p instanceof AST_ForIn,
                        avoid_semicolon = in_for && p.init === this;
                    avoid_semicolon || output.semicolon()
                }), DEFPRINT(AST_Var, function(self, output) {
                    self._do_print(output, "var")
                }), DEFPRINT(AST_Const, function(self, output) {
                    self._do_print(output, "const")
                }), DEFPRINT(AST_VarDef, function(self, output) {
                    if (self.name.print(output), self.value) {
                        output.space(), output.print("="), output.space();
                        var p = output.parent(1),
                            noin = p instanceof AST_For || p instanceof AST_ForIn;
                        parenthesize_for_noin(self.value, output, noin)
                    }
                }), DEFPRINT(AST_Call, function(self, output) {
                    self.expression.print(output), self instanceof AST_New && no_constructor_parens(self, output) || output.with_parens(function() {
                        self.args.forEach(function(expr, i) {
                            i && output.comma(), expr.print(output)
                        })
                    })
                }), DEFPRINT(AST_New, function(self, output) {
                    output.print("new"), output.space(), AST_Call.prototype._codegen(self, output)
                }), AST_Seq.DEFMETHOD("_do_print", function(output) {
                    this.car.print(output), this.cdr && (output.comma(), output.should_break() && (output.newline(), output.indent()), this.cdr.print(output))
                }), DEFPRINT(AST_Seq, function(self, output) {
                    self._do_print(output)
                }), DEFPRINT(AST_Dot, function(self, output) {
                    var expr = self.expression;
                    expr.print(output), expr instanceof AST_Number && expr.getValue() >= 0 && (/[xa-f.]/i.test(output.last()) || output.print(".")), output.print("."), output.add_mapping(self.end), output.print_name(self.property)
                }), DEFPRINT(AST_Sub, function(self, output) {
                    self.expression.print(output), output.print("["), self.property.print(output), output.print("]")
                }), DEFPRINT(AST_UnaryPrefix, function(self, output) {
                    var op = self.operator;
                    output.print(op), /^[a-z]/i.test(op) && output.space(), self.expression.print(output)
                }), DEFPRINT(AST_UnaryPostfix, function(self, output) {
                    self.expression.print(output), output.print(self.operator)
                }), DEFPRINT(AST_Binary, function(self, output) {
                    self.left.print(output), output.space(), output.print(self.operator), "<" == self.operator && self.right instanceof AST_UnaryPrefix && "!" == self.right.operator && self.right.expression instanceof AST_UnaryPrefix && "--" == self.right.expression.operator ? output.print(" ") : output.space(), self.right.print(output)
                }), DEFPRINT(AST_Conditional, function(self, output) {
                    self.condition.print(output), output.space(), output.print("?"), output.space(), self.consequent.print(output), output.space(), output.colon(), self.alternative.print(output)
                }), DEFPRINT(AST_Array, function(self, output) {
                    output.with_square(function() {
                        var a = self.elements,
                            len = a.length;
                        len > 0 && output.space(), a.forEach(function(exp, i) {
                            i && output.comma(), exp.print(output), i === len - 1 && exp instanceof AST_Hole && output.comma()
                        }), len > 0 && output.space()
                    })
                }), DEFPRINT(AST_Object, function(self, output) {
                    self.properties.length > 0 ? output.with_block(function() {
                        self.properties.forEach(function(prop, i) {
                            i && (output.print(","), output.newline()), output.indent(), prop.print(output)
                        }), output.newline()
                    }) : output.print("{}")
                }), DEFPRINT(AST_ObjectKeyVal, function(self, output) {
                    var key = self.key;
                    output.option("quote_keys") ? output.print_string(key + "") : ("number" == typeof key || !output.option("beautify") && +key + "" == key) && parseFloat(key) >= 0 ? output.print(make_num(key)) : (RESERVED_WORDS(key) ? output.option("screw_ie8") : is_identifier_string(key)) ? output.print_name(key) : output.print_string(key), output.colon(), self.value.print(output)
                }), DEFPRINT(AST_ObjectSetter, function(self, output) {
                    output.print("set"), self.value._do_print(output, !0)
                }), DEFPRINT(AST_ObjectGetter, function(self, output) {
                    output.print("get"), self.value._do_print(output, !0)
                }), DEFPRINT(AST_Symbol, function(self, output) {
                    var def = self.definition();
                    output.print_name(def ? def.mangled_name || def.name : self.name)
                }), DEFPRINT(AST_Undefined, function(self, output) {
                    output.print("void 0")
                }), DEFPRINT(AST_Hole, noop), DEFPRINT(AST_Infinity, function(self, output) {
                    output.print("1/0")
                }), DEFPRINT(AST_NaN, function(self, output) {
                    output.print("0/0")
                }), DEFPRINT(AST_This, function(self, output) {
                    output.print("this")
                }), DEFPRINT(AST_Constant, function(self, output) {
                    output.print(self.getValue())
                }), DEFPRINT(AST_String, function(self, output) {
                    output.print_string(self.getValue())
                }), DEFPRINT(AST_Number, function(self, output) {
                    output.print(make_num(self.getValue()))
                }), DEFPRINT(AST_RegExp, function(self, output) {
                    var str = self.getValue().toString();
                    output.option("ascii_only") && (str = output.to_ascii(str)), output.print(str);
                    var p = output.parent();
                    p instanceof AST_Binary && /^in/.test(p.operator) && p.left === self && output.print(" ")
                }), DEFMAP(AST_Node, noop), DEFMAP(AST_Directive, basic_sourcemap_gen), DEFMAP(AST_Debugger, basic_sourcemap_gen), DEFMAP(AST_Symbol, basic_sourcemap_gen), DEFMAP(AST_Jump, basic_sourcemap_gen), DEFMAP(AST_StatementWithBody, basic_sourcemap_gen), DEFMAP(AST_LabeledStatement, noop), DEFMAP(AST_Lambda, basic_sourcemap_gen), DEFMAP(AST_Switch, basic_sourcemap_gen), DEFMAP(AST_SwitchBranch, basic_sourcemap_gen), DEFMAP(AST_BlockStatement, basic_sourcemap_gen), DEFMAP(AST_Toplevel, noop), DEFMAP(AST_New, basic_sourcemap_gen), DEFMAP(AST_Try, basic_sourcemap_gen), DEFMAP(AST_Catch, basic_sourcemap_gen), DEFMAP(AST_Finally, basic_sourcemap_gen), DEFMAP(AST_Definitions, basic_sourcemap_gen), DEFMAP(AST_Constant, basic_sourcemap_gen), DEFMAP(AST_ObjectProperty, function(self, output) {
                    output.add_mapping(self.start, self.key)
                })
            }(), Compressor.prototype = new TreeTransformer, merge(Compressor.prototype, {
                option: function(key) {
                    return this.options[key]
                },
                warn: function() {
                    this.options.warnings && AST_Node.warn.apply(AST_Node, arguments)
                },
                before: function(node, descend) {
                    return node._squeezed ? node : (node instanceof AST_Scope && (node.drop_unused(this), node = node.hoist_declarations(this)), descend(node, this), node = node.optimize(this), node instanceof AST_Scope && node.drop_unused(this), node._squeezed = !0, node)
                }
            }),
            function() {
                function OPT(node, optimizer) {
                    node.DEFMETHOD("optimize", function(compressor) {
                        var self = this;
                        if (self._optimized) return self;
                        var opt = optimizer(self, compressor);
                        return opt._optimized = !0, opt === self ? opt : opt.transform(compressor)
                    })
                }

                function make_node(ctor, orig, props) {
                    return props || (props = {}), orig && (props.start || (props.start = orig.start), props.end || (props.end = orig.end)), new ctor(props)
                }

                function make_node_from_constant(compressor, val, orig) {
                    if (val instanceof AST_Node) return val.transform(compressor);
                    switch (typeof val) {
                        case "string":
                            return make_node(AST_String, orig, {
                                value: val
                            }).optimize(compressor);
                        case "number":
                            return make_node(isNaN(val) ? AST_NaN : AST_Number, orig, {
                                value: val
                            }).optimize(compressor);
                        case "boolean":
                            return make_node(val ? AST_True : AST_False, orig).optimize(compressor);
                        case "undefined":
                            return make_node(AST_Undefined, orig).optimize(compressor);
                        default:
                            if (null === val) return make_node(AST_Null, orig).optimize(compressor);
                            if (val instanceof RegExp) return make_node(AST_RegExp, orig).optimize(compressor);
                            throw new Error(string_template("Can't handle constant of type: {type}", {
                                type: typeof val
                            }))
                    }
                }

                function as_statement_array(thing) {
                    if (null === thing) return [];
                    if (thing instanceof AST_BlockStatement) return thing.body;
                    if (thing instanceof AST_EmptyStatement) return [];
                    if (thing instanceof AST_Statement) return [thing];
                    throw new Error("Can't convert thing to statement array")
                }

                function is_empty(thing) {
                    return null === thing ? !0 : thing instanceof AST_EmptyStatement ? !0 : thing instanceof AST_BlockStatement ? 0 == thing.body.length : !1
                }

                function loop_body(x) {
                    return x instanceof AST_Switch ? x : x instanceof AST_For || x instanceof AST_ForIn || x instanceof AST_DWLoop ? x.body instanceof AST_BlockStatement ? x.body : x : x
                }

                function tighten_body(statements, compressor) {
                    function eliminate_spurious_blocks(statements) {
                        var seen_dirs = [];
                        return statements.reduce(function(a, stat) {
                            return stat instanceof AST_BlockStatement ? (CHANGED = !0, a.push.apply(a, eliminate_spurious_blocks(stat.body))) : stat instanceof AST_EmptyStatement ? CHANGED = !0 : stat instanceof AST_Directive ? seen_dirs.indexOf(stat.value) < 0 ? (a.push(stat), seen_dirs.push(stat.value)) : CHANGED = !0 : a.push(stat), a
                        }, [])
                    }

                    function handle_if_return(statements, compressor) {
                        var self = compressor.self(),
                            in_lambda = self instanceof AST_Lambda,
                            ret = [];
                        loop: for (var i = statements.length; --i >= 0;) {
                            var stat = statements[i];
                            switch (!0) {
                                case in_lambda && stat instanceof AST_Return && !stat.value && 0 == ret.length:
                                    CHANGED = !0;
                                    continue loop;
                                case stat instanceof AST_If:
                                    if (stat.body instanceof AST_Return) {
                                        if ((in_lambda && 0 == ret.length || ret[0] instanceof AST_Return && !ret[0].value) && !stat.body.value && !stat.alternative) {
                                            CHANGED = !0;
                                            var cond = make_node(AST_SimpleStatement, stat.condition, {
                                                body: stat.condition
                                            });
                                            ret.unshift(cond);
                                            continue loop
                                        }
                                        if (ret[0] instanceof AST_Return && stat.body.value && ret[0].value && !stat.alternative) {
                                            CHANGED = !0, stat = stat.clone(), stat.alternative = ret[0], ret[0] = stat.transform(compressor);
                                            continue loop
                                        }
                                        if ((0 == ret.length || ret[0] instanceof AST_Return) && stat.body.value && !stat.alternative && in_lambda) {
                                            CHANGED = !0, stat = stat.clone(), stat.alternative = ret[0] || make_node(AST_Return, stat, {
                                                value: make_node(AST_Undefined, stat)
                                            }), ret[0] = stat.transform(compressor);
                                            continue loop
                                        }
                                        if (!stat.body.value && in_lambda) {
                                            CHANGED = !0, stat = stat.clone(), stat.condition = stat.condition.negate(compressor), stat.body = make_node(AST_BlockStatement, stat, {
                                                body: as_statement_array(stat.alternative).concat(ret)
                                            }), stat.alternative = null, ret = [stat.transform(compressor)];
                                            continue loop
                                        }
                                        if (1 == ret.length && in_lambda && ret[0] instanceof AST_SimpleStatement && (!stat.alternative || stat.alternative instanceof AST_SimpleStatement)) {
                                            CHANGED = !0, ret.push(make_node(AST_Return, ret[0], {
                                                value: make_node(AST_Undefined, ret[0])
                                            }).transform(compressor)), ret = as_statement_array(stat.alternative).concat(ret), ret.unshift(stat);
                                            continue loop
                                        }
                                    }
                                    var ab = aborts(stat.body),
                                        lct = ab instanceof AST_LoopControl ? compressor.loopcontrol_target(ab.label) : null;
                                    if (ab && (ab instanceof AST_Return && !ab.value && in_lambda || ab instanceof AST_Continue && self === loop_body(lct) || ab instanceof AST_Break && lct instanceof AST_BlockStatement && self === lct)) {
                                        ab.label && remove(ab.label.thedef.references, ab), CHANGED = !0;
                                        var body = as_statement_array(stat.body).slice(0, -1);
                                        stat = stat.clone(), stat.condition = stat.condition.negate(compressor), stat.body = make_node(AST_BlockStatement, stat, {
                                            body: ret
                                        }), stat.alternative = make_node(AST_BlockStatement, stat, {
                                            body: body
                                        }), ret = [stat.transform(compressor)];
                                        continue loop
                                    }
                                    var ab = aborts(stat.alternative),
                                        lct = ab instanceof AST_LoopControl ? compressor.loopcontrol_target(ab.label) : null;
                                    if (ab && (ab instanceof AST_Return && !ab.value && in_lambda || ab instanceof AST_Continue && self === loop_body(lct) || ab instanceof AST_Break && lct instanceof AST_BlockStatement && self === lct)) {
                                        ab.label && remove(ab.label.thedef.references, ab), CHANGED = !0, stat = stat.clone(), stat.body = make_node(AST_BlockStatement, stat.body, {
                                            body: as_statement_array(stat.body).concat(ret)
                                        }), stat.alternative = make_node(AST_BlockStatement, stat.alternative, {
                                            body: as_statement_array(stat.alternative).slice(0, -1)
                                        }), ret = [stat.transform(compressor)];
                                        continue loop
                                    }
                                    ret.unshift(stat);
                                    break;
                                default:
                                    ret.unshift(stat)
                            }
                        }
                        return ret
                    }

                    function eliminate_dead_code(statements, compressor) {
                        var has_quit = !1,
                            orig = statements.length,
                            self = compressor.self();
                        return statements = statements.reduce(function(a, stat) {
                            if (has_quit) extract_declarations_from_unreachable_code(compressor, stat, a);
                            else {
                                if (stat instanceof AST_LoopControl) {
                                    var lct = compressor.loopcontrol_target(stat.label);
                                    stat instanceof AST_Break && lct instanceof AST_BlockStatement && loop_body(lct) === self || stat instanceof AST_Continue && loop_body(lct) === self ? stat.label && remove(stat.label.thedef.references, stat) : a.push(stat)
                                } else a.push(stat);
                                aborts(stat) && (has_quit = !0)
                            }
                            return a
                        }, []), CHANGED = statements.length != orig, statements
                    }

                    function sequencesize(statements, compressor) {
                        function push_seq() {
                            seq = AST_Seq.from_array(seq), seq && ret.push(make_node(AST_SimpleStatement, seq, {
                                body: seq
                            })), seq = []
                        }
                        if (statements.length < 2) return statements;
                        var seq = [],
                            ret = [];
                        return statements.forEach(function(stat) {
                            stat instanceof AST_SimpleStatement ? seq.push(stat.body) : (push_seq(), ret.push(stat))
                        }), push_seq(), ret = sequencesize_2(ret, compressor), CHANGED = ret.length != statements.length, ret
                    }

                    function sequencesize_2(statements, compressor) {
                        function cons_seq(right) {
                            ret.pop();
                            var left = prev.body;
                            return left instanceof AST_Seq ? left.add(right) : left = AST_Seq.cons(left, right), left.transform(compressor)
                        }
                        var ret = [],
                            prev = null;
                        return statements.forEach(function(stat) {
                            if (prev)
                                if (stat instanceof AST_For) {
                                    var opera = {};
                                    try {
                                        prev.body.walk(new TreeWalker(function(node) {
                                            if (node instanceof AST_Binary && "in" == node.operator) throw opera
                                        })), !stat.init || stat.init instanceof AST_Definitions ? stat.init || (stat.init = prev.body, ret.pop()) : stat.init = cons_seq(stat.init)
                                    } catch (ex) {
                                        if (ex !== opera) throw ex
                                    }
                                } else stat instanceof AST_If ? stat.condition = cons_seq(stat.condition) : stat instanceof AST_With ? stat.expression = cons_seq(stat.expression) : stat instanceof AST_Exit && stat.value ? stat.value = cons_seq(stat.value) : stat instanceof AST_Exit ? stat.value = cons_seq(make_node(AST_Undefined, stat)) : stat instanceof AST_Switch && (stat.expression = cons_seq(stat.expression));
                            ret.push(stat), prev = stat instanceof AST_SimpleStatement ? stat : null
                        }), ret
                    }

                    function join_consecutive_vars(statements) {
                        var prev = null;
                        return statements.reduce(function(a, stat) {
                            return stat instanceof AST_Definitions && prev && prev.TYPE == stat.TYPE ? (prev.definitions = prev.definitions.concat(stat.definitions), CHANGED = !0) : stat instanceof AST_For && prev instanceof AST_Definitions && (!stat.init || stat.init.TYPE == prev.TYPE) ? (CHANGED = !0, a.pop(), stat.init ? stat.init.definitions = prev.definitions.concat(stat.init.definitions) : stat.init = prev, a.push(stat), prev = stat) : (prev = stat, a.push(stat)), a
                        }, [])
                    }

                    function negate_iifes(statements) {
                        statements.forEach(function(stat) {
                            stat instanceof AST_SimpleStatement && (stat.body = function transform(thing) {
                                return thing.transform(new TreeTransformer(function(node) {
                                    if (node instanceof AST_Call && node.expression instanceof AST_Function) return make_node(AST_UnaryPrefix, node, {
                                        operator: "!",
                                        expression: node
                                    });
                                    if (node instanceof AST_Call) node.expression = transform(node.expression);
                                    else if (node instanceof AST_Seq) node.car = transform(node.car);
                                    else if (node instanceof AST_Conditional) {
                                        var expr = transform(node.condition);
                                        if (expr !== node.condition) {
                                            node.condition = expr;
                                            var tmp = node.consequent;
                                            node.consequent = node.alternative, node.alternative = tmp
                                        }
                                    }
                                    return node
                                }))
                            }(stat.body))
                        })
                    }
                    var CHANGED;
                    do CHANGED = !1, statements = eliminate_spurious_blocks(statements), compressor.option("dead_code") && (statements = eliminate_dead_code(statements, compressor)), compressor.option("if_return") && (statements = handle_if_return(statements, compressor)), compressor.option("sequences") && (statements = sequencesize(statements, compressor)), compressor.option("join_vars") && (statements = join_consecutive_vars(statements, compressor)); while (CHANGED);
                    return compressor.option("negate_iife") && negate_iifes(statements, compressor), statements
                }

                function extract_declarations_from_unreachable_code(compressor, stat, target) {
                    compressor.warn("Dropping unreachable code [{file}:{line},{col}]", stat.start), stat.walk(new TreeWalker(function(node) {
                        return node instanceof AST_Definitions ? (compressor.warn("Declarations in unreachable code! [{file}:{line},{col}]", node.start), node.remove_initializers(), target.push(node), !0) : node instanceof AST_Defun ? (target.push(node), !0) : node instanceof AST_Scope ? !0 : void 0
                    }))
                }

                function best_of(ast1, ast2) {
                    return ast1.print_to_string().length > ast2.print_to_string().length ? ast2 : ast1
                }

                function aborts(thing) {
                    return thing && thing.aborts()
                }

                function if_break_in_loop(self, compressor) {
                    function drop_it(rest) {
                        rest = as_statement_array(rest), self.body instanceof AST_BlockStatement ? (self.body = self.body.clone(), self.body.body = rest.concat(self.body.body.slice(1)), self.body = self.body.transform(compressor)) : self.body = make_node(AST_BlockStatement, self.body, {
                            body: rest
                        }).transform(compressor), if_break_in_loop(self, compressor)
                    }
                    var first = self.body instanceof AST_BlockStatement ? self.body.body[0] : self.body;
                    first instanceof AST_If && (first.body instanceof AST_Break && compressor.loopcontrol_target(first.body.label) === self ? (self.condition = self.condition ? make_node(AST_Binary, self.condition, {
                        left: self.condition,
                        operator: "&&",
                        right: first.condition.negate(compressor)
                    }) : first.condition.negate(compressor), drop_it(first.alternative)) : first.alternative instanceof AST_Break && compressor.loopcontrol_target(first.alternative.label) === self && (self.condition = self.condition ? make_node(AST_Binary, self.condition, {
                        left: self.condition,
                        operator: "&&",
                        right: first.condition
                    }) : first.condition, drop_it(first.body)))
                }

                function literals_in_boolean_context(self, compressor) {
                    return compressor.option("booleans") && compressor.in_boolean_context() ? make_node(AST_True, self) : self
                }
                OPT(AST_Node, function(self) {
                        return self
                    }), AST_Node.DEFMETHOD("equivalent_to", function(node) {
                        return this.print_to_string() == node.print_to_string()
                    }),
                    function(def) {
                        var unary_bool = ["!", "delete"],
                            binary_bool = ["in", "instanceof", "==", "!=", "===", "!==", "<", "<=", ">=", ">"];
                        def(AST_Node, function() {
                            return !1
                        }), def(AST_UnaryPrefix, function() {
                            return member(this.operator, unary_bool)
                        }), def(AST_Binary, function() {
                            return member(this.operator, binary_bool) || ("&&" == this.operator || "||" == this.operator) && this.left.is_boolean() && this.right.is_boolean()
                        }), def(AST_Conditional, function() {
                            return this.consequent.is_boolean() && this.alternative.is_boolean()
                        }), def(AST_Assign, function() {
                            return "=" == this.operator && this.right.is_boolean()
                        }), def(AST_Seq, function() {
                            return this.cdr.is_boolean()
                        }), def(AST_True, function() {
                            return !0
                        }), def(AST_False, function() {
                            return !0
                        })
                    }(function(node, func) {
                        node.DEFMETHOD("is_boolean", func)
                    }),
                    function(def) {
                        def(AST_Node, function() {
                            return !1
                        }), def(AST_String, function() {
                            return !0
                        }), def(AST_UnaryPrefix, function() {
                            return "typeof" == this.operator
                        }), def(AST_Binary, function(compressor) {
                            return "+" == this.operator && (this.left.is_string(compressor) || this.right.is_string(compressor))
                        }), def(AST_Assign, function(compressor) {
                            return ("=" == this.operator || "+=" == this.operator) && this.right.is_string(compressor)
                        }), def(AST_Seq, function(compressor) {
                            return this.cdr.is_string(compressor)
                        }), def(AST_Conditional, function(compressor) {
                            return this.consequent.is_string(compressor) && this.alternative.is_string(compressor)
                        }), def(AST_Call, function(compressor) {
                            return compressor.option("unsafe") && this.expression instanceof AST_SymbolRef && "String" == this.expression.name && this.expression.undeclared()
                        })
                    }(function(node, func) {
                        node.DEFMETHOD("is_string", func)
                    }),
                    function(def) {
                        function ev(node, compressor) {
                            if (!compressor) throw new Error("Compressor must be passed");
                            return node._eval(compressor)
                        }
                        AST_Node.DEFMETHOD("evaluate", function(compressor) {
                            if (!compressor.option("evaluate")) return [this];
                            try {
                                var val = this._eval(compressor);
                                return [best_of(make_node_from_constant(compressor, val, this), this), val]
                            } catch (ex) {
                                if (ex !== def) throw ex;
                                return [this]
                            }
                        }), def(AST_Statement, function() {
                            throw new Error(string_template("Cannot evaluate a statement [{file}:{line},{col}]", this.start))
                        }), def(AST_Function, function() {
                            throw def
                        }), def(AST_Node, function() {
                            throw def
                        }), def(AST_Constant, function() {
                            return this.getValue()
                        }), def(AST_UnaryPrefix, function(compressor) {
                            var e = this.expression;
                            switch (this.operator) {
                                case "!":
                                    return !ev(e, compressor);
                                case "typeof":
                                    if (e instanceof AST_Function) return "function";
                                    if (e = ev(e, compressor), e instanceof RegExp) throw def;
                                    return typeof e;
                                case "void":
                                    return void ev(e, compressor);
                                case "~":
                                    return ~ev(e, compressor);
                                case "-":
                                    if (e = ev(e, compressor), 0 === e) throw def;
                                    return -e;
                                case "+":
                                    return +ev(e, compressor)
                            }
                            throw def
                        }), def(AST_Binary, function(c) {
                            var left = this.left,
                                right = this.right;
                            switch (this.operator) {
                                case "&&":
                                    return ev(left, c) && ev(right, c);
                                case "||":
                                    return ev(left, c) || ev(right, c);
                                case "|":
                                    return ev(left, c) | ev(right, c);
                                case "&":
                                    return ev(left, c) & ev(right, c);
                                case "^":
                                    return ev(left, c) ^ ev(right, c);
                                case "+":
                                    return ev(left, c) + ev(right, c);
                                case "*":
                                    return ev(left, c) * ev(right, c);
                                case "/":
                                    return ev(left, c) / ev(right, c);
                                case "%":
                                    return ev(left, c) % ev(right, c);
                                case "-":
                                    return ev(left, c) - ev(right, c);
                                case "<<":
                                    return ev(left, c) << ev(right, c);
                                case ">>":
                                    return ev(left, c) >> ev(right, c);
                                case ">>>":
                                    return ev(left, c) >>> ev(right, c);
                                case "==":
                                    return ev(left, c) == ev(right, c);
                                case "===":
                                    return ev(left, c) === ev(right, c);
                                case "!=":
                                    return ev(left, c) != ev(right, c);
                                case "!==":
                                    return ev(left, c) !== ev(right, c);
                                case "<":
                                    return ev(left, c) < ev(right, c);
                                case "<=":
                                    return ev(left, c) <= ev(right, c);
                                case ">":
                                    return ev(left, c) > ev(right, c);
                                case ">=":
                                    return ev(left, c) >= ev(right, c);
                                case "in":
                                    return ev(left, c) in ev(right, c);
                                case "instanceof":
                                    return ev(left, c) instanceof ev(right, c)
                            }
                            throw def
                        }), def(AST_Conditional, function(compressor) {
                            return ev(this.condition, compressor) ? ev(this.consequent, compressor) : ev(this.alternative, compressor)
                        }), def(AST_SymbolRef, function(compressor) {
                            var d = this.definition();
                            if (d && d.constant && d.init) return ev(d.init, compressor);
                            throw def
                        })
                    }(function(node, func) {
                        node.DEFMETHOD("_eval", func)
                    }),
                    function(def) {
                        function basic_negation(exp) {
                            return make_node(AST_UnaryPrefix, exp, {
                                operator: "!",
                                expression: exp
                            })
                        }
                        def(AST_Node, function() {
                            return basic_negation(this)
                        }), def(AST_Statement, function() {
                            throw new Error("Cannot negate a statement")
                        }), def(AST_Function, function() {
                            return basic_negation(this)
                        }), def(AST_UnaryPrefix, function() {
                            return "!" == this.operator ? this.expression : basic_negation(this)
                        }), def(AST_Seq, function(compressor) {
                            var self = this.clone();
                            return self.cdr = self.cdr.negate(compressor), self
                        }), def(AST_Conditional, function(compressor) {
                            var self = this.clone();
                            return self.consequent = self.consequent.negate(compressor), self.alternative = self.alternative.negate(compressor), best_of(basic_negation(this), self)
                        }), def(AST_Binary, function(compressor) {
                            var self = this.clone(),
                                op = this.operator;
                            if (compressor.option("unsafe_comps")) switch (op) {
                                case "<=":
                                    return self.operator = ">", self;
                                case "<":
                                    return self.operator = ">=", self;
                                case ">=":
                                    return self.operator = "<", self;
                                case ">":
                                    return self.operator = "<=", self
                            }
                            switch (op) {
                                case "==":
                                    return self.operator = "!=", self;
                                case "!=":
                                    return self.operator = "==", self;
                                case "===":
                                    return self.operator = "!==", self;
                                case "!==":
                                    return self.operator = "===", self;
                                case "&&":
                                    return self.operator = "||", self.left = self.left.negate(compressor), self.right = self.right.negate(compressor), best_of(basic_negation(this), self);
                                case "||":
                                    return self.operator = "&&", self.left = self.left.negate(compressor), self.right = self.right.negate(compressor), best_of(basic_negation(this), self)
                            }
                            return basic_negation(this)
                        })
                    }(function(node, func) {
                        node.DEFMETHOD("negate", function(compressor) {
                            return func.call(this, compressor)
                        })
                    }),
                    function(def) {
                        def(AST_Node, function() {
                            return !0
                        }), def(AST_EmptyStatement, function() {
                            return !1
                        }), def(AST_Constant, function() {
                            return !1
                        }), def(AST_This, function() {
                            return !1
                        }), def(AST_Call, function(compressor) {
                            var pure = compressor.option("pure_funcs");
                            return pure ? pure.indexOf(this.expression.print_to_string()) < 0 : !0
                        }), def(AST_Block, function(compressor) {
                            for (var i = this.body.length; --i >= 0;)
                                if (this.body[i].has_side_effects(compressor)) return !0;
                            return !1
                        }), def(AST_SimpleStatement, function(compressor) {
                            return this.body.has_side_effects(compressor)
                        }), def(AST_Defun, function() {
                            return !0
                        }), def(AST_Function, function() {
                            return !1
                        }), def(AST_Binary, function(compressor) {
                            return this.left.has_side_effects(compressor) || this.right.has_side_effects(compressor)
                        }), def(AST_Assign, function() {
                            return !0
                        }), def(AST_Conditional, function(compressor) {
                            return this.condition.has_side_effects(compressor) || this.consequent.has_side_effects(compressor) || this.alternative.has_side_effects(compressor)
                        }), def(AST_Unary, function(compressor) {
                            return "delete" == this.operator || "++" == this.operator || "--" == this.operator || this.expression.has_side_effects(compressor)
                        }), def(AST_SymbolRef, function() {
                            return !1
                        }), def(AST_Object, function(compressor) {
                            for (var i = this.properties.length; --i >= 0;)
                                if (this.properties[i].has_side_effects(compressor)) return !0;
                            return !1
                        }), def(AST_ObjectProperty, function(compressor) {
                            return this.value.has_side_effects(compressor)
                        }), def(AST_Array, function(compressor) {
                            for (var i = this.elements.length; --i >= 0;)
                                if (this.elements[i].has_side_effects(compressor)) return !0;
                            return !1
                        }), def(AST_Dot, function(compressor) {
                            return compressor.option("pure_getters") ? this.expression.has_side_effects(compressor) : !0
                        }), def(AST_Sub, function(compressor) {
                            return compressor.option("pure_getters") ? this.expression.has_side_effects(compressor) || this.property.has_side_effects(compressor) : !0
                        }), def(AST_PropAccess, function(compressor) {
                            return !compressor.option("pure_getters")
                        }), def(AST_Seq, function(compressor) {
                            return this.car.has_side_effects(compressor) || this.cdr.has_side_effects(compressor)
                        })
                    }(function(node, func) {
                        node.DEFMETHOD("has_side_effects", func)
                    }),
                    function(def) {
                        function block_aborts() {
                            var n = this.body.length;
                            return n > 0 && aborts(this.body[n - 1])
                        }
                        def(AST_Statement, function() {
                            return null
                        }), def(AST_Jump, function() {
                            return this
                        }), def(AST_BlockStatement, block_aborts), def(AST_SwitchBranch, block_aborts), def(AST_If, function() {
                            return this.alternative && aborts(this.body) && aborts(this.alternative)
                        })
                    }(function(node, func) {
                        node.DEFMETHOD("aborts", func)
                    }), OPT(AST_Directive, function(self) {
                        return self.scope.has_directive(self.value) !== self.scope ? make_node(AST_EmptyStatement, self) : self
                    }), OPT(AST_Debugger, function(self, compressor) {
                        return compressor.option("drop_debugger") ? make_node(AST_EmptyStatement, self) : self
                    }), OPT(AST_LabeledStatement, function(self, compressor) {
                        return self.body instanceof AST_Break && compressor.loopcontrol_target(self.body.label) === self.body ? make_node(AST_EmptyStatement, self) : 0 == self.label.references.length ? self.body : self
                    }), OPT(AST_Block, function(self, compressor) {
                        return self.body = tighten_body(self.body, compressor), self
                    }), OPT(AST_BlockStatement, function(self, compressor) {
                        switch (self.body = tighten_body(self.body, compressor), self.body.length) {
                            case 1:
                                return self.body[0];
                            case 0:
                                return make_node(AST_EmptyStatement, self)
                        }
                        return self
                    }), AST_Scope.DEFMETHOD("drop_unused", function(compressor) {
                        var self = this;
                        if (compressor.option("unused") && !(self instanceof AST_Toplevel) && !self.uses_eval) {
                            var in_use = [],
                                initializations = new Dictionary,
                                scope = this,
                                tw = new TreeWalker(function(node, descend) {
                                    if (node !== self) {
                                        if (node instanceof AST_Defun) return initializations.add(node.name.name, node), !0;
                                        if (node instanceof AST_Definitions && scope === self) return node.definitions.forEach(function(def) {
                                            def.value && (initializations.add(def.name.name, def.value), def.value.has_side_effects(compressor) && def.value.walk(tw))
                                        }), !0;
                                        if (node instanceof AST_SymbolRef) return push_uniq(in_use, node.definition()), !0;
                                        if (node instanceof AST_Scope) {
                                            var save_scope = scope;
                                            return scope = node, descend(), scope = save_scope, !0
                                        }
                                    }
                                });
                            self.walk(tw);
                            for (var i = 0; i < in_use.length; ++i) in_use[i].orig.forEach(function(decl) {
                                var init = initializations.get(decl.name);
                                init && init.forEach(function(init) {
                                    var tw = new TreeWalker(function(node) {
                                        node instanceof AST_SymbolRef && push_uniq(in_use, node.definition())
                                    });
                                    init.walk(tw)
                                })
                            });
                            var tt = new TreeTransformer(function(node, descend, in_list) {
                                if (node instanceof AST_Lambda && !(node instanceof AST_Accessor))
                                    for (var a = node.argnames, i = a.length; --i >= 0;) {
                                        var sym = a[i];
                                        if (!sym.unreferenced()) break;
                                        a.pop(), compressor.warn("Dropping unused function argument {name} [{file}:{line},{col}]", {
                                            name: sym.name,
                                            file: sym.start.file,
                                            line: sym.start.line,
                                            col: sym.start.col
                                        })
                                    }
                                if (node instanceof AST_Defun && node !== self) return member(node.name.definition(), in_use) ? node : (compressor.warn("Dropping unused function {name} [{file}:{line},{col}]", {
                                    name: node.name.name,
                                    file: node.name.start.file,
                                    line: node.name.start.line,
                                    col: node.name.start.col
                                }), make_node(AST_EmptyStatement, node));
                                if (node instanceof AST_Definitions && !(tt.parent() instanceof AST_ForIn)) {
                                    var def = node.definitions.filter(function(def) {
                                        if (member(def.name.definition(), in_use)) return !0;
                                        var w = {
                                            name: def.name.name,
                                            file: def.name.start.file,
                                            line: def.name.start.line,
                                            col: def.name.start.col
                                        };
                                        return def.value && def.value.has_side_effects(compressor) ? (def._unused_side_effects = !0, compressor.warn("Side effects in initialization of unused variable {name} [{file}:{line},{col}]", w), !0) : (compressor.warn("Dropping unused variable {name} [{file}:{line},{col}]", w), !1)
                                    });
                                    def = mergeSort(def, function(a, b) {
                                        return !a.value && b.value ? -1 : !b.value && a.value ? 1 : 0
                                    });
                                    for (var side_effects = [], i = 0; i < def.length;) {
                                        var x = def[i];
                                        x._unused_side_effects ? (side_effects.push(x.value), def.splice(i, 1)) : (side_effects.length > 0 && (side_effects.push(x.value), x.value = AST_Seq.from_array(side_effects), side_effects = []), ++i)
                                    }
                                    return side_effects = side_effects.length > 0 ? make_node(AST_BlockStatement, node, {
                                        body: [make_node(AST_SimpleStatement, node, {
                                            body: AST_Seq.from_array(side_effects)
                                        })]
                                    }) : null, 0 != def.length || side_effects ? 0 == def.length ? side_effects : (node.definitions = def, side_effects && (side_effects.body.unshift(node), node = side_effects), node) : make_node(AST_EmptyStatement, node)
                                }
                                if (node instanceof AST_For && node.init instanceof AST_BlockStatement) {
                                    descend(node, this);
                                    var body = node.init.body.slice(0, -1);
                                    return node.init = node.init.body.slice(-1)[0].body, body.push(node), in_list ? MAP.splice(body) : make_node(AST_BlockStatement, node, {
                                        body: body
                                    })
                                }
                                return node instanceof AST_Scope && node !== self ? node : void 0
                            });
                            self.transform(tt)
                        }
                    }), AST_Scope.DEFMETHOD("hoist_declarations", function(compressor) {
                        var hoist_funs = compressor.option("hoist_funs"),
                            hoist_vars = compressor.option("hoist_vars"),
                            self = this;
                        if (hoist_funs || hoist_vars) {
                            var dirs = [],
                                hoisted = [],
                                vars = new Dictionary,
                                vars_found = 0,
                                var_decl = 0;
                            self.walk(new TreeWalker(function(node) {
                                return node instanceof AST_Scope && node !== self ? !0 : node instanceof AST_Var ? (++var_decl, !0) : void 0
                            })), hoist_vars = hoist_vars && var_decl > 1;
                            var tt = new TreeTransformer(function(node) {
                                if (node !== self) {
                                    if (node instanceof AST_Directive) return dirs.push(node), make_node(AST_EmptyStatement, node);
                                    if (node instanceof AST_Defun && hoist_funs) return hoisted.push(node), make_node(AST_EmptyStatement, node);
                                    if (node instanceof AST_Var && hoist_vars) {
                                        node.definitions.forEach(function(def) {
                                            vars.set(def.name.name, def), ++vars_found
                                        });
                                        var seq = node.to_assignments(),
                                            p = tt.parent();
                                        return p instanceof AST_ForIn && p.init === node ? null == seq ? node.definitions[0].name : seq : p instanceof AST_For && p.init === node ? seq : seq ? make_node(AST_SimpleStatement, node, {
                                            body: seq
                                        }) : make_node(AST_EmptyStatement, node)
                                    }
                                    if (node instanceof AST_Scope) return node
                                }
                            });
                            if (self = self.transform(tt), vars_found > 0) {
                                var defs = [];
                                if (vars.each(function(def, name) {
                                        self instanceof AST_Lambda && find_if(function(x) {
                                            return x.name == def.name.name
                                        }, self.argnames) ? vars.del(name) : (def = def.clone(), def.value = null, defs.push(def), vars.set(name, def))
                                    }), defs.length > 0) {
                                    for (var i = 0; i < self.body.length;) {
                                        if (self.body[i] instanceof AST_SimpleStatement) {
                                            var sym, assign, expr = self.body[i].body;
                                            if (expr instanceof AST_Assign && "=" == expr.operator && (sym = expr.left) instanceof AST_Symbol && vars.has(sym.name)) {
                                                var def = vars.get(sym.name);
                                                if (def.value) break;
                                                def.value = expr.right, remove(defs, def), defs.push(def), self.body.splice(i, 1);
                                                continue
                                            }
                                            if (expr instanceof AST_Seq && (assign = expr.car) instanceof AST_Assign && "=" == assign.operator && (sym = assign.left) instanceof AST_Symbol && vars.has(sym.name)) {
                                                var def = vars.get(sym.name);
                                                if (def.value) break;
                                                def.value = assign.right, remove(defs, def), defs.push(def), self.body[i].body = expr.cdr;
                                                continue
                                            }
                                        }
                                        if (self.body[i] instanceof AST_EmptyStatement) self.body.splice(i, 1);
                                        else {
                                            if (!(self.body[i] instanceof AST_BlockStatement)) break;
                                            var tmp = [i, 1].concat(self.body[i].body);
                                            self.body.splice.apply(self.body, tmp)
                                        }
                                    }
                                    defs = make_node(AST_Var, self, {
                                        definitions: defs
                                    }), hoisted.push(defs)
                                }
                            }
                            self.body = dirs.concat(hoisted, self.body)
                        }
                        return self
                    }), OPT(AST_SimpleStatement, function(self, compressor) {
                        return compressor.option("side_effects") && !self.body.has_side_effects(compressor) ? (compressor.warn("Dropping side-effect-free statement [{file}:{line},{col}]", self.start), make_node(AST_EmptyStatement, self)) : self
                    }), OPT(AST_DWLoop, function(self, compressor) {
                        var cond = self.condition.evaluate(compressor);
                        if (self.condition = cond[0], !compressor.option("loops")) return self;
                        if (cond.length > 1) {
                            if (cond[1]) return make_node(AST_For, self, {
                                body: self.body
                            });
                            if (self instanceof AST_While && compressor.option("dead_code")) {
                                var a = [];
                                return extract_declarations_from_unreachable_code(compressor, self.body, a), make_node(AST_BlockStatement, self, {
                                    body: a
                                })
                            }
                        }
                        return self
                    }), OPT(AST_While, function(self, compressor) {
                        return compressor.option("loops") ? (self = AST_DWLoop.prototype.optimize.call(self, compressor), self instanceof AST_While && (if_break_in_loop(self, compressor), self = make_node(AST_For, self, self).transform(compressor)), self) : self
                    }), OPT(AST_For, function(self, compressor) {
                        var cond = self.condition;
                        if (cond && (cond = cond.evaluate(compressor), self.condition = cond[0]), !compressor.option("loops")) return self;
                        if (cond && cond.length > 1 && !cond[1] && compressor.option("dead_code")) {
                            var a = [];
                            return self.init instanceof AST_Statement ? a.push(self.init) : self.init && a.push(make_node(AST_SimpleStatement, self.init, {
                                body: self.init
                            })), extract_declarations_from_unreachable_code(compressor, self.body, a), make_node(AST_BlockStatement, self, {
                                body: a
                            })
                        }
                        return if_break_in_loop(self, compressor), self
                    }), OPT(AST_If, function(self, compressor) {
                        if (!compressor.option("conditionals")) return self;
                        var cond = self.condition.evaluate(compressor);
                        if (self.condition = cond[0], cond.length > 1)
                            if (cond[1]) {
                                if (compressor.warn("Condition always true [{file}:{line},{col}]", self.condition.start), compressor.option("dead_code")) {
                                    var a = [];
                                    return self.alternative && extract_declarations_from_unreachable_code(compressor, self.alternative, a), a.push(self.body), make_node(AST_BlockStatement, self, {
                                        body: a
                                    }).transform(compressor)
                                }
                            } else if (compressor.warn("Condition always false [{file}:{line},{col}]", self.condition.start), compressor.option("dead_code")) {
                            var a = [];
                            return extract_declarations_from_unreachable_code(compressor, self.body, a), self.alternative && a.push(self.alternative), make_node(AST_BlockStatement, self, {
                                body: a
                            }).transform(compressor)
                        }
                        is_empty(self.alternative) && (self.alternative = null);
                        var negated = self.condition.negate(compressor),
                            negated_is_best = best_of(self.condition, negated) === negated;
                        if (self.alternative && negated_is_best) {
                            negated_is_best = !1, self.condition = negated;
                            var tmp = self.body;
                            self.body = self.alternative || make_node(AST_EmptyStatement), self.alternative = tmp
                        }
                        if (is_empty(self.body) && is_empty(self.alternative)) return make_node(AST_SimpleStatement, self.condition, {
                            body: self.condition
                        }).transform(compressor);
                        if (self.body instanceof AST_SimpleStatement && self.alternative instanceof AST_SimpleStatement) return make_node(AST_SimpleStatement, self, {
                            body: make_node(AST_Conditional, self, {
                                condition: self.condition,
                                consequent: self.body.body,
                                alternative: self.alternative.body
                            })
                        }).transform(compressor);
                        if (is_empty(self.alternative) && self.body instanceof AST_SimpleStatement) return negated_is_best ? make_node(AST_SimpleStatement, self, {
                            body: make_node(AST_Binary, self, {
                                operator: "||",
                                left: negated,
                                right: self.body.body
                            })
                        }).transform(compressor) : make_node(AST_SimpleStatement, self, {
                            body: make_node(AST_Binary, self, {
                                operator: "&&",
                                left: self.condition,
                                right: self.body.body
                            })
                        }).transform(compressor);
                        if (self.body instanceof AST_EmptyStatement && self.alternative && self.alternative instanceof AST_SimpleStatement) return make_node(AST_SimpleStatement, self, {
                            body: make_node(AST_Binary, self, {
                                operator: "||",
                                left: self.condition,
                                right: self.alternative.body
                            })
                        }).transform(compressor);
                        if (self.body instanceof AST_Exit && self.alternative instanceof AST_Exit && self.body.TYPE == self.alternative.TYPE) return make_node(self.body.CTOR, self, {
                            value: make_node(AST_Conditional, self, {
                                condition: self.condition,
                                consequent: self.body.value || make_node(AST_Undefined, self.body).optimize(compressor),
                                alternative: self.alternative.value || make_node(AST_Undefined, self.alternative).optimize(compressor)
                            })
                        }).transform(compressor);
                        if (self.body instanceof AST_If && !self.body.alternative && !self.alternative && (self.condition = make_node(AST_Binary, self.condition, {
                                operator: "&&",
                                left: self.condition,
                                right: self.body.condition
                            }).transform(compressor), self.body = self.body.body), aborts(self.body) && self.alternative) {
                            var alt = self.alternative;
                            return self.alternative = null, make_node(AST_BlockStatement, self, {
                                body: [self, alt]
                            }).transform(compressor)
                        }
                        if (aborts(self.alternative)) {
                            var body = self.body;
                            return self.body = self.alternative, self.condition = negated_is_best ? negated : self.condition.negate(compressor), self.alternative = null, make_node(AST_BlockStatement, self, {
                                body: [self, body]
                            }).transform(compressor)
                        }
                        return self
                    }), OPT(AST_Switch, function(self, compressor) {
                        if (0 == self.body.length && compressor.option("conditionals")) return make_node(AST_SimpleStatement, self, {
                            body: self.expression
                        }).transform(compressor);
                        for (;;) {
                            var last_branch = self.body[self.body.length - 1];
                            if (last_branch) {
                                var stat = last_branch.body[last_branch.body.length - 1];
                                if (stat instanceof AST_Break && loop_body(compressor.loopcontrol_target(stat.label)) === self && last_branch.body.pop(), last_branch instanceof AST_Default && 0 == last_branch.body.length) {
                                    self.body.pop();
                                    continue
                                }
                            }
                            break
                        }
                        var exp = self.expression.evaluate(compressor);
                        out: if (2 == exp.length) try {
                                if (self.expression = exp[0], !compressor.option("dead_code")) break out;
                                var value = exp[1],
                                    in_if = !1,
                                    in_block = !1,
                                    started = !1,
                                    stopped = !1,
                                    ruined = !1,
                                    tt = new TreeTransformer(function(node, descend, in_list) {
                                        if (node instanceof AST_Lambda || node instanceof AST_SimpleStatement) return node;
                                        if (node instanceof AST_Switch && node === self) return node = node.clone(), descend(node, this), ruined ? node : make_node(AST_BlockStatement, node, {
                                            body: node.body.reduce(function(a, branch) {
                                                return a.concat(branch.body)
                                            }, [])
                                        }).transform(compressor);
                                        if (node instanceof AST_If || node instanceof AST_Try) {
                                            var save = in_if;
                                            return in_if = !in_block, descend(node, this), in_if = save, node
                                        }
                                        if (node instanceof AST_StatementWithBody || node instanceof AST_Switch) {
                                            var save = in_block;
                                            return in_block = !0, descend(node, this), in_block = save, node
                                        }
                                        if (node instanceof AST_Break && this.loopcontrol_target(node.label) === self) return in_if ? (ruined = !0, node) : in_block ? node : (stopped = !0, in_list ? MAP.skip : make_node(AST_EmptyStatement, node));
                                        if (node instanceof AST_SwitchBranch && this.parent() === self) {
                                            if (stopped) return MAP.skip;
                                            if (node instanceof AST_Case) {
                                                var exp = node.expression.evaluate(compressor);
                                                if (exp.length < 2) throw self;
                                                return exp[1] === value || started ? (started = !0, aborts(node) && (stopped = !0), descend(node, this), node) : MAP.skip
                                            }
                                            return descend(node, this), node
                                        }
                                    });
                                tt.stack = compressor.stack.slice(), self = self.transform(tt)
                            } catch (ex) {
                                if (ex !== self) throw ex
                            }
                            return self
                    }), OPT(AST_Case, function(self, compressor) {
                        return self.body = tighten_body(self.body, compressor), self
                    }), OPT(AST_Try, function(self, compressor) {
                        return self.body = tighten_body(self.body, compressor), self
                    }), AST_Definitions.DEFMETHOD("remove_initializers", function() {
                        this.definitions.forEach(function(def) {
                            def.value = null
                        })
                    }), AST_Definitions.DEFMETHOD("to_assignments", function() {
                        var assignments = this.definitions.reduce(function(a, def) {
                            if (def.value) {
                                var name = make_node(AST_SymbolRef, def.name, def.name);
                                a.push(make_node(AST_Assign, def, {
                                    operator: "=",
                                    left: name,
                                    right: def.value
                                }))
                            }
                            return a
                        }, []);
                        return 0 == assignments.length ? null : AST_Seq.from_array(assignments)
                    }), OPT(AST_Definitions, function(self) {
                        return 0 == self.definitions.length ? make_node(AST_EmptyStatement, self) : self
                    }), OPT(AST_Function, function(self, compressor) {
                        return self = AST_Lambda.prototype.optimize.call(self, compressor), compressor.option("unused") && self.name && self.name.unreferenced() && (self.name = null), self
                    }), OPT(AST_Call, function(self, compressor) {
                        if (compressor.option("unsafe")) {
                            var exp = self.expression;
                            if (exp instanceof AST_SymbolRef && exp.undeclared()) switch (exp.name) {
                                case "Array":
                                    if (1 != self.args.length) return make_node(AST_Array, self, {
                                        elements: self.args
                                    });
                                    break;
                                case "Object":
                                    if (0 == self.args.length) return make_node(AST_Object, self, {
                                        properties: []
                                    });
                                    break;
                                case "String":
                                    return 0 == self.args.length ? make_node(AST_String, self, {
                                        value: ""
                                    }) : make_node(AST_Binary, self, {
                                        left: self.args[0],
                                        operator: "+",
                                        right: make_node(AST_String, self, {
                                            value: ""
                                        })
                                    });
                                case "Function":
                                    if (all(self.args, function(x) {
                                            return x instanceof AST_String
                                        })) try {
                                        var code = "(function(" + self.args.slice(0, -1).map(function(arg) {
                                                return arg.value
                                            }).join(",") + "){" + self.args[self.args.length - 1].value + "})()",
                                            ast = parse(code);
                                        ast.figure_out_scope();
                                        var comp = new Compressor(compressor.options);
                                        ast = ast.transform(comp), ast.figure_out_scope(), ast.mangle_names();
                                        var fun;
                                        try {
                                            ast.walk(new TreeWalker(function(node) {
                                                if (node instanceof AST_Lambda) throw fun = node, ast
                                            }))
                                        } catch (ex) {
                                            if (ex !== ast) throw ex
                                        }
                                        var args = fun.argnames.map(function(arg, i) {
                                                return make_node(AST_String, self.args[i], {
                                                    value: arg.print_to_string()
                                                })
                                            }),
                                            code = OutputStream();
                                        return AST_BlockStatement.prototype._codegen.call(fun, fun, code), code = code.toString().replace(/^\{|\}$/g, ""), args.push(make_node(AST_String, self.args[self.args.length - 1], {
                                            value: code
                                        })), self.args = args, self
                                    } catch (ex) {
                                        if (!(ex instanceof JS_Parse_Error)) throw console.log(ex), ex;
                                        compressor.warn("Error parsing code passed to new Function [{file}:{line},{col}]", self.args[self.args.length - 1].start), compressor.warn(ex.toString())
                                    }
                            } else {
                                if (exp instanceof AST_Dot && "toString" == exp.property && 0 == self.args.length) return make_node(AST_Binary, self, {
                                    left: make_node(AST_String, self, {
                                        value: ""
                                    }),
                                    operator: "+",
                                    right: exp.expression
                                }).transform(compressor);
                                if (exp instanceof AST_Dot && exp.expression instanceof AST_Array && "join" == exp.property) {
                                    var separator = 0 == self.args.length ? "," : self.args[0].evaluate(compressor)[1];
                                    if (null != separator) {
                                        var elements = exp.expression.elements.reduce(function(a, el) {
                                            if (el = el.evaluate(compressor), 0 == a.length || 1 == el.length) a.push(el);
                                            else {
                                                var last = a[a.length - 1];
                                                if (2 == last.length) {
                                                    var val = "" + last[1] + separator + el[1];
                                                    a[a.length - 1] = [make_node_from_constant(compressor, val, last[0]), val]
                                                } else a.push(el)
                                            }
                                            return a
                                        }, []);
                                        if (0 == elements.length) return make_node(AST_String, self, {
                                            value: ""
                                        });
                                        if (1 == elements.length) return elements[0][0];
                                        if ("" == separator) {
                                            var first;
                                            return first = elements[0][0] instanceof AST_String || elements[1][0] instanceof AST_String ? elements.shift()[0] : make_node(AST_String, self, {
                                                value: ""
                                            }), elements.reduce(function(prev, el) {
                                                return make_node(AST_Binary, el[0], {
                                                    operator: "+",
                                                    left: prev,
                                                    right: el[0]
                                                })
                                            }, first).transform(compressor)
                                        }
                                        var node = self.clone();
                                        return node.expression = node.expression.clone(), node.expression.expression = node.expression.expression.clone(), node.expression.expression.elements = elements.map(function(el) {
                                            return el[0]
                                        }), best_of(self, node)
                                    }
                                }
                            }
                        }
                        return compressor.option("side_effects") && self.expression instanceof AST_Function && 0 == self.args.length && !AST_Block.prototype.has_side_effects.call(self.expression, compressor) ? make_node(AST_Undefined, self).transform(compressor) : self.evaluate(compressor)[0]
                    }), OPT(AST_New, function(self, compressor) {
                        if (compressor.option("unsafe")) {
                            var exp = self.expression;
                            if (exp instanceof AST_SymbolRef && exp.undeclared()) switch (exp.name) {
                                case "Object":
                                case "RegExp":
                                case "Function":
                                case "Error":
                                case "Array":
                                    return make_node(AST_Call, self, self).transform(compressor)
                            }
                        }
                        return self
                    }), OPT(AST_Seq, function(self, compressor) {
                        if (!compressor.option("side_effects")) return self;
                        if (!self.car.has_side_effects(compressor)) {
                            var p;
                            if (!(self.cdr instanceof AST_SymbolRef && "eval" == self.cdr.name && self.cdr.undeclared() && (p = compressor.parent()) instanceof AST_Call && p.expression === self)) return self.cdr
                        }
                        if (compressor.option("cascade")) {
                            if (self.car instanceof AST_Assign && !self.car.left.has_side_effects(compressor) && self.car.left.equivalent_to(self.cdr)) return self.car;
                            if (!self.car.has_side_effects(compressor) && !self.cdr.has_side_effects(compressor) && self.car.equivalent_to(self.cdr)) return self.car
                        }
                        return self
                    }), AST_Unary.DEFMETHOD("lift_sequences", function(compressor) {
                        if (compressor.option("sequences") && this.expression instanceof AST_Seq) {
                            var seq = this.expression,
                                x = seq.to_array();
                            return this.expression = x.pop(), x.push(this), seq = AST_Seq.from_array(x).transform(compressor)
                        }
                        return this
                    }), OPT(AST_UnaryPostfix, function(self, compressor) {
                        return self.lift_sequences(compressor)
                    }), OPT(AST_UnaryPrefix, function(self, compressor) {
                        self = self.lift_sequences(compressor);
                        var e = self.expression;
                        if (compressor.option("booleans") && compressor.in_boolean_context()) {
                            switch (self.operator) {
                                case "!":
                                    if (e instanceof AST_UnaryPrefix && "!" == e.operator) return e.expression;
                                    break;
                                case "typeof":
                                    return compressor.warn("Boolean expression always true [{file}:{line},{col}]", self.start), make_node(AST_True, self)
                            }
                            e instanceof AST_Binary && "!" == self.operator && (self = best_of(self, e.negate(compressor)))
                        }
                        return self.evaluate(compressor)[0]
                    }), AST_Binary.DEFMETHOD("lift_sequences", function(compressor) {
                        if (compressor.option("sequences")) {
                            if (this.left instanceof AST_Seq) {
                                var seq = this.left,
                                    x = seq.to_array();
                                return this.left = x.pop(), x.push(this), seq = AST_Seq.from_array(x).transform(compressor)
                            }
                            if (this.right instanceof AST_Seq && "||" != this.operator && "&&" != this.operator && !this.left.has_side_effects(compressor)) {
                                var seq = this.right,
                                    x = seq.to_array();
                                return this.right = x.pop(), x.push(this), seq = AST_Seq.from_array(x).transform(compressor)
                            }
                        }
                        return this
                    });
                var commutativeOperators = makePredicate("== === != !== * & | ^");
                OPT(AST_Binary, function(self, compressor) {
                    var reverse = compressor.has_directive("use asm") ? noop : function(op, force) {
                        if (force || !self.left.has_side_effects(compressor) && !self.right.has_side_effects(compressor)) {
                            op && (self.operator = op);
                            var tmp = self.left;
                            self.left = self.right, self.right = tmp
                        }
                    };
                    if (commutativeOperators(self.operator) && (self.right instanceof AST_Constant && !(self.left instanceof AST_Constant) && reverse(null, !0), /^[!=]==?$/.test(self.operator))) {
                        if (self.left instanceof AST_SymbolRef && self.right instanceof AST_Conditional) {
                            if (self.right.consequent instanceof AST_SymbolRef && self.right.consequent.definition() === self.left.definition()) {
                                if (/^==/.test(self.operator)) return self.right.condition;
                                if (/^!=/.test(self.operator)) return self.right.condition.negate(compressor)
                            }
                            if (self.right.alternative instanceof AST_SymbolRef && self.right.alternative.definition() === self.left.definition()) {
                                if (/^==/.test(self.operator)) return self.right.condition.negate(compressor);
                                if (/^!=/.test(self.operator)) return self.right.condition
                            }
                        }
                        if (self.right instanceof AST_SymbolRef && self.left instanceof AST_Conditional) {
                            if (self.left.consequent instanceof AST_SymbolRef && self.left.consequent.definition() === self.right.definition()) {
                                if (/^==/.test(self.operator)) return self.left.condition;
                                if (/^!=/.test(self.operator)) return self.left.condition.negate(compressor)
                            }
                            if (self.left.alternative instanceof AST_SymbolRef && self.left.alternative.definition() === self.right.definition()) {
                                if (/^==/.test(self.operator)) return self.left.condition.negate(compressor);
                                if (/^!=/.test(self.operator)) return self.left.condition
                            }
                        }
                    }
                    if (self = self.lift_sequences(compressor), compressor.option("comparisons")) switch (self.operator) {
                        case "===":
                        case "!==":
                            (self.left.is_string(compressor) && self.right.is_string(compressor) || self.left.is_boolean() && self.right.is_boolean()) && (self.operator = self.operator.substr(0, 2));
                        case "==":
                        case "!=":
                            self.left instanceof AST_String && "undefined" == self.left.value && self.right instanceof AST_UnaryPrefix && "typeof" == self.right.operator && compressor.option("unsafe") && (self.right.expression instanceof AST_SymbolRef && self.right.expression.undeclared() || (self.right = self.right.expression, self.left = make_node(AST_Undefined, self.left).optimize(compressor), 2 == self.operator.length && (self.operator += "=")))
                    }
                    if (compressor.option("booleans") && compressor.in_boolean_context()) switch (self.operator) {
                        case "&&":
                            var ll = self.left.evaluate(compressor),
                                rr = self.right.evaluate(compressor);
                            if (ll.length > 1 && !ll[1] || rr.length > 1 && !rr[1]) return compressor.warn("Boolean && always false [{file}:{line},{col}]", self.start), make_node(AST_False, self);
                            if (ll.length > 1 && ll[1]) return rr[0];
                            if (rr.length > 1 && rr[1]) return ll[0];
                            break;
                        case "||":
                            var ll = self.left.evaluate(compressor),
                                rr = self.right.evaluate(compressor);
                            if (ll.length > 1 && ll[1] || rr.length > 1 && rr[1]) return compressor.warn("Boolean || always true [{file}:{line},{col}]", self.start), make_node(AST_True, self);
                            if (ll.length > 1 && !ll[1]) return rr[0];
                            if (rr.length > 1 && !rr[1]) return ll[0];
                            break;
                        case "+":
                            var ll = self.left.evaluate(compressor),
                                rr = self.right.evaluate(compressor);
                            if (ll.length > 1 && ll[0] instanceof AST_String && ll[1] || rr.length > 1 && rr[0] instanceof AST_String && rr[1]) return compressor.warn("+ in boolean context always true [{file}:{line},{col}]", self.start), make_node(AST_True, self)
                    }
                    if (compressor.option("comparisons")) {
                        if (!(compressor.parent() instanceof AST_Binary) || compressor.parent() instanceof AST_Assign) {
                            var negated = make_node(AST_UnaryPrefix, self, {
                                operator: "!",
                                expression: self.negate(compressor)
                            });
                            self = best_of(self, negated)
                        }
                        switch (self.operator) {
                            case "<":
                                reverse(">");
                                break;
                            case "<=":
                                reverse(">=")
                        }
                    }
                    return "+" == self.operator && self.right instanceof AST_String && "" === self.right.getValue() && self.left instanceof AST_Binary && "+" == self.left.operator && self.left.is_string(compressor) ? self.left : (compressor.option("evaluate") && "+" == self.operator && (self.left instanceof AST_Constant && self.right instanceof AST_Binary && "+" == self.right.operator && self.right.left instanceof AST_Constant && self.right.is_string(compressor) && (self = make_node(AST_Binary, self, {
                        operator: "+",
                        left: make_node(AST_String, null, {
                            value: "" + self.left.getValue() + self.right.left.getValue(),
                            start: self.left.start,
                            end: self.right.left.end
                        }),
                        right: self.right.right
                    })), self.right instanceof AST_Constant && self.left instanceof AST_Binary && "+" == self.left.operator && self.left.right instanceof AST_Constant && self.left.is_string(compressor) && (self = make_node(AST_Binary, self, {
                        operator: "+",
                        left: self.left.left,
                        right: make_node(AST_String, null, {
                            value: "" + self.left.right.getValue() + self.right.getValue(),
                            start: self.left.right.start,
                            end: self.right.end
                        })
                    })), self.left instanceof AST_Binary && "+" == self.left.operator && self.left.is_string(compressor) && self.left.right instanceof AST_Constant && self.right instanceof AST_Binary && "+" == self.right.operator && self.right.left instanceof AST_Constant && (self = make_node(AST_Binary, self, {
                        operator: "+",
                        left: make_node(AST_Binary, self.left, {
                            operator: "+",
                            left: self.left.left,
                            right: make_node(AST_String, null, {
                                value: "" + self.left.right.getValue() + self.right.left.getValue(),
                                start: self.left.right.start,
                                end: self.right.left.end
                            })
                        }),
                        right: self.right.right
                    }))), self.evaluate(compressor)[0])
                }), OPT(AST_SymbolRef, function(self, compressor) {
                    if (self.undeclared()) {
                        var defines = compressor.option("global_defs");
                        if (defines && defines.hasOwnProperty(self.name)) return make_node_from_constant(compressor, defines[self.name], self);
                        switch (self.name) {
                            case "undefined":
                                return make_node(AST_Undefined, self);
                            case "NaN":
                                return make_node(AST_NaN, self);
                            case "Infinity":
                                return make_node(AST_Infinity, self)
                        }
                    }
                    return self
                }), OPT(AST_Undefined, function(self, compressor) {
                    if (compressor.option("unsafe")) {
                        var scope = compressor.find_parent(AST_Scope),
                            undef = scope.find_variable("undefined");
                        if (undef) {
                            var ref = make_node(AST_SymbolRef, self, {
                                name: "undefined",
                                scope: scope,
                                thedef: undef
                            });
                            return ref.reference(), ref
                        }
                    }
                    return self
                });
                var ASSIGN_OPS = ["+", "-", "/", "*", "%", ">>", "<<", ">>>", "|", "^", "&"];
                OPT(AST_Assign, function(self, compressor) {
                    return self = self.lift_sequences(compressor), "=" == self.operator && self.left instanceof AST_SymbolRef && self.right instanceof AST_Binary && self.right.left instanceof AST_SymbolRef && self.right.left.name == self.left.name && member(self.right.operator, ASSIGN_OPS) && (self.operator = self.right.operator + "=", self.right = self.right.right), self
                }), OPT(AST_Conditional, function(self, compressor) {
                    if (!compressor.option("conditionals")) return self;
                    if (self.condition instanceof AST_Seq) {
                        var car = self.condition.car;
                        return self.condition = self.condition.cdr, AST_Seq.cons(car, self)
                    }
                    var cond = self.condition.evaluate(compressor);
                    if (cond.length > 1) return cond[1] ? (compressor.warn("Condition always true [{file}:{line},{col}]", self.start), self.consequent) : (compressor.warn("Condition always false [{file}:{line},{col}]", self.start), self.alternative);
                    var negated = cond[0].negate(compressor);
                    best_of(cond[0], negated) === negated && (self = make_node(AST_Conditional, self, {
                        condition: negated,
                        consequent: self.alternative,
                        alternative: self.consequent
                    }));
                    var consequent = self.consequent,
                        alternative = self.alternative;
                    return consequent instanceof AST_Assign && alternative instanceof AST_Assign && consequent.operator == alternative.operator && consequent.left.equivalent_to(alternative.left) && (self = make_node(AST_Assign, self, {
                        operator: consequent.operator,
                        left: consequent.left,
                        right: make_node(AST_Conditional, self, {
                            condition: self.condition,
                            consequent: consequent.right,
                            alternative: alternative.right
                        })
                    })), self
                }), OPT(AST_Boolean, function(self, compressor) {
                    if (compressor.option("booleans")) {
                        var p = compressor.parent();
                        return p instanceof AST_Binary && ("==" == p.operator || "!=" == p.operator) ? (compressor.warn("Non-strict equality against boolean: {operator} {value} [{file}:{line},{col}]", {
                            operator: p.operator,
                            value: self.value,
                            file: p.start.file,
                            line: p.start.line,
                            col: p.start.col
                        }), make_node(AST_Number, self, {
                            value: +self.value
                        })) : make_node(AST_UnaryPrefix, self, {
                            operator: "!",
                            expression: make_node(AST_Number, self, {
                                value: 1 - self.value
                            })
                        })
                    }
                    return self
                }), OPT(AST_Sub, function(self, compressor) {
                    var prop = self.property;
                    return prop instanceof AST_String && compressor.option("properties") && (prop = prop.getValue(), RESERVED_WORDS(prop) ? compressor.option("screw_ie8") : is_identifier_string(prop)) ? make_node(AST_Dot, self, {
                        expression: self.expression,
                        property: prop
                    }) : self
                }), OPT(AST_Array, literals_in_boolean_context), OPT(AST_Object, literals_in_boolean_context), OPT(AST_RegExp, literals_in_boolean_context)
            }(),
            function() {
                function From_Moz_Unary(M) {
                    var prefix = "prefix" in M ? M.prefix : "UnaryExpression" == M.type ? !0 : !1;
                    return new(prefix ? AST_UnaryPrefix : AST_UnaryPostfix)({
                        start: my_start_token(M),
                        end: my_end_token(M),
                        operator: M.operator,
                        expression: from_moz(M.argument)
                    })
                }

                function my_start_token(moznode) {
                    return new AST_Token({
                        file: moznode.loc && moznode.loc.source,
                        line: moznode.loc && moznode.loc.start.line,
                        col: moznode.loc && moznode.loc.start.column,
                        pos: moznode.start,
                        endpos: moznode.start
                    })
                }

                function my_end_token(moznode) {
                    return new AST_Token({
                        file: moznode.loc && moznode.loc.source,
                        line: moznode.loc && moznode.loc.end.line,
                        col: moznode.loc && moznode.loc.end.column,
                        pos: moznode.end,
                        endpos: moznode.end
                    })
                }

                function map(moztype, mytype, propmap) {
                    var moz_to_me = "function From_Moz_" + moztype + "(M){\n";
                    return moz_to_me += "return new mytype({\nstart: my_start_token(M),\nend: my_end_token(M)", propmap && propmap.split(/\s*,\s*/).forEach(function(prop) {
                        var m = /([a-z0-9$_]+)(=|@|>|%)([a-z0-9$_]+)/i.exec(prop);
                        if (!m) throw new Error("Can't understand property map: " + prop);
                        var moz = "M." + m[1],
                            how = m[2],
                            my = m[3];
                        if (moz_to_me += ",\n" + my + ": ", "@" == how) moz_to_me += moz + ".map(from_moz)";
                        else if (">" == how) moz_to_me += "from_moz(" + moz + ")";
                        else if ("=" == how) moz_to_me += moz;
                        else {
                            if ("%" != how) throw new Error("Can't understand operator in propmap: " + prop);
                            moz_to_me += "from_moz(" + moz + ").body"
                        }
                    }), moz_to_me += "\n})}", moz_to_me = new Function("mytype", "my_start_token", "my_end_token", "from_moz", "return(" + moz_to_me + ")")(mytype, my_start_token, my_end_token, from_moz), MOZ_TO_ME[moztype] = moz_to_me
                }

                function from_moz(node) {
                    FROM_MOZ_STACK.push(node);
                    var ret = null != node ? MOZ_TO_ME[node.type](node) : null;
                    return FROM_MOZ_STACK.pop(), ret
                }
                var MOZ_TO_ME = {
                    TryStatement: function(M) {
                        return new AST_Try({
                            start: my_start_token(M),
                            end: my_end_token(M),
                            body: from_moz(M.block).body,
                            bcatch: from_moz(M.handlers[0]),
                            bfinally: M.finalizer ? new AST_Finally(from_moz(M.finalizer)) : null
                        })
                    },
                    CatchClause: function(M) {
                        return new AST_Catch({
                            start: my_start_token(M),
                            end: my_end_token(M),
                            argname: from_moz(M.param),
                            body: from_moz(M.body).body
                        })
                    },
                    ObjectExpression: function(M) {
                        return new AST_Object({
                            start: my_start_token(M),
                            end: my_end_token(M),
                            properties: M.properties.map(function(prop) {
                                var key = prop.key,
                                    name = "Identifier" == key.type ? key.name : key.value,
                                    args = {
                                        start: my_start_token(key),
                                        end: my_end_token(prop.value),
                                        key: name,
                                        value: from_moz(prop.value)
                                    };
                                switch (prop.kind) {
                                    case "init":
                                        return new AST_ObjectKeyVal(args);
                                    case "set":
                                        return args.value.name = from_moz(key), new AST_ObjectSetter(args);
                                    case "get":
                                        return args.value.name = from_moz(key), new AST_ObjectGetter(args)
                                }
                            })
                        })
                    },
                    SequenceExpression: function(M) {
                        return AST_Seq.from_array(M.expressions.map(from_moz))
                    },
                    MemberExpression: function(M) {
                        return new(M.computed ? AST_Sub : AST_Dot)({
                            start: my_start_token(M),
                            end: my_end_token(M),
                            property: M.computed ? from_moz(M.property) : M.property.name,
                            expression: from_moz(M.object)
                        })
                    },
                    SwitchCase: function(M) {
                        return new(M.test ? AST_Case : AST_Default)({
                            start: my_start_token(M),
                            end: my_end_token(M),
                            expression: from_moz(M.test),
                            body: M.consequent.map(from_moz)
                        })
                    },
                    Literal: function(M) {
                        var val = M.value,
                            args = {
                                start: my_start_token(M),
                                end: my_end_token(M)
                            };
                        if (null === val) return new AST_Null(args);
                        switch (typeof val) {
                            case "string":
                                return args.value = val, new AST_String(args);
                            case "number":
                                return args.value = val, new AST_Number(args);
                            case "boolean":
                                return new(val ? AST_True : AST_False)(args);
                            default:
                                return args.value = val, new AST_RegExp(args)
                        }
                    },
                    UnaryExpression: From_Moz_Unary,
                    UpdateExpression: From_Moz_Unary,
                    Identifier: function(M) {
                        var p = FROM_MOZ_STACK[FROM_MOZ_STACK.length - 2];
                        return new("this" == M.name ? AST_This : "LabeledStatement" == p.type ? AST_Label : "VariableDeclarator" == p.type && p.id === M ? "const" == p.kind ? AST_SymbolConst : AST_SymbolVar : "FunctionExpression" == p.type ? p.id === M ? AST_SymbolLambda : AST_SymbolFunarg : "FunctionDeclaration" == p.type ? p.id === M ? AST_SymbolDefun : AST_SymbolFunarg : "CatchClause" == p.type ? AST_SymbolCatch : "BreakStatement" == p.type || "ContinueStatement" == p.type ? AST_LabelRef : AST_SymbolRef)({
                            start: my_start_token(M),
                            end: my_end_token(M),
                            name: M.name
                        })
                    }
                };
                map("Node", AST_Node), map("Program", AST_Toplevel, "body@body"), map("Function", AST_Function, "id>name, params@argnames, body%body"), map("EmptyStatement", AST_EmptyStatement), map("BlockStatement", AST_BlockStatement, "body@body"), map("ExpressionStatement", AST_SimpleStatement, "expression>body"), map("IfStatement", AST_If, "test>condition, consequent>body, alternate>alternative"), map("LabeledStatement", AST_LabeledStatement, "label>label, body>body"), map("BreakStatement", AST_Break, "label>label"), map("ContinueStatement", AST_Continue, "label>label"), map("WithStatement", AST_With, "object>expression, body>body"), map("SwitchStatement", AST_Switch, "discriminant>expression, cases@body"), map("ReturnStatement", AST_Return, "argument>value"), map("ThrowStatement", AST_Throw, "argument>value"), map("WhileStatement", AST_While, "test>condition, body>body"), map("DoWhileStatement", AST_Do, "test>condition, body>body"), map("ForStatement", AST_For, "init>init, test>condition, update>step, body>body"), map("ForInStatement", AST_ForIn, "left>init, right>object, body>body"), map("DebuggerStatement", AST_Debugger), map("FunctionDeclaration", AST_Defun, "id>name, params@argnames, body%body"), map("VariableDeclaration", AST_Var, "declarations@definitions"), map("VariableDeclarator", AST_VarDef, "id>name, init>value"), map("ThisExpression", AST_This), map("ArrayExpression", AST_Array, "elements@elements"), map("FunctionExpression", AST_Function, "id>name, params@argnames, body%body"), map("BinaryExpression", AST_Binary, "operator=operator, left>left, right>right"), map("AssignmentExpression", AST_Assign, "operator=operator, left>left, right>right"), map("LogicalExpression", AST_Binary, "operator=operator, left>left, right>right"), map("ConditionalExpression", AST_Conditional, "test>condition, consequent>consequent, alternate>alternative"), map("NewExpression", AST_New, "callee>expression, arguments@args"), map("CallExpression", AST_Call, "callee>expression, arguments@args");
                var FROM_MOZ_STACK = null;
                AST_Node.from_mozilla_ast = function(node) {
                    var save_stack = FROM_MOZ_STACK;
                    FROM_MOZ_STACK = [];
                    var ast = from_moz(node);
                    return FROM_MOZ_STACK = save_stack, ast
                }
            }(), exports.array_to_hash = array_to_hash, exports.slice = slice, exports.characters = characters, exports.member = member, exports.find_if = find_if, exports.repeat_string = repeat_string, exports.DefaultsError = DefaultsError, exports.defaults = defaults, exports.merge = merge, exports.noop = noop, exports.MAP = MAP, exports.push_uniq = push_uniq, exports.string_template = string_template, exports.remove = remove, exports.mergeSort = mergeSort, exports.set_difference = set_difference, exports.set_intersection = set_intersection, exports.makePredicate = makePredicate, exports.all = all, exports.Dictionary = Dictionary, exports.DEFNODE = DEFNODE, exports.AST_Token = AST_Token, exports.AST_Node = AST_Node, exports.AST_Statement = AST_Statement, exports.AST_Debugger = AST_Debugger, exports.AST_Directive = AST_Directive, exports.AST_SimpleStatement = AST_SimpleStatement, exports.walk_body = walk_body, exports.AST_Block = AST_Block, exports.AST_BlockStatement = AST_BlockStatement, exports.AST_EmptyStatement = AST_EmptyStatement, exports.AST_StatementWithBody = AST_StatementWithBody, exports.AST_LabeledStatement = AST_LabeledStatement, exports.AST_IterationStatement = AST_IterationStatement, exports.AST_DWLoop = AST_DWLoop, exports.AST_Do = AST_Do, exports.AST_While = AST_While, exports.AST_For = AST_For, exports.AST_ForIn = AST_ForIn, exports.AST_With = AST_With, exports.AST_Scope = AST_Scope, exports.AST_Toplevel = AST_Toplevel, exports.AST_Lambda = AST_Lambda, exports.AST_Accessor = AST_Accessor, exports.AST_Function = AST_Function, exports.AST_Defun = AST_Defun, exports.AST_Jump = AST_Jump, exports.AST_Exit = AST_Exit, exports.AST_Return = AST_Return, exports.AST_Throw = AST_Throw, exports.AST_LoopControl = AST_LoopControl, exports.AST_Break = AST_Break, exports.AST_Continue = AST_Continue, exports.AST_If = AST_If, exports.AST_Switch = AST_Switch, exports.AST_SwitchBranch = AST_SwitchBranch, exports.AST_Default = AST_Default, exports.AST_Case = AST_Case, exports.AST_Try = AST_Try, exports.AST_Catch = AST_Catch, exports.AST_Finally = AST_Finally, exports.AST_Definitions = AST_Definitions, exports.AST_Var = AST_Var, exports.AST_Const = AST_Const, exports.AST_VarDef = AST_VarDef, exports.AST_Call = AST_Call, exports.AST_New = AST_New, exports.AST_Seq = AST_Seq, exports.AST_PropAccess = AST_PropAccess, exports.AST_Dot = AST_Dot, exports.AST_Sub = AST_Sub, exports.AST_Unary = AST_Unary, exports.AST_UnaryPrefix = AST_UnaryPrefix, exports.AST_UnaryPostfix = AST_UnaryPostfix, exports.AST_Binary = AST_Binary, exports.AST_Conditional = AST_Conditional, exports.AST_Assign = AST_Assign, exports.AST_Array = AST_Array, exports.AST_Object = AST_Object, exports.AST_ObjectProperty = AST_ObjectProperty, exports.AST_ObjectKeyVal = AST_ObjectKeyVal, exports.AST_ObjectSetter = AST_ObjectSetter, exports.AST_ObjectGetter = AST_ObjectGetter, exports.AST_Symbol = AST_Symbol, exports.AST_SymbolAccessor = AST_SymbolAccessor, exports.AST_SymbolDeclaration = AST_SymbolDeclaration, exports.AST_SymbolVar = AST_SymbolVar, exports.AST_SymbolConst = AST_SymbolConst, exports.AST_SymbolFunarg = AST_SymbolFunarg, exports.AST_SymbolDefun = AST_SymbolDefun, exports.AST_SymbolLambda = AST_SymbolLambda, exports.AST_SymbolCatch = AST_SymbolCatch, exports.AST_Label = AST_Label, exports.AST_SymbolRef = AST_SymbolRef, exports.AST_LabelRef = AST_LabelRef, exports.AST_This = AST_This, exports.AST_Constant = AST_Constant, exports.AST_String = AST_String, exports.AST_Number = AST_Number, exports.AST_RegExp = AST_RegExp, exports.AST_Atom = AST_Atom, exports.AST_Null = AST_Null, exports.AST_NaN = AST_NaN, exports.AST_Undefined = AST_Undefined, exports.AST_Hole = AST_Hole, exports.AST_Infinity = AST_Infinity, exports.AST_Boolean = AST_Boolean, exports.AST_False = AST_False, exports.AST_True = AST_True, exports.TreeWalker = TreeWalker, exports.KEYWORDS = KEYWORDS, exports.KEYWORDS_ATOM = KEYWORDS_ATOM, exports.RESERVED_WORDS = RESERVED_WORDS, exports.KEYWORDS_BEFORE_EXPRESSION = KEYWORDS_BEFORE_EXPRESSION, exports.OPERATOR_CHARS = OPERATOR_CHARS, exports.RE_HEX_NUMBER = RE_HEX_NUMBER, exports.RE_OCT_NUMBER = RE_OCT_NUMBER, exports.RE_DEC_NUMBER = RE_DEC_NUMBER, exports.OPERATORS = OPERATORS, exports.WHITESPACE_CHARS = WHITESPACE_CHARS, exports.PUNC_BEFORE_EXPRESSION = PUNC_BEFORE_EXPRESSION, exports.PUNC_CHARS = PUNC_CHARS, exports.REGEXP_MODIFIERS = REGEXP_MODIFIERS, exports.UNICODE = UNICODE, exports.is_letter = is_letter, exports.is_digit = is_digit, exports.is_alphanumeric_char = is_alphanumeric_char, exports.is_unicode_combining_mark = is_unicode_combining_mark, exports.is_unicode_connector_punctuation = is_unicode_connector_punctuation, exports.is_identifier = is_identifier, exports.is_identifier_start = is_identifier_start, exports.is_identifier_char = is_identifier_char, exports.is_identifier_string = is_identifier_string, exports.parse_js_number = parse_js_number, exports.JS_Parse_Error = JS_Parse_Error, exports.js_error = js_error, exports.is_token = is_token, exports.EX_EOF = EX_EOF, exports.tokenizer = tokenizer, exports.UNARY_PREFIX = UNARY_PREFIX, exports.UNARY_POSTFIX = UNARY_POSTFIX, exports.ASSIGNMENT = ASSIGNMENT, exports.PRECEDENCE = PRECEDENCE, exports.STATEMENTS_WITH_LABELS = STATEMENTS_WITH_LABELS, exports.ATOMIC_START_TOKEN = ATOMIC_START_TOKEN, exports.parse = parse, exports.TreeTransformer = TreeTransformer, exports.SymbolDef = SymbolDef, exports.base54 = base54, exports.OutputStream = OutputStream, exports.Compressor = Compressor, exports.SourceMap = SourceMap
    }({}, function() {
        return this
    }()), module("users.timfelgentreff.babelsberg.src_transform").requires("cop.Layers", "lively.morphic.Halos", "lively.ide.CodeEditor").toRun(function() {
        JSLoader.loadJs(module("users.timfelgentreff.babelsberg.uglify").uri()), Object.subclass("BabelsbergSrcTransform", {
            isAlways: function(node) {
                return node instanceof UglifyJS.AST_LabeledStatement && "always" === node.label.name && node.body instanceof UglifyJS.AST_BlockStatement
            },
            isStay: function(node) {
                return node instanceof UglifyJS.AST_LabeledStatement && "stay" === node.label.name && node.body instanceof UglifyJS.AST_BlockStatement
            },
            isRule: function(node) {
                return node instanceof UglifyJS.AST_Label && "rule" === node.name ? (this.__ruleLabelSeen = node, !0) : this.__ruleLabelSeen && node instanceof UglifyJS.AST_String ? !0 : node instanceof UglifyJS.AST_LabeledStatement && "rule" === node.label.name && node.body instanceof UglifyJS.AST_BlockStatement ? !0 : node instanceof UglifyJS.AST_LabeledStatement && node.body.body instanceof UglifyJS.AST_SimpleStatement && node.body.body.body instanceof UglifyJS.AST_Call && node.body.body.body.expression instanceof UglifyJS.AST_Dot && "rule" === node.body.body.body.expression.property && "bbb" === node.body.body.body.expression.expression.name ? (this.__ruleLabelRemove = !0, !0) : (this.__ruleLabelSeen = null, !1)
            },
            isOnce: function(node) {
                return node instanceof UglifyJS.AST_LabeledStatement && "once" === node.label.name && node.body instanceof UglifyJS.AST_BlockStatement
            },
            isTrigger: function(node) {
                return node instanceof UglifyJS.AST_Call && node.expression instanceof UglifyJS.AST_SymbolRef && "when" === node.expression.name
            },
            ensureThisToSelfIn: function(ast) {
                var tr = new UglifyJS.TreeTransformer(function(node) {
                    return node instanceof UglifyJS.AST_This ? new UglifyJS.AST_SymbolRef({
                        start: node.start,
                        end: node.end,
                        name: "_$_self"
                    }) : void 0
                }, null);
                ast.transform(tr)
            },
            hasContextInArgs: function(constraintNode) {
                if (2 == constraintNode.args.length) {
                    if (!constraintNode.args[0] instanceof UglifyJS.AST_Object) throw new SyntaxError("first argument of call to `always' must be an object");
                    return constraintNode.args[0].properties.any(function(ea) {
                        return "ctx" === ea.key
                    })
                }
                return !1
            },
            createContextFor: function(ast, constraintNode) {
                var enclosed = ast.enclosed,
                    self = this;
                constraintNode.args.last() instanceof UglifyJS.AST_Function && (enclosed = constraintNode.args.last().enclosed || [], enclosed = enclosed.reject(function(ea) {
                    return ea.init && ea.init.start.pos > constraintNode.start.pos || ea.orig && ea.orig[0] && ea.orig[0].start.pos > constraintNode.end.pos
                }), enclosed.push({
                    name: "_$_self"
                }));
                var ctx = new UglifyJS.AST_Object({
                        start: constraintNode.start,
                        end: constraintNode.end,
                        properties: enclosed.collect(function(ea) {
                            return new UglifyJS.AST_ObjectKeyVal({
                                start: constraintNode.start,
                                end: constraintNode.end,
                                key: ea.name,
                                value: self.contextMap(ea.name)
                            })
                        })
                    }),
                    ctxkeyval = new UglifyJS.AST_ObjectKeyVal({
                        start: constraintNode.start,
                        end: constraintNode.end,
                        key: "ctx",
                        value: ctx
                    });
                2 == constraintNode.args.length ? constraintNode.args[0].properties.push(ctxkeyval) : constraintNode.args.unshift(new UglifyJS.AST_Object({
                    start: constraintNode.start,
                    end: constraintNode.end,
                    properties: [ctxkeyval]
                }))
            },
            ensureContextFor: function(ast, constraintNode) {
                this.hasContextInArgs(constraintNode) || this.createContextFor(ast, constraintNode)
            },
            getContextTransformerFor: function(ast) {
                var self = this;
                return new UglifyJS.TreeTransformer(null, function(node) {
                    if (self.isAlways(node)) return self.transformConstraint(ast, node, "always");
                    if (self.isOnce(node)) return self.transformConstraint(ast, node, "once");
                    if (self.isTrigger(node)) return self.transformConstraint(ast, node, "when");
                    if (self.isStay(node)) return self.transformConstraint(ast, node, "stay");
                    if (self.isRule(node)) {
                        var node = self.createRuleFor(node);
                        return self.isTransformed = !0, node
                    }
                })
            },
            transformConstraint: function(ast, node, name) {
                var node = this.createCallFor(ast, node, name);
                return this.isTransformed = !0, node
            },
            transform: function(code) {
                var ast = UglifyJS.parse(code);
                ast.figure_out_scope();
                var transformedAst = ast.transform(this.getContextTransformerFor(ast)),
                    stream = UglifyJS.OutputStream({
                        beautify: !0,
                        comments: !0
                    });
                return this.isTransformed ? (transformedAst.print(stream), stream.toString()) : code
            },
            transformAddScript: function(code) {
                var ast = UglifyJS.parse(code);
                ast.figure_out_scope(), transformed = !1;
                var transformedAst = ast.transform(new UglifyJS.TreeTransformer(null, function(node) {
                        return node instanceof UglifyJS.AST_Call && node.expression instanceof UglifyJS.AST_Dot && "addScript" === node.expression.property && node.expression.expression instanceof UglifyJS.AST_This ? (assert(1 === node.args.length), node.args.push(new UglifyJS.AST_String({
                            value: code.slice(node.args[0].start.pos, node.args[0].end.endpos)
                        })), transformed = !0, node) : void 0
                    })),
                    stream = UglifyJS.OutputStream({
                        beautify: !0,
                        comments: !0
                    });
                return transformed ? (transformedAst.print(stream), stream.toString()) : code
            },
            ensureReturnIn: function(body) {
                var lastStatement = body.last();
                lastStatement.body instanceof UglifyJS.AST_Return || (body[body.length - 1] = new UglifyJS.AST_Return({
                    start: lastStatement.start,
                    end: lastStatement.end,
                    value: lastStatement
                }))
            },
            extractArgumentsFrom: function(constraintNode) {
                var store, body = constraintNode.body.body,
                    newBody = [],
                    args = [],
                    extraArgs = [];
                return newBody = body.select(function(ea) {
                    if (ea instanceof UglifyJS.AST_LabeledStatement) {
                        if (!(ea.body instanceof UglifyJS.AST_SimpleStatement)) throw new SyntaxError("Labeled arguments in `always:' have to be simple statements");
                        return "store" == ea.label.name || "name" == ea.label.name ? store = new UglifyJS.AST_Assign({
                            start: ea.start,
                            end: ea.end,
                            right: void 0,
                            operator: "=",
                            left: ea.body.body
                        }) : extraArgs.push(new UglifyJS.AST_ObjectKeyVal({
                            start: ea.start,
                            end: ea.end,
                            key: ea.label.name,
                            value: ea.body.body
                        })), !1
                    }
                    return !0
                }), extraArgs && args.push(new UglifyJS.AST_Object({
                    start: constraintNode.start,
                    end: constraintNode.end,
                    properties: extraArgs
                })), {
                    body: newBody,
                    args: args,
                    store: store
                }
            },
            createCallFor: function(ast, constraintNode, methodName) {
                var body, args, store, enclosed, self = this;
                if (constraintNode instanceof UglifyJS.AST_LabeledStatement) {
                    var splitBodyAndArgs = this.extractArgumentsFrom(constraintNode);
                    body = splitBodyAndArgs.body, args = splitBodyAndArgs.args, store = splitBodyAndArgs.store, enclosed = constraintNode.label.scope.enclosed
                } else {
                    if (!(constraintNode instanceof UglifyJS.AST_Call)) throw SyntaxError("Don't know what to do with " + constraintNode);
                    var nodeArgs = constraintNode.args,
                        funcArg = nodeArgs[nodeArgs.length - 1];
                    if (!(funcArg instanceof UglifyJS.AST_Function)) throw new SyntaxError("Last argument to " + constraintNode.expression.name + " must be a function");
                    body = funcArg.body, args = nodeArgs.slice(0, nodeArgs.length - 1), enclosed = funcArg.enclosed
                }
                this.ensureReturnIn(body), body.each(function(ea) {
                    self.ensureThisToSelfIn(ea)
                });
                var call = new UglifyJS.AST_Call({
                    start: constraintNode.start,
                    end: constraintNode.end,
                    expression: new UglifyJS.AST_Dot({
                        start: constraintNode.start,
                        end: constraintNode.end,
                        property: methodName,
                        expression: new UglifyJS.AST_SymbolRef({
                            start: constraintNode.start,
                            end: constraintNode.end,
                            name: "bbb"
                        })
                    }),
                    args: args.concat([new UglifyJS.AST_Function({
                        start: body.start,
                        end: body.end,
                        body: body,
                        enclosed: enclosed,
                        argnames: []
                    })])
                });
                this.ensureContextFor(ast, call);
                var newBody;
                return store ? (store.right = call, newBody = store) : newBody = call, constraintNode instanceof UglifyJS.AST_Statement ? new UglifyJS.AST_SimpleStatement({
                    start: constraintNode.start,
                    end: constraintNode.end,
                    body: newBody
                }) : newBody
            },
            createRuleFor: function(ruleNode) {
                if (ruleNode instanceof UglifyJS.AST_Label) return ruleNode;
                var stringNode;
                if (ruleNode instanceof UglifyJS.AST_String) stringNode = ruleNode, stringNode.value = stringNode.value.replace(/\|\s*-/gm, ":-"), ruleNode = this.__ruleLabelSeen, delete this.__ruleLabelSeen;
                else {
                    if (this.__ruleLabelRemove) return delete this.__ruleLabelRemove, ruleNode.body.body;
                    var stream = UglifyJS.OutputStream({
                        beautify: !0,
                        comments: !0
                    });
                    ruleNode.body.print(stream), stringNode = new UglifyJS.AST_String({
                        start: ruleNode.body.start,
                        end: ruleNode.body.end,
                        value: stream.toString().replace(/\|\s*-/gm, ":-").replace(/^{\s*/, "").replace(/\s*}\s*$/, "").replace(/\s*;\s*$/, "")
                    })
                }
                return new UglifyJS.AST_SimpleStatement({
                    start: ruleNode.start,
                    end: ruleNode.end,
                    body: new UglifyJS.AST_Call({
                        start: ruleNode.start,
                        end: ruleNode.end,
                        expression: new UglifyJS.AST_Dot({
                            start: ruleNode.start,
                            end: ruleNode.end,
                            property: "rule",
                            expression: new UglifyJS.AST_SymbolRef({
                                start: ruleNode.start,
                                end: ruleNode.end,
                                name: "bbb"
                            })
                        }),
                        args: [stringNode]
                    })
                })
            },
            contextMap: function(name) {
                return "_$_self" === name ? new UglifyJS.AST_Binary({
                    operator: "||",
                    left: new UglifyJS.AST_Dot({
                        expression: new UglifyJS.AST_This({}),
                        property: "doitContext"
                    }),
                    right: new UglifyJS.AST_This({})
                }) : ("ro" === name && (name = "bbb.readonly"), "system" === name && (name = "bbb.system()"), new UglifyJS.AST_SymbolRef({
                    name: name
                }))
            }
        }), lively && lively.morphic && lively.morphic.Morph && lively.morphic.CodeEditor && (cop.create("AddScriptWithFakeOriginalLayer").refineClass(lively.morphic.Morph, {
            addScript: function(funcOrString, origSource) {
                var originalFunction;
                originalFunction = cop.proceed.apply(this, [origSource]);
                var result = cop.proceed.apply(this, [funcOrString]);
                return result.getOriginal().setProperty("originalFunction", originalFunction), result
            }
        }), cop.create("ConstraintSyntaxLayer").refineClass(lively.morphic.CodeEditor, {
            doSave: function() {
                if (this.owner instanceof lively.ide.BrowserPanel) {
                    for (var matchData = this.textString.match(/[^"](always:|once:)/), t = new BabelsbergSrcTransform, idx = matchData && matchData.index || -1, endIdx = this.textString.indexOf("}", idx + 1), fragments = [], offset = 0, lines = this.textString.split("\n").map(function(line) {
                            return [line, offset += line.length + 1]
                        }); - 1 !== idx && -1 !== endIdx;) try {
                        var line, str = t.transform(this.textString.slice(idx, endIdx + 1));
                        lines.some(function(ary) {
                            return line = ary[0], ary[1] > idx
                        });
                        var indent = new Array(line.match(/always:|once:/).index + 1).join(" ");
                        str = str.split("\n").inject("", function(acc, line) {
                            return acc + "\n" + indent + line
                        }).slice("\n".length + indent.length), fragments.push([idx + 1, endIdx, str]), matchData = this.textString.slice(idx + 1).match(/[^"](always:|once:)/), idx = matchData && matchData.index + idx + 1 || -1, endIdx = this.textString.indexOf("}", idx + 2)
                    } catch (e) {
                        endIdx = this.textString.indexOf("}", endIdx + 1)
                    }
                    if (0 !== fragments.length) {
                        var textPos = 0,
                            newTextString = fragments.inject("", function(memo, fragment) {
                                var r = this.textString.slice(textPos, fragment[0]) + fragment[2];
                                return textPos = fragment[1] + 1, memo + r
                            }.bind(this));
                        newTextString += this.textString.slice(textPos), this.textString = newTextString
                    }
                    return cop.withoutLayers([ConstraintSyntaxLayer], function() {
                        return cop.proceed()
                    })
                }
                return cop.proceed()
            },
            boundEval: function(code) {
                var t = new BabelsbergSrcTransform,
                    addScriptWithOrigCode = t.transformAddScript(code),
                    constraintCode = t.transform(addScriptWithOrigCode);
                return addScriptWithOrigCode === constraintCode ? cop.proceed.apply(this, [code]) : cop.withLayers([AddScriptWithFakeOriginalLayer], function() {
                    return cop.proceed.apply(this, [constraintCode])
                })
            }
        }), ConstraintSyntaxLayer.beGlobal())
    }),
    function() {
        function load() {
            function checkForFinish() {
                if (0 === numScripts && !fired) {
                    if (document.createEvent) {
                        var event = document.createEvent("CustomEvent");
                        if (event.initCustomEvent) return event.initCustomEvent("babelsbergready", !0, !0, {
                            message: "Babelsberg Scripts loaded",
                            time: new Date
                        }), fired = !0, document.dispatchEvent(event), void 0
                    }
                    console.warn("Custom Events not supported on this platform")
                }
            }

            function checkScript(script) {
                if (/^text\/(?:x-|)babelsbergscript$/.test(script.type) && !script.getAttribute("babelsberg-ignore")) {
                    var src = script.src;
                    src ? (numScripts += 1, Http.request("get", src, function(code) {
                        Babelsberg.execute(code), numScripts -= 1, checkForFinish()
                    })) : Babelsberg.execute(script.innerHTML), script.setAttribute("babelsberg-ignore", !0)
                }
            }
            for (var numScripts = 0, fired = !1, scripts = document.getElementsByTagName("script"), i = 0; i < scripts.length; i++) checkScript(scripts[i]);
            checkForFinish()
        }
        var Http = {
            request: function(method, url, callback) {
                var xhr = new(window.ActiveXObject || XMLHttpRequest)("Microsoft.XMLHTTP");
                return xhr.open(method.toUpperCase(), url, !0), "overrideMimeType" in xhr && xhr.overrideMimeType("text/plain"), xhr.onreadystatechange = function() {
                    if (4 === xhr.readyState) {
                        var status = xhr.status;
                        if (0 !== status && 200 !== status) throw new Error("Could not load " + url + " (Error " + status + ")");
                        callback.call(xhr, xhr.responseText)
                    }
                }, xhr.send(null)
            }
        };
        Babelsberg.compile = function(code) {
            var t = new BabelsbergSrcTransform;
            return t.transform(code)
        }, Babelsberg.execute = function(code, scope) {
            var func, params = [],
                args = [];
            code = Babelsberg.compile(code);
            var firefox = window.InstallTrigger;
            if (firefox || window.chrome) {
                var script = document.createElement("script"),
                    head = document.head;
                firefox && (code = "\n" + code), script.appendChild(document.createTextNode("bbb._execute = function(" + params + ") {" + code + "\n}")), head.appendChild(script), func = bbb._execute, delete bbb._execute, head.removeChild(script)
            } else func = Function(params, code);
            func.apply(scope, args) || {}
        }, "complete" === document.readyState ? setTimeout(load) : contentLoaded(window, load)
    }();