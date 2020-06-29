const Discord = require('discord.js');
const { Client } = require('discord.js');
const client = new Client({ ws: { intents: ['GUILDS', 'GUILD_MESSAGES'] } });
client.commands = new Discord.Collection();
const fs = require('fs');
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}
const config = require('./config.json');

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on('message', message  => {
    const args = message.content.slice(config.prefix.length).split(' ');
    const commandName = args.shift().toLowerCase();
    if (message.content.startsWith(config.prefix)) {
        const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
        if(!command) return;

        if (command.guildOnly && message.channel.type !== 'text') {
            return message.reply('that command cannot be executed inside direct messages.');
        }

        if(command.args && !args.length) {
            let reply = `You did not provide the proper command arguments, ${message.author}.`;

            if(command.usage) {
                reply += `\nThe proper usage would be: \`${config.prefix}${command.name} ${command.usage}\``;
            }

            return message.channel.send(reply);
        }

        // if(!message.member.roles.cache.find(x => x.name === 'Admin') && command.permissions.indexOf('Admin') > -1) {
        //     return message.reply('you are not authorized to use that command.');
        // }

        try {
            if(command.client) {
                command.execute(message, args, client);
            } else {
                command.execute(message, args);
            }
        } catch (error) {
            console.error(error);
            message.reply('there was an error trying to execute that command!');
        }
    }
});

client.login(config.BOT_TOKEN);
