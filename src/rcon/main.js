import { Rcon } from '../../rcon-client'
import { log } from '../utilities';

export default class RconConnection {
    constructor(selectedServer, server) {
        this.selectedServer = selectedServer;
        this.server = server;
    }

    async main() {
        this.rcon = new Rcon({
            host: this.selectedServer.ip, port: this.selectedServer.rconPort, password: this.selectedServer.password
        });

        this.connect().catch(error => {
            console.log(error);
        });

        this.rcon.on('end', () => {
            console.log('rcon end');
            this.connect().catch(error => {
                console.log(error);
            });
        });

        this.rcon.on('chat_message', message => {
            this.server.emit('CHAT_MESSAGE', message);
        });

        this.rcon.on('error', error => {
            log('RCON Error');
            console.log(error);
        });
    }

    async connect() {
        await this.rcon.connect();
    }

    async listPlayers() {
        return await this.rcon.send('ListPlayers').then(response => {
            return response;
        });
    }

    async warnPlayer(steamID, reason) {
        return await this.rcon.send(`AdminWarn ${steamID} ${reason}`).then(response => {
            return response;
        });
    }
}
