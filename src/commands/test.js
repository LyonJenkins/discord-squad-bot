import { servers } from '../../config';
import { log } from '../utilities';

export default {
	name: 'test',
	description: 'Command of testing purposes',
	usage: '',
	args: false,
	guildOnly: true,
	disabled: false,
	permissions: ["GROUP_LEADERS", "GROUP_DEV"],
	execute(message, args) {
		log(`Entered ${this.name} command file`);
		const server = servers.find(x => x.name === 'Public');
	}
}
