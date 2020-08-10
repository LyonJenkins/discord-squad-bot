const { Rcon } = require("rcon-client");
const config = require('../../config.json');

export async function listPlayers(server) {
    if(!server) server = 'rcon test';
    const serverInfo = config.servers.find(x => x.name === server);
    const rcon = await Rcon.connect({
        host: serverInfo.ip, port: serverInfo.rconPort, password: serverInfo.password
    });
    return await rcon.send('ListPlayers').then(response => {
        rcon.end();
        return response;
    });
}

export async function kickById(playerID, reason, server) {
    if(!server) server = 'rcon test';
    const serverInfo = config.servers.find(x => x.name === server);
    const rcon = await Rcon.connect({
        host: serverInfo.ip, port: serverInfo.rconPort, password: serverInfo.password
    });
    return await rcon.send(`AdminKickById ${playerID} ${reason}`).then(response => {
        rcon.end();
        return response;
    });
}

export async function banByID(playerID, reason, length, server) {
    if(!server) server = 'rcon test';
    const serverInfo = config.servers.find(x => x.name === server);
    const rcon = await Rcon.connect({
        host: serverInfo.ip, port: serverInfo.rconPort, password: serverInfo.password
    });
    return await rcon.send(`AdminBanById ${playerID} ${length} ${reason}`).then(response => {
        rcon.end();
        return response;
    });
}

export async function broadcast(message, server) {
    if(!server) server = 'rcon test';
    const serverInfo = config.servers.find(x => x.name === server);
    const rcon = await Rcon.connect({
        host: serverInfo.ip, port: serverInfo.rconPort, password: serverInfo.password
    });
    return await rcon.send(`AdminBroadcast ${message}`).then(response => {
        rcon.end();
        return response;
    });
}
