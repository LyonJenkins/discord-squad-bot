"use strict";var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:!0}),exports["default"]=void 0;var _mongoose=_interopRequireDefault(require("mongoose")),Kill=new _mongoose["default"].Schema({killer:String,victim:String,weapon:String,teamkill:Boolean}),_default=_mongoose["default"].model("Kill",Kill);exports["default"]=_default;