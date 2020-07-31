"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _config = require("../../config");

var fs = require('fs');

var SteamAPI = require('web-api-steam');

var got = require('got');

var _default = {
  name: 'whitelist',
  description: 'Adds the specified Steam 64 ID or the Steam 64 ID from the profile specified to the whitelist.',
  usage: '<steam64id or steam profile url>',
  args: true,
  guildOnly: false,
  aliases: ['wl'],
  disabled: false,
  execute: function execute(message, args) {
    var steamID = args[0];
    message["delete"]({
      timeout: 1000
    });

    if (validURL(steamID)) {
      get64ID(args[0]).then(function (response) {
        if (response.response.steamid) {
          steamID = response.response.steamid;
          addUser(steamID, message);
        } else {
          return message.reply('specified Steam URL is invalid.').then(function (msg) {
            msg["delete"]({
              timeout: 5000
            });
          });
        }
      });
    } else {
      addUser(steamID, message);
    }
  }
};
exports["default"] = _default;

function validURL(str) {
  var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
  '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
  '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
  '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator

  return !!pattern.test(str);
}

function get64ID(_x) {
  return _get64ID.apply(this, arguments);
}

function _get64ID() {
  _get64ID = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(url) {
    var vanityUrl, id, response;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            vanityUrl = url.split('/');

            if (vanityUrl.indexOf('id') !== -1) {
              vanityUrl = vanityUrl[vanityUrl.indexOf('id') + 1];
            }

            if (!(vanityUrl.indexOf('profiles') !== -1)) {
              _context.next = 5;
              break;
            }

            id = vanityUrl[vanityUrl.indexOf('profiles') + 1];
            return _context.abrupt("return", {
              response: {
                steamid: id
              }
            });

          case 5:
            _context.prev = 5;
            _context.next = 8;
            return got("http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=".concat(_config.steamAPIkey, "&vanityurl=").concat(vanityUrl));

          case 8:
            response = _context.sent;
            return _context.abrupt("return", JSON.parse(response.body));

          case 12:
            _context.prev = 12;
            _context.t0 = _context["catch"](5);
            console.log(_context.t0.response.body);

          case 15:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[5, 12]]);
  }));
  return _get64ID.apply(this, arguments);
}

function addUser(steamID, message) {
  fs.readFile(_config.whitelistPath, 'utf-8', function (err, whitelist) {
    if (err) {
      return console.error(err);
    }

    SteamAPI.getPlayerInfo(steamID, _config.steamAPIkey, function (err, steamUser) {
      if (err) {
        return err;
      }

      if (!steamUser) {
        return message.reply('specified SteamID is invalid.').then(function (msg) {
          msg["delete"]({
            timeout: 5000
          });
        });
      }

      if (whitelist.indexOf(steamID) > -1) {
        return message.reply("that user is already present in the whitelist.").then(function (msg) {
          msg["delete"]({
            timeout: 5000
          });
        });
      }

      var newUser = "\r\nAdmin=".concat(steamID, ":Whitelist // ").concat(steamUser.personaname);
      fs.appendFile(_config.whitelistPath, newUser, function (err) {
        if (err) {
          return console.error(err);
        }

        return message.reply("successfully added Steam user ".concat(steamUser.personaname, " to the whitelist.")).then(function (msg) {
          msg["delete"]({
            timeout: 5000
          });
        });
      });
    });
  });
}