"use strict";var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:!0}),exports["default"]=updatePlayer;var _mongoose=_interopRequireDefault(require("mongoose")),_models=require("../models"),_functions=require("../../functions");function updatePlayer(a,b){_mongoose["default"].connect("mongodb://localhost:27017/blueberrydb",{useNewUrlParser:!0,useUnifiedTopology:!0}),_models.Player.findByIdAndUpdate(a,b,function(a,b){a&&console.log(a),console.log(b),(0,_functions.log)("Updated player")})}