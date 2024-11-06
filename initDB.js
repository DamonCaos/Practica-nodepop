import mongoose from 'mongoose';
import Product from './models/product.js';
import User from './models/User.js';

async function initDB() {
    try {
        await Product.deleteMany();
        await User.deleteMany();
        console.log('Productos y usuarios eliminados.');

        // Inserta algunos usuarios de ejemplo
        const users = await User.insertMany([
            { name: 'user1', email: 'user1@example.com', password: 'password1' },
            { name: 'user2', email: 'user2@example.com', password: 'password2' }
        ]);
        console.log('Usuarios iniciales cargados:', users);

        // Inserta productos de ejemplo
        await Product.insertMany([
            { name: 'T-shirt', owner: users[0]._id, price: 20, image: 'image_url', tags: ['lifestyle'] },
            { name: 'PC Monitor', owner: users[1]._id, price: 150, image: 'image2_url', tags: ['work', 'technology'] }
        ]);
        console.log('Productos iniciales cargados.');
    } catch (error) {
        console.error('Error inicializando la base de datos:', error);
    } finally {
        // Cierra la conexión solo después de completar las operaciones
        if (mongoose.connection.readyState === 1) {
            await mongoose.connection.close();
            console.log('Conexión a MongoDB cerrada.');
        } else {
            console.log('No hay conexión a cerrar.');
        }
    }
}

export default initDB;

