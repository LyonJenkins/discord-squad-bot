import { EventEmitter } from 'events';
import { leaderboardChannelID, leaderboardMessageID, servers } from '../../config';
import { Events } from './index';
import Rcon from '../rcon/index';
import { fetchPlayers } from '../database/controllers/player';
import { fetchKills } from '../database/controllers/kill';
import { getSteamUser } from '../utilities';

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
		this.players = [];
		this.leaderBoardChannel = this.client.channels.cache.find(channel => channel.id === leaderboardChannelID);
	}

	main() {
		const events = new Events(this);
		events.main();

		this.rcon = new Rcon(this.server, this);
		this.rcon.watch();

		this.setServerData().then(() => {
			this.emit('SERVER_UPDATE');
			this.updateLeaderBoardEmbed();
			const serverDataRefresh = setInterval(() => {
				this.parseServerData().then(data => {
					if(data === undefined) return;
					if(data.playerCount !== this.playerCount || data.map !== this.map || data.publicQueue !== this.publicQueue || data.reservedQueue !== this.reservedQueue || data.publicSlots !== this.publicSlots || data.reservedSlots !== this.reservedSlots) {
						this.refresh();
					}
				});
			}, 30000);
			const leaderboardRefresh = setInterval(() => {
				this.updateLeaderBoardEmbed();
			}, 3600000)
		});
	}

	updateLeaderBoardEmbed() {
		this.updateLeaderboards(15).then(embed => {
			this.leaderBoardChannel.messages.fetch(leaderboardMessageID).then(msg => {
				if(embed !== undefined) {
					msg.edit(embed);
				}
			});
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
			.setFooter(`${this.name} Server Status`);
	}

	async setServerData() {
		const data = await this.parseServerData();
		if(data === undefined) return;
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
		if(state === undefined) return undefined;
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

	async getServerPlayers() {
		this.players = await this.rcon.listPlayers();
	}

	async getPlayerByName(name) {
		await this.getServerPlayers();
		const players = this.players;
		return players.find(x => x.username === name);
	}

	async getPlayerBySteam64ID(id) {
		await this.getServerPlayers();
		const players = this.players;
		return players.find(x => x.steam64ID === id);
	}

	async getPlayerByController(playerController) {
		const player = await fetchPlayers({ playerController });
		if(player[0]) {
			return await this.getPlayerBySteam64ID(player[0].steam64ID);
		} else {
			return undefined;
		}
	}

	async getKD(player) {
		const args = player.split(' ');
		let foundPlayer;
		if(args.length > 1) {
			const name = args.join(' ');
			foundPlayer = await fetchPlayers({name});
		} else {
			foundPlayer = await fetchPlayers({name: args[0]});
			if(foundPlayer.length === 0) {
				const user = await getSteamUser(args[0]);
				if(user === undefined) {
					return undefined;
				}
				const steam64ID = user.steamID;
				foundPlayer = await fetchPlayers({steam64ID});
			}
		}

		if(foundPlayer.length === 0) {
			return undefined;
		} else if(foundPlayer.length > 1) {
			return undefined;
		} else {
			foundPlayer = foundPlayer[0];
			const kills = await fetchKills({killerSteamID: foundPlayer.steam64ID, teamkill: false, wound: false});
			const deaths = await fetchKills({victimSteamID: foundPlayer.steam64ID, teamkill: false, wound: false});
			return {
				kills: kills.length,
				deaths: deaths.length,
				foundPlayer
			}
		}
	}

	async getVictimAndAttacker(victimName, attackerController) {
		const attacker = await this.getPlayerByController(attackerController);
		if(attacker === undefined) return undefined;
		const victim = await this.getPlayerByName(victimName);
		if(victim === undefined) return undefined;
		return { victim, attacker};
	}

	async updateLeaderboards(limit) {
		const kills = await fetchKills({teamkill: false, wound: false});
		if(kills.length === 0) return undefined;
		const players = await fetchPlayers();
		let killsAndDeaths = [];
		for(const player of players) {
			const playerKd = { playerKills: kills.filter(x => x.killerSteamID === player.steam64ID).length,
				playerDeaths: kills.filter(x => x.victimSteamID === player.steam64ID).length,
				name: player.name
			};
			if(playerKd.playerKills === 0 || playerKd.playerDeaths === 0) {
				continue;
			}
			killsAndDeaths.push(playerKd);
		}
		killsAndDeaths.sort((a, b) => b.playerKills/b.playerDeaths - a.playerKills/a.playerDeaths);

		let playerNames = '', position = '', playerKdr = '';
		let condition = true;
		let i = 0;
		while(condition) {
			if(!(i < limit) || !(i < killsAndDeaths.length)) {
				break;
			}
			const kdPlayer = killsAndDeaths[i];
			position+=`${(i+1)}\n`;
			playerNames+=`${kdPlayer.name}\n`;
			const formatter = new Intl.NumberFormat('en-US', {
				minimumFractionDigits: 2,
				maximumFractionDigits: 2,
			});
			playerKdr+=`${formatter.format(kdPlayer.playerKills/kdPlayer.playerDeaths)}\n`;
			i++;
		}

		return new Discord.MessageEmbed()
			.setColor('#0099ff')
			.setTitle(`KDR Leaderboard (Showing Top ${limit})`)
			.addFields(
				{ name: 'Place', value: `${position}`, inline: true },
				{ name: 'Name', value: playerNames, inline: true },
				{ name: 'KDR', value: playerKdr, inline: true },
			)
			.setTimestamp()
			.setFooter(this.name);
	}
}
