import mongoose from 'mongoose';
import { Signup } from '../models';
import { log } from '../../functions';

export default function updateSignup(id, data) {
	mongoose.connect('mongodb://localhost:27017/blueberrydb', {useNewUrlParser: true, useUnifiedTopology: true});
	console.log(data);
	Signup.findByIdAndUpdate(id, data, (err, signup) => {
		if(err) console.log(err);
		console.log(signup);
		log('Updated signup');
	});
}
