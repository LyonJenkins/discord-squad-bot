"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _events = require("events");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var Tail = require('tail').Tail;

var readLastLines = require('read-last-lines');

var FileTail = /*#__PURE__*/function (_EventEmitter) {
  (0, _inherits2["default"])(FileTail, _EventEmitter);

  var _super = _createSuper(FileTail);

  function FileTail(path) {
    var _this;

    (0, _classCallCheck2["default"])(this, FileTail);
    _this = _super.call(this);
    _this.filePath = path;
    return _this;
  }

  (0, _createClass2["default"])(FileTail, [{
    key: "main",
    value: function main() {
      var _this2 = this;

      var tail = new Tail(this.filePath);
      tail.on('line', function (line) {
        readLastLines.read(_this2.filePath, 2).then(function (lines) {
          var data = {
            line: line,
            lines: lines
          };

          _this2.emit('line', data);
        });
      });
    }
  }]);
  return FileTail;
}(_events.EventEmitter);

exports["default"] = FileTail;