import moment from 'moment';


export default function log(log) {
	const date = moment().format();
	console.log(`[${date}] ${log}`);
}
