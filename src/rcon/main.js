const { Rcon } = require("rcon-client");
const config = require('../../config.json');

export default class RconConnection {
    constructor(server) {
        this.server = server;
    }

    async main() {
        const serverInfo = config.servers.find(x => x.name === this.server);
        this.rcon = await Rcon.connect({
            host: serverInfo.ip, port: serverInfo.rconPort, password: serverInfo.password
        });

    }

    async listPlayers() {
        return await this.rcon.send('ListPlayers').then(response => {
            return response;
        });
    }
}
