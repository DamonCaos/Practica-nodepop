import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Product from '../models/product.js';
import User from '../models/User.js';
import upload from '../config/multer_config.js';
import autMiddleware from '../middlewares/auth.js'; // Corregido el path

const router = express.Router();
const SECRET_KEY = 'ljkdbkhjbsdlkg';

// Endpoint de login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generar el token
        const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Obtener lista de productos con filtros
router.get('/products', autMiddleware, async (req, res) => {
    try {
        const { name, priceMin, priceMax, tags, sort, page = 1, limit = 10, fields } = req.query;

        let filter = { owner: req.user.id }; // Solo ver sus productos

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

// Crear un producto
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

// Obtener un solo producto por ID
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

export default router;
