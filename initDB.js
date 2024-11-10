import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Product from './models/product.js';  

const SALT_ROUNDS = 10;

async function initDB() {
  try {
    // Eliminar todos los usuarios y productos existentes antes de crear nuevos
    await User.deleteMany(); // Borra todos los usuarios actuales
    await Product.deleteMany(); // Borra todos los productos actuales

    // Crear un usuario admin con contraseña hasheada
    const password1 = 'password1';
    console.log('Contraseña antes de ser hasheada (admin):', password1);
    const hashedPassword1 = await bcrypt.hash(password1, SALT_ROUNDS);  // Hashear contraseña
    console.log('Contraseña hasheada (admin):', hashedPassword1);
    const adminUser = new User({
      email: 'admin@example.com',
      password: 'password1',
      name: 'admin',
      role: 'admin'
    });
    await adminUser.save();
    console.log('Admin creado con contraseña hasheada:', hashedPassword1);

    // Crear user1 con contraseña hasheada
    const password2 = 'password2';
    console.log('Contraseña antes de ser hasheada (user1):', password2);
    const hashedPassword2 = await bcrypt.hash(password2, SALT_ROUNDS);  // Hashear contraseña
    console.log('Contraseña hasheada (user1):', hashedPassword2);
    const user1 = new User({
      email: 'user1@example.com',
      password: 'password2',
      name: 'User 1',
      role: 'user'
    });
    await user1.save();
    console.log('Usuario user1@example.com creado con contraseña hasheada:', hashedPassword2);

    // Crear user2 con contraseña hasheada
    const password3 = 'password3';
    console.log('Contraseña antes de ser hasheada (user2):', password3);
    const hashedPassword3 = await bcrypt.hash(password3, SALT_ROUNDS);  // Hashear contraseña
    console.log('Contraseña hasheada (user2):', hashedPassword3);
    const user2 = new User({
      email: 'user2@example.com',
      password: 'password3',
      name: 'User 2',
      role: 'user'
    });
    await user2.save();
    console.log('Usuario user2@example.com creado con contraseña hasheada:', hashedPassword3);

    // Crear productos para los usuarios
    const product1 = new Product({
      name: 'Stereo Headset',
      owner: user1._id,  // Asociar producto a user1
      price: 100,
      image: 'product1.jpg',
      tags: ['electronics', 'new']
    });
    await product1.save();
    console.log('Producto 1 creado para el usuario user1@example.com');

    const product2 = new Product({
      name: 'PS5',
      owner: user1._id,  // Asociar producto a user1
      price: 200,
      image: 'product2.jpg',
      tags: ['VideoGames', 'sale']
    });
    await product2.save();
    console.log('Producto 2 creado para el usuario user1@example.com');

    const product3 = new Product({
      name: 'Necronomicon',
      owner: user2._id,  // Asociar producto a user2
      price: 150,
      image: 'product3.jpg',
      tags: ['books', 'sale']
    });
    await product3.save();
    console.log('Producto 3 creado para el usuario user2@example.com');

    const product4 = new Product({
      name: 'Guitar bundle',
      owner: user2._id,  // Asociar producto a user2
      price: 80,
      image: 'product4.jpg',
      tags: ['music', 'new']
    });
    await product4.save();
    console.log('Producto 4 creado para el usuario user2@example.com');

  } catch (error) {
    console.error('Error al inicializar la base de datos:', error);
  }
}

export default initDB;



