"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _default = {
  regex: /^\[([0-9.:-]+)]\[([ 0-9]*)]LogEasyAntiCheatServer: \[[0-9:]+]\[Windows]\[EAC Server] \[Info]\[RegisterClient] Client: ([a-zA-Z0-9_.-]*) PlayerGUID: ([0-9]*) PlayerIP: ([0-9]*) OwnerGUID: ([0-9]*) PlayerName: (.*)/,
  parseArgs: function parseArgs(args, logParser, lines) {
    var data = {
      time: args[1],
      steam64ID: args[4],
      name: args[7]
    };
    logParser.server.emit('CLIENT_LOGIN', data, lines);
  }
};
exports["default"] = _default;