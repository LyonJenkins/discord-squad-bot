import { signupsChannelID } from '../../config';
import { compTeamRoleID } from '../../config';

export default {
	name: 'signups',
	description: 'Pings members for specified signup',
	usage: '',
	args: false,
	guildOnly: true,
	disabled: false,
	permissions: ["GROUP_LEADERS", "GROUP_DEV"],
	execute: async (message, args) => {
		const signupChannel = message.guild.channels.cache.get(signupsChannelID);
		const signup = await signupChannel.messages.fetch(args[0]);
		let signupReactors = [];
		for(const reaction of signup.reactions.cache.array()) {
			const users = await reaction.users.fetch();
			signupReactors = signupReactors.concat(users.array());
		}
		const guildMembers = await message.guild.members.fetch();
		const compTeam = guildMembers.array().filter(isComp);
		let notReacted = [];
		for(const comp of compTeam) {
			if(!signupReactors.find(x => x.id === comp.id)) {
				notReacted.push(comp);
			}
		}
		let notReactedMessage = `Users who are not reacted to that signup (${message.url}): \n`;
		for(const user of notReacted) {
			const dm = await user.createDM();
			dm.send(`You have not reacted to this signup ${message.url}.`);
			notReactedMessage+=user.toString()+'\n';
		}
		await message.channel.send(notReactedMessage);
	}
}

function isComp(user) {
	const roles = user.roles.cache.array();
	return roles.find(x => x.id === compTeamRoleID);
}
