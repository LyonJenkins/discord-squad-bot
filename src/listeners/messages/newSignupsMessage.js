import { signupChangesID, signupsChannelID } from '../../../config';
import { newSignup } from '../../database/signup';
import { log } from '../../functions';
const Discord = require('discord.js');

export default function newSignupsMessage(message) {
	if (message.channel.id === signupsChannelID) {
		log('New signup found in signups channel');
		const channel = message.client.channels.cache.get(signupChangesID);
		if(!channel) return;
		const signupEmbed = new Discord.MessageEmbed()
			.setTitle(`${message.content}`)
			.setFooter(`${message.id}`)
			.setTimestamp()
			.setColor('#0099ff');
		channel.send(signupEmbed).then((msg) => {
			newSignup(message, msg.id);
		});
	}

}
