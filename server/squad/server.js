import { EventEmitter } from 'events';
import { servers } from '../../config';
import { Events } from './index';
const Discord = require('discord.js');
const Gamedig = require('gamedig');

export default class Server extends EventEmitter {
	constructor(serverName, client) {
		super();
		this.server = servers.find(x => x.name === serverName);
		this.playerCount = 0;
		this.map = '';
		this.maxPlayers = 0;
		this.name = '';
		this.publicSlots = 0;
		this.reservedSlots = 0;
		this.publicQueue = 0;
		this.reservedQueue = 0;
		this.tickRate = 0;
		this.client = client;
	}

	main() {
		const events = new Events(this);
		events.main();
		this.setServerData().then(() => {
			this.emit('SERVER_UPDATE');
			setInterval(() => {
				this.parseServerData().then(data => {
					if(data.playerCount !== this.playerCount || data.map !== this.map || data.publicQueue !== this.publicQueue || data.reservedQueue !== this.reservedQueue || data.publicSlots !== this.publicSlots || data.reservedSlots !== this.reservedSlots) {
						this.refresh();
					}
				});
			}, 30000);
		});
	}

	async generateEmbed() {
		await this.setServerData();
		return new Discord.MessageEmbed()
			.setColor('#0099ff')
			.setTitle(this.name)
			.addFields(
				{ name: 'Players', value: this.generatePlayersString(), inline: true },
				{ name: 'Current Layer', value: this.map, inline: true },
			)
			.setTimestamp()
			.setFooter('Server Status powered by Blueberries');
	}

	async setServerData() {
		const data = await this.parseServerData();
		this.playerCount = data.playerCount;
		this.map = data.map;
		this.maxPlayers = data.maxplayers;
		this.publicSlots = data.publicSlots;
		this.reservedSlots = data.reservedSlots;
		this.publicQueue = data.publicQueue;
		this.reservedQueue = data.reservedQueue;
		this.name = data.name;
	}

	async parseServerData() {
		const state = await this.queryServer().catch(error => {
			console.log(error);
		});
		return {
			playerCount: parseInt(state.raw.rules.PlayerCount_i),
			map: state.map,
			maxPlayers: state.maxplayers,
			publicSlots: parseInt(state.raw.rules.NUMPUBCONN),
			reservedSlots: parseInt(state.raw.rules.NUMPRIVCONN),
			publicQueue: parseInt(state.raw.rules.PublicQueue_i),
			reservedQueue: parseInt(state.raw.rules.ReservedQueue_i),
			name: state.name,
		};
	}

	generatePlayersString(minimize) {
		let string = `${this.playerCount}`;
		if(this.publicQueue > 0) {
			string+=`+${this.publicQueue + this.reservedQueue}`;
		}
		if(minimize) {
			string+=`/`
		} else {
			string+=` / `
		}
		string+=`${this.publicSlots}`;
		if(this.reservedSlots > 0) {
			string+=`+${this.reservedSlots}`;
		}
		return string;
	}

	async queryServer() {
		return Gamedig.query({
			type: 'squad',
			host: this.server.ip,
			port: parseInt(this.server.queryPort),
			maxAttempts: 10,
		});
	}

	refresh() {
		this.setServerData().then(() => {
			this.emit('SERVER_UPDATE');
		});
	}
}
