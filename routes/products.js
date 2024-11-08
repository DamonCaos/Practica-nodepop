import express from 'express';
import Product from '../models/product.js'; 
import product from '../models/product.js';
const router = express.Router();

// Listar productos
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.render('products', { products, session: req.session });
    } catch (error) {
        console.error('Error al listar productos:', error);
        res.status(500).send('Error interno del servidor');
    }
});






// Crear nuevo producto
router.post('/create', async (req, res) => {
    try {
        const { name, owner, price, image, tags } = req.body;
        const product = new Product({ name, owner, price, image, tags: tags.split(',') });
        await product.save();
        res.redirect('/products');
    } catch (error) {
        console.error('Error al crear producto:', error);
        res.status(500).send('Error al crear el producto');
    }
});

// Editar producto
router.post('/edit/:id', async (req, res) => {
    try {
        const { name, owner, price, image, tags } = req.body;
        await Product.findByIdAndUpdate(req.params.id, { name, owner, price, image, tags: tags.split(',') });
        res.redirect('/products');
    } catch (error) {
        console.error('Error al editar producto:', error);
        res.status(500).send('Error al editar el producto');
    }
});

// Eliminar producto
router.post('/delete/:id', async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.redirect('/products');
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).send('Error al eliminar el producto');
    }
});

export default router;
