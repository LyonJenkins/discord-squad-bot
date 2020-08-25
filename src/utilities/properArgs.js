import { prefix } from '../../config';
import { log } from './';

export default function properArgs(command) {
	log('Entered properArgs function');
	let reply = `you did not provide the proper command arguments.`;

	if(command.usage) {
		reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
	}
	return reply;
}
