"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _mongoose = _interopRequireDefault(require("mongoose"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var Schema = _mongoose["default"].Schema;
var ReviewSchema = new Schema({
  movieId: {
    type: Number,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  author: {
    type: String,
    required: true
  },
  review: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    "default": Date.now
  }
});
var _default = exports["default"] = _mongoose["default"].model('Review', ReviewSchema);