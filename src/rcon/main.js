const { Rcon } = require("rcon-client");
const config = require('../../config.json');

export async function listPlayers(server) {
    if(!server) server = 'rcon test';
    const serverInfo = config.servers.find(x => x.name === server);
    const rcon = await Rcon.connect({
        host: serverInfo.ip, port: serverInfo.port, password: serverInfo.password
    });
    rcon.send('ListPlayers').then(response => {
        console.log(response);
        return response;
    });
}

export async function kickById(playerID, reason, server) {
    if(!server) server = config.defaultServer;
    const serverInfo = config.servers.find(x => x.name === server);
    const rcon = await Rcon.connect({
        host: serverInfo.ip, port: serverInfo.port, password: serverInfo.password
    });
    rcon.send(`AdminKickById ${playerID} ${reason}`).then(response => {
        console.log(response);
        return response;
    });
}

export async function banByID(playerID, reason, length, server) {
    if(!server) server = config.defaultServer;
    const serverInfo = config.servers.find(x => x.name === server);
    const rcon = await Rcon.connect({
        host: serverInfo.ip, port: serverInfo.port, password: serverInfo.password
    });
    rcon.send(`AdminBanById ${playerID} ${length} ${reason}`).then(response => {
        console.log(response);
        return response;
    });
}

export async function broadcast(message, server) {
    if(!server) server = config.defaultServer;
    const serverInfo = config.servers.find(x => x.name === server);
    const rcon = await Rcon.connect({
        host: serverInfo.ip, port: serverInfo.port, password: serverInfo.password
    });
    rcon.send(`AdminBroadcast ${message}`).then(response => {
        console.log(response);
        return response;
    });
}
