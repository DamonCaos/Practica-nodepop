import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Product from '../models/product.js';
import User from '../models/User.js';
import upload from '../config/multer_config.js';
import autMiddleware from '../middlewares/auth.js'; 

const router = express.Router();
const SECRET_KEY = 'ljkdbkhjbsdlkg';

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Iniciar sesión y obtener un token JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 example: 1234
 *     responses:
 *       200:
 *         description: Login exitoso, devuelve un token JWT
 */
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Obtener todos los productos del usuario autenticado
 *     tags: [Products]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de productos del usuario autenticado
 */
router.get('/products', autMiddleware, async (req, res) => {
    try {
        const { name, priceMin, priceMax, tags, sort, page = 1, limit = 10, fields } = req.query;

        let filter = { owner: req.user.id };

        if (name) filter.name = new RegExp(name, 'i');
        if (priceMin || priceMax) {
            filter.price = {};
            if (priceMin) filter.price.$gte = Number(priceMin);
            if (priceMax) filter.price.$lte = Number(priceMax);
        }
        if (tags) filter.tags = { $in: tags.split(',') };

        const options = {
            skip: (page - 1) * limit,
            limit: Number(limit),
            sort: sort ? { [sort]: 1 } : {},
            select: fields ? fields.split(',').join(' ') : '',
        };

        const products = await Product.find(filter, options.select)
            .skip(options.skip)
            .limit(options.limit)
            .sort(options.sort);

        const total = await Product.countDocuments(filter);

        res.json({
            results: products,
            total,
            page: Number(page),
            totalPages: Math.ceil(total / limit),
        });

    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
});

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Crear un nuevo producto
 *     tags: [Products]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       201:
 *         description: Producto creado exitosamente
 */
router.post('/products', autMiddleware, upload.single('image'), async (req, res) => {
    try {
        const { name, price, tags } = req.body;

        if (!name || !price) {
            return res.status(400).json({ error: 'El nombre y el precio son obligatorios' });
        }

        const newProduct = new Product({
            name,
            owner: req.user.id,
            price: Number(price),
            image: req.file ? `/images/uploads/${req.file.filename}` : null,
            tags: tags ? tags.split(',') : [],
        });

        await newProduct.save();
        res.status(201).json({ message: 'Producto creado', product: newProduct });

    } catch (error) {
        console.error('Error al crear producto:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
});

/**
 * @swagger
 * /api/products/{productID}:
 *   get:
 *     summary: Obtener un producto por ID
 *     tags: [Products]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Producto encontrado
 */
router.get('/products/:productID', autMiddleware, async (req, res) => {
    try {
        const { productID } = req.params;
        const product = await Product.findOne({ _id: productID, owner: req.user.id });

        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado o no autorizado' });
        }

        res.json(product);

    } catch (error) {
        console.error('Error al obtener producto:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
});

/**
 * @swagger
 * /api/products/{productID}:
 *   put:
 *     summary: Actualizar un producto
 *     tags: [Products]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Producto actualizado exitosamente
 */
router.put('/products/:productID', autMiddleware, upload.single('image'), async (req, res) => {
    try {
        const { productID } = req.params;
        const { name, price, tags } = req.body;

        const product = await Product.findOne({ _id: productID, owner: req.user.id });

        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado o no autorizado' });
        }

        if (name) product.name = name;
        if (price) product.price = Number(price);
        if (tags) product.tags = tags.split(',');

        if (req.file) {
            product.image = `/images/uploads/${req.file.filename}`;
        }

        await product.save();

        res.json({ message: 'Producto actualizado', product });

    } catch (error) {
        console.error('Error al actualizar producto:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
});

/**
 * @swagger
 * /api/products/{productID}:
 *   delete:
 *     summary: Eliminar un producto
 *     tags: [Products]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Producto eliminado exitosamente
 */
router.delete('/products/:productID', autMiddleware, async (req, res) => {
    try {
        const { productID } = req.params;
        const product = await Product.findOne({ _id: productID, owner: req.user.id });

        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado o no autorizado' });
        }

        await Product.deleteOne({ _id: productID });

        res.json({ message: 'Producto eliminado' });

    } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
});

export default router;

