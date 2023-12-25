"use strict";

var _dotenv = _interopRequireDefault(require("dotenv"));
var _express = _interopRequireDefault(require("express"));
var _movies = _interopRequireDefault(require("./api/movies"));
var _actors = _interopRequireDefault(require("./api/actors"));
require("./db");
require("./seedData");
var _reviews = _interopRequireDefault(require("./api/reviews"));
var _users = _interopRequireDefault(require("./api/users"));
var _authenticate = require("./authenticate");
var _cors = _interopRequireDefault(require("cors"));
var _errHandler = _interopRequireDefault(require("./errHandler"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
_dotenv["default"].config();
var app = (0, _express["default"])();
var port = process.env.PORT;
app.use(_authenticate.passport.initialize());
app.use((0, _cors["default"])());
app.use(_express["default"].json());
app.use('/api/users', _users["default"]);
app.use('/api/actors', _actors["default"]);
app.use('/api/movies', _movies["default"]);
app.use('/api/reviews', _reviews["default"]);
app.use(_errHandler["default"]);
var server = app.listen(port, function () {
  console.info("Server running at ".concat(port));
});
module.exports = server;