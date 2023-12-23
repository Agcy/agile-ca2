"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var defaultErrHandler = function defaultErrHandler(err, req, res, next) {
  /* if the error in development then send stack trace to display whole error,
  if it's in production then just send error message  */
  if (process.env.NODE_ENV === 'production') {
    return res.status(500).send("Something went wrong!");
  }
  res.status(500).send("Hey!! You caught the error \uD83D\uDC4D\uD83D\uDC4D. Here's the details: ".concat(err.stack, " "));
};
var _default = exports["default"] = defaultErrHandler;