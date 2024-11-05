import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const SALT_ROUNDS = 10

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true}
});

userSchema.pre('save', async function(next){
    try {
        if (this.isModified('password')){
            return next
        }
    } catch (error) {
        next(error)
    }
});

userSchema.methods.comparePassword = function (plainPassword) {
    return bcrypt.compare(plainPassword, this.password)
}

module.exports = mongoose.model( 'User', userSchema );