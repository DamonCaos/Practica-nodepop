import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user'}
});

userSchema.pre('save', async function(next) {
    try {
        if (this.isModified('password')) {
            console.log("Contraseña antes de ser hasheada: ", this.password);  // Log antes de hashear
            this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
            console.log("Contraseña hasheada: ", this.password);  // Log después de hashear
        }
        next();
    } catch (error) {
        next(error);
    }
});



userSchema.methods.comparePassword = async function(plainPassword) {
    console.log('Contraseña ingresada:', plainPassword);  
    console.log('Longitud contraseña ingresada:', plainPassword.length);  
    console.log('Contraseña almacenada (hash):', this.password);  
    console.log('Longitud contraseña almacenada (hash):', this.password.length);  
    
    const match = await bcrypt.compare(plainPassword, this.password);
    console.log('Resultado comparación:', match); // Añadido log para mostrar el resultado de la comparación

    return match;
};



export default mongoose.model('User', userSchema);
