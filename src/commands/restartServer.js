import { log } from '../utilities';
import { servers } from '../../config';
const util = require('util');
const exec = util.promisify(require('child_process').execFile);

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
			message.reply(`restarted server ${server.name}.`);
			restartServer(server).then(() => {

			}).catch(error => {
				console.log(error);
			});
		} else {
			return message.reply('that server was not found.')
		}
	}
}

async function restartServer(server) {
	return await exec(server.restartBat);
}
