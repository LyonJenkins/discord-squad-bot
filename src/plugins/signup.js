import { signupChangesID, signupsChannelID } from '../../config';
import { fetchSignups, newSignup } from '../database/controllers/signup';
import { handleReaction, log } from '../utilities';
const Discord = require('discord.js');

export default {
	execute(client) {
		client.on('message', message => {
			newSignupsMessage(message);
		});

		client.on('messageReactionAdd', async (reaction, user) => {
			await handleReaction(reaction);
			const message = reaction.message;
			signupMessageListener(message, reaction, user, false);
		});

		client.on('messageReactionRemove', async (reaction, user) => {
			await handleReaction(reaction);
			const message = reaction.message;
			signupMessageListener(message, reaction, user, false);
		});
	}
}

function newSignupsMessage(message) {
	if (message.channel.id === signupsChannelID) {
		log('New signup found in signups channel');
		const channel = message.client.channels.cache.get(signupChangesID);
		if(!channel) return;
		const signupEmbed = new Discord.MessageEmbed()
			.setTitle(`${message.content}`)
			.setFooter(`${message.id}`)
			.setTimestamp()
			.setColor('#0099ff');
		channel.send(signupEmbed).then((msg) => {
			newSignup(message, msg.id);
		});
	}
}

function signupMessageListener(message, reaction, user, remove) {
	fetchSignups().then((signups) => {
		for(const signup of signups) {
			if(signup.discordMessageID === message.id) {
				updateSignups(signup, message);
			}
		}
	});
}

function updateSignups(signup, message) {
	const channel = message.client.channels.cache.get(signupsChannelID);
	if(!channel) return;
	channel.messages.fetch(signup.discordMessageID).then(msg => {
		const reactions = msg.reactions.cache.array();
		generateReactionList(reactions).then(list => {
			const signupChanges = message.client.channels.cache.get(signupChangesID);
			if(!signupChanges) return;
			let signupEmbed = new Discord.MessageEmbed()
				.setTitle(`${message.content}`)
				.setFooter(`${message.id}`)
				.setTimestamp()
				.setColor('#0099ff');
			for(const reaction of list) {
				let userlist = "";
				for(const user of reaction.users) {
					userlist+=user+"\n";
				}
				signupEmbed.addField(reaction.emoji, userlist);
			}
			signupChanges.messages.fetch(signup.discordSignupEmbedID).then(signupMessage => {
				if(!signupMessage) return;
				signupMessage.edit(signupEmbed);
			});
		});
	});
}

async function generateReactionList(reactions) {
	let usersArray = [];
	for(const reaction of reactions) {
		let usersObject = {};
		usersObject.emoji = reaction.emoji.toString()+"\n";
		usersObject.users = [];
		const users = await reaction.users.fetch();
		const reactionUsers = users.array();
		for(const user of reactionUsers) {
			usersObject.users.push(user.username);
		}
		usersArray.push(usersObject);
	}
	return usersArray;
}

