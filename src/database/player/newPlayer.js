import mongoose from 'mongoose';
import { Player } from '../models';
import { log } from '../../functions';

export default function newPlayer(player) {
	mongoose.connect('mongodb://localhost:27017/blueberrydb', {useNewUrlParser: true, useUnifiedTopology: true});
	const newPlayer = new Player(player);
	newPlayer.save().then(() => {
		log('New player added');
	});
}
