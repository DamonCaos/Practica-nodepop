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

// Middleware de autorización
function checkAdmin(req, res, next) {
    if (req.session.user && req.session.user.role === 'admin') {
        return next(); // Si el usuario es admin, continúa con la ruta
    } else {
        return res.status(403).send('No tienes permisos para realizar esta acción');
    }
}


router.post('/create', checkAdmin, async (req, res) => {
    
});

router.put('/edit/:id', checkAdmin, async (req, res) => {
    
});

router.delete('/delete/:id', checkAdmin, async (req, res) => {
    
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
