import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';

const SALT_ROUNDS = 10;

async function initDB() {
  try {
    // Eliminar todos los usuarios existentes antes de crear nuevos
    await User.deleteMany(); // Borra todos los usuarios actuales

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

  } catch (error) {
    console.error('Error al inicializar la base de datos:', error);
  }
}

export default initDB;


