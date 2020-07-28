const fs = require('fs');

export default {
	name: 'newLine',
	description: 'New line test',
	usage: '',
	args: false,
	guildOnly: false,
	aliases: [],
	disabled: false,
	adminOnly: true,
	execute(message, args) {
		//addLine('\r\n[2020.07.05-02.10.35:294][324]LogSquad: USQGameState: Server Tick Rate: 26');
		//addLine('\r\n[2020.07.04-18.41.11:888][534]LogSquadTrace: [DedicatedServer]ASQSoldier::Die(): Player:Normandy KillingDamage=-300.000000 from BP_PlayerController_C_2147469081 caused by BP_Soldier_GB_Medic_C_2147462534');	}
		//addLine('\r\n[2020.07.04-18.24.08:927][610]LogSquadTrace: [DedicatedServer]ASQPlayerController::OnPossess(): PC=Bob Ross` Squirrel Pawn=CameraMan_C_2147466985 FullPath=CameraMan_C /Game/Maps/Sumari/Gameplay_Layers/Sumari_AAS_v1.Sumari_AAS_v1:PersistentLevel.CameraMan_C_2147466985')
		//addLine('\r\n[2020.07.04-13.53.02:650][  0]LogWorld: Bringing World /Game/Maps/Yehorivka/Gameplay_Layers/Yehorivka_AAS_v1.Yehorivka_AAS_v1 up for play (max tick rate 50) at 2020.07.04-06.53.02');
		addLine('\n[2020.07.04-18.28.27:586][488]LogSquad: PostLogin: NewPlayer: BP_PlayerController_C /Game/Maps/Sumari/Gameplay_Layers/Sumari_AAS_v1.Sumari_AAS_v1:PersistentLevel.BP_PlayerController_C_2147463267')
		addLine('\n[2020.07.04-18.28.27:587][488]LogEasyAntiCheatServer: [11:28:27:587][Windows][EAC Server] [Info][RegisterClient] Client: 0000014281B36700 PlayerGUID: 76561198151426401 PlayerIP: 76561198151426401 OwnerGUID: 76561198151426401 PlayerName: Jbrink1')
	}
}

function addLine(line) {
	fs.appendFile('C:\\Users\\Lyon\\Documents\\GitHub\\bbr-bot\\SquadGame.log', line, (err) => {
		if (err) {
			return console.error(err);
		}
	});
}
