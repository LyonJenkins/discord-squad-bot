"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _tail = _interopRequireDefault(require("./tail"));

var _rules = _interopRequireDefault(require("./rules"));

var moment = _interopRequireWildcard(require("moment"));

var _config = require("../../config");

var _async = _interopRequireDefault(require("async"));

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var LogParser = /*#__PURE__*/function () {
  function LogParser(server) {
    var _this = this;

    (0, _classCallCheck2["default"])(this, LogParser);
    this.server = server;
    this.queue = _async["default"].queue(function (task, callback) {
      handleLine(task.data, _this).then(function () {
        callback();
      });
    });
  }

  (0, _createClass2["default"])(LogParser, [{
    key: "main",
    value: function main() {
      var _this2 = this;

      var fileTail = new _tail["default"](_config.squadGameLogPath);
      fileTail.on('line', function (data) {
        _this2.queue.push({
          data: data
        });
      });
      fileTail.main();
    }
  }]);
  return LogParser;
}();

exports["default"] = LogParser;

function handleLine(_x, _x2) {
  return _handleLine.apply(this, arguments);
}

function _handleLine() {
  _handleLine = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(data, logParser) {
    var _iterator, _step, rule, match;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _iterator = _createForOfIteratorHelper(_rules["default"]);
            _context.prev = 1;

            _iterator.s();

          case 3:
            if ((_step = _iterator.n()).done) {
              _context.next = 15;
              break;
            }

            rule = _step.value;

            if (!rule.skip) {
              _context.next = 7;
              break;
            }

            return _context.abrupt("continue", 13);

          case 7:
            match = data.line.match(rule.regex);

            if (!match) {
              _context.next = 13;
              break;
            }

            match[1] = moment.utc(match[1], 'YYYY.MM.DD-hh.mm.ss:SSS').toDate();
            _context.next = 12;
            return rule.parseArgs(match, logParser, data.lines);

          case 12:
            return _context.abrupt("break", 15);

          case 13:
            _context.next = 3;
            break;

          case 15:
            _context.next = 20;
            break;

          case 17:
            _context.prev = 17;
            _context.t0 = _context["catch"](1);

            _iterator.e(_context.t0);

          case 20:
            _context.prev = 20;

            _iterator.f();

            return _context.finish(20);

          case 23:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[1, 17, 20, 23]]);
  }));
  return _handleLine.apply(this, arguments);
}