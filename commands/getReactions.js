import { signupsChannel } from '../config';

export default {
	name: 'getReactions',
	description:'Gets reactions for a certain message',
	args: true,
	guildOnly: true,
	disabled: false,
	execute(message, args, server) {
		const regex = /^((http[s]?|ftp):\/)?\/?([^:\/\s]+)((\/\w+)*\/)([\w\-\.]+[^#?\s]+)(.*)?(#[\w\-]+)?$/;
		const parsedURL = args[0].match(regex);
		let messageID;
		if(parsedURL != null) {
			messageID = parsedURL[6];
		} else {
			messageID = args[0];
		}
		const client = message.client;
		const channel = client.channels.cache.get(signupsChannel);
		if(!channel) return message.reply('the signups channel specified in the config does not exist.');
		channel.messages.fetch(messageID).then(signupsMessage => {
			const reactionsArray = signupsMessage.reactions.cache.array();
			generateSignups(reactionsArray).then(embedBody => {
				message.channel.send(embedBody);
			});
		}).catch(error => {
			console.log(error);
			if(error) return message.reply('there was an error trying to execute this command.');
		});
	}
}

async function generateSignups(reactionsArray) {
	let embedBody = "";
	for(const reaction of reactionsArray) {
		embedBody+=`${reaction.count} user(s) reacted with ${reaction.emoji.toString()}\n`;
		let users = await reaction.users.fetch();
		for(const user of users.array()) {
			embedBody+=`<@${user.id}>\n`;
		}
	}
	return embedBody;
}
