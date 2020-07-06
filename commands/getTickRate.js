export default class getTickRate {
	constructor() {
		this.name = 'getTickRate';
		this.description = 'Returns tick rate from the public server';
		this.args = false;
		this.guildOnly = true;
		this.aliases = ['tickrate', 'tr'];
		this.disabled = false;
	}

	execute(message, args, server) {
		return message.reply(`server tick rate is ${server.tickRate}.`)
	}
}
