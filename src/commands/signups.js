import { log } from '../utilities';

export default {
	name: 'signups',
	description: 'Pings members for specified signup',
	usage: '',
	args: true,
	guildOnly: true,
	disabled: false,
	permissions: ["GROUP_LEADERS", "GROUP_DEV"],
	execute(message, args) {
		log(`Entered ${this.name} command file`);


	}
}
