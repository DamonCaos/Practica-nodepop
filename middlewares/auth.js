import jwt from 'jsonwebtoken';

const SECRET_KEY = 'ljkdbkhjbsdlkg'; // Asegúrate de que es la misma clave usada en login

function autMiddleware(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token no proporcionado' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token inválido' });
    }
}

export default autMiddleware;
