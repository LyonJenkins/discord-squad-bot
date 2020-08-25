import { adminRoles, prefix } from '../../config';
import { properArgs } from '../utilities';

export default {
	execute(client, server) {
		client.on('message', message  => {
			const args = message.content.slice(prefix.length).split(' ');
			const commandName = args.shift().toLowerCase();
			if (message.content.startsWith(prefix)) {
				const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

				if(!command) {
					return;
				}

				if(command.disabled) {
					return;
				}

				if(command.adminOnly) {
					let admin = false;
					for(const roleID of adminRoles) {
						if(message.member.roles.cache.find(role => role.id === roleID)) admin = true;
					}
					if(!admin) return message.reply('you are not authorized to use that command.');
				}

				if (command.guildOnly && message.channel.type !== 'text') {
					return message.reply('that command cannot be executed inside direct messages.');
				}

				if(command.args && !args.length) {
					return message.reply(properArgs(command));
				}

				try {
					command.execute(message, args, server);
				} catch (error) {
					console.error(error);
					message.reply('there was an error trying to execute that command!');
				}
			}
		});
	}
}
