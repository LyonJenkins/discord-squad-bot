import { EventEmitter } from 'events';
import { getTruePlayerCount } from '../functions/helperFuncs';
import { servers } from '../config';
const Discord = require('discord.js');
const Gamedig = require('gamedig');

export default class Server extends EventEmitter {
	constructor(serverName) {
		super();
		this.server = servers.find(x => x.name === serverName);
		this.playerCount = 0;
		this.map = '';
		this.maxPlayers = 0;
		this.name = '';
	}

	main() {
		setInterval(() => {
			this.queryServer().then(state => {
				const count = getTruePlayerCount(state.players);
				if(this.playerCount !== count || this.map !== state.map) {
					this.playerCount = count;
					this.map = state.map;
					this.emit('update');
				}
			}).catch(error => {
				console.log(error);
			});
		}, 30000);
		this.setServerData();
	}

	async generateEmbed() {
		await this.setServerData();
		return new Discord.MessageEmbed()
			.setColor('#0099ff')
			.setTitle(this.name)
			.addFields(
				{ name: 'Players', value: `${this.playerCount} / ${this.maxPlayers}`, inline: true },
				{ name: 'Current Layer', value: this.map, inline: true },
			)
			.setTimestamp()
			.setFooter('Server Status powered by Blueberries');
	}

	async setServerData() {
		await this.queryServer().then(state => {
			this.playerCount = getTruePlayerCount(state.players);
			this.map = state.map;
			this.maxPlayers = state.maxplayers;
			this.name = state.name;
		}).catch(error => {
			console.log(error);
		});
	}


	async queryServer() {
		return Gamedig.query({
			type: 'squad',
			host: this.server.ip,
			port: parseInt(this.server.queryPort),
			maxAttempts: 10,
		});
	}
}
