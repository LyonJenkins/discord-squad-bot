const fs = require('fs');
const SteamAPI = require('web-api-steam');
const got = require('got');
import { steamAPIkey, whitelistPath } from '../config';

export default {
    name: 'whitelist',
    description: 'Adds the specified Steam 64 ID or the Steam 64 ID from the profile specified to the whitelist.',
    usage: '<steam64id or steam profile url>',
    args: true,
    guildOnly: false,
    aliases: ['wl'],
    disabled: false,
    execute(message, args) {
        let steamID = args[0];
        message.delete({timeout: 1000});
        if(validURL(steamID)) {
            get64ID(args[0]).then(response => {
                if(response.response.steamid) {
                    steamID = response.response.steamid;
                    addUser(steamID, message);
                } else {
                    return message.reply('specified Steam URL is invalid.').then(msg => {
                        msg.delete({timeout: 5000});
                    });
                }
            });
        } else {
            addUser(steamID, message);
        }
    }
}

function validURL(str) {
    const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
        '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(str);
}

async function get64ID(url) {
    let vanityUrl = url.split('/');
    if (vanityUrl.indexOf('id') !== -1) {
        vanityUrl = vanityUrl[vanityUrl.indexOf('id') + 1];
    }
    if (vanityUrl.indexOf('profiles') !== -1) {
        const id = vanityUrl[vanityUrl.indexOf('profiles') + 1];
        return {response: {steamid: id}};
    }
    try {
        const response = await got(`http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${steamAPIkey}&vanityurl=${vanityUrl}`);
        return JSON.parse(response.body);
    } catch (error) {
        console.log(error.response.body);
    }
}

function addUser(steamID, message) {
    fs.readFile(whitelistPath, 'utf-8', (err, whitelist) => {
        if (err) {
            return console.error(err);
        }

        SteamAPI.getPlayerInfo(steamID, steamAPIkey, (err, steamUser) => {
            if(err) {
                return err;
            }

            if(!steamUser) {
                return message.reply('specified SteamID is invalid.').then(msg => {
                    msg.delete({timeout: 5000});
                });
            }

            if(whitelist.indexOf(steamID) > -1) {
                return message.reply(`that user is already present in the whitelist.`).then(msg => {
                    msg.delete({timeout: 5000});
                });
            }

            const newUser = `\r\nAdmin=${steamID}:Whitelist // ${steamUser.personaname}`;

            fs.appendFile(whitelistPath, newUser, (err) => {
                if (err) {
                    return console.error(err);
                }

                return message.reply(`successfully added Steam user ${steamUser.personaname} to the whitelist.`).then(msg => {
                    msg.delete({timeout: 5000});
                });
            });
        });
    });
}
