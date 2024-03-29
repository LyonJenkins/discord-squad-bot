const Discord = require('discord.js');
import { log } from '../utilities';

export default {
	name: 'leaderboard',
	description: 'Returns leaderboard shiet',
	usage: '',
	args: true,
	guildOnly: true,
	disabled: false,
	permissions: ["GROUP_LEADERS", "GROUP_DEV"],
	execute(message, args, server) {
		log(`Entered ${this.name} command file`);

		server.updateLeaderboards(parseInt(args[0])).then(embed => {
			if(embed === undefined) return message.reply('there are no kills in the database, or an error has occurred.');
			message.channel.send(embed);
		});
	}
}
