"use strict";var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:!0}),exports["default"]=fetchKills;var _regenerator=_interopRequireDefault(require("@babel/runtime/regenerator")),_asyncToGenerator2=_interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator")),_mongoose=_interopRequireDefault(require("mongoose")),_models=require("../models");function fetchKills(){return _fetchKills.apply(this,arguments)}function _fetchKills(){return _fetchKills=(0,_asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function a(b){return _regenerator["default"].wrap(function(a){for(;;)switch(a.prev=a.next){case 0:return _mongoose["default"].connect("mongodb://localhost:27017/blueberrydb",{useNewUrlParser:!0,useUnifiedTopology:!0}),b||(b={}),a.next=4,_models.Kill.find(b,function(a,b){return a?console.log(a):b});case 4:return a.abrupt("return",a.sent);case 5:case"end":return a.stop();}},a)})),_fetchKills.apply(this,arguments)}