import { fetchSignups } from '../../database/signup';
import { signupChangesID } from '../../../config';
const Discord = require('discord.js');

export default function signupMessageListener(message, reaction, user, remove) {
	fetchSignups().then((signups) => {
		for(const signup of signups) {
			if(signup.discordMessageID === message.id) {
				const channel = message.client.channels.cache.get(signupChangesID);
				if(!channel) return message.reply('the signups channel specified in the config does not exist.');
				const reactionEmbed = new Discord.MessageEmbed()
					.setAuthor(`${user.username}`, `${user.avatarURL()}`)
					.addFields(
						{ name: 'Emoji Name', value: reaction.emoji.name },
						{ name: 'Signup Name', value: message.content },
					);
				if(remove) {
					reactionEmbed.setColor('#ff0000');
					reactionEmbed.setTitle('Reaction Removed');
					channel.send(reactionEmbed);
				} else {
					reactionEmbed.setColor('#00FF00');
					reactionEmbed.setTitle('Reaction Added');
					channel.send(reactionEmbed);
				}
			}
		}
	});
}
