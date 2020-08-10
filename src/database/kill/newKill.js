import mongoose from 'mongoose';
import { Kill } from '../models';
import { log } from '../../functions';

export default function newPlayer(kill) {
	mongoose.connect('mongodb://localhost:27017/blueberrydb', {useNewUrlParser: true, useUnifiedTopology: true});
	const newKill = new Kill(kill);
	newKill.save().then(() => {
		log('New Kill added');
	});
}
