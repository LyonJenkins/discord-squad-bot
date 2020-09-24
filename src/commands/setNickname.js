import { log } from '../utilities';
import { BOT_ID } from '../../config';

export default {
	name: 'setNickname',
	description: 'addRolesMessage',
	usage: '',
	args: true,
	guildOnly: true,
	disabled: false,
	permissions: ["GROUP_LEADERS", "GROUP_DEV"],
	execute: async (message, args) => {
		log(`Entered addRolesMessage command file`);
		const bot = await message.guild.members.fetch(BOT_ID);
		bot.setNickname(args.join(' '))
	}
}
