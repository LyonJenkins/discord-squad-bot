const Discord = require('discord.js');
const Gamedig = require('gamedig');
const config = require('../config.json');

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
		const defaultServer = config.servers.find(x => x.name === config.defaultServer);
		Gamedig.query({
			type: 'squad',
			host: defaultServer.ip,
			port: parseInt(defaultServer.queryPort),
			maxAttempts: 5,
		}).then((state) => {
			const serverEmbed = newServerInfoEmbed(state);
			message.edit(serverEmbed);
		}).catch((error) => {
			console.log(error);
			console.log("Server is offline");
		});
	}

}
