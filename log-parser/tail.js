import { EventEmitter } from 'events';
const Tail = require('tail').Tail;
const readLastLines = require('read-last-lines');


export default class FileTail extends EventEmitter {
	constructor(path) {
		super();
		this.filePath = path;
	}

	main() {
		const tail = new Tail(this.filePath);
		tail.on('line', line => {
			readLastLines.read(this.filePath, 2).then((lines) => {
				const data = {line, lines};
				this.emit('line', data);
			});
		});
	}
}
