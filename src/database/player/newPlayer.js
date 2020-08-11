import { Player } from '../models';
import { log } from '../../functions';
import { connect } from '../main';

export default function newPlayer(player) {
	connect();
	const newPlayer = new Player(player);
	newPlayer.save().then(() => {
		log('New player added');
	});
}
