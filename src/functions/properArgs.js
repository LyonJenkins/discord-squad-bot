import { prefix } from '../../config';

export default function properArgs(command) {
	let reply = `you did not provide the proper command arguments.`;

	if(command.usage) {
		reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
	}
	return reply;
}
