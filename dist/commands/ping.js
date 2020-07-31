"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _default = {
  name: 'ping',
  description: 'Pong!',
  usage: '',
  args: false,
  guildOnly: false,
  disabled: false,
  adminOnly: true,
  execute: function execute(message, args) {
    message.reply('Pinging').then(function (msg) {
      msg.edit("Ping is ".concat(msg.createdAt - message.createdAt, "ms"));
    });
  }
};
exports["default"] = _default;