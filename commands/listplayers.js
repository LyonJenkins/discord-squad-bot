const rcon = require("../rcon/main");

module.exports = {
    name: 'listplayers',
    description: 'Returns a list of players connected to the specified server',
    usage: '<servername>',
    args: true,
    guildOnly: true,
    aliases: ['lp'],
    permissions: ['Admin'],
    disabled: true,
    execute(message, args) {
        const serverName = args.join(" ");
        rcon.listPlayers(serverName).then(response => {
            console.log(response);
        });
    },
};
