import { log } from '../functions';

export default {
	name: 'signups',
	description: 'Pings members for specified signup',
	usage: '',
	args: true,
	guildOnly: false,
	disabled: false,
	adminOnly: true,
	execute(message, args) {
		log(`Entered ${this.name} command file`);


	}
}
