import { Server } from '../events';
import { prefix } from '../config';

// Function to check if refresh reaction has been added to the server info embed
export function checkForRefreshReaction(message, reaction, user) {
	if(message.author.id === user.id) {
		return;
	}
	if(message.embeds[0]) {
		if(message.embeds[0].footer) {
			if(message.embeds[0].footer.text === 'Server Status powered by Blueberries') {
				reaction.remove();
				message.react('🔄');
				const server = new Server('public');
				server.generateEmbed().then(embed => {
					message.edit(embed);
				});
			}
		}
	}
}

export function getTruePlayerCount(players) {
	let count = 0;
	for(const player of players) {
		if(Object.keys(player).length !== 0) {
			count++;
		}
	}
	return count;
}

export function properArgs(command) {
	const commandClass = new command();
	let reply = `you did not provide the proper command arguments.`;

	if(commandClass.usage) {
		reply += `\nThe proper usage would be: \`${prefix}${commandClass.name} ${commandClass.usage}\``;
	}
	return reply;
}
