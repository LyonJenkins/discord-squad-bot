import { Server } from '../events';
import { seedingChannelID, serverStatusMessageID } from '../config';

export function serverStatus(client) {
	const server = new Server('public');
	server.on('update', () => {
		setActivity(server, client);
		setMessage(server, client);
	});
	server.main();
}

function setActivity(server, client) {
	client.user.setActivity(`(${server.playerCount}/${server.maxPlayers}) ${server.map}`);
}

function setMessage(server, client) {
	const seedingChannel = client.channels.cache.find(channel => channel.id === seedingChannelID);
	if(seedingChannel) {
		seedingChannel.messages.fetch(serverStatusMessageID).then(msg => {
			const serverStatusMessage = msg;
			if(serverStatusMessage) {
				server.generateEmbed().then(embed => {
					serverStatusMessage.edit(embed);
				});
			}
		});
	}
}
