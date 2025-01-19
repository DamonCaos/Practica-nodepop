import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Product from '../models/product';
import User from '../models/User';
import { token } from 'morgan';

const router = express.Router();
const SECRET_KEY = 'ljkdbkhjbsdlkg';


//Endpoints and middlewares

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if(!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid creedentials' })
        }
        const token = jwt.sign({ id: user._id}, SECRET_KEY,
            res.json({ token })
        )
    } catch (error) {
        console.error('Error en login', error);
        res.status(500).json({ error: 'Server error'});
        
    }
});

function autMiddleware(req,res,next) {
    const token = req.headers.authorization?.split(' ')[1];
    if(!token) {
        return res.status(401).json({ error: 'Not authoriced' })
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next()
    } catch {
        return res.status(401).json({ error: 'invalid token' })
        
    }
}

//Product list

router.get('/products', autMiddleware, async(req,res) => {
    try {
        const products = await Product.find({ owner: req.user.id });
        res.json(products)
    } catch (error) {
        console.error('Getting products error', error);
        res.status(500).json({ error: 'server error' })
        
    }
});




export default router;