export default {
	name: 'ping',
	description: 'Pong!',
	usage: '',
	args: false,
	guildOnly: false,
	disabled: false,
	adminOnly: true,
	execute(message, args) {
		message.reply('pong!')
	}
}

