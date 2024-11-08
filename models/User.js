import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

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
            this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
        }
        next();
    } catch (error) {
        next(error);
    }
});


userSchema.methods.comparePassword = function(plainPassword) {
    return bcrypt.compare(plainPassword, this.password);
};


export default mongoose.model('User', userSchema);
