import express from 'express';
import Product from '../models/product.js';
const router = express.Router();

// Listar productos
// Listar productos (solo los productos del usuario logueado)
router.get('/', async (req, res) => {
    try {
        // Filtrar productos por el ID del usuario logueado
        const products = await Product.find({ owner: req.session.user._id });
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
    // Lógica para eliminar un producto
});





// Crear nuevo producto (asociado al usuario logueado)
router.post('/create', async (req, res) => {
    try {
        const { name, price, image, tags } = req.body;
        // El owner debe ser el ID del usuario logueado
        const product = new Product({
            name,
            owner: req.session.user._id, // Asociar el producto al usuario logueado
            price,
            image,
            tags: tags.split(',')
        });
        await product.save();
        res.redirect('/products'); // Redirigir a la lista de productos
    } catch (error) {
        console.error('Error al crear producto:', error);
        res.status(500).send('Error al crear el producto');
    }
});

// Editar producto (solo si el producto pertenece al usuario logueado)
router.post('/edit/:id', async (req, res) => {
    try {
        const { name, price, image, tags } = req.body;
        const productId = req.params.id;
        
        // Buscar el producto por ID y comprobar si el propietario es el usuario logueado
        const product = await Product.findById(productId);
        if (product.owner.toString() !== req.session.user._id.toString()) {
            return res.status(403).send('No tienes permisos para editar este producto');
        }

        // Si la validación pasa, se actualiza el producto
        await Product.findByIdAndUpdate(productId, {
            name,
            price,
            image,
            tags: tags.split(',')
        });
        res.redirect('/products');
    } catch (error) {
        console.error('Error al editar producto:', error);
        res.status(500).send('Error al editar el producto');
    }
});


// Eliminar producto (solo si el producto pertenece al usuario logueado)
router.post('/delete/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        
        // Buscar el producto por ID y comprobar si el propietario es el usuario logueado
        const product = await Product.findById(productId);
        if (product.owner.toString() !== req.session.user._id.toString()) {
            return res.status(403).send('No tienes permisos para eliminar este producto');
        }

        // Si la validación pasa, se elimina el producto
        await Product.findByIdAndDelete(productId);
        res.redirect('/products');
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).send('Error al eliminar el producto');
    }
});


export default router;
