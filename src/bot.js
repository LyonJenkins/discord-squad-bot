const Discord = require('discord.js');
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'GUILD_MEMBER', 'GUILD_PRESENCES'] });
client.commands = new Discord.Collection();
import * as commands from './commands';
import { Server } from './server';
import { selectedServer } from '../config';

for(const command of commands.default) {
    client.commands.set(command.name.toLowerCase(), command);
}

import { BOT_TOKEN } from '../config';
import plugins from './plugins';

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
    const server = new Server(selectedServer, client);
    server.main();
    for(const plugin of plugins) {
        plugin.execute(client, server);
    }
});

client.login(BOT_TOKEN);
