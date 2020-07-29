export default {
	regex: /^\[([0-9.:-]+)]\[([ 0-9]*)]LogSquad: PostLogin: NewPlayer: (.*) \/(.*)\/(.*):PersistentLevel.(.*)/,
	skip: true,
	parseArgs: (args) => {
		return {
			time: args[1],
			playerController: args[6]
		};
	}
}
