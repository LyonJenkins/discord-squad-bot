import { LogParser } from '../log-parser';
import { serverLogChannelID } from '../config';
const Discord = require('discord.js');

export default function LogParserListener(client) {
	const logParser = new LogParser();
	const logChannel = client.channels.cache.find(channel => channel.id === serverLogChannelID);
	logParser.on('TICK_RATE', data => {
		const embed = new Discord.MessageEmbed()
			.setColor('#0099ff')
			.setTitle(`Server Tick Rate Update`)
			.addFields(
				{ name: 'Tick Rate', value: `${data.tickRate}` },
				{ name: 'Action Timestamp', value: `${data.time}` },
			)
			.setTimestamp();
		logChannel.send(embed);
	});
	logParser.on('PLAYER_POSSESS', data => {
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
	logParser.main();
}
