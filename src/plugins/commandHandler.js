import { roles, prefix } from '../../config';
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

				if(command.permissions) {
					let allowed = false;
					for(const roleName of command.permissions) {
						const foundRole = roles.find(x => x.name === roleName);
						if(foundRole) {
							if(message.member.roles.cache.find(role => role.id === foundRole.groupID)) allowed = true;
						}
					}
					if(!allowed) return message.reply('you are not allowed to use that command.');
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

function hasPermissions(roleArr) {

}
