import { handleReaction, log } from '../utilities';
import { addRoleMessageIDs } from '../../config';

export default {
	execute(client, server) {
		client.on('messageReactionAdd', async (reaction, user) => {
			await handleReaction(reaction);

			const message = reaction.message;
			reactionGiveRole(message, reaction, user, false);
		});
		client.on('messageReactionRemove', async (reaction, user) => {
			await handleReaction(reaction);

			const message = reaction.message;
			reactionGiveRole(message, reaction, user, true);
		});
	}
}

function reactionGiveRole(message, reaction, user, remove) {
	log('Entered reactiveGiveRole function');
	for (const messageID of addRoleMessageIDs) {
		if(message.id === messageID) {
			const parsed = message.content.match(/([0-9])+/);
			const roleId = parsed[0];
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
