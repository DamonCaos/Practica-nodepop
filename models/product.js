import mongoose from 'mongoose';

const productSchema = mongoose.Schema({
    name: String,
    owner: { ref: 'User', type: mongoose.Schema.Types.ObjectId },
    price: Number,
    image: String,
    tags: [String]
});


export default mongoose.model('Product', productSchema);
