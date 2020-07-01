const Discord = require('discord.js');
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'GUILD_MEMBER'] });
client.commands = new Discord.Collection();
const fs = require('fs');
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

import { BOT_TOKEN, prefix } from './config';
import { checkForRefreshReaction } from './functions/helperFuncs';

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on('message', message  => {
    const args = message.content.slice(prefix.length).split(' ');
    const commandName = args.shift().toLowerCase();
    if (message.content.startsWith(prefix)) {
        const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
        if(!command) return;

        if(command.disabled) {
            return;
        }

        if (command.guildOnly && message.channel.type !== 'text') {
            return message.reply('that command cannot be executed inside direct messages.');
        }

        if(command.args && !args.length) {
            let reply = `You did not provide the proper command arguments, ${message.author}.`;

            if(command.usage) {
                reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
            }

            return message.channel.send(reply);
        }

        try {
            command.execute(message, args);
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

});

client.login(BOT_TOKEN);
