import { Player } from '../models';
import { connect } from '../main';
import { log } from '../../utilities';

export async function fetchPlayers(key) {
	connect();
	if(!key) key = {};
	return await Player.find(key, (err, players) => {
		if (err) return console.log(err);
		return players;
	});

}

export function newPlayer(player) {
	connect();
	const newPlayer = new Player(player);
	newPlayer.save().then(() => {
		log('New player added');
	});
}

export function updatePlayer(id, data) {
	connect();
	Player.findByIdAndUpdate(id, data, (err, player) => {
		if(err) console.log(err);
		log('Updated player');
	});
}
