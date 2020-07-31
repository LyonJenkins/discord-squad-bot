"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var commands = _interopRequireWildcard(require("./commands"));

var _squad = require("./server/squad");

var _config = require("../config");

var _functions = require("./functions");

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var Discord = require('discord.js');

var client = new Discord.Client({
  partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'GUILD_MEMBER']
});
client.commands = new Discord.Collection();
var server;

var _iterator = _createForOfIteratorHelper(commands["default"]),
    _step;

try {
  for (_iterator.s(); !(_step = _iterator.n()).done;) {
    var command = _step.value;
    client.commands.set(command.name.toLowerCase(), command);
  }
} catch (err) {
  _iterator.e(err);
} finally {
  _iterator.f();
}

client.on('ready', function () {
  console.log("Logged in as ".concat(client.user.tag));
  server = new _squad.Server('Public', client);
  server.main();
});
client.on('message', function (message) {
  var args = message.content.slice(_config.prefix.length).split(' ');
  var commandName = args.shift().toLowerCase();

  if (message.content.startsWith(_config.prefix)) {
    var command = client.commands.get(commandName) || client.commands.find(function (cmd) {
      return cmd.aliases && cmd.aliases.includes(commandName);
    });

    if (!command) {
      return;
    }

    if (command.disabled) {
      return;
    }

    if (command.adminOnly) {
      var admin = false;

      var _iterator2 = _createForOfIteratorHelper(_config.adminRoles),
          _step2;

      try {
        var _loop = function _loop() {
          var roleID = _step2.value;
          if (message.member.roles.cache.find(function (role) {
            return role.id === roleID;
          })) admin = true;
        };

        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          _loop();
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }

      if (!admin) return message.reply('you are not authorized to use that command.');
    }

    if (command.guildOnly && message.channel.type !== 'text') {
      return message.reply('that command cannot be executed inside direct messages.');
    }

    if (command.args && !args.length) {
      return message.reply((0, _functions.properArgs)(command));
    }

    try {
      command.execute(message, args, server);
    } catch (error) {
      console.error(error);
      message.reply('there was an error trying to execute that command!');
    }
  }
});
client.on('messageReactionAdd', /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(reaction, user) {
    var message;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!reaction.partial) {
              _context.next = 10;
              break;
            }

            _context.prev = 1;
            _context.next = 4;
            return reaction.fetch();

          case 4:
            _context.next = 10;
            break;

          case 6:
            _context.prev = 6;
            _context.t0 = _context["catch"](1);
            console.log('Something went wrong when fetching the message: ', _context.t0);
            return _context.abrupt("return");

          case 10:
            message = reaction.message;
            (0, _functions.checkForRefreshReaction)(message, reaction, user, server);
            (0, _functions.reactionGiveRole)(message, reaction, user);

          case 13:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[1, 6]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
client.on('messageReactionRemove', /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(reaction, user) {
    var message;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if (!reaction.partial) {
              _context2.next = 10;
              break;
            }

            _context2.prev = 1;
            _context2.next = 4;
            return reaction.fetch();

          case 4:
            _context2.next = 10;
            break;

          case 6:
            _context2.prev = 6;
            _context2.t0 = _context2["catch"](1);
            console.log('Something went wrong when fetching the message: ', _context2.t0);
            return _context2.abrupt("return");

          case 10:
            message = reaction.message;
            (0, _functions.reactionGiveRole)(message, reaction, user);

          case 12:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[1, 6]]);
  }));

  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}());
client.login(_config.BOT_TOKEN);