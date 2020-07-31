"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _events = require("events");

var _config = require("../../../config");

var _index = require("./index");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var Discord = require('discord.js');

var Gamedig = require('gamedig');

var Server = /*#__PURE__*/function (_EventEmitter) {
  (0, _inherits2["default"])(Server, _EventEmitter);

  var _super = _createSuper(Server);

  function Server(serverName, client) {
    var _this;

    (0, _classCallCheck2["default"])(this, Server);
    _this = _super.call(this);
    _this.server = _config.servers.find(function (x) {
      return x.name === serverName;
    });
    _this.playerCount = 0;
    _this.map = '';
    _this.maxPlayers = 0;
    _this.name = '';
    _this.publicSlots = 0;
    _this.reservedSlots = 0;
    _this.publicQueue = 0;
    _this.reservedQueue = 0;
    _this.tickRate = 0;
    _this.client = client;
    return _this;
  }

  (0, _createClass2["default"])(Server, [{
    key: "main",
    value: function main() {
      var _this2 = this;

      var events = new _index.Events(this);
      events.main();
      this.setServerData().then(function () {
        _this2.emit('SERVER_UPDATE');

        setInterval(function () {
          _this2.parseServerData().then(function (data) {
            if (data.playerCount !== _this2.playerCount || data.map !== _this2.map || data.publicQueue !== _this2.publicQueue || data.reservedQueue !== _this2.reservedQueue || data.publicSlots !== _this2.publicSlots || data.reservedSlots !== _this2.reservedSlots) {
              _this2.refresh();
            }
          });
        }, 30000);
      });
    }
  }, {
    key: "generateEmbed",
    value: function () {
      var _generateEmbed = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.setServerData();

              case 2:
                return _context.abrupt("return", new Discord.MessageEmbed().setColor('#0099ff').setTitle(this.name).addFields({
                  name: 'Players',
                  value: this.generatePlayersString(),
                  inline: true
                }, {
                  name: 'Current Layer',
                  value: this.map,
                  inline: true
                }).setTimestamp().setFooter('Server Status powered by Blueberries'));

              case 3:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function generateEmbed() {
        return _generateEmbed.apply(this, arguments);
      }

      return generateEmbed;
    }()
  }, {
    key: "setServerData",
    value: function () {
      var _setServerData = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
        var data;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return this.parseServerData();

              case 2:
                data = _context2.sent;
                this.playerCount = data.playerCount;
                this.map = data.map;
                this.maxPlayers = data.maxplayers;
                this.publicSlots = data.publicSlots;
                this.reservedSlots = data.reservedSlots;
                this.publicQueue = data.publicQueue;
                this.reservedQueue = data.reservedQueue;
                this.name = data.name;

              case 11:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function setServerData() {
        return _setServerData.apply(this, arguments);
      }

      return setServerData;
    }()
  }, {
    key: "parseServerData",
    value: function () {
      var _parseServerData = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
        var state;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return this.queryServer()["catch"](function (error) {
                  console.log(error);
                });

              case 2:
                state = _context3.sent;
                return _context3.abrupt("return", {
                  playerCount: parseInt(state.raw.rules.PlayerCount_i),
                  map: state.map,
                  maxPlayers: state.maxplayers,
                  publicSlots: parseInt(state.raw.rules.NUMPUBCONN),
                  reservedSlots: parseInt(state.raw.rules.NUMPRIVCONN),
                  publicQueue: parseInt(state.raw.rules.PublicQueue_i),
                  reservedQueue: parseInt(state.raw.rules.ReservedQueue_i),
                  name: state.name
                });

              case 4:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function parseServerData() {
        return _parseServerData.apply(this, arguments);
      }

      return parseServerData;
    }()
  }, {
    key: "generatePlayersString",
    value: function generatePlayersString(minimize) {
      var string = "".concat(this.playerCount);

      if (this.publicQueue > 0) {
        string += "+".concat(this.publicQueue + this.reservedQueue);
      }

      if (minimize) {
        string += "/";
      } else {
        string += " / ";
      }

      string += "".concat(this.publicSlots);

      if (this.reservedSlots > 0) {
        string += "+".concat(this.reservedSlots);
      }

      return string;
    }
  }, {
    key: "queryServer",
    value: function () {
      var _queryServer = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4() {
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                return _context4.abrupt("return", Gamedig.query({
                  type: 'squad',
                  host: this.server.ip,
                  port: parseInt(this.server.queryPort),
                  maxAttempts: 10
                }));

              case 1:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function queryServer() {
        return _queryServer.apply(this, arguments);
      }

      return queryServer;
    }()
  }, {
    key: "refresh",
    value: function refresh() {
      var _this3 = this;

      this.setServerData().then(function () {
        _this3.emit('SERVER_UPDATE');
      });
    }
  }]);
  return Server;
}(_events.EventEmitter);

exports["default"] = Server;