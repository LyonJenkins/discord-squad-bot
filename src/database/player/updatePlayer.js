import { Player } from '../models';
import { log } from '../../functions';
import { connect } from '../main';

export default function updatePlayer(id, data) {
	connect();
	Player.findByIdAndUpdate(id, data, (err, player) => {
		if(err) console.log(err);
		log('Updated player');
	});
}
