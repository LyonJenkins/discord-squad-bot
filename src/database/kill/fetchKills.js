import mongoose from 'mongoose';
import { Kill } from '../models';

export default async function fetchKills(key) {
	mongoose.connect('mongodb://localhost:27017/blueberrydb', {useNewUrlParser: true, useUnifiedTopology: true});
	if(!key) key = {};
	return await Kill.find(key, (err, kills) => {
		if (err) return console.log(err);
		return kills;
	});

}
