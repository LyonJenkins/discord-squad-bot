export default {
	regex: /^\[([0-9.:-]+)]\[([ 0-9]*)]LogSquad: USQGameState: Server Tick Rate: ([0-9.]+)/,
	parseArgs: (args, logParser) => {
		const data = {
			time: args[1],
			tickRate: parseFloat(args[3]),
		};
		logParser.emit('TICK_RATE', data);
	}
}
