import { EventEmitter } from 'events';
import { Tail } from 'tail';


export default class FileTail extends EventEmitter {
	constructor(path) {
		super();
		this.filePath = path;
	}

	main() {
		const tail = new Tail(this.filePath);
		tail.on('line', line => {
			this.emit('line', line);
		});
	}
}
