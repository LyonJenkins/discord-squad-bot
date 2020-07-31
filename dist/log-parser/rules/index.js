"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _tickRate = _interopRequireDefault(require("./tick-rate"));

var _openAdminCam = _interopRequireDefault(require("./open-admin-cam"));

var _clientLogin = _interopRequireDefault(require("./client-login"));

var _postLogin = _interopRequireDefault(require("./post-login"));

var _default = [_tickRate["default"], _openAdminCam["default"], _clientLogin["default"], _postLogin["default"]];
exports["default"] = _default;