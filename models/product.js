import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    price: { type: Number, required: true },
    image: { type: String },
    tags: [String]
});

// Verificar si el modelo ya está registrado para evitar sobrescribirlo
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;
