import mongoose from 'mongoose';
import { Signup } from '../models';

export default async function fetchSignups() {
	mongoose.connect('mongodb://localhost:27017/blueberrydb', {useNewUrlParser: true, useUnifiedTopology: true});
	return await Signup.find({}, (err, signups) => {
		if (err) return console.log(err);
		return signups;
	});

}
