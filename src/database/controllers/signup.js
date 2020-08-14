import { Signup } from '../models';
import { connect } from '../main';
import { log } from '../../functions';

export async function fetchSignups(key) {
	connect();
	if(!key) key = {};
	return await Signup.find(key, (err, signups) => {
		if (err) return console.log(err);
		return signups;
	});

}

export function newSignup(discordMessage, embedID) {
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

export function updateSignup(id, data) {
	connect();
	Signup.findByIdAndUpdate(id, data, (err, signup) => {
		if(err) console.log(err);
		log('Updated signup');
	});
}
