"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.listPlayers = listPlayers;
exports.kickById = kickById;
exports.banByID = banByID;
exports.broadcast = broadcast;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _require = require("rcon-client"),
    Rcon = _require.Rcon;

var config = require('../../config.json');

function listPlayers(_x) {
  return _listPlayers.apply(this, arguments);
}

function _listPlayers() {
  _listPlayers = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(server) {
    var serverInfo, rcon;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!server) server = 'rcon test';
            serverInfo = config.servers.find(function (x) {
              return x.name === server;
            });
            _context.next = 4;
            return Rcon.connect({
              host: serverInfo.ip,
              port: serverInfo.port,
              password: serverInfo.password
            });

          case 4:
            rcon = _context.sent;
            rcon.send('ListPlayers').then(function (response) {
              console.log(response);
              return response;
            });

          case 6:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _listPlayers.apply(this, arguments);
}

function kickById(_x2, _x3, _x4) {
  return _kickById.apply(this, arguments);
}

function _kickById() {
  _kickById = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(playerID, reason, server) {
    var serverInfo, rcon;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if (!server) server = config.defaultServer;
            serverInfo = config.servers.find(function (x) {
              return x.name === server;
            });
            _context2.next = 4;
            return Rcon.connect({
              host: serverInfo.ip,
              port: serverInfo.port,
              password: serverInfo.password
            });

          case 4:
            rcon = _context2.sent;
            rcon.send("AdminKickById ".concat(playerID, " ").concat(reason)).then(function (response) {
              console.log(response);
              return response;
            });

          case 6:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _kickById.apply(this, arguments);
}

function banByID(_x5, _x6, _x7, _x8) {
  return _banByID.apply(this, arguments);
}

function _banByID() {
  _banByID = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(playerID, reason, length, server) {
    var serverInfo, rcon;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            if (!server) server = config.defaultServer;
            serverInfo = config.servers.find(function (x) {
              return x.name === server;
            });
            _context3.next = 4;
            return Rcon.connect({
              host: serverInfo.ip,
              port: serverInfo.port,
              password: serverInfo.password
            });

          case 4:
            rcon = _context3.sent;
            rcon.send("AdminBanById ".concat(playerID, " ").concat(length, " ").concat(reason)).then(function (response) {
              console.log(response);
              return response;
            });

          case 6:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _banByID.apply(this, arguments);
}

function broadcast(_x9, _x10) {
  return _broadcast.apply(this, arguments);
}

function _broadcast() {
  _broadcast = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(message, server) {
    var serverInfo, rcon;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            if (!server) server = config.defaultServer;
            serverInfo = config.servers.find(function (x) {
              return x.name === server;
            });
            _context4.next = 4;
            return Rcon.connect({
              host: serverInfo.ip,
              port: serverInfo.port,
              password: serverInfo.password
            });

          case 4:
            rcon = _context4.sent;
            rcon.send("AdminBroadcast ".concat(message)).then(function (response) {
              console.log(response);
              return response;
            });

          case 6:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));
  return _broadcast.apply(this, arguments);
}