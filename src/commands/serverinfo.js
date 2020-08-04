import { servers } from '../../config';
import { log } from '../functions';
const Gamedig = require('gamedig');
const Discord = require('discord.js');

export default {
	name: 'server',
	description: 'Returns info on the public server',
	args: false,
	guildOnly: true,
	aliases: ['si', 'server'],
	disabled: false,
	execute(message, args, server) {
		log(`Entered ${this.name} command file`);
		if(args[0]) {
			// Handles Arma server embed
			const foundServer = servers.find(x => x.name === args[0].toLowerCase());
			if(!foundServer) return message.reply('server not found.');
			if(foundServer.game !== 'arma') return message.reply('you must specify an Arma 3 Server.');

			Gamedig.query({
				type: 'arma3',
				host: foundServer.ip,
				port: foundServer.port
			}).then(r => {
				let serverData = {
					name: r.name,
					players: r.raw.numplayers,
					maxplayers: r.maxplayers,
					map: r.map,
					mission: r.raw.game,
				};
				if(serverData.map === '') serverData.map = 'Unselected';
				if(serverData.mission === '') serverData.mission = 'Unselected';
				const serverEmbed = new Discord.MessageEmbed()
					.setColor('#0099ff')
					.setTitle(serverData.name)
					.addFields(
						{ name: 'Players', value: `${serverData.players} / ${serverData.maxplayers}`, inline: true },
						{ name: 'Selected Map', value: serverData.map, inline: true },
						{ name: 'Selected Mission', value: serverData.mission },
					)
					.setTimestamp()
					.setFooter('Server Status powered by Blueberries');
				message.channel.send(serverEmbed);
			}).catch(error => {
				console.log(error);
				if(error) message.reply('that server is offline.');
			});
		} else {
			// Handles Squad
			server.generateEmbed().then(embed => {
				message.channel.send(embed).then(msg => {
					msg.react('🔄');
				});
			});
		}
	}
}
