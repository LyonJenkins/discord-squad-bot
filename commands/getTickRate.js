export default {
	name: 'getTickRate',
	description: 'Returns tick rate from the public server',
	args: false,
	guildOnly: true,
	aliases: ['tickrate', 'tr'],
	disabled: false,
	execute(message, args, server) {
		return message.reply(`server tick rate is ${server.tickRate}.`)
	}
}
