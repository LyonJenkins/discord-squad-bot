import { log } from '../functions';
import { newSignup } from '../database/signup';
import { signupsChannelID, signupChangesID } from '../../config';
const Discord = require('discord.js');

export default {
	name: 'addSignup',
	description: 'addSignup',
	usage: '',
	args: true,
	guildOnly: false,
	disabled: false,
	adminOnly: true,
	execute(message, args) {
		log(`Entered ${this.name} command file`);

		const channel = message.client.channels.cache.get(signupsChannelID);
		if(!channel) return message.reply('the signups channel specified in the config does not exist.');
		channel.messages.fetch(args[0]).then(signupMessage => {
			const signupChanges = message.client.channels.cache.get(signupChangesID);
			const signupEmbed = new Discord.MessageEmbed()
				.setTitle(`${message.content}`)
				.setFooter(`${message.id}`)
				.setTimestamp()
				.setColor('#0099ff');
			signupChanges.send(signupEmbed).then(msg => {
				newSignup(signupMessage, msg.id);
			});
			message.reply('added signup');
		}).catch(error => {
			console.log(error);
			if(error) return message.reply('there was an error trying to execute this command.');
		});

	}
}
