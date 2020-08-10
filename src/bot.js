const Discord = require('discord.js');
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'GUILD_MEMBER'] });
client.commands = new Discord.Collection();
import * as commands from './commands';
import { Server } from './server/squad';

for(const command of commands.default) {
    client.commands.set(command.name.toLowerCase(), command);
}

import { BOT_TOKEN } from '../config';
import components from './components';

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
    const server = new Server('Public', client);
    server.main();
    for(const component of components) {
        component.execute(client, server);
    }
});

client.login(BOT_TOKEN);
