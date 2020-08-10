import mongoose from 'mongoose';
import { Signup } from '../models';

export default async function fetchSignups(key) {
	mongoose.connect('mongodb://localhost:27017/blueberrydb', {useNewUrlParser: true, useUnifiedTopology: true});
	if(!key) key = {};
	return await Signup.find(key, (err, signups) => {
		if (err) return console.log(err);
		return signups;
	});

}
