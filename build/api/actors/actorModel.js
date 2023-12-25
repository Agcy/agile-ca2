"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _mongoose = _interopRequireDefault(require("mongoose"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var Schema = _mongoose["default"].Schema;
var ActorSchema = new Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  profile_path: {
    type: String
  },
  popularity: {
    type: Number
  },
  gender: {
    type: Number
  },
  known_for_department: {
    type: String
  },
  biography: {
    type: String
  },
  birthday: {
    type: String
  },
  deathday: {
    type: String
  },
  place_of_birth: {
    type: String
  }
});
ActorSchema.statics.findByActorDBId = function (id) {
  return this.findOne({
    id: id
  });
};
var _default = exports["default"] = _mongoose["default"].model('Actors', ActorSchema);