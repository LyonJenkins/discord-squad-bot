export default {
	regex: /^\[([0-9.:-]+)]\[([ 0-9]*)]LogSquadTrace: \[DedicatedServer](?:ASQSoldier::)?Wound\(\): Player:(.+) KillingDamage=(?:-)*([0-9.]+) from ([A-z_0-9]+) caused by ([A-z_0-9]+)_C/,
	parseArgs: (args, logParser) => {
		const data = {
			time: args[1],
			id: args[2],
			victim: args[3],
			attackerPlayerController: args[5],
			weapon: args[6]
		};
		logParser.server.emit('PLAYER_WOUND', data);
	}
}
