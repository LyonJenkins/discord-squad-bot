const Discord = require('discord.js');
import { log } from '../utilities';

export default {
	name: 'kd',
	description: 'Returns KDR',
	usage: '',
	args: true,
	guildOnly: false,
	disabled: false,
	adminOnly: false,
	execute(message, args, server) {
		log(`Entered ${this.name} command file`);
		const player = args.join(' ');
		server.getKD(player).then(data => {
			if(data === undefined) {
				return message.reply('that player does not exist.');
			}
			const formatter = new Intl.NumberFormat('en-US', {
				minimumFractionDigits: 2,
				maximumFractionDigits: 2,
			});
			const kdr = formatter.format(data.kills / data.deaths);
			const kdrEmbed = new Discord.MessageEmbed()
				.setColor('#0099ff')
				.setTitle(`Kills and Deaths for ${data.foundPlayer.name}`)
				.addFields(
					{ name: 'Kills', value: data.kills },
					{ name: 'Deaths', value: data.deaths },
					{ name: 'KDR', value: kdr },
				)
				.setFooter(server.name)
				.setTimestamp();
			message.channel.send(kdrEmbed);
		});
	}
}
