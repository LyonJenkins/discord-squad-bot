"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports["default"]=void 0;var _functions=require("../functions"),_default={name:"ping",description:"Pong!",usage:"",args:!1,guildOnly:!1,disabled:!1,adminOnly:!0,execute:function execute(a){(0,_functions.log)("Entered ".concat(this.name," command file")),a.reply("Pinging").then(function(b){b.edit("Ping is ".concat(b.createdAt-a.createdAt,"ms"))})}};exports["default"]=_default;