import FileTail from './tail';
import rules from './rules';
import * as moment from 'moment';
import async from 'async';

export default class LogParser {
	constructor(server) {
		this.server = server;
		this.queue = async.queue((task, callback) => {
			handleLine(task.data, this).then(() => {
				callback();
			});
		});
	}

	main() {
		const fileTail = new FileTail(this.server.server.logPath);
		fileTail.on('line', data => {
			this.queue.push({data});
		});
		fileTail.main();
	}

}

async function handleLine(line, logParser) {
	for(const rule of rules) {
		if(rule.skip) continue;
		const match = line.match(rule.regex);
		if(match) {
			match[1] = moment.utc(match[1], 'YYYY.MM.DD-hh.mm.ss:SSS').toDate();
			await rule.parseArgs(match, logParser);
			break;
		}
	}
}
