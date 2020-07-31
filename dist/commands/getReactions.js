"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _config = require("../../config");

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var _default = {
  name: 'getReactions',
  description: 'Gets reactions for a certain message',
  args: true,
  guildOnly: true,
  disabled: false,
  adminOnly: true,
  aliases: ['gr'],
  execute: function execute(message, args, server) {
    var regex = /^((http[s]?|ftp):\/)?\/?([^:\/\s]+)((\/\w+)*\/)([\w\-\.]+[^#?\s]+)(.*)?(#[\w\-]+)?$/;
    var parsedURL = args[0].match(regex);
    var messageID;

    if (parsedURL != null) {
      messageID = parsedURL[6];
    } else {
      messageID = args[0];
    }

    var client = message.client;
    var channel = client.channels.cache.get(_config.signupsChannelID);
    if (!channel) return message.reply('the signups channel specified in the config does not exist.');
    channel.messages.fetch(messageID).then(function (signupsMessage) {
      var reactionsArray = signupsMessage.reactions.cache.array();
      generateSignupsAndSend(reactionsArray, message);
    })["catch"](function (error) {
      console.log(error);
      if (error) return message.reply('there was an error trying to execute this command.');
    });
  }
};
exports["default"] = _default;

function generateSignupsAndSend(reactionsArray, message) {
  var _iterator = _createForOfIteratorHelper(reactionsArray),
      _step;

  try {
    var _loop = function _loop() {
      var reaction = _step.value;
      var reactions = "";
      reactions += "".concat(reaction.count, " user(s) reacted with ").concat(reaction.emoji.toString(), "\n");
      reaction.users.fetch().then(function (users) {
        var _iterator2 = _createForOfIteratorHelper(users.array()),
            _step2;

        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var user = _step2.value;
            reactions += "<@".concat(user.id, ">\n");
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }

        message.channel.send(reactions);
      });
    };

    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      _loop();
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
}