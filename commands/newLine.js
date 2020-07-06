const fs = require('fs');

export default class newLine {
	constructor() {
		this.name = 'newLine';
		this.description = 'New line test';
		this.usage = '';
		this.args = false;
		this.guildOnly = false;
		this.aliases = [];
		this.disabled = false;
		this.adminOnly = true;
	}

	execute(message, args) {
		addLine('\r\n[2020.07.05-02.10.35:294][324]LogSquad: USQGameState: Server Tick Rate: 51.20');
		//addLine('\r\n[2020.07.04-18.41.11:888][534]LogSquadTrace: [DedicatedServer]ASQSoldier::Die(): Player:Normandy KillingDamage=-300.000000 from BP_PlayerController_C_2147469081 caused by BP_Soldier_GB_Medic_C_2147462534');	}
		//addLine('\r\n[2020.07.04-18.24.08:927][610]LogSquadTrace: [DedicatedServer]ASQPlayerController::OnPossess(): PC=Bob Ross` Squirrel Pawn=CameraMan_C_2147466985 FullPath=CameraMan_C /Game/Maps/Sumari/Gameplay_Layers/Sumari_AAS_v1.Sumari_AAS_v1:PersistentLevel.CameraMan_C_2147466985')
	}
}

function addLine(line) {
	fs.appendFile('C:\\Users\\Lyon\\Documents\\GitHub\\bbr-bot\\SquadGame.log', line, (err) => {
		if (err) {
			return console.error(err);
		}
	});
}
