"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _config = require("../../config");

var Gamedig = require('gamedig');

var Discord = require('discord.js');

var _default = {
  name: 'server',
  description: 'Returns info on the public server',
  args: false,
  guildOnly: true,
  aliases: ['si', 'server'],
  disabled: false,
  execute: function execute(message, args, server) {
    if (args[0]) {
      // Handles Arma server embed
      var foundServer = _config.servers.find(function (x) {
        return x.name === args[0].toLowerCase();
      });

      if (!foundServer) return message.reply('server not found.');
      if (foundServer.game !== 'arma') return message.reply('you must specify an Arma 3 Server.');
      Gamedig.query({
        type: 'arma3',
        host: foundServer.ip,
        port: foundServer.port
      }).then(function (r) {
        var serverData = {
          name: r.name,
          players: r.raw.numplayers,
          maxplayers: r.maxplayers,
          map: r.map,
          mission: r.raw.game
        };
        if (serverData.map === '') serverData.map = 'Unselected';
        if (serverData.mission === '') serverData.mission = 'Unselected';
        var serverEmbed = new Discord.MessageEmbed().setColor('#0099ff').setTitle(serverData.name).addFields({
          name: 'Players',
          value: "".concat(serverData.players, " / ").concat(serverData.maxplayers),
          inline: true
        }, {
          name: 'Selected Map',
          value: serverData.map,
          inline: true
        }, {
          name: 'Selected Mission',
          value: serverData.mission
        }).setTimestamp().setFooter('Server Status powered by Blueberries');
        message.channel.send(serverEmbed);
      })["catch"](function (error) {
        console.log(error);
        if (error) message.reply('an error has occurred, which means the server is most likely offline.');
      });
    } else {
      // Handles Squad
      server.generateEmbed().then(function (embed) {
        message.channel.send(embed).then(function (msg) {
          msg.react('🔄');
        });
      });
    }
  }
};
exports["default"] = _default;