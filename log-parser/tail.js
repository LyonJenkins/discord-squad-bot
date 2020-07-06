import { EventEmitter } from 'events';
const Tail = require('tail').Tail;

export default class FileTail extends EventEmitter {
	constructor(path) {
		super();
		this.filePath = path;
	}

	main() {
		const tail = new Tail(this.filePath);
		tail.on('line', data => {
			this.emit('new line', data);
		});
	}
}
