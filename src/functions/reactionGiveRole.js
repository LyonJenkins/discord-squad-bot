import { allowableAddRoles } from '../../config';

export default function reactionGiveRole(message, reaction, user) {
	for (const roleId of allowableAddRoles) {
		if(message.content.indexOf(roleId) !== -1) {
			 message.guild.members.fetch(user.id).then(GuildMember => {
			 	if(!GuildMember.roles.cache.find(role => role.id === roleId)) {
			 		GuildMember.roles.add(roleId);
				} else {
					GuildMember.roles.remove(roleId);
				}
			 });
		}
	}
}
