import { queryServer, newServerInfoEmbed } from '../functions/helperFuncs';

export const name = 'serverinfo',
	description = 'Returns info on the public server',
	args = false,
	guildOnly = true,
	aliases = ['si', 'server'],
	permissions = ['Admin'],
	disabled = false;

export function execute(message, args) {
	queryServer().then(response => {
		message.channel.send(newServerInfoEmbed(response)).then(msg => {
			msg.react('🔄');
		});
	}).catch(error => {
		if(error) console.log(error);
	});
}
