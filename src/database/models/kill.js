import mongoose from 'mongoose';

const Kill = new mongoose.Schema({
	killer: String,
	victim: String,
	weapon: String,
	teamkill: Boolean,
	createdTimestamp: Date
});

export default mongoose.model('Kill', Kill);
