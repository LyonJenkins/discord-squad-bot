"use strict";var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:!0}),exports["default"]=newSignup;var _mongoose=_interopRequireDefault(require("mongoose")),_models=require("../models"),_functions=require("../../functions");function newSignup(a,b){_mongoose["default"].connect("mongodb://localhost:27017/blueberrydb",{useNewUrlParser:!0,useUnifiedTopology:!0});var c=new _models.Signup({name:a.content,discordMessageID:a.id,discordSignupEmbedID:b});c.save().then(function(){(0,_functions.log)("New signup created")})}