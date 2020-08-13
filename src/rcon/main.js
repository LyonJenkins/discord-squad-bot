import { Rcon } from '../../rcon-client'

export default class RconConnection {
    constructor(selectedServer, server) {
        this.selectedServer = selectedServer;
        this.server = server;
    }

    async main() {
        this.rcon = new Rcon({
            host: this.selectedServer.ip, port: this.selectedServer.rconPort, password: this.selectedServer.password
        });

        await this.rcon.connect();

        this.rcon.on('end', async () => {
            console.log('rcon end');
            await this.rcon.connect();
        });

        this.rcon.on('chatMessage', message => {
            this.server.emit('CHAT_MESSAGE', message);
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
