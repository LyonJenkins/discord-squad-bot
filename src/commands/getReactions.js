import { signupsChannelID } from '../../config';
import { log } from '../utilities';

export default {
	name: 'getReactions',
	description:'Gets reactions for a certain message',
	args: true,
	guildOnly: true,
	disabled: false,
	adminOnly: true,
	aliases: ['gr'],
	execute(message, args, server) {
		log(`Entered ${this.name} command file`);
		const regex = /^((http[s]?|ftp):\/)?\/?([^:\/\s]+)((\/\w+)*\/)([\w\-\.]+[^#?\s]+)(.*)?(#[\w\-]+)?$/;
		const parsedURL = args[0].match(regex);
		let messageID;
		if(parsedURL != null) {
			messageID = parsedURL[6];
		} else {
			messageID = args[0];
		}
		const client = message.client;
		const channel = client.channels.cache.get(signupsChannelID);
		if(!channel) return message.reply('the signups channel specified in the config does not exist.');
		channel.messages.fetch(messageID).then(signupsMessage => {
			const reactionsArray = signupsMessage.reactions.cache.array();
			generateSignupsAndSend(reactionsArray, message);
		}).catch(error => {
			console.log(error);
			if(error) return message.reply('there was an error trying to execute this command.');
		});
	}
}

function generateSignupsAndSend(reactionsArray, message) {
	for(const reaction of reactionsArray) {
		let reactions = "";
		reactions+=`${reaction.count} user(s) reacted with ${reaction.emoji.toString()}\n`;
		reaction.users.fetch().then(users => {
			for(const user of users.array()) {
				reactions+=`<@${user.id}>\n`;
			}
			message.channel.send(reactions);
		});
	}
}
