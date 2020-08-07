import { LogParser } from '../../log-parser';
import { seedingChannelID, serverLogChannelID, serverStatusMessageID } from '../../../config';
const Discord = require('discord.js');
import * as postLoginRule from '../../log-parser/rules/post-login'

export default class Events {
	constructor(server) {
		this.server = server;
		this.logChannel = this.server.client.channels.cache.find(channel => channel.id === serverLogChannelID);
	}

	main() {
		const logParser = new LogParser(this.server);
		logParser.main();
		this.server.on('TICK_RATE', data => {
			this.tickRate(data);
		});
		this.server.on('PLAYER_POSSESS', data => {
			this.playerPossess(data);
		});
		this.server.on('CLIENT_LOGIN', (data, lines) => {
			this.clientLogin(data, lines)
		});
		this.server.on('SERVER_UPDATE', () => {
			this.serverUpdate();
		});
	}

	tickRate(data) {
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
		this.logChannel.send(embed);
	}

	playerPossess(data) {
		if(data.classname === 'CameraMan') {
			const embed = new Discord.MessageEmbed()
				.setColor('#0099ff')
				.setTitle(`Admin Cam Open`)
				.addFields(
					{ name: 'Player Name', value: `${data.player}` },
					{ name: 'Action Timestamp', value: `${data.time}` },
				)
				.setTimestamp();
			this.logChannel.send(embed);
		}
	}

	clientLogin(data, lines) {
		console.log(data);
		const linesArr = lines.split('\n');
		const postLogin = linesArr[0];
		const match = postLogin.match(postLoginRule.default.regex);
		if(match) {
			const args = postLoginRule.default.parseArgs(match);
			console.log(args);
		}
	}

	serverUpdate() {
		setActivity(this.server);
		setMessage(this.server);
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

