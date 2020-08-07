import { log } from '../../functions';

export default function checkForRefreshReaction(message, reaction, user, server) {
	log('Entered checkForRefreshReaction function');
	if(message.author.id === user.id) {
		return;
	}
	if(message.embeds[0]) {
		if(message.embeds[0].footer) {
			if(message.embeds[0].footer.text === 'Server Status powered by Blueberries') {
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
}
