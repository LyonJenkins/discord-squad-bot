const Gamedig = require('gamedig');
const Discord = require('discord.js');
const config = require('../config.json');
module.exports = {
	name: 'serverinfo',
	description: 'Returns info on the public server',
	args: false,
	guildOnly: true,
	aliases: ['si', 'server'],
	permissions: ['Admin'],
	client: true,
	execute(message, args, client) {
		const defaultServer = config.servers.find(x => x.name === config.defaultServer);
		Gamedig.query({
			type: 'squad',
			host: defaultServer.ip,
			port: parseInt(defaultServer.queryPort),
			maxAttempts: 5,
		}).then((state) => {
			let count = 0;
			for(const player of state.players) {
				if(Object.keys(player).length !== 0) count++;
			}
			const serverEmbed = new Discord.MessageEmbed()
				.setColor('#0099ff')
				.setTitle(state.name)
				.addFields(
					{ name: 'Players', value: `${count} / ${state.maxplayers}`, inline: true },
					{ name: 'Current Layer', value: state.map, inline: true },
				)
				.setTimestamp()
				.setFooter('Server Status powered by Blueberries');
			message.channel.send(serverEmbed);
		}).catch((error) => {
			console.log(error);
			console.log("Server is offline");
		});
	},
};
