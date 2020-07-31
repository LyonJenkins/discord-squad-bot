"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _default = {
  name: 'getTickRate',
  description: 'Returns tick rate from the public server',
  args: false,
  guildOnly: true,
  aliases: ['tickrate', 'tr'],
  disabled: false,
  execute: function execute(message, args, server) {
    return message.reply("server tick rate is ".concat(server.tickRate, "."));
  }
};
exports["default"] = _default;