import { log } from '../functions';

export default {
	name: 'ping',
	description: 'Pong!',
	usage: '',
	args: false,
	guildOnly: false,
	disabled: false,
	adminOnly: true,
	execute(message, args) {
		log(`Entered ${this.name} command file`);
		message.reply('Pinging').then(msg => {
			msg.edit(`Ping is ${msg.createdAt - message.createdAt}ms`);
		});
	}
}

