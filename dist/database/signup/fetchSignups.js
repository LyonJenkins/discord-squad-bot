"use strict";var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:!0}),exports["default"]=fetchSignups;var _regenerator=_interopRequireDefault(require("@babel/runtime/regenerator")),_asyncToGenerator2=_interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator")),_mongoose=_interopRequireDefault(require("mongoose")),_models=require("../models");function fetchSignups(){return _fetchSignups.apply(this,arguments)}function _fetchSignups(){return _fetchSignups=(0,_asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function a(){return _regenerator["default"].wrap(function(a){for(;;)switch(a.prev=a.next){case 0:return _mongoose["default"].connect("mongodb://localhost:27017/blueberrydb",{useNewUrlParser:!0,useUnifiedTopology:!0}),a.next=3,_models.Signup.find({},function(a,b){return a?console.log(a):b});case 3:return a.abrupt("return",a.sent);case 4:case"end":return a.stop();}},a)})),_fetchSignups.apply(this,arguments)}