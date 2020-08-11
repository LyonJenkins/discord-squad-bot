import { Signup } from '../models';
import { log } from '../../functions';
import { connect } from '../main';

export default function updateSignup(id, data) {
	connect();
	Signup.findByIdAndUpdate(id, data, (err, signup) => {
		if(err) console.log(err);
		log('Updated signup');
	});
}
