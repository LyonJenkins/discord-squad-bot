import { Player } from '../models';
import { connect } from '../main';

export default async function fetchPlayers(key) {
	connect();
	if(!key) key = {};
	return await Player.find(key, (err, players) => {
		if (err) return console.log(err);
		return players;
	});

}
