"use strict";var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:!0}),exports["default"]=updateSignup;var _mongoose=_interopRequireDefault(require("mongoose")),_models=require("../models"),_functions=require("../../functions");function updateSignup(a,b){_mongoose["default"].connect("mongodb://localhost:27017/blueberrydb",{useNewUrlParser:!0,useUnifiedTopology:!0}),_models.Signup.findByIdAndUpdate(a,b,function(a){a&&console.log(a),(0,_functions.log)("Updated signup")})}