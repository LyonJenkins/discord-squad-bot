"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = properArgs;

var _config = require("../../config");

function properArgs(command) {
  var reply = "you did not provide the proper command arguments.";

  if (command.usage) {
    reply += "\nThe proper usage would be: `".concat(_config.prefix).concat(command.name, " ").concat(command.usage, "`");
  }

  return reply;
}