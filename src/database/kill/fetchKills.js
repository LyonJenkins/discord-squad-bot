import { Kill } from '../models';
import { connect } from '../main';

export default async function fetchKills(key) {
	connect();
	if(!key) key = {};
	return await Kill.find(key, (err, kills) => {
		if (err) return console.log(err);
		return kills;
	});

}
