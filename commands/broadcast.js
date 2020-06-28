const rcon = require("../rcon/main");
const config = require('../config.json');

module.exports = {
    name: 'broadcast',
    description: 'Broadcasts your specified message to your specified server',
    usage: `<server> <message>`,
    args: true,
    guildOnly: true,
    aliases: ['b'],
    permissions: ['Admin'],
    execute(message, args) {
        if (config.servers.find(x => x.name === args[0].toLowerCase())) {
            const server = args[0];
            args.splice(0, 1);
            const msg = args.join(' ');
            rcon.broadcast(msg, server).then(response => {
                console.log(response);
            });
        } else {
            const msg = args.join(' ');
            rcon.broadcast(msg).then(response => {
                console.log(response);
            });
        }
    }
};
