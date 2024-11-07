import mongoose from 'mongoose';
import bcrypt from 'bcrypt'; // Importar bcrypt aquí
import Product from './models/product.js';
import User from './models/User.js';

const SALT_ROUNDS = 10;

async function initDB() {
  try {
    await Product.deleteMany();
    await User.deleteMany();
    console.log('Productos y usuarios eliminados.');

    // Crear usuarios con contraseñas cifradas
    const users = [
      { name: 'user1', email: 'user1@example.com', password: await bcrypt.hash('password1', SALT_ROUNDS) },
      { name: 'user2', email: 'user2@example.com', password: await bcrypt.hash('password2', SALT_ROUNDS) }
    ];

    // Insertar usuarios en la base de datos
    const insertedUsers = await User.insertMany(users);
    console.log('Usuarios iniciales cargados:', insertedUsers);

    // Insertar productos de ejemplo
    await Product.insertMany([
      { name: 'T-shirt', owner: insertedUsers[0]._id, price: 20, image: 'image_url', tags: ['lifestyle'] },
      { name: 'PC Monitor', owner: insertedUsers[1]._id, price: 150, image: 'image2_url', tags: ['work', 'technology'] }
    ]);
    console.log('Productos iniciales cargados.');
  } catch (error) {
    console.error('Error inicializando la base de datos:', error);
  }
}

export default initDB;
