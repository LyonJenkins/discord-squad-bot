const fs = require('fs');
const Discord = require('discord.js');
import { EventEmitter } from 'events';
import { signupsChannel, adminRoleID } from '../config';

export default class createSignup {
	constructor() {
		this.name = 'createsignup';
		this.description = 'Creates an event signup';
		this.usage = '[name] [date]';
		this.args = true;
		this.guildOnly = true;
		this.aliases = [''];
		this.disabled = false;
		this.client = true;
		this.adminOnly = true;
	}

	execute(message, args) {
		args = args.join(' ');
		args = args.split('] [');
		if(args.length !== 2) return;
		const eventName = args[0].replace('[', '');
		const date = args[1].replace(']', '');
		console.log(eventName);
		console.log(date);
		message.channel.send('@everyone').then(msg => {
			const signup = new Discord.MessageEmbed()
				.setColor('#0099ff')
				.setTitle('New Signup')
				.addFields(
					{ name: 'Signup Name', value: eventName },
					{ name: 'Signup Date', value: date },
				)
				.setTimestamp()
				.setFooter(msg.id);
			msg.react('⬆');
			msg.react('⬇');
			msg.react('❓');
			msg.edit(signup);
			addNewSignup(eventName, date, msg);
		})
	}
}

class signupReactionChange extends EventEmitter {
	constructor(message, reaction, user) {
		super();
		this.message = message;
		this.reaction = reaction;
		this.user = user;
	}

	signupReactionAdd() {
		if (this.message.author.id === this.user.id) {
			return;
		}
		fs.readFile('./storage/signups.json', (err, signups) => {
			if(err) {
				console.log(err);
			}
			const signUpJSON = JSON.parse(signups);
			if (this.message.embeds[0] && this.message.embeds[0].footer.text) {
				const signUp = signUpJSON.signUps.find(x => x.messageID === this.message.id);
				if(signUp) {
					let newsignup = signUp;
					if(signUp) {
						if(!checkIfSignedUp(signUp, this.user.id)) {
							if (this.reaction.emoji.name === '⬆') {
								newsignup.accepted.push(this.user.id);
								this.emit('update', newsignup, signUpJSON);
							} else if (this.reaction.emoji.name === '⬇') {
								newsignup.declined.push(this.user.id);
								this.emit('update', newsignup, signUpJSON);
							} else if (this.reaction.emoji.name === '❓') {
								newsignup.maybe.push(this.user.id);
								this.emit('update', newsignup, signUpJSON);
							} else {
								this.reaction.remove();
							}
						} else {
							this.reaction.users.remove(this.user);
						}
					}
				}
			}
		});
	}

	signupReactionRemove() {
		if (this.message.author.id === this.user.id) {
			return;
		}
		fs.readFile('./storage/signups.json', (err, signups) => {
			if(err) {
				console.log(err);
			}
			const signUpJSON = JSON.parse(signups);
			if (this.message.embeds[0] && this.message.embeds[0].footer.text) {
				const signUp = signUpJSON.signUps.find(x => x.messageID === this.message.id);
				if(signUp) {
					let newsignup = signUp;
					if(signUp) {
						if(checkIfSignedUp(signUp, this.user.id)) {
							if (this.reaction.emoji.name === '⬆') {
								newsignup.accepted.splice(newsignup.accepted.indexOf(this.user.id), 1);
								this.emit('update', newsignup, signUpJSON);
							} else if (this.reaction.emoji.name === '⬇') {
								newsignup.declined.splice(newsignup.declined.indexOf(this.user.id), 1);
								this.emit('update', newsignup, signUpJSON);
							} else if (this.reaction.emoji.name === '❓') {
								newsignup.maybe.splice(newsignup.maybe.indexOf(this.user.id), 1);
								this.emit('update', newsignup, signUpJSON);
							}
						}
					}
				}
			}
		});
	}
}

export function signupReactionAdd(message, reaction, user) {
	const signUpReaction = new signupReactionChange(message, reaction, user);
	signUpReaction.on('update', (signUp, signUps) => {
		updateSignupsMessage(signUp, message);
		updateSignupsFile(signUp, signUps);
	});
	signUpReaction.signupReactionAdd();
}

export function signupReactionRemove(message, reaction, user) {
	const signUpReaction = new signupReactionChange(message, reaction, user);
	signUpReaction.on('update', (signUp, signUps) => {
		updateSignupsMessage(signUp, message);
		updateSignupsFile(signUp, signUps);
	});
	signUpReaction.signupReactionRemove();
}

function updateSignupsMessage(signup, message) {
	const client = message.client;
	const channel = client.channels.cache.find(channel => channel.id === signupsChannel);
	channel.messages.fetch(signup.signupsID).then(msg => {
		if(msg) {
			addUsersToMessage(signup.accepted, client).then(accepted => {
				addUsersToMessage(signup.declined, client).then(declined => {
					addUsersToMessage(signup.maybe, client).then(maybe => {
						const newEmbed = new Discord.MessageEmbed()
							.setColor('#0099ff')
							.setTitle(`${signup.name} on ${signup.date} Signups`)
							.addFields(
								{ name: 'Going', value: `${accepted}` },
								{ name: 'Not Going', value: `${declined}` },
								{ name: 'Maybe', value: `${maybe}` },
							)
							.setFooter(signup.messageID)
							.setTimestamp();
						msg.edit(newEmbed);
					});
				})
			});
		}
	});
}

function updateSignupsFile(signUp, signups) {
	fs.writeFile('./storage/signups.json', JSON.stringify(signups), (err) => {
		if(err) {
			console.log(err);
		}
	});
}

function checkIfSignedUp(signup, user) {
	if(signup.accepted.find(x => x.id === user.id)) {
		console.log('true');
		return true;
	} else if(signup.declined.find(x => x.id === user.id)) {
		console.log('true');
		return true;
	} else if(signup.maybe.find(x => x.id === user.id)) {
		console.log('true');
		return true;
	}
	return false;
}

function addNewSignup(name, date, message) {
	fs.readFile('./storage/signups.json', (err, signups) => {
		if (err) {
			console.log(err);
		}
		signups = JSON.parse(signups);
		message.client.channels.fetch(signupsChannel).then(signupsChannel => {
			signupsChannel.send(`${name}`).then(msg => {
				const newSignup = {messageID: message.id, accepted: [], declined: [], maybe: [], name: name, date: date, signupsID: msg.id};
				signups.signUps.push(newSignup);
				updateSignupsFile(undefined, signups);
			});
		});
	});
}

async function addUsersToMessage(users, client) {
	let msg = "";
	if(users.length === 0) {
		return "none";
	}
	for(const signup of users) {
		const user = await fetchUser(client, signup);
		msg+=`\n<@${user.id}>`;
	}
	return msg;
}

async function fetchUser(client, id) {
	return client.users.fetch(id);
}
