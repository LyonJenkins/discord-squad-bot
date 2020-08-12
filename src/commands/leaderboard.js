const Discord = require('discord.js');
import { log } from '../functions';

export default {
	name: 'leaderboard',
	description: 'Returns leaderboard shiet',
	usage: '',
	args: true,
	guildOnly: false,
	disabled: false,
	adminOnly: true,
	execute(message, args, server) {
		log(`Entered ${this.name} command file`);

		server.updateLeaderboards(parseInt(args[0])).then(embed => {
			message.channel.send(embed);
		});
	}
}