import mongoose from "mongoose";

mongoose.connect('mongodb://localhost:21017/nodepop');

const db = mongoose.connection;

db.on('error', (error) => console.log('Mongodb conexion error', error));
db.once('open', () => console.log('conected to mongodb'));

module.exports = mongoose

