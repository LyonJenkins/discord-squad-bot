import mongoose from 'mongoose';

const ServerState = new mongoose.Schema({
	name: String,
	playerCount: String,
	map: String,
	tickRate: String,
	timestamp: Date
});

export default mongoose.model('ServerState', ServerState);
