import { log } from '../utilities';
const Discord = require('discord.js');


export default {
	name: 'ping',
	description: 'Pong!',
	usage: '',
	args: false,
	guildOnly: true,
	disabled: false,
	permissions: ["GROUP_LEADERS", "GROUP_DEV"],
	execute(message, args) {
		log(`Entered ${this.name} command file`);
		message.reply('Pinging').then(msg => {
			const pingEmbed = new Discord.MessageEmbed()
				.setColor('#0099ff')
				.setTitle(message.client.user.username)
				.addFields(
					{ name: 'Ping', value: `${msg.createdAt - message.createdAt}ms` },
					{ name: 'Client Uptime', value: `${msToTime(message.client.uptime)}`},
				)
				.setTimestamp();
			message.channel.send(pingEmbed)
			msg.delete();
		});
	}
}

function msToTime(duration) {
	let milliseconds = parseInt((duration % 1000) / 100),
		seconds = Math.floor((duration / 1000) % 60),
		minutes = Math.floor((duration / (1000 * 60)) % 60),
		hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

	hours = (hours < 10) ? "0" + hours : hours;
	minutes = (minutes < 10) ? "0" + minutes : minutes;
	seconds = (seconds < 10) ? "0" + seconds : seconds;

	return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
}
