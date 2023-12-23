"use strict";

var _dotenv = _interopRequireDefault(require("dotenv"));
var _express = _interopRequireDefault(require("express"));
var _movies = _interopRequireDefault(require("./api/movies"));
require("./db");
require("./seedData");
var _users = _interopRequireDefault(require("./api/users"));
var _authenticate = _interopRequireDefault(require("./authenticate"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
// import genresRouter from './api/genres'

// import authenticate from './authenticate';

var errHandler = function errHandler(err, req, res, next) {
  /* if the error in development then send stack trace to display whole error,
  if it's in production then just send error message  */
  if (process.env.NODE_ENV === 'production') {
    return res.status(500).send("Something went wrong!");
  }
  res.status(500).send("Hey!! You caught the error \uD83D\uDC4D\uD83D\uDC4D. Here's the details: ".concat(err.stack, " "));
};
_dotenv["default"].config();
var app = (0, _express["default"])();
var port = process.env.PORT;
app.use(_authenticate["default"].initialize());
app.use(_express["default"].json());
// app.use('/api/movies', passport.authenticate('jwt', {session: false}), moviesRouter);
app.use('/api/movies', _movies["default"]);
// app.use('/api/genres', genresRouter);
app.use('/api/users', _users["default"]);
app.use(errHandler);
var server = app.listen(port, function () {
  console.info("Server running at ".concat(port));
});
module.exports = server;