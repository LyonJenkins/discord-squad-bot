const Gamedig = require('gamedig');
import { servers } from '../config';

export default {
	name: 'arma',
	description:'Returns Arma server info',
	server: {},
	args: true,
	guildOnly: true,
	disabled: false,
	execute(message, args, server) {
		server = servers.find(x => x.name === args[0].toLowerCase());
		if(!server) return message.reply('server not found.');

		Gamedig.query({
			type: 'arma3',
			host: server.ip,
			port: server.port,
			maxAttempts: 10,
		}).then(r => {
			console.log(r);
		}).catch(error => {
			console.log(error);
		});
	}
}
