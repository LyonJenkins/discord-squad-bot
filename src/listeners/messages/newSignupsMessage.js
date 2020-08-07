import { signupsChannelID } from '../../../config';
import { newSignup } from '../../database/signup';
import { log } from '../../functions';

export default function newSignupsMessage(message) {
	if (message.channel.id === signupsChannelID) {
		log('New signup found in signups channel');
		newSignup(message);
	}
}
