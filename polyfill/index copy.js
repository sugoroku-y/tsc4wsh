"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
(function () {
    Array.isArray =
        Array.isArray ||
            function isArray(obj) {
                return Object.prototype.toString.call(obj) === '[object Array]';
            };
    Array.of =
        Array.of ||
            function of() {
                return Array.prototype.slice.call(arguments);
            };
    Array.from =
        Array.from ||
            function from(arrayLike, mapFn, thisArg) {
                if (typeof mapFn !== 'function' &&
                    Object.prototype.toString.call(mapFn) !== '[object Function]') {
                    mapFn = function (e) { return e; };
                }
                var array;
                if (Array.isArray(arrayLike)) {
                    array = arrayLike.map(mapFn, thisArg);
                }
                else if (typeof arrayLike === 'object' &&
                    (typeof arrayLike.Item === 'function' ||
                        typeof arrayLike.item === 'function')) {
                    array = new Array();
                    var i = 0;
                    for (var e = new Enumerator(arrayLike); !e.atEnd(); e.moveNext()) {
                        array.push(mapFn.call(thisArg, e.item(), i++));
                    }
                }
                else {
                    var len = +arrayLike.length || 0;
                    array = new Array(len);
                    for (var i = 0; i < len; ++i) {
                        array[i] = mapFn.call(thisArg, arrayLike[i], i);
                    }
                }
                return array;
            };
    Array.prototype.some =
        Array.prototype.some ||
            function some(callback, thisObj) {
                for (var i = 0; i < this.length; ++i) {
                    if (!(i in this)) {
                        continue;
                    }
                    if (callback.call(thisObj, this[i], i, this)) {
                        return true;
                    }
                }
                return false;
            };
    Array.prototype.every =
        Array.prototype.every ||
            function every(callback, thisObj) {
                return !this.some(function (e, i, a) { return !callback.call(thisObj, e, i, a); });
            };
    Array.prototype.reduce =
        Array.prototype.reduce ||
            function reduce(callback, initialValue) {
                var index = 0;
                var result = 1 < arguments.length ? initialValue : this[index++];
                for (; index < this.length; ++index) {
                    if (!(index in this)) {
                        continue;
                    }
                    result = callback.call(null, result, this[index], index, this);
                }
                return result;
            };
    Array.prototype.reduceRight =
        Array.prototype.reduceRight ||
            function reduceRight(callback, initialValue) {
                var index = this.length;
                var result = 1 < arguments.length ? initialValue : this[--index];
                while (index-- > 0) {
                    if (!(index in this)) {
                        continue;
                    }
                    result = callback.call(null, result, this[index], index, this);
                }
                return result;
            };
    Array.prototype.forEach =
        Array.prototype.forEach ||
            function forEach(callback, thisObj) {
                this.reduce(function (r, e, i, a) { return callback.call(thisObj, e, i, a) && false; }, false);
            };
    Array.prototype.filter =
        Array.prototype.filter ||
            function filter(callback, thisObj) {
                return this.reduce(function (r, e, i, a) {
                    if (callback.call(thisObj, e, i, a)) {
                        r.push(e);
                    }
                    return r;
                }, []);
            };
    Array.prototype.map =
        Array.prototype.map ||
            function map(callback, thisObj) {
                return this.reduce(function (r, e, i, a) {
                    r[i] = callback.call(thisObj, e, i, a);
                    return r;
                }, []);
            };
    var adjustIndex = function (args, index, length, defaultValue) {
        var value = args.length > index ? +args[index] : NaN;
        if (isNaN(value)) {
            if (defaultValue === undefined) {
                throw new Error('arguments[' + index + '] required');
            }
            value = defaultValue;
        }
        if (value < 0) {
            value += length;
            if (value < 0) {
                value = 0;
            }
        }
        return value;
    };
    Array.prototype.copyWithin =
        Array.prototype.copyWithin ||
            function copyWithin() {
                var target = adjustIndex(arguments, 1, this.length);
                var start = adjustIndex(arguments, 1, this.length, 0);
                var end = adjustIndex(arguments, 2, this.length, this.length);
                var targetEnd = Math.min(target + (end - start), this.length);
                if (target < start) {
                    for (var i = target; i < targetEnd; ++i) {
                        if (!(i in this)) {
                            continue;
                        }
                        this[i] = this[start + i - target];
                    }
                }
                else {
                    for (var i = targetEnd; --i >= target;) {
                        if (!(i in this)) {
                            continue;
                        }
                        this[i] = this[start + i - target];
                    }
                }
                return this;
            };
    Array.prototype.fill =
        Array.prototype.fill ||
            function fill(value) {
                var start = adjustIndex(arguments, 1, this.length, 0);
                var end = adjustIndex(arguments, 2, this.length, this.length);
                for (var i = start; i < end; ++i) {
                    this[i] = value;
                }
                return this;
            };
    Array.prototype.find =
        Array.prototype.find ||
            function find(pred, thisArg) {
                var result;
                this.some(function (e, i, a) { return pred.call(thisArg, e, i, a) && ((result = e), true); });
                return result;
            };
    Array.prototype.findIndex =
        Array.prototype.findIndex ||
            function findIndex(pred, thisArg) {
                var result = -1;
                this.some(function (e, i, a) { return pred.call(thisArg, e, i, a) && ((result = i), true); });
                return result;
            };
    Array.prototype.includes =
        Array.prototype.includes ||
            function includes(searchElement) {
                var e_1, _a;
                try {
                    for (var _b = __values(this), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var e = _c.value;
                        if (e === searchElement) {
                            return true;
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                return false;
            };
    Array.prototype.indexOf =
        Array.prototype.lastIndexOf ||
            function indexOf(searchElement) {
                for (var index = adjustIndex(arguments, 1, this.length, 0); index < this.length; ++index) {
                    if (this[index] === searchElement) {
                        return index;
                    }
                }
                return -1;
            };
    Array.prototype.lastIndexOf =
        Array.prototype.lastIndexOf ||
            function lastIndexOf(searchElement) {
                for (var index = adjustIndex(arguments, 1, this.length, this.length - 1); index >= 0; --index) {
                    if (this[index] === searchElement) {
                        return index;
                    }
                }
                return -1;
            };
    Array.prototype.entries =
        Array.prototype.entries ||
            function entries() {
                return this.map(function (value, index) { return [index, value]; });
            };
    Array.prototype.keys =
        Array.prototype.keys ||
            function keys() {
                return this.map(function (_, index) { return index; });
            };
})();
(function () {
    this.console = this.console || {};
    function output(stream, messages) {
        stream.WriteLine("[" + new Date().toLocaleTimeString() + "] " + Array.from(messages)
            .map(function (m) { return (m === undefined ? 'undefined' : m === null ? 'null' : m); })
            .join(' '));
    }
    this.console.log =
        this.console.log ||
            function log() {
                output(WScript.StdOut, arguments);
            };
    this.console.error =
        this.console.error ||
            function error() {
                output(WScript.StdErr, arguments);
            };
})();
(function () {
    Date.prototype.toISOString =
        Date.prototype.toISOString ||
            function toISOString() {
                return (this.getUTCFullYear() +
                    '-' +
                    ('' + (this.getUTCMonth() + 1)).padStart(2, '0') +
                    '-' +
                    ('' + this.getUTCDate()).padStart(2, '0') +
                    'T' +
                    ('' + this.getUTCHours()).padStart(2, '0') +
                    ':' +
                    ('' + this.getUTCMinutes()).padStart(2, '0') +
                    ':' +
                    ('' + this.getUTCSeconds()).padStart(2, '0') +
                    '.' +
                    ('' + this.getUTCMilliseconds()).padStart(3, '0') +
                    'Z');
            };
    Date.now =
        Date.now ||
            function now() {
                return new Date().getTime();
            };
})();
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
(function () {
    var ENQUOTE = {
        '\b': '\\b',
        '\t': '\\t',
        '\n': '\\n',
        '\f': '\\f',
        '\r': '\\r',
        '"': '\\"',
        '/': '\\/',
        '\\': '\\\\'
    };
    var DEQUOTE = Object.keys(ENQUOTE).reduce(function (r, ch) { return ((r[ENQUOTE[ch].charAt(1)] = ch), r); }, {});
    var ENQUOTE_RE = new RegExp("[" + Object.keys(ENQUOTE)
        .map(function (ch) { return (ch === '\\' ? '\\\\' : ch); })
        .join('') + "\0-\u001F]", 'g');
    var DEQUOTE_RE = new RegExp("\\\\(?:([" + Object.keys(DEQUOTE)
        .map(function (ch) { return (ch === '\\' ? '\\\\' : ch); })
        .join('') + "])|u([0-9A-Fa-f]{4}))", 'g');
    var ACCEPT_TYPES = {
        boolean: true,
        number: true,
        object: true,
        string: true,
        undefined: true
    };
    this.JSON = this.JSON || {};
    function enquote(str) {
        return "\"" + str.replace(ENQUOTE_RE, function (ch) {
            return ENQUOTE[ch] ||
                '\\u' +
                    ch
                        .charCodeAt(0)
                        .toString(16)
                        .padStart(4, '0');
        }) + "\"";
    }
    function dequote(quoted) {
        return quoted
            .substr(1, -1)
            .replace(DEQUOTE_RE, function (_, ch, hex) {
            return hex ? String.fromCharCode(parseInt(hex, 16)) : DEQUOTE[ch];
        });
    }
    var cache = {};
    var Parser = (function () {
        function Parser(str) {
            this.str = str;
            this.index = 0;
        }
        Parser.prototype.parse = function (reviewer) {
            var value = this.parseValue();
            this.skipWS();
            if (this.isLeft()) {
                this.failedParsing();
            }
            if (!reviewer) {
                return value;
            }
            return (function recursive(key, subvalue) {
                var e_2, _a;
                if (subvalue && typeof subvalue === 'object') {
                    try {
                        for (var _b = __values(Object.entries(subvalue)), _c = _b.next(); !_c.done; _c = _b.next()) {
                            var _d = __read(_c.value, 2), k = _d[0], v = _d[1];
                            subvalue[k] = recursive(k, v);
                        }
                    }
                    catch (e_2_1) { e_2 = { error: e_2_1 }; }
                    finally {
                        try {
                            if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
                        }
                        finally { if (e_2) throw e_2.error; }
                    }
                }
                return reviewer(key, subvalue);
            })('', value);
        };
        Parser.prototype.stickyMatch = function (pattern) {
            var re = cache[pattern] ||
                (cache[pattern] = new RegExp("(?:" + pattern + ")|(?=([\\s\\S]))", 'g'));
            re.lastIndex = this.index;
            var match = re.exec(this.str);
            if (!match || match[match.length - 1]) {
                return undefined;
            }
            this.index += match[0].length;
            return match;
        };
        Parser.prototype.failedParsing = function () {
            if (!this.isLeft()) {
                throw new Error("Unexpected the end of string");
            }
            var re = /[^\r\n]*(?:\r?\n|\r|$)/g;
            var _a = __read([0, 0], 2), line = _a[0], bol = _a[1];
            while (true) {
                var match = re.exec(this.str);
                if (!match) {
                    break;
                }
                var eol = match.index + match[0].length;
                if (eol >= this.index) {
                    break;
                }
                ++line;
                bol = eol;
            }
            var column = this.index - bol;
            throw new Error("unexpected: " + this.str.substr(this.index, 10) + " at line: " + line + ", column: " + column);
        };
        Parser.prototype.skipWS = function () {
            this.stickyMatch("\\s+");
        };
        Parser.prototype.scanOne = function (candidates, nothrow) {
            this.skipWS();
            if (!this.isLeft()) {
                return this.failedParsing();
            }
            var ch = this.str.charAt(this.index);
            if (candidates.indexOf(ch) < 0) {
                if (nothrow) {
                    return undefined;
                }
                return this.failedParsing();
            }
            ++this.index;
            return ch;
        };
        Parser.prototype.parseWord = function (pattern, value) {
            this.skipWS();
            return this.stickyMatch(pattern) ? value : this.failedParsing();
        };
        Parser.prototype.parseNumber = function () {
            this.skipWS();
            var match = this.stickyMatch("-?(?:0|[1-9]\\d*)(?:\\.\\d+)?(?:[Ee][-+]?\\d+)?\\b");
            return match ? +match[0] : this.failedParsing();
        };
        Parser.prototype.parseString = function () {
            this.skipWS();
            var match = this.stickyMatch("\"[^\\\\\"]*(?:\\\\.[^\\\\\"]*)*\"");
            return match ? dequote(match[0]) : this.failedParsing();
        };
        Parser.prototype.parseSequence = function (terminater, initialValue, continuousProc) {
            ++this.index;
            var value = initialValue;
            if (!this.scanOne(terminater, true)) {
                var termsep = terminater + ',';
                do {
                    continuousProc(value);
                } while (this.scanOne(termsep) !== terminater);
            }
            return value;
        };
        Parser.prototype.parseValue = function () {
            var _this = this;
            this.skipWS();
            switch (this.str.charAt(this.index)) {
                case 'n':
                    return this.parseWord("null\\b", null);
                case 't':
                    return this.parseWord("true\\b", true);
                case 'f':
                    return this.parseWord("false\\b", false);
                case '-':
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    return this.parseNumber();
                case '"':
                    return this.parseString();
                case '[':
                    return this.parseSequence(']', [], function (arr) {
                        arr.push(_this.parseValue());
                    });
                case '{':
                    return this.parseSequence('}', {}, function (obj) {
                        _this.skipWS();
                        var name = _this.parseString();
                        _this.scanOne(':');
                        obj[name] = _this.parseValue();
                    });
            }
            this.failedParsing();
        };
        Parser.prototype.isLeft = function () {
            return this.index < this.str.length;
        };
        return Parser;
    }());
    this.JSON.parse =
        this.JSON.parse ||
            function parse(str, reviewer) {
                return new Parser(str).parse(reviewer);
            };
    this.JSON.stringify =
        this.JSON.stringify ||
            function stringify(value, replacer, space) {
                var validKeys = Array.isArray(replacer) ? replacer : undefined;
                var p = typeof replacer === 'function' ? replacer : undefined;
                var indentUnit = typeof space === 'number'
                    ? ' '.repeat(space)
                    : typeof space === 'string'
                        ? space
                        : '';
                var indent = function (depth) {
                    return (indentUnit && '\n' + indentUnit.repeat(depth)) || '';
                };
                return (function sub(v, depth) {
                    switch (v) {
                        case undefined:
                        case null:
                            return 'null';
                        case true:
                            return 'true';
                        case false:
                            return 'false';
                    }
                    var handlers = {
                        number: function (n) { return (isNaN(n) ? 'null' : '' + n); },
                        string: function (s) { return enquote(s); },
                        object: function (o) {
                            if (typeof o.toJSON === 'function') {
                                var json = o.toJSON();
                                if (json !== o) {
                                    return sub(json, depth);
                                }
                            }
                            if (Array.isArray(o)) {
                                if (o.length === 0) {
                                    return '[]';
                                }
                                return ('[' +
                                    indent(depth + 1) +
                                    o
                                        .map(function (json, i) {
                                        return sub(p ? p('' + i, json) : json, depth + 1) ||
                                            'null';
                                    })
                                        .join(',' + indent(depth + 1)) +
                                    indent(depth) +
                                    ']');
                            }
                            var entries = Object.entries(o)
                                .filter(function (_a) {
                                var _b = __read(_a, 2), k = _b[0], sv = _b[1];
                                return ACCEPT_TYPES[typeof sv] &&
                                    (!validKeys || validKeys.includes(k));
                            })
                                .map(function (_a) {
                                var _b = __read(_a, 2), k = _b[0], sv = _b[1];
                                return [enquote(k), sub(p ? p(k, sv) : sv, depth + 1)];
                            })
                                .filter(function (_a) {
                                var _b = __read(_a, 2), sv = _b[1];
                                return !!sv;
                            })
                                .map(function (_a) {
                                var _b = __read(_a, 2), k = _b[0], sv = _b[1];
                                return k + ":" + (space ? ' ' : '') + sv;
                            });
                            if (entries.length === 0) {
                                return '{}';
                            }
                            return ('{' +
                                indent(depth + 1) +
                                entries.join(',' + indent(depth + 1)) +
                                indent(depth) +
                                '}');
                        }
                    };
                    var handler = handlers[typeof v];
                    return handler ? handler(v) : '';
                })(value, 0);
            };
})();
(function () {
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    var hasDontEnumBug = !{ toString: null }.propertyIsEnumerable('toString');
    var dontEnums = [
        'toString',
        'toLocaleString',
        'valueOf',
        'hasOwnProperty',
        'isPrototypeOf',
        'propertyIsEnumerable',
        'constructor',
    ];
    Object.keys =
        Object.keys ||
            function keys(obj) {
                var e_3, _a;
                if (typeof obj !== 'function' &&
                    (typeof obj !== 'object' || obj === null)) {
                    throw new TypeError('Object.keys called on non-object');
                }
                var result = [];
                for (var prop in obj) {
                    if (Symbol.isSymbol(prop)) {
                        continue;
                    }
                    if (!hasOwnProperty.call(obj, prop)) {
                        continue;
                    }
                    result.push(prop);
                }
                if (hasDontEnumBug) {
                    try {
                        for (var dontEnums_1 = __values(dontEnums), dontEnums_1_1 = dontEnums_1.next(); !dontEnums_1_1.done; dontEnums_1_1 = dontEnums_1.next()) {
                            var name = dontEnums_1_1.value;
                            if (!hasOwnProperty.call(obj, name)) {
                                continue;
                            }
                            result.push(name);
                        }
                    }
                    catch (e_3_1) { e_3 = { error: e_3_1 }; }
                    finally {
                        try {
                            if (dontEnums_1_1 && !dontEnums_1_1.done && (_a = dontEnums_1["return"])) _a.call(dontEnums_1);
                        }
                        finally { if (e_3) throw e_3.error; }
                    }
                }
                return result;
            };
    Object.entries =
        Object.entries ||
            function entries(obj) {
                return Object.keys(obj).map(function (key) { return [key, obj[key]]; });
            };
    Object.values =
        Object.values ||
            function values(obj) {
                return Object.keys(obj).map(function (key) { return obj[key]; });
            };
    Object.create =
        Object.create ||
            function create(proto, propertiesObject) {
                if (typeof proto !== 'object' && typeof proto !== 'function') {
                    throw new TypeError('Object prototype may only be an Object: ' + proto);
                }
                if (proto === null) {
                    throw new Error("This Object.create is a shim and doesn't support 'null' as the first argument.");
                }
                if (propertiesObject !== undefined) {
                    throw new Error("This Object.create is a shim and doesn't support a second argument.");
                }
                var F = function () { };
                F.prototype = proto;
                return new F();
            };
    Object.assign =
        Object.assign ||
            function assign(target) {
                var e_4, _a, e_5, _b;
                var sources = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    sources[_i - 1] = arguments[_i];
                }
                if (target == null) {
                    throw new TypeError('Cannot convert null or undefined to object');
                }
                var to = new Object(target);
                try {
                    for (var sources_1 = __values(sources), sources_1_1 = sources_1.next(); !sources_1_1.done; sources_1_1 = sources_1.next()) {
                        var source = sources_1_1.value;
                        try {
                            for (var _c = (e_5 = void 0, __values(Object.keys(source))), _d = _c.next(); !_d.done; _d = _c.next()) {
                                var name = _d.value;
                                to[name] = source[name];
                            }
                        }
                        catch (e_5_1) { e_5 = { error: e_5_1 }; }
                        finally {
                            try {
                                if (_d && !_d.done && (_b = _c["return"])) _b.call(_c);
                            }
                            finally { if (e_5) throw e_5.error; }
                        }
                    }
                }
                catch (e_4_1) { e_4 = { error: e_4_1 }; }
                finally {
                    try {
                        if (sources_1_1 && !sources_1_1.done && (_a = sources_1["return"])) _a.call(sources_1);
                    }
                    finally { if (e_4) throw e_4.error; }
                }
                return to;
            };
})();
(function () {
    String.prototype.repeat =
        String.prototype.repeat ||
            function repeat(count) {
                if (count < 0) {
                    throw new Error('repeat count must be non-negative');
                }
                if (count === Infinity) {
                    throw new Error('repeat count must be less than infinity');
                }
                if (this.length === 0) {
                    if (count < 1) {
                        return '';
                    }
                    throw new Error('empty string');
                }
                var r = '';
                while (count-- > 0) {
                    r += this;
                }
                return r;
            };
    var originalSubstr = String.prototype.substr;
    String.prototype.substr = function substr(start, length) {
        if (start < 0) {
            start += this.length;
        }
        length =
            length !== undefined
                ? length < 0
                    ? length + this.length - start
                    : length
                : this.length - start;
        return originalSubstr.call(this, start, length);
    };
    String.prototype.padStart =
        String.prototype.padStart ||
            function padStart(length, paddings) {
                var count = length - this.length;
                if (count <= 0) {
                    return this;
                }
                paddings = paddings || ' ';
                return (paddings
                    .repeat((count + paddings.length - 1) / paddings.length)
                    .substr(0, count) + this);
            };
    String.prototype.padEnd =
        String.prototype.padEnd ||
            function padEnd(length, paddings) {
                var count = length - this.length;
                if (count <= 0) {
                    return this;
                }
                paddings = paddings || ' ';
                return (this +
                    paddings
                        .repeat((count + paddings.length - 1) / paddings.length)
                        .substr(0, count));
            };
    String.prototype.startsWith =
        String.prototype.startsWith ||
            function startsWith(searchString, position) {
                position = position !== undefined ? position : 0;
                return (this.length - position >= searchString.length &&
                    this.lastIndexOf(searchString, position) === position);
            };
    String.prototype.endsWith =
        String.prototype.endsWith ||
            function endsWith(searchString, position) {
                position =
                    (position !== undefined ? position : this.length) - searchString.length;
                return position >= 0 && this.indexOf(searchString, position) === position;
            };
    String.prototype.trim =
        String.prototype.trim ||
            function trim() {
                var match = /(?:\S(?:.*\S)?)(?=\s*$)/.exec(this);
                return (match && match[0]) || '';
            };
    String.prototype.includes =
        String.prototype.includes ||
            function includes(searchString, position) {
                if (typeof position !== 'number') {
                    position = 0;
                }
                return (position + searchString.length <= this.length &&
                    this.indexOf(searchString, position) >= 0);
            };
    String.prototype.split = function split(separator, limit) {
        var str = '' + this;
        if (separator &&
            typeof separator !== 'string' &&
            !(separator instanceof RegExp) &&
            typeof separator[Symbol.split] === 'function') {
            return separator[Symbol.split](str, limit);
        }
        var index = 0;
        var result = [];
        if (separator instanceof RegExp) {
            var prev = 0;
            var re = separator.global
                ? separator
                : new RegExp(separator.source, "g" + (separator.multiline ? 'm' : '') + (separator.ignoreCase ? 'i' : ''));
            while (true) {
                re.lastIndex = index;
                var match = re.exec(str);
                if (!match) {
                    break;
                }
                if (match[0].length) {
                    var next = match.index;
                    var splitted = str.substr(prev, next - prev);
                    result.push(splitted);
                    prev = index = next + match[0].length;
                }
                else {
                    if (index === prev) {
                        index = prev + 1;
                        if (index >= str.length) {
                            return result;
                        }
                        continue;
                    }
                    if (index >= str.length) {
                        break;
                    }
                    var next = index;
                    var splitted = str.substr(prev, next - prev);
                    prev = next;
                    result.push(splitted);
                    ++index;
                }
                for (var i = 1; i < match.length; ++i) {
                    result.push(match[i]);
                }
            }
            result.push(str.substr(prev));
            return result;
        }
        if (!separator) {
            return Array(str.length)
                .fill(0)
                .map(function (_, i) { return str.substr(i, 1); });
        }
        separator = '' + separator;
        while (index < str.length) {
            var next = str.indexOf(separator, index);
            if (next < 0) {
                break;
            }
            result.push(str.substr(index, next - index));
            index = next + separator.length;
        }
        result.push(str.substr(index));
        return result;
    };
})();
function Symbol(description) {
    var symbols = this.Symbol.symbols;
    var id = "Symbol@@" + description + "@@" + new Date().getTime() + "@@" + Math.random();
    symbols[id] = true;
    return {
        toString: function () {
            return id;
        },
        valueOf: function () {
            return description || '';
        }
    };
}
(function (Symbol) {
})(Symbol || (Symbol = {}));
(function () {
    var symbols = (this.Symbol.symbols = {});
    var registered = {};
    var keys = {};
    this.Symbol.isSymbol = function (symbol) { return !!symbols[symbol.toString()]; };
    this.Symbol["for"] = function (key) {
        var existing = registered[key];
        if (existing) {
            return existing;
        }
        var sym = Symbol(key);
        registered[key] = sym;
        keys[sym.toString()] = key;
        return sym;
    };
    this.Symbol.keyFor = function (sym) { return keys[sym.toString()]; };
})();
(function () {
    this.Symbol.iterator = Symbol('iterator');
    this.Symbol.iterator = Symbol('split');
    function polyfill_iterator(o) {
        var i = 0;
        return {
            next: function () {
                return i < o.length ? { value: o[i++] } : { done: true };
            }
        };
    }
    this.Array.prototype[Symbol.iterator] =
        this.Array.prototype[Symbol.iterator] ||
            function Array_iterator() {
                return polyfill_iterator(this);
            };
    this.String.prototype[Symbol.iterator] =
        this.String.prototype[Symbol.iterator] ||
            function String_iterator() {
                return polyfill_iterator(this);
            };
    if (typeof this.TypedArray === 'function') {
        this.TypedArray.prototype[Symbol.iterator] =
            this.TypedArray.prototype[Symbol.iterator] ||
                function TypedArray_iterator() {
                    return polyfill_iterator(this);
                };
    }
    if (typeof this.Map === 'function') {
        this.Map.prototype[Symbol.iterator] =
            this.Map.prototype[Symbol.iterator] ||
                function Map_iterator() {
                    return polyfill_iterator(this.entries());
                };
    }
    if (typeof this.Set === 'function') {
        this.Set.prototype[Symbol.iterator] =
            this.Set.prototype[Symbol.iterator] ||
                function Set_iterator() {
                    return polyfill_iterator(this.values());
                };
    }
})();
