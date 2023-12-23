"use strict";

var _dotenv = _interopRequireDefault(require("dotenv"));
var _mongoose = _interopRequireDefault(require("mongoose"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
_dotenv["default"].config();

// Connect to database
_mongoose["default"].connect(process.env.MONGO_DB);
var db = _mongoose["default"].connection;
db.on('error', function (err) {
  console.log("database connection error: ".concat(err));
});
db.on('disconnected', function () {
  console.log('database disconnected');
});
db.once('open', function () {
  console.log("database connected to ".concat(db.name, " on ").concat(db.host));
});