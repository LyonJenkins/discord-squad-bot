const Discord = require('discord.js');
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'GUILD_MEMBER'] });
client.commands = new Discord.Collection();
import * as commands from './commands';
import { Server } from './server/squad';
let server;
for(const command of commands.default) {
    client.commands.set(command.name.toLowerCase(), command);
}


import { adminRoles, BOT_TOKEN, prefix } from './config';
import { checkForRefreshReaction, properArgs, reactionGiveRole } from './functions';

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
    server = new Server('Public', client);
    server.main();
});

client.on('message', message  => {
    const args = message.content.slice(prefix.length).split(' ');
    const commandName = args.shift().toLowerCase();
    if (message.content.startsWith(prefix)) {
        const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if(!command) {
            return;
        }

        if(command.disabled) {
            return;
        }

        if(command.adminOnly) {
            let admin = false;
            for(const roleID of adminRoles) {
                if(message.member.roles.cache.find(role => role.id === roleID)) admin = true;
            }
            if(!admin) return message.reply('you are not authorized to use that command.');
        }

        if (command.guildOnly && message.channel.type !== 'text') {
            return message.reply('that command cannot be executed inside direct messages.');
        }

        if(command.args && !args.length) {
            return message.reply(properArgs(command));
        }

        try {
            command.execute(message, args, server);
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
    checkForRefreshReaction(message, reaction, user, server);
    reactionGiveRole(message, reaction, user);
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
    reactionGiveRole(message, reaction, user);
});

client.login(BOT_TOKEN);
