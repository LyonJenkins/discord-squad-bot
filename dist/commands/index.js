"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _serverinfo = _interopRequireDefault(require("./serverinfo"));

var _whitelist = _interopRequireDefault(require("./whitelist"));

var _newLine = _interopRequireDefault(require("./newLine"));

var _getTickRate = _interopRequireDefault(require("./getTickRate"));

var _getReactions = _interopRequireDefault(require("./getReactions"));

var _ping = _interopRequireDefault(require("./ping"));

var _default = [_serverinfo["default"], _whitelist["default"], _newLine["default"], _getTickRate["default"], _getReactions["default"], _ping["default"]];
exports["default"] = _default;