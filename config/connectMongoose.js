import mongoose from "mongoose";

async function connectMongoose() {
    try {
        await mongoose.connect('mongodb://localhost:27017/nodepop');
        console.log('Conectado a MongoDB');
    } catch (error) {
        console.error('Error en la conexión a MongoDB:', error);
        process.exit(1);
    }
}

export default connectMongoose;


