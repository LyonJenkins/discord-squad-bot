export default {
	regex: /^\[([0-9.:-]+)]\[([ 0-9]*)]LogSquadTrace: \[DedicatedServer](?:ASQPlayerController::)?OnPossess\(\): PC=(.+) Pawn=([A-z0-9_]+)_C/,
	parseArgs: (args, logParser) => {
		const data = {
			time: args[1],
			player: args[3],
			classname: args[4]
		};
		logParser.server.emit('PLAYER_POSSESS', data);
	}
}
