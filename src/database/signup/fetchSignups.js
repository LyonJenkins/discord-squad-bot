import { Signup } from '../models';
import { connect } from '../main';

export default async function fetchSignups(key) {
	connect();
	if(!key) key = {};
	return await Signup.find(key, (err, signups) => {
		if (err) return console.log(err);
		return signups;
	});

}
