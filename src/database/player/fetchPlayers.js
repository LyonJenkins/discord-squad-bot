import mongoose from 'mongoose';
import { Player } from '../models';

export default async function fetchPlayers(key) {
	mongoose.connect('mongodb://localhost:27017/blueberrydb', {useNewUrlParser: true, useUnifiedTopology: true});
	if(!key) key = {};
	return await Player.find(key, (err, players) => {
		if (err) return console.log(err);
		return players;
	});

}
