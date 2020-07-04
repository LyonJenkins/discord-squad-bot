const Discord = require('discord.js');
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'GUILD_MEMBER'] });
client.commands = new Discord.Collection();
import * as commands from './commands';
import { serverStatus } from './functions/serverStatus';
import { signupReactionAdd, signupReactionRemove } from './commands/createSignup';

Object.values(commands).forEach((command) => {
   client.commands.set(command.name.toLowerCase(), command);
});


import { adminRoleID, BOT_TOKEN, prefix } from './config';
import { checkForRefreshReaction, properArgs } from './functions/helperFuncs';

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
    serverStatus(client);
});

client.on('message', message  => {
    const args = message.content.slice(prefix.length).split(' ');
    const commandName = args.shift().toLowerCase();
    if (message.content.startsWith(prefix)) {
        let command = client.commands.get(commandName);

        if(!command) {
            Object.values(commands).forEach((cmd) => {
                const commandClass = new cmd();
                if(commandClass.aliases.indexOf(commandName) > -1) {
                    command = cmd;
                }
            });
        }

        let commandClass;
        try {
            commandClass = new command()
        } catch (err) {
            return;
        }

        if(commandClass.disabled) {
            return;
        }

        if(commandClass.adminOnly) {
            if(!message.member.roles.cache.find(role => role.id === adminRoleID)) {
                return message.reply('you are not authorized to use that command.');
            }
        }

        if (commandClass.guildOnly && message.channel.type !== 'text') {
            return message.reply('that command cannot be executed inside direct messages.');
        }

        if(commandClass.args && !args.length) {
            return message.reply(properArgs(command));
        }

        try {
            commandClass.execute(message, args);
        } catch (error) {
            console.error(error);
            message.reply('there was an error trying to execute that command!');
        }
    }
});

client.on('messageReactionAdd', async (reaction, user) => {
    if (reaction.partial) {
        try {
            await reaction.fetch();
        } catch (error) {
            console.log('Something went wrong when fetching the message: ', error);
            return;
        }
    }

    const message = reaction.message;
    checkForRefreshReaction(message, reaction, user);
    signupReactionAdd(message, reaction, user);
});

client.on('messageReactionRemove', async (reaction, user) => {
    if (reaction.partial) {
        try {
            await reaction.fetch();
        } catch (error) {
            console.log('Something went wrong when fetching the message: ', error);
            return;
        }
    }

    const message = reaction.message;
    signupReactionRemove(message, reaction, user);
});

client.login(BOT_TOKEN);
