import mongoose from 'mongoose';

export function connect() {
	mongoose.connect('mongodb://localhost:27017/blueberrydb', {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false});
}
