import { log } from '../functions';
import { servers } from '../../config';
const { exec } = require('child_process');

export default {
	name: 'restartServer',
	description: 'Restarts the selected server',
	usage: '',
	args: true,
	guildOnly: true,
	disabled: false,
	adminOnly: true,
	execute(message, args) {
		log(`Entered ${this.name} command file`);
		const server = servers.find(x => x.name === args[0]);
		if (server) {
			exec(server.restartBat, (err, stdout, stderr) => {
				if(err) {
					console.log(err);
					console.log('error executing restart command');
				}

				message.reply(`restarted ${server.name} server.`);
			})
		} else {
			return message.reply('that server was not found.')
		}
	}
}
