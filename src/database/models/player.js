import mongoose from 'mongoose';

const Player = new mongoose.Schema({
	name: String,
	steam64ID: String,
	playerController: String
});

export default mongoose.model('Player', Player);
