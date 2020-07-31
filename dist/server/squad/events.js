"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _logParser = require("../../log-parser");

var _config = require("../../../config");

var postLoginRule = _interopRequireWildcard(require("../../log-parser/rules/post-login"));

var Discord = require('discord.js');

var Events = /*#__PURE__*/function () {
  function Events(server) {
    (0, _classCallCheck2["default"])(this, Events);
    this.server = server;
    this.logChannel = this.server.client.channels.cache.find(function (channel) {
      return channel.id === _config.serverLogChannelID;
    });
  }

  (0, _createClass2["default"])(Events, [{
    key: "main",
    value: function main() {
      var _this = this;

      var logParser = new _logParser.LogParser(this.server);
      logParser.main();
      this.server.on('TICK_RATE', function (data) {
        _this.tickRate(data);
      });
      this.server.on('PLAYER_POSSESS', function (data) {
        _this.playerPossess(data);
      });
      this.server.on('CLIENT_LOGIN', function (data, lines) {
        _this.clientLogin(data, lines);
      });
      this.server.on('SERVER_UPDATE', function () {
        _this.serverUpdate();
      });
    }
  }, {
    key: "tickRate",
    value: function tickRate(data) {
      this.server.tickRate = data.tickRate;

      if (data.tickRate > 25) {
        return;
      }

      var embed = new Discord.MessageEmbed().setTitle("Server Tick Rate Update").addFields({
        name: 'Tick Rate',
        value: "".concat(data.tickRate)
      }, {
        name: 'Action Timestamp',
        value: "".concat(data.time)
      }).setTimestamp();

      if (data.tickRate <= 25 && data.tickRate > 20) {
        embed.setColor('#FFFF00');
      } else if (data.tickRate <= 20) {
        embed.setColor('#ff0000');
      }

      this.logChannel.send(embed);
    }
  }, {
    key: "playerPossess",
    value: function playerPossess(data) {
      if (data.classname === 'CameraMan') {
        var embed = new Discord.MessageEmbed().setColor('#0099ff').setTitle("Admin Cam Open").addFields({
          name: 'Player Name',
          value: "".concat(data.player)
        }, {
          name: 'Action Timestamp',
          value: "".concat(data.time)
        }).setTimestamp();
        this.logChannel.send(embed);
      }
    }
  }, {
    key: "clientLogin",
    value: function clientLogin(data, lines) {
      var linesArr = lines.split('\n');
      var postLogin = linesArr[0];
      var match = postLogin.match(postLoginRule["default"].regex);

      if (match) {
        var args = postLoginRule["default"].parseArgs(match);
        console.log(args);
      }
    }
  }, {
    key: "serverUpdate",
    value: function serverUpdate() {
      setActivity(this.server);
      setMessage(this.server);
    }
  }]);
  return Events;
}();

exports["default"] = Events;

function setActivity(server) {
  server.client.user.setActivity("(".concat(server.generatePlayersString(true), ") ").concat(server.map));
}

function setMessage(server) {
  var seedingChannel = server.client.channels.cache.find(function (channel) {
    return channel.id === _config.seedingChannelID;
  });

  if (seedingChannel) {
    seedingChannel.messages.fetch(_config.serverStatusMessageID).then(function (msg) {
      var serverStatusMessage = msg;

      if (serverStatusMessage) {
        server.generateEmbed().then(function (embed) {
          serverStatusMessage.edit(embed);
        });
      }
    });
  }
}