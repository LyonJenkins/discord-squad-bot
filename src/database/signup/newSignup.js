import { Signup } from '../models';
import { log } from '../../functions';
import { connect } from '../main';

export default function newSignup(discordMessage, embedID) {
	connect();
	const newSignup = new Signup({
		name: discordMessage.content,
		discordMessageID: discordMessage.id,
		discordSignupEmbedID: embedID,
	});
	newSignup.save().then(() => {
		log('New signup created');
	});
}
