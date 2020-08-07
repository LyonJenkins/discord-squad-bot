import mongoose from 'mongoose';

const Signup = new mongoose.Schema({
	name: String,
	discordMessageID: String
});

export default mongoose.model('Signup', Signup);
