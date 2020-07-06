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
			if(data.tickRate !== this.server.tickRate) {
				this.server.tickRate = data.tickRate;
				const embed = new Discord.MessageEmbed()
					.setColor('#0099ff')
					.setTitle(`Server Tick Rate Update`)
					.addFields(
						{ name: 'Tick Rate', value: `${data.tickRate}` },
						{ name: 'Action Timestamp', value: `${data.time}` },
					)
					.setTimestamp();
				logChannel.send(embed);
			}
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

