import { log } from '../utilities';
import { allowableAddRoles } from '../../config';

export default {
	name: 'addRolesMessage',
	description: 'addRolesMessage',
	usage: '',
	args: false,
	guildOnly: true,
	disabled: false,
	permissions: ["GROUP_LEADERS", "GROUP_DEV"],
	execute: async (message, args) => {
		log(`Entered addRolesMessage command file`);
		await message.channel.send('**Add Roles**\n' + 'To add yourself to the following roles, react with any emoji. To remove yourself from any of the roles, unreact with any emoji.');
		const msgIds = [];
		for(const role of allowableAddRoles) {
			const msg = await message.channel.send('**');
			msgIds.push(msg.id);
			const discordRole = await message.guild.roles.fetch(role);
			msg.edit(discordRole.toString());
			msg.react('⬆️');
		}
		console.log(msgIds);
		message.delete();
	}
}
