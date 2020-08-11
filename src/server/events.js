import { LogParser } from '../log-parser';
import { seedingChannelID, serverLogChannelID, serverLogging, serverStatusMessageID, killLogChannelID } from '../../config';
import { fetchPlayers, newPlayer, updatePlayer } from '../database/player';
import { newKill } from '../database/kill';

const Discord = require('discord.js');

export default class Events {
	constructor(server) {
		this.server = server;
		this.logChannel = this.server.client.channels.cache.find(channel => channel.id === serverLogChannelID);
		this.killLogChannel = this.server.client.channels.cache.find(channel => channel.id === killLogChannelID);
		this.unhandledLogins = [];
	}

	main() {
		const logParser = new LogParser(this.server);
		logParser.main();
		this.server.on('POST_LOGIN', data => {
			this.unhandledLogins.push(data);
		});
		this.server.on('TICK_RATE', data => {
			this.tickRate(data);
		});
		this.server.on('PLAYER_POSSESS', data => {
			this.playerPossess(data);
		});
		this.server.on('SERVER_UPDATE', () => {
			this.serverUpdate();
		});
		this.server.on('PLAYER_DIED', data => {
			this.playerDied(data);
		});
		this.server.on('CLIENT_LOGIN', data => {
			this.clientLogin(data)
		});
	}

	tickRate(data) {
		this.server.tickRate = data.tickRate;
		if(data.tickRate > 25) {
			return;
		}
		let embed = new Discord.MessageEmbed()
			.setTitle(`Server Tick Rate Update`)
			.addFields(
				{ name: 'Tick Rate', value: `${data.tickRate}` },
				{ name: 'Action Timestamp', value: `${data.time}` },
			)
			.setFooter(this.server.name)
			.setTimestamp();
		if(data.tickRate <= 25 && data.tickRate > 20) {
			embed.setColor('#FFFF00');
		} else if(data.tickRate <= 20) {
			embed.setColor('#ff0000');
		}
		this.logChannel.send(embed);
	}

	playerPossess(data) {
		if(data.classname === 'CameraMan') {
			const embed = new Discord.MessageEmbed()
				.setColor('#0099ff')
				.setTitle(`Admin Cam Open`)
				.addFields(
					{ name: 'Player Name', value: `${data.player}` },
					{ name: 'Action Timestamp', value: `${data.time}` },
				)
				.setFooter(this.server.name)
				.setTimestamp();
			this.logChannel.send(embed);
		}
	}

	clientLogin(data) {
		if(!serverLogging) return;
		if(this.unhandledLogins.length > 0) {
			const lastLoggedPlayer = this.unhandledLogins.find(x => x.id === data.id);
			if(lastLoggedPlayer) {
				this.unhandledLogins.splice(this.unhandledLogins.indexOf(lastLoggedPlayer), 1);
				const newPlayerObj = {
					name: data.name,
					steam64ID: data.steam64ID,
					playerController: lastLoggedPlayer.playerController,
					createdTimestamp: data.time
				};
				fetchPlayers({steam64ID: data.steam64ID}).then(player => {
					if(player[0]) {
						updatePlayer(player[0]._id, newPlayerObj);
					} else {
						newPlayer(newPlayerObj);
					}
				});
			}
		}
	}

	playerDied(data) {
		if(!serverLogging) return;
		this.server.getPlayerByName(data.victim).then(victim => {
			this.server.getPlayerByController(data.attackerPlayerController).then(killer => {
				if(victim === undefined) {
					victim = { steam64ID: data.victim };
				}
				if(killer.length === 0) {
					killer[0] = { steam64ID: data.attackerPlayerController, name: undefined };
				}
				this.server.sameTeam(victim.steam64ID, killer[0].steam64ID).then(teamkill => {
					const newKillObj = {
						victim: victim.steam64ID,
						killer: killer[0].steam64ID,
						weapon: data.weapon,
						teamkill: teamkill,
						server: this.server.name,
						createdTimestamp: data.time
					};
					const embed = new Discord.MessageEmbed()
						.setColor('#0099ff')
						.setTitle(`New Kill`)
						.addFields(
							{ name: 'Victim', value: `${data.victim}` },
							{ name: 'Killer', value: `${killer[0].name}` },
							{ name: 'Teamkill', value: `${teamkill}` },
							{ name: 'Action Timestamp', value: `${data.time}` },
						)
						.setFooter(this.server.name)
						.setTimestamp();
					this.killLogChannel.send(embed);
					if(teamkill) {
						const teamkillEmbed = new Discord.MessageEmbed()
							.setColor('#FFFF00')
							.setTitle(`Teamkill`)
							.addFields(
								{ name: 'Victim', value: `${data.victim}` },
								{ name: 'Killer', value: `${killer[0].name}` },
								{ name: 'Teamkill', value: `${teamkill}` },
								{ name: 'Action Timestamp', value: `${data.time}` },
							)
							.setFooter(this.server.name)
							.setTimestamp();
						this.logChannel.send(teamkillEmbed);
					}
					newKill(newKillObj);
				});
			});
		});
	}

	serverUpdate() {
		setActivity(this.server);
		setMessage(this.server);
	}
}

function setActivity(server) {
	server.client.user.setActivity(`(${server.generatePlayersString(true)}) ${server.map}`);
}

function setMessage(server) {
	const seedingChannel = server.client.channels.cache.find(channel => channel.id === seedingChannelID);
	if(seedingChannel) {
		seedingChannel.messages.fetch(serverStatusMessageID).then(msg => {
			const serverStatusMessage = msg;
			msg.guild.members.fetch(server.client.user.id).then(member => {
				member.setNickname(server.name);
			});
			if(serverStatusMessage) {
				server.generateEmbed().then(embed => {
					serverStatusMessage.edit(embed);
				});
			}
		});
	}
}

