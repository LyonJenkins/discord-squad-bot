import { Server } from '../events';

export default class serverInfo {
	constructor() {
		this.name = 'server';
		this.description = 'Returns info on the public server';
		this.args = false;
		this.guildOnly = true;
		this.aliases = ['si', 'server'];
		this.disabled = false;
	}

	execute(message, args) {
		const server = new Server('public');
		server.generateEmbed().then(embed => {
			message.channel.send(embed).then(msg => {
				msg.react('🔄');
			});
		});
	}

}
