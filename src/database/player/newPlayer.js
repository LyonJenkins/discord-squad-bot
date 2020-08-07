import mongoose from 'mongoose';
import { Player } from '../models';
import { log } from '../../functions';

export default function newPlayer(name, steam64ID, playerController) {
	mongoose.connect('mongodb://localhost:27017/blueberrydb', {useNewUrlParser: true, useUnifiedTopology: true});
	const newPlayer = new Player({
		name: name,
		steam64ID: steam64ID,
		playerController: playerController,
	});
	newPlayer.save().then(() => {
		log('New player added');
	});
}
