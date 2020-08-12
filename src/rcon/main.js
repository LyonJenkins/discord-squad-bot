const { Rcon } = require("rcon-client");

export default class RconConnection {
    constructor(server) {
        this.server = server;
    }

    async main() {
        this.rcon = new Rcon({
            host: this.server.ip, port: this.server.rconPort, password: this.server.password
        });

        await this.rcon.connect();

        this.rcon.on('end', async () => {
            console.log('rcon end');
            await this.rcon.connect();
        });

        this.rcon.on('error', error => {
            console.log(error);
        });
    }


    async listPlayers() {
        return await this.rcon.send('ListPlayers').then(response => {
            return response;
        });
    }
}
