const Gamedig = require('gamedig');
const config = require('../config.json');
import { newServerInfoEmbed } from '../functions/helperFuncs';

export const name = 'serverinfo',
	description = 'Returns info on the public server',
	args = false,
	guildOnly = true,
	aliases = ['si', 'server'],
	permissions = ['Admin'],
	disabled = false;

export function execute(message, args) {
	const defaultServer = config.servers.find(x => x.name === config.defaultServer);
	Gamedig.query({
		type: 'squad',
		host: defaultServer.ip,
		port: parseInt(defaultServer.queryPort),
		maxAttempts: 5,
	}).then((state) => {
		const serverEmbed = newServerInfoEmbed(state);
		message.channel.send(serverEmbed).then(msg => {
			msg.react('🔄');
		});
	}).catch((error) => {
		console.log(error);
		console.log("Server is offline");
	});
}
