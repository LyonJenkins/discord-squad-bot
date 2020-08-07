import mongoose from 'mongoose';
import { Player } from '../models';
import { log } from '../../functions';

export default function updatePlayer(id, data) {
	mongoose.connect('mongodb://localhost:27017/blueberrydb', {useNewUrlParser: true, useUnifiedTopology: true});
	Player.findByIdAndUpdate(id, data, (err, player) => {
		if(err) console.log(err);
		console.log(player);
		log('Updated player');
	});
}
