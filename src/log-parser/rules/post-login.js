export default {
	regex: /^\[([0-9.:-]+)]\[([ 0-9]*)]LogSquad: PostLogin: NewPlayer: (.*) \/(.*)\/(.*):PersistentLevel.(.*)/,
	parseArgs: (args, logParser) => {
		const data = {
			time: args[1],
			playerController: args[6]
		};
		logParser.server.emit('POST_LOGIN', data);
	}
}
