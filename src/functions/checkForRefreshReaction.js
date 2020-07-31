export default function checkForRefreshReaction(message, reaction, user, server) {
	if(message.author.id === user.id) {
		return;
	}
	if(message.embeds[0]) {
		if(message.embeds[0].footer) {
			if(message.embeds[0].footer.text === 'Server Status powered by Blueberries') {
				reaction.remove();
				message.react('🔄');
				server.generateEmbed().then(embed => {
					message.edit(embed);
					server.emit('SERVER_UPDATE');
				});
			}
		}
	}
}
