import mongoose from 'mongoose';

const SignupReaction = new mongoose.Schema({
	signupID: String,
	discordUserID: String,
	emojiReaction: String,
	removeReaction: Boolean,
	timestamp: Date,
});

export default mongoose.model('SignupReaction', SignupReaction);
