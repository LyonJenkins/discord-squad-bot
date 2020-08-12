import { EventEmitter } from 'events';
import { leaderboardChannelID, leaderboardMessageID, servers } from '../../config';
import { Events } from './index';
import RconConnection from '../rcon/main';
import { fetchPlayers } from '../database/player';
import { fetchKills } from '../database/kill';
import { getSteamUser } from '../functions';

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
	}

	main() {
		const events = new Events(this);
		events.main();
		this.rcon = new RconConnection(this.server);
		this.rcon.main();
		this.setServerData().then(() => {
			this.emit('SERVER_UPDATE');
			const serverDataRefresh = setInterval(() => {
				this.parseServerData().then(data => {
					if(data === undefined) return;
					if(data.playerCount !== this.playerCount || data.map !== this.map || data.publicQueue !== this.publicQueue || data.reservedQueue !== this.reservedQueue || data.publicSlots !== this.publicSlots || data.reservedSlots !== this.reservedSlots) {
						this.refresh();
					}
				});
			}, 30000);
			const leaderboardRefresh = setInterval(() => {
				this.updateLeaderboards(15).then(embed => {
					this.leaderBoardChannel.messages.fetch(leaderboardMessageID).then(msg => {
						if(embed === undefined) return;
						msg.edit(embed);
					});
				});

			}, 3600000)
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
		if(data === undefined) return;
		this.playerCount = data.playerCount;
		this.map = data.map;
		this.maxPlayers = data.maxplayers;
		this.publicSlots = data.publicSlots;
		this.reservedSlots = data.reservedSlots;
		this.publicQueue = data.publicQueue;
		this.reservedQueue = data.reservedQueue;
		this.leaderBoardChannel = this.client.channels.cache.find(channel => channel.id === leaderboardChannelID);
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
		const response = await this.rcon.listPlayers();
		const lines = response.split('\n');
		let players = [];
		const regex = /ID: ([0-9]*) \| SteamID: ([0-9]*) \| Name: ([\s\S]*) \| Team ID: ([0-9]*) \| Squad ID: ([\s\S]*)/;
		for(const line of lines) {
			const args = line.match(regex);
			if(args) {
				const playerObj = {
					id: args[1],
					steam64ID: args[2],
					username: args[3],
					teamID: args[4],
					squadID: args[5]
				};
				players.push(playerObj);
			}
		}
		this.players = players;
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
		return await fetchPlayers({ playerController });
	}

	async sameTeam(victim, killer) {
		await this.getServerPlayers();
		const players = this.players;
		const playerVictim = players.find(x => x.steam64ID === victim),
			  playerKiller = players.find(x => x.steam64ID === killer);
		if(playerVictim && playerKiller) {
			return playerVictim.teamID === playerKiller.teamID;
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
		} else {
			foundPlayer = foundPlayer[0];
			const kills = await fetchKills({killer: foundPlayer.steam64ID, teamkill: false, wound: false});
			const deaths = await fetchKills({victim: foundPlayer.steam64ID, teamkill: false, wound: false});
			return {
				kills: kills.length,
				deaths: deaths.length,
				foundPlayer
			}
		}
	}

	async updateLeaderboards(limit) {
		const kills = await fetchKills({teamkill: false, wound: false});
		if(kills.length === 0) return undefined;
		const players = await fetchPlayers();
		let killsAndDeaths = [];
		for(const player of players) {
			const playerKd = { playerKills: kills.filter(x => x.killer === player.steam64ID).length,
				playerDeaths: kills.filter(x => x.victim === player.steam64ID).length,
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
