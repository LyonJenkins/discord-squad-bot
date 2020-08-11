import { Kill } from '../models';
import { log } from '../../functions';
import { connect } from '../main';

export default function newPlayer(kill) {
	connect();
	const newKill = new Kill(kill);
	newKill.save().then(() => {
		log('New Kill added');
	});
}
