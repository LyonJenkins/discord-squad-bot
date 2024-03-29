import { log } from '../utilities';
import { newSignup } from '../database/controllers/signup';
import { signupsChannelID, signupListChannelID } from '../../config';
const Discord = require('discord.js');

export default {
	name: 'addSignup',
	description: 'addSignup',
	usage: '',
	args: true,
	guildOnly: true,
	disabled: false,
	permissions: ["GROUP_LEADERS", "GROUP_DEV"],
	execute(message, args) {
		log(`Entered ${this.name} command file`);

		const channel = message.client.channels.cache.get(signupsChannelID);
		if(!channel) return message.reply('the signups channel specified in the config does not exist.');
		channel.messages.fetch(args[0]).then(signupMessage => {
			const signupChanges = message.client.channels.cache.get(signupListChannelID);
			const signupEmbed = new Discord.MessageEmbed()
				.setTitle(`${message.content}`)
				.setFooter(`${message.id}`)
				.setTimestamp()
				.setColor('#0099ff');
			signupChanges.send(signupEmbed).then(msg => {
				newSignup(signupMessage, msg.id);
			});
			message.reply('added signup.').then(msg => {
				msg.delete({timeout: 5000});
				message.delete({timeout: 5000});
			});
		}).catch(error => {
			console.log(error);
			if(error) return message.reply('there was an error trying to execute this command.');
		});

	}
}
