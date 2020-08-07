import mongoose from 'mongoose';
import { Signup } from '../models';
import { log } from '../../functions';

export default function newSignup(discordMessage) {
	mongoose.connect('mongodb://localhost:27017/blueberrydb', {useNewUrlParser: true, useUnifiedTopology: true});
	const newSignup = new Signup({
		name: discordMessage.content,
		discordMessageID: discordMessage.id,
		reactionLog: []
	});
	newSignup.save().then(() => {
		log('New signup created');
	});
}
