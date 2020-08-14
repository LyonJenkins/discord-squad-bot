import { Kill } from '../models';
import { connect } from '../main';
import { log } from '../../functions';

export async function fetchKills(key) {
	connect();
	if(!key) key = {};
	return await Kill.find(key, (err, kills) => {
		if (err) return console.log(err);
		return kills;
	});

}

export function newKill(kill) {
	connect();
	const newKill = new Kill(kill);
	newKill.save().then(() => {
		log('New Kill added');
	});
}
