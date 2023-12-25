"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = _interopRequireDefault(require("express"));
var _userModel = _interopRequireDefault(require("./userModel"));
var _expressAsyncHandler = _interopRequireDefault(require("express-async-handler"));
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
var _authenticate = require("../../authenticate");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw new Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw new Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
var router = _express["default"].Router(); // eslint-disable-line

// Get all users
router.get('/', /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(req, res) {
    var users;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return _userModel["default"].find();
        case 3:
          users = _context.sent;
          res.status(200).json(users);
          _context.next = 10;
          break;
        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          res.status(500).json({
            error: 'Internal Server Error'
          });
        case 10:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 7]]);
  }));
  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());

// register(Create)/Authenticate User
router.post('/', (0, _expressAsyncHandler["default"])( /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(req, res) {
    var _req$body, username, email, account, password;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _req$body = req.body, username = _req$body.username, email = _req$body.email, account = _req$body.account, password = _req$body.password;
          if (!(req.query.action === 'register')) {
            _context2.next = 9;
            break;
          }
          if (!(!username || !email || !password)) {
            _context2.next = 5;
            break;
          }
          return _context2.abrupt("return", res.status(400).json({
            success: false,
            msg: 'Username, email and password are required for registration.'
          }));
        case 5:
          _context2.next = 7;
          return registerUser(req, res);
        case 7:
          _context2.next = 13;
          break;
        case 9:
          if (!(!account || !password)) {
            _context2.next = 11;
            break;
          }
          return _context2.abrupt("return", res.status(400).json({
            success: false,
            msg: 'Account and password are required for login.'
          }));
        case 11:
          _context2.next = 13;
          return authenticateUser(req, res);
        case 13:
          _context2.next = 20;
          break;
        case 15:
          _context2.prev = 15;
          _context2.t0 = _context2["catch"](0);
          if (!(_context2.t0.name === 'ValidationError')) {
            _context2.next = 19;
            break;
          }
          return _context2.abrupt("return", res.status(400).json({
            success: false,
            msg: 'something got wrong'
          }));
        case 19:
          // Log the error and return a generic error message
          res.status(500).json({
            success: false,
            msg: 'Internal server error.'
          });
        case 20:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[0, 15]]);
  }));
  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}()));

// Update a user
router.put('/:id', /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(req, res) {
    var result;
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          if (req.body._id) delete req.body._id;
          _context3.next = 3;
          return _userModel["default"].updateOne({
            _id: req.params.id
          }, req.body);
        case 3:
          result = _context3.sent;
          if (result.matchedCount) {
            res.status(200).json({
              code: 200,
              msg: 'User Updated Successfully'
            });
          } else {
            res.status(404).json({
              code: 404,
              msg: 'Unable to Update User'
            });
          }
        case 5:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return function (_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}());

// get all favorite movies
router.get('/tmdb/:id/favorites', _authenticate.authenticate, (0, _expressAsyncHandler["default"])( /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(req, res) {
    var id, user;
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          id = req.params.id;
          if (!(req.user.id !== id)) {
            _context4.next = 3;
            break;
          }
          return _context4.abrupt("return", res.status(403).json({
            message: 'Forbidden access.'
          }));
        case 3:
          _context4.prev = 3;
          _context4.next = 6;
          return _userModel["default"].findById(id).populate('favorites');
        case 6:
          user = _context4.sent;
          if (user) {
            _context4.next = 9;
            break;
          }
          return _context4.abrupt("return", res.status(404).json({
            message: 'User not found'
          }));
        case 9:
          res.status(200).json(user.favorites);
          _context4.next = 15;
          break;
        case 12:
          _context4.prev = 12;
          _context4.t0 = _context4["catch"](3);
          res.status(500).json({
            message: 'Internal server error'
          });
        case 15:
        case "end":
          return _context4.stop();
      }
    }, _callee4, null, [[3, 12]]);
  }));
  return function (_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}()));

// add to favorite
router.post('/tmdb/:id/favorites', _authenticate.authenticate, (0, _expressAsyncHandler["default"])( /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(req, res) {
    var id, movieId;
    return _regeneratorRuntime().wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          id = req.params.id;
          movieId = req.body.movieId;
          _context5.prev = 2;
          if (!(req.user.id !== id)) {
            _context5.next = 5;
            break;
          }
          throw new Error('Unauthorized access');
        case 5:
          _context5.next = 7;
          return _userModel["default"].findByIdAndUpdate(id, {
            $addToSet: {
              favorites: movieId
            }
          }, {
            "new": true
          });
        case 7:
          res.status(200).json({
            message: 'Movie added to favorites'
          });
          _context5.next = 13;
          break;
        case 10:
          _context5.prev = 10;
          _context5.t0 = _context5["catch"](2);
          res.status(500).json({
            message: 'Internal server error',
            error: _context5.t0.message
          });
        case 13:
        case "end":
          return _context5.stop();
      }
    }, _callee5, null, [[2, 10]]);
  }));
  return function (_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}()));

// delete from favorite
router["delete"]('/tmdb/:id/favorites/:movieId', _authenticate.authenticate, (0, _expressAsyncHandler["default"])( /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6(req, res) {
    var _req$params, id, movieId;
    return _regeneratorRuntime().wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          _req$params = req.params, id = _req$params.id, movieId = _req$params.movieId;
          _context6.prev = 1;
          if (!(req.user.id !== id)) {
            _context6.next = 4;
            break;
          }
          throw new Error('Unauthorized access');
        case 4:
          _context6.next = 6;
          return _userModel["default"].findByIdAndUpdate(id, {
            $pull: {
              favorites: movieId
            }
          }, {
            "new": true
          });
        case 6:
          res.status(200).json({
            message: 'Movie removed from favorites'
          });
          _context6.next = 12;
          break;
        case 9:
          _context6.prev = 9;
          _context6.t0 = _context6["catch"](1);
          res.status(500).json({
            message: 'Internal server error',
            error: _context6.t0.message
          });
        case 12:
        case "end":
          return _context6.stop();
      }
    }, _callee6, null, [[1, 9]]);
  }));
  return function (_x11, _x12) {
    return _ref6.apply(this, arguments);
  };
}()));

// marked movie
router.get('/tmdb/:id/marked', _authenticate.authenticate, (0, _expressAsyncHandler["default"])( /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee7(req, res) {
    var id, user;
    return _regeneratorRuntime().wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          id = req.params.id;
          _context7.prev = 1;
          if (!(req.user.id !== id)) {
            _context7.next = 4;
            break;
          }
          throw new Error('Unauthorized access');
        case 4:
          _context7.next = 6;
          return _userModel["default"].findById(id).populate('marked');
        case 6:
          user = _context7.sent;
          if (user) {
            _context7.next = 9;
            break;
          }
          return _context7.abrupt("return", res.status(404).json({
            message: 'User not found'
          }));
        case 9:
          res.status(200).json(user.marked);
          _context7.next = 15;
          break;
        case 12:
          _context7.prev = 12;
          _context7.t0 = _context7["catch"](1);
          res.status(500).json({
            message: 'Internal server error',
            error: _context7.t0.message
          });
        case 15:
        case "end":
          return _context7.stop();
      }
    }, _callee7, null, [[1, 12]]);
  }));
  return function (_x13, _x14) {
    return _ref7.apply(this, arguments);
  };
}()));

// add marked
router.post('/tmdb/:id/marked', _authenticate.authenticate, (0, _expressAsyncHandler["default"])( /*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee8(req, res) {
    var id, movieId;
    return _regeneratorRuntime().wrap(function _callee8$(_context8) {
      while (1) switch (_context8.prev = _context8.next) {
        case 0:
          id = req.params.id;
          movieId = req.body.movieId;
          _context8.prev = 2;
          if (!(req.user.id !== id)) {
            _context8.next = 5;
            break;
          }
          return _context8.abrupt("return", res.status(403).json({
            message: 'Forbidden access.'
          }));
        case 5:
          _context8.next = 7;
          return _userModel["default"].findByIdAndUpdate(id, {
            $addToSet: {
              marked: movieId
            }
          }, {
            "new": true
          });
        case 7:
          res.status(200).json({
            message: 'Movie marked successfully'
          });
          _context8.next = 13;
          break;
        case 10:
          _context8.prev = 10;
          _context8.t0 = _context8["catch"](2);
          res.status(500).json({
            message: 'Internal server error',
            error: _context8.t0.message
          });
        case 13:
        case "end":
          return _context8.stop();
      }
    }, _callee8, null, [[2, 10]]);
  }));
  return function (_x15, _x16) {
    return _ref8.apply(this, arguments);
  };
}()));

// delete marked
router["delete"]('/tmdb/:id/marked/:movieId', _authenticate.authenticate, (0, _expressAsyncHandler["default"])( /*#__PURE__*/function () {
  var _ref9 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee9(req, res) {
    var _req$params2, id, movieId;
    return _regeneratorRuntime().wrap(function _callee9$(_context9) {
      while (1) switch (_context9.prev = _context9.next) {
        case 0:
          _req$params2 = req.params, id = _req$params2.id, movieId = _req$params2.movieId;
          _context9.prev = 1;
          if (!(req.user.id !== id)) {
            _context9.next = 4;
            break;
          }
          return _context9.abrupt("return", res.status(403).json({
            message: 'Forbidden access.'
          }));
        case 4:
          _context9.next = 6;
          return _userModel["default"].findByIdAndUpdate(id, {
            $pull: {
              marked: movieId
            }
          }, {
            "new": true
          });
        case 6:
          res.status(200).json({
            message: 'Movie unmarked successfully'
          });
          _context9.next = 12;
          break;
        case 9:
          _context9.prev = 9;
          _context9.t0 = _context9["catch"](1);
          res.status(500).json({
            message: 'Internal server error',
            error: _context9.t0.message
          });
        case 12:
        case "end":
          return _context9.stop();
      }
    }, _callee9, null, [[1, 9]]);
  }));
  return function (_x17, _x18) {
    return _ref9.apply(this, arguments);
  };
}()));

// follow actor
router.get('/tmdb/:id/follow', _authenticate.authenticate, (0, _expressAsyncHandler["default"])( /*#__PURE__*/function () {
  var _ref10 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee10(req, res) {
    var id, user;
    return _regeneratorRuntime().wrap(function _callee10$(_context10) {
      while (1) switch (_context10.prev = _context10.next) {
        case 0:
          id = req.params.id;
          _context10.prev = 1;
          if (!(req.user.id !== id)) {
            _context10.next = 4;
            break;
          }
          return _context10.abrupt("return", res.status(403).json({
            message: 'Forbidden access.'
          }));
        case 4:
          _context10.next = 6;
          return _userModel["default"].findById(id).populate('follow');
        case 6:
          user = _context10.sent;
          if (user) {
            _context10.next = 9;
            break;
          }
          return _context10.abrupt("return", res.status(404).json({
            message: 'User not found'
          }));
        case 9:
          res.status(200).json(user.follow);
          _context10.next = 15;
          break;
        case 12:
          _context10.prev = 12;
          _context10.t0 = _context10["catch"](1);
          res.status(500).json({
            message: 'Internal server error',
            error: _context10.t0.message
          });
        case 15:
        case "end":
          return _context10.stop();
      }
    }, _callee10, null, [[1, 12]]);
  }));
  return function (_x19, _x20) {
    return _ref10.apply(this, arguments);
  };
}()));

// add actors
router.post('/tmdb/:id/follow', _authenticate.authenticate, (0, _expressAsyncHandler["default"])( /*#__PURE__*/function () {
  var _ref11 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee11(req, res) {
    var id, actorId;
    return _regeneratorRuntime().wrap(function _callee11$(_context11) {
      while (1) switch (_context11.prev = _context11.next) {
        case 0:
          id = req.params.id;
          actorId = req.body.actorId;
          _context11.prev = 2;
          if (!(req.user.id !== id)) {
            _context11.next = 5;
            break;
          }
          return _context11.abrupt("return", res.status(403).json({
            message: 'Forbidden access.'
          }));
        case 5:
          _context11.next = 7;
          return _userModel["default"].findByIdAndUpdate(id, {
            $addToSet: {
              follow: actorId
            }
          }, {
            "new": true
          });
        case 7:
          res.status(200).json({
            message: 'Actor followed successfully'
          });
          _context11.next = 13;
          break;
        case 10:
          _context11.prev = 10;
          _context11.t0 = _context11["catch"](2);
          res.status(500).json({
            message: 'Internal server error',
            error: _context11.t0.message
          });
        case 13:
        case "end":
          return _context11.stop();
      }
    }, _callee11, null, [[2, 10]]);
  }));
  return function (_x21, _x22) {
    return _ref11.apply(this, arguments);
  };
}()));

// delete actors
router["delete"]('/tmdb/:id/follow/:actorId', _authenticate.authenticate, (0, _expressAsyncHandler["default"])( /*#__PURE__*/function () {
  var _ref12 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee12(req, res) {
    var _req$params3, id, actorId;
    return _regeneratorRuntime().wrap(function _callee12$(_context12) {
      while (1) switch (_context12.prev = _context12.next) {
        case 0:
          _req$params3 = req.params, id = _req$params3.id, actorId = _req$params3.actorId;
          _context12.prev = 1;
          if (!(req.user.id !== id)) {
            _context12.next = 4;
            break;
          }
          return _context12.abrupt("return", res.status(403).json({
            message: 'Forbidden access.'
          }));
        case 4:
          _context12.next = 6;
          return _userModel["default"].findByIdAndUpdate(id, {
            $pull: {
              follow: actorId
            }
          }, {
            "new": true
          });
        case 6:
          res.status(200).json({
            message: 'Actor unfollowed successfully'
          });
          _context12.next = 12;
          break;
        case 9:
          _context12.prev = 9;
          _context12.t0 = _context12["catch"](1);
          res.status(500).json({
            message: 'Internal server error',
            error: _context12.t0.message
          });
        case 12:
        case "end":
          return _context12.stop();
      }
    }, _callee12, null, [[1, 9]]);
  }));
  return function (_x23, _x24) {
    return _ref12.apply(this, arguments);
  };
}()));
function registerUser(_x25, _x26) {
  return _registerUser.apply(this, arguments);
}
function _registerUser() {
  _registerUser = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee13(req, res) {
    var _req$body2, username, email, password, user, user1, emailRegex, passwordRegex, newUser, token;
    return _regeneratorRuntime().wrap(function _callee13$(_context13) {
      while (1) switch (_context13.prev = _context13.next) {
        case 0:
          _req$body2 = req.body, username = _req$body2.username, email = _req$body2.email, password = _req$body2.password; // 验证用户名
          if (username) {
            _context13.next = 3;
            break;
          }
          return _context13.abrupt("return", res.status(400).json({
            success: false,
            msg: 'Username is required.'
          }));
        case 3:
          _context13.next = 5;
          return _userModel["default"].findOne({
            username: username
          });
        case 5:
          user = _context13.sent;
          if (user) {
            res.status(400).json({
              success: false,
              msg: 'User name already existed!!'
            });
          }

          // 验证邮箱
          if (email) {
            _context13.next = 9;
            break;
          }
          return _context13.abrupt("return", res.status(400).json({
            success: false,
            msg: 'Email is required.'
          }));
        case 9:
          _context13.next = 11;
          return _userModel["default"].findOne({
            email: email
          });
        case 11:
          user1 = _context13.sent;
          if (user1) {
            res.status(400).json({
              success: false,
              msg: 'Email already existed!!'
            });
          }
          // 验证邮箱格式
          emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (emailRegex.test(email)) {
            _context13.next = 16;
            break;
          }
          return _context13.abrupt("return", res.status(400).json({
            success: false,
            msg: 'Invalid email format.'
          }));
        case 16:
          if (password) {
            _context13.next = 18;
            break;
          }
          return _context13.abrupt("return", res.status(400).json({
            success: false,
            msg: 'Password is required.'
          }));
        case 18:
          // 验证密码格式（例如，长度和字符要求）
          passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/; // 示例：至少8个字符，至少一个字母和一个数字
          if (passwordRegex.test(password)) {
            _context13.next = 21;
            break;
          }
          return _context13.abrupt("return", res.status(400).json({
            success: false,
            msg: 'Password does not meet complexity requirements.'
          }));
        case 21:
          _context13.prev = 21;
          // 创建用户
          // 创建用户
          newUser = new _userModel["default"](req.body);
          _context13.next = 25;
          return newUser.save();
        case 25:
          // 创建令牌
          token = _jsonwebtoken["default"].sign({
            username: newUser.username
          }, process.env.SECRET); // 发送响应
          res.status(201).json({
            success: true,
            msg: 'User successfully created.',
            token: 'BEARER ' + token,
            user: {
              id: newUser._id,
              // 返回用户 ID
              username: newUser.username,
              email: newUser.email
            }
          });
          _context13.next = 32;
          break;
        case 29:
          _context13.prev = 29;
          _context13.t0 = _context13["catch"](21);
          // 错误处理逻辑，比如处理唯一性冲突等
          res.status(500).json({
            success: false,
            msg: 'Internal server error.'
          });
        case 32:
        case "end":
          return _context13.stop();
      }
    }, _callee13, null, [[21, 29]]);
  }));
  return _registerUser.apply(this, arguments);
}
function authenticateUser(_x27, _x28) {
  return _authenticateUser.apply(this, arguments);
}
function _authenticateUser() {
  _authenticateUser = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee14(req, res) {
    var user, _req$body3, account, password, isMatch, token;
    return _regeneratorRuntime().wrap(function _callee14$(_context14) {
      while (1) switch (_context14.prev = _context14.next) {
        case 0:
          _req$body3 = req.body, account = _req$body3.account, password = _req$body3.password; // 判断输入的是邮箱还是用户名
          if (!account.includes('@')) {
            _context14.next = 7;
            break;
          }
          _context14.next = 4;
          return _userModel["default"].findByEmail(account);
        case 4:
          user = _context14.sent;
          _context14.next = 10;
          break;
        case 7:
          _context14.next = 9;
          return _userModel["default"].findByUserName(account);
        case 9:
          user = _context14.sent;
        case 10:
          if (user) {
            _context14.next = 12;
            break;
          }
          return _context14.abrupt("return", res.status(401).json({
            success: false,
            msg: 'Authentication failed. User not found.'
          }));
        case 12:
          _context14.next = 14;
          return user.comparePassword(password);
        case 14:
          isMatch = _context14.sent;
          if (isMatch) {
            token = _jsonwebtoken["default"].sign({
              username: user.username
            }, process.env.SECRET);
            res.status(200).json({
              success: true,
              msg: 'User login successfully',
              token: 'BEARER ' + token,
              user: {
                id: user._id,
                // 返回用户 ID
                username: user.username,
                email: user.email
              }
            });
          } else {
            res.status(401).json({
              success: false,
              msg: 'Wrong password.'
            });
          }
        case 16:
        case "end":
          return _context14.stop();
      }
    }, _callee14);
  }));
  return _authenticateUser.apply(this, arguments);
}
var _default = exports["default"] = router;