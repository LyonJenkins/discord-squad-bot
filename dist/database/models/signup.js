"use strict";var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:!0}),exports["default"]=void 0;var _mongoose=_interopRequireDefault(require("mongoose")),Signup=new _mongoose["default"].Schema({name:String,discordMessageID:String}),_default=_mongoose["default"].model("Signup",Signup);exports["default"]=_default;