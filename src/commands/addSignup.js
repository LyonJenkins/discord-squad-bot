import { log } from '../functions';
import { newSignup } from '../database/signup';
import { signupsChannelID } from '../../config';

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
			newSignup(signupMessage);
			message.reply('added signup');
		}).catch(error => {
			console.log(error);
			if(error) return message.reply('there was an error trying to execute this command.');
		});

	}
}
