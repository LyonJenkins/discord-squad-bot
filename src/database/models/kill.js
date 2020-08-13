import mongoose from 'mongoose';

const Kill = new mongoose.Schema({
	killer: Object,
	killerSteamID: String,
	victim: Object,
	victimSteamID: String,
	role: String,
	weapon: String,
	map: String,
	players: String,
	server: String,
	teamkill: Boolean,
	createdTimestamp: Date,
	serverName: String,
	wound: Boolean
});

export default mongoose.model('Kill', Kill);
