"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _default = {
  regex: /^\[([0-9.:-]+)]\[([ 0-9]*)]LogSquad: PostLogin: NewPlayer: (.*) \/(.*)\/(.*):PersistentLevel.(.*)/,
  skip: true,
  parseArgs: function parseArgs(args) {
    return {
      time: args[1],
      playerController: args[6]
    };
  }
};
exports["default"] = _default;