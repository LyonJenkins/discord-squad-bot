const fs = require('fs');
import { log, getSteamUser } from '../utilities';
import { servers, defaultServer } from '../../config';

export default {
    name: 'whitelist',
    description: 'Adds the specified Steam 64 ID or the Steam 64 ID from the profile specified to the whitelist.',
    usage: '<steam64id or steam profile url>',
    args: true,
    guildOnly: true,
    aliases: ['wl'],
    disabled: false,
    execute(message, args) {
        log(`Entered ${this.name} command file`);
        message.delete({timeout: 1000});
        getSteamUser(args[0]).then(user => {
            if(user === undefined) {
                return message.reply('that SteamID or URL is invalid.').then(msg => {
                    msg.delete({timeout: 5000});
                })
            }
            addUser(user, message);
        });
    }
}

function addUser(user, message) {
    const server = servers.find(x => x.name === defaultServer);
    fs.readFile(server.adminPath, 'utf-8', (err, whitelist) => {
        if (err) {
            return console.error(err);
        }

        if(whitelist.indexOf(user.steamID) > -1) {
            return message.reply(`that user is already present in the whitelist.`).then(msg => {
                msg.delete({timeout: 5000});
            });
        }

        const newUser = `\r\nAdmin=${user.steamID}:Whitelist // ${user.nickname}`;

        fs.appendFile(server.adminPath, newUser, (err) => {
            if (err) {
                return console.error(err);
            }

            return message.reply(`successfully added Steam user ${user.nickname} to the whitelist.`).then(msg => {
                msg.delete({timeout: 5000});
            });
        });
    });
}
