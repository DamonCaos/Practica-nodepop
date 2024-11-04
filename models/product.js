import mongoose from 'mongoose'

const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
    name: String,
    owner: { ref: 'user', type: mongoose.Schema.Types.ObjectId },
    price: Number,
    image: String,
    tags: [String]
})

module.exports = mongoose.model('Product', productSchema);