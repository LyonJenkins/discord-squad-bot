import { log, handleReaction } from '../utilities';

export default {
	execute(client, server) {
		client.on('messageReactionAdd', async (reaction, user) => {
			await handleReaction(reaction);

			const message = reaction.message;
			if(message.author.id === user.id) {
				return;
			}
			if(message.embeds[0]) {
				if(message.embeds[0].footer) {
					if(message.embeds[0].footer.text === `${server.name} Server Status`) {
						log('Server Status embed found');
						reaction.remove();
						log('Removed reaction from Server Status message');
						message.react('🔄');
						log('Readded refresh to Server Status message');
						server.generateEmbed().then(embed => {
							log('Sent Request to server class to update server status embed');
							message.edit(embed);
							server.emit('SERVER_UPDATE');
						});
					}
				}
			}
		});
	}
}
