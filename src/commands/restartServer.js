import { log } from '../functions';
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
			restartServer(server).then(() => {
				message.reply('restarted server.');
			}).catch(error => {
				console.log(error);
			});
		} else {
			return message.reply('that server was not found.')
		}
	}
}

async function restartServer(server) {
	const { stdout, stderr } = await exec(server.restartBat);
}
