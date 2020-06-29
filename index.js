const Discord = require('discord.js');
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'GUILD_MEMBER'] });
client.commands = new Discord.Collection();
const fs = require('fs');
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}
const config = require('./config.json');
const Gamedig = require('gamedig');

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on('message', message  => {
    const args = message.content.slice(config.prefix.length).split(' ');
    const commandName = args.shift().toLowerCase();
    if (message.content.startsWith(config.prefix)) {
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
                reply += `\nThe proper usage would be: \`${config.prefix}${command.name} ${command.usage}\``;
            }

            return message.channel.send(reply);
        }


        // if(!message.member.roles.cache.find(x => x.name === 'Admin') && command.permissions.indexOf('Admin') > -1) {
        //     return message.reply('you are not authorized to use that command.');
        // }

        try {
            command.execute(message, args);
        } catch (error) {
            console.error(error);
            message.reply('there was an error trying to execute that command!');
        }
    }
});

client.on('messageReactionAdd', async (reaction, user) => {
    // When we receive a reaction we check if the reaction is partial or not
    if (reaction.partial) {
        // If the message this reaction belongs to was removed the fetching might result in an API error, which we need to handle
        try {
            await reaction.fetch();
        } catch (error) {
            console.log('Something went wrong when fetching the message: ', error);
            // Return as `reaction.message.author` may be undefined/null
            return;
        }
    }
    // Now the message has been cached and is fully available
    const message = reaction.message;
    if(message.author.id === user.id) {
        return;
    }
    if(message.embeds[0] && (message.embeds[0].footer.text === 'Server Status powered by Blueberries')) {
        reaction.remove();
        message.react('🔄');
        const defaultServer = config.servers.find(x => x.name === config.defaultServer);
        Gamedig.query({
            type: 'squad',
            host: defaultServer.ip,
            port: parseInt(defaultServer.queryPort),
            maxAttempts: 5,
        }).then((state) => {
            let count = 0;
            for(const player of state.players) {
                if(Object.keys(player).length !== 0) count++;
            }
            const serverEmbed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle(state.name)
                .addFields(
                    { name: 'Players', value: `${count} / ${state.maxplayers}`, inline: true },
                    { name: 'Current Layer', value: state.map, inline: true },
                )
                .setTimestamp()
                .setFooter('Server Status powered by Blueberries');
            message.edit(serverEmbed);
        }).catch((error) => {
            console.log(error);
            console.log("Server is offline");
        });
    }
});

client.login(config.BOT_TOKEN);
