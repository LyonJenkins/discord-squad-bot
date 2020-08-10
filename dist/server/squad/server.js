"use strict";var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:!0}),exports["default"]=void 0;var _regenerator=_interopRequireDefault(require("@babel/runtime/regenerator")),_asyncToGenerator2=_interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator")),_classCallCheck2=_interopRequireDefault(require("@babel/runtime/helpers/classCallCheck")),_createClass2=_interopRequireDefault(require("@babel/runtime/helpers/createClass")),_inherits2=_interopRequireDefault(require("@babel/runtime/helpers/inherits")),_possibleConstructorReturn2=_interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn")),_getPrototypeOf2=_interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf")),_events=require("events"),_config=require("../../../config"),_index=require("./index");function _createSuper(a){var b=_isNativeReflectConstruct();return function(){var c,d=(0,_getPrototypeOf2["default"])(a);if(b){var e=(0,_getPrototypeOf2["default"])(this).constructor;c=Reflect.construct(d,arguments,e)}else c=d.apply(this,arguments);return(0,_possibleConstructorReturn2["default"])(this,c)}}function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(a){return!1}}var Discord=require("discord.js"),Gamedig=require("gamedig"),Server=/*#__PURE__*/function(a){function b(a,d){var e;return(0,_classCallCheck2["default"])(this,b),e=c.call(this),e.server=_config.servers.find(function(b){return b.name===a}),e.playerCount=0,e.map="",e.maxPlayers=0,e.name="",e.publicSlots=0,e.reservedSlots=0,e.publicQueue=0,e.reservedQueue=0,e.tickRate=0,e.client=d,e}(0,_inherits2["default"])(b,a);var c=_createSuper(b);return(0,_createClass2["default"])(b,[{key:"main",value:function main(){var a=this,b=new _index.Events(this);b.main(),this.setServerData().then(function(){a.emit("SERVER_UPDATE"),setInterval(function(){a.parseServerData().then(function(b){(b.playerCount!==a.playerCount||b.map!==a.map||b.publicQueue!==a.publicQueue||b.reservedQueue!==a.reservedQueue||b.publicSlots!==a.publicSlots||b.reservedSlots!==a.reservedSlots)&&a.refresh()})},3e4)})}},{key:"generateEmbed",value:function(){var a=(0,_asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function a(){return _regenerator["default"].wrap(function(a){for(;;)switch(a.prev=a.next){case 0:return a.next=2,this.setServerData();case 2:return a.abrupt("return",new Discord.MessageEmbed().setColor("#0099ff").setTitle(this.name).addFields({name:"Players",value:this.generatePlayersString(),inline:!0},{name:"Current Layer",value:this.map,inline:!0}).setTimestamp().setFooter("Server Status powered by Blueberries"));case 3:case"end":return a.stop();}},a,this)}));return function generateEmbed(){return a.apply(this,arguments)}}()},{key:"setServerData",value:function(){var a=(0,_asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function a(){var b;return _regenerator["default"].wrap(function(a){for(;;)switch(a.prev=a.next){case 0:return a.next=2,this.parseServerData();case 2:b=a.sent,this.playerCount=b.playerCount,this.map=b.map,this.maxPlayers=b.maxplayers,this.publicSlots=b.publicSlots,this.reservedSlots=b.reservedSlots,this.publicQueue=b.publicQueue,this.reservedQueue=b.reservedQueue,this.name=b.name;case 11:case"end":return a.stop();}},a,this)}));return function setServerData(){return a.apply(this,arguments)}}()},{key:"parseServerData",value:function(){var a=(0,_asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function a(){var b;return _regenerator["default"].wrap(function(a){for(;;)switch(a.prev=a.next){case 0:return a.next=2,this.queryServer()["catch"](function(a){console.log(a)});case 2:return b=a.sent,a.abrupt("return",{playerCount:parseInt(b.raw.rules.PlayerCount_i),map:b.map,maxPlayers:b.maxplayers,publicSlots:parseInt(b.raw.rules.NUMPUBCONN),reservedSlots:parseInt(b.raw.rules.NUMPRIVCONN),publicQueue:parseInt(b.raw.rules.PublicQueue_i),reservedQueue:parseInt(b.raw.rules.ReservedQueue_i),name:b.name});case 4:case"end":return a.stop();}},a,this)}));return function parseServerData(){return a.apply(this,arguments)}}()},{key:"generatePlayersString",value:function generatePlayersString(a){var b="".concat(this.playerCount);return 0<this.publicQueue&&(b+="+".concat(this.publicQueue+this.reservedQueue)),b+=a?"/":" / ",b+="".concat(this.publicSlots),0<this.reservedSlots&&(b+="+".concat(this.reservedSlots)),b}},{key:"queryServer",value:function(){var a=(0,_asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function a(){return _regenerator["default"].wrap(function(a){for(;;)switch(a.prev=a.next){case 0:return a.abrupt("return",Gamedig.query({type:"squad",host:this.server.ip,port:parseInt(this.server.queryPort),maxAttempts:10}));case 1:case"end":return a.stop();}},a,this)}));return function queryServer(){return a.apply(this,arguments)}}()},{key:"refresh",value:function refresh(){var a=this;this.setServerData().then(function(){a.emit("SERVER_UPDATE")})}}]),b}(_events.EventEmitter);exports["default"]=Server;