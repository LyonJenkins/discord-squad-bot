import { LogParser } from '../log-parser';
import { seedingChannelID, serverLogChannelID, serverStatusMessageID } from '../config';
const Discord = require('discord.js');

export default class Events {
	constructor(server) {
		this.server = server;
	}

	main() {
		const logParser = new LogParser(this.server);
		logParser.main();
		const logChannel = this.server.client.channels.cache.find(channel => channel.id === serverLogChannelID);
		this.server.on('TICK_RATE', data => {
			this.server.tickRate = data.tickRate;
			if(data.tickRate > 25) {
				return;
			}
			let embed = new Discord.MessageEmbed()
				.setTitle(`Server Tick Rate Update`)
				.addFields(
					{ name: 'Tick Rate', value: `${data.tickRate}` },
					{ name: 'Action Timestamp', value: `${data.time}` },
				)
				.setTimestamp();
			if(data.tickRate <= 25 && data.tickRate > 20) {
				embed.setColor('#FFFF00');
			} else if(data.tickRate <= 20) {
				embed.setColor('#ff0000');
			}
			logChannel.send(embed);
		});
		this.server.on('PLAYER_POSSESS', data => {
			if(data.classname === 'CameraMan') {
				const embed = new Discord.MessageEmbed()
					.setColor('#0099ff')
					.setTitle(`Admin Cam Open`)
					.addFields(
						{ name: 'Player Name', value: `${data.player}` },
						{ name: 'Action Timestamp', value: `${data.time}` },
					)
					.setTimestamp();
				logChannel.send(embed);
			}
		});
		this.server.on('SERVER_UPDATE', () => {
			setActivity(this.server);
			setMessage(this.server);
		});
	}
}

function setActivity(server) {
	server.client.user.setActivity(`(${server.generatePlayersString(true)}) ${server.map}`);
}

function setMessage(server) {
	const seedingChannel = server.client.channels.cache.find(channel => channel.id === seedingChannelID);
	if(seedingChannel) {
		seedingChannel.messages.fetch(serverStatusMessageID).then(msg => {
			const serverStatusMessage = msg;
			if(serverStatusMessage) {
				server.generateEmbed().then(embed => {
					serverStatusMessage.edit(embed);
				});
			}
		});
	}
}

