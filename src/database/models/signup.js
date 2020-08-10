import mongoose from 'mongoose';

const Signup = new mongoose.Schema({
	name: String,
	discordMessageID: String,
	discordSignupEmbedID: String
});

export default mongoose.model('Signup', Signup);
