import { allowableAddRoles } from '../../config';
import { log } from './';

export default function reactionGiveRole(message, reaction, user, remove) {
	log('Entered reactiveGiveRole function');
	for (const roleId of allowableAddRoles) {
		if(message.content.indexOf(roleId) !== -1) {
			 message.guild.members.fetch(user.id).then(GuildMember => {
			 	if(!GuildMember.roles.cache.find(role => role.id === roleId) && !remove) {
			 		log(`Added roleID ${roleId} to user ${user.username}`);
			 		GuildMember.roles.add(roleId);
				} else if(GuildMember.roles.cache.find(role => role.id === roleId) && remove) {
					log(`Removed roleID ${roleId} from user ${user.username}`);
					GuildMember.roles.remove(roleId);
				}
			 });
		}
	}
}
