"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _default = {
  regex: /^\[([0-9.:-]+)]\[([ 0-9]*)]LogSquad: USQGameState: Server Tick Rate: ([0-9.]+)/,
  parseArgs: function parseArgs(args, logParser) {
    var data = {
      time: args[1],
      tickRate: parseInt(args[3])
    };
    logParser.server.emit('TICK_RATE', data);
  }
};
exports["default"] = _default;