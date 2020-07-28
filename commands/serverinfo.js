export default {
	name: 'server',
	description: 'Returns info on the public server',
	args: false,
	guildOnly: true,
	aliases: ['si', 'server'],
	disabled: false,
	execute(message, args, server) {
		server.generateEmbed().then(embed => {
			message.channel.send(embed).then(msg => {
				msg.react('🔄');
			});
		});
	}
}
