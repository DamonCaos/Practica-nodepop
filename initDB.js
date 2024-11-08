import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import Product from './models/product.js';
import User from './models/User.js';

const SALT_ROUNDS = 10;

async function initDB() {
  try {
    await Product.deleteMany();
    await User.deleteMany();
    console.log('Productos y usuarios eliminados.');

    // Crear usuarios
    const admin = new User({
      name: 'admin', 
      email: 'admin@example.com', 
      password: await bcrypt.hash('adminpassword', SALT_ROUNDS), 
      role: 'admin'
    });
    console.log('Admin creado con contraseña hasheada:', admin.password);
    const user1 = new User({
      name: 'user1',
      email: 'user1@example.com',
      password: await bcrypt.hash('password1', SALT_ROUNDS)
    });

    const user2 = new User({
      name: 'user2',
      email: 'user2@example.com',
      password: await bcrypt.hash('password2', SALT_ROUNDS)
    });

    await admin.save();
    await user1.save();
    await user2.save();

    console.log('Usuarios creados');

    // Insertar productos de ejemplo por usuario
    const products = [
      { name: 'T-shirt', owner: user1._id, price: 20, image: 'image_url', tags: ['lifestyle'] },
      { name: 'PC Monitor', owner: user1._id, price: 150, image: 'image2_url', tags: ['work', 'technology'] },
      { name: 'Admin Laptop', owner: admin._id, price: 1000, image: 'admin_image_url', tags: ['technology', 'admin'] }
    ];

    await Product.insertMany(products);
    console.log('Productos cargados');

  } catch (error) {
    console.error('Error inicializando la base de datos:', error);
  }
}

export default initDB;
