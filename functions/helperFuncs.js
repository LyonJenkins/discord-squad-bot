const Discord = require('discord.js');
const Gamedig = require('gamedig');
import { defaultServer, servers } from '../config';

export async function queryServer() {
	const server = servers.find(x => x.name === defaultServer);
	return Gamedig.query({
		type: 'squad',
		host: server.ip,
		port: parseInt(server.queryPort),
		maxAttempts: 5,
	})
}

export function newServerInfoEmbed(state) {
	let count = 0;
	for(const player of state.players) {
		if(Object.keys(player).length !== 0) count++;
	}
	return new Discord.MessageEmbed()
		.setColor('#0099ff')
		.setTitle(state.name)
		.addFields(
			{ name: 'Players', value: `${count} / ${state.maxplayers}`, inline: true },
			{ name: 'Current Layer', value: state.map, inline: true },
		)
		.setTimestamp()
		.setFooter('Server Status powered by Blueberries');
}

// Function to check if refresh reaction has been added to the server info embed
export function checkForRefreshReaction(message, reaction, user) {
	if(message.author.id === user.id) {
		return;
	}
	if(message.embeds[0] && (message.embeds[0].footer.text === 'Server Status powered by Blueberries')) {
		reaction.remove();
		message.react('🔄');

		queryServer().then(response => {
			message.edit(newServerInfoEmbed(response));
		}).catch(error => {
			if(error) console.log(error);
		});
	}

}
