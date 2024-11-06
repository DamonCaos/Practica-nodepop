import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import User from './models/User.js';
import createError from 'http-errors';
import mongoose from './config/connectMongoose.js';
import indexRouter from './routes/index.js';
import usersRouter from './routes/users.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();

app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, 'views'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Aquí está la ruta que añade la funcionalidad para renderizar index.ejs
app.get('/', (req, res) => {
  res.render('index');  
});
//ruta para renderizar login
app.get('/login', (req, res) => {
  res.render('login'); 
});
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  console.log(`Intento de login con el email: ${email}`); 

  try {
    
    const user = await User.findOne({ email });

    if (!user) {
      console.log(`Login fallido: Usuario no encontrado - ${email}`);
      return res.render('login', { error: 'Usuario o contraseña incorrectos' });
    }

    
    const isMatch = await user.comparePassword(password);

    if (isMatch) {
      console.log(`Login exitoso con el usuario: ${email}`);  
      res.redirect('/');  
    } else {
      console.log(`Login fallido: Contraseña incorrecta - ${email}`);
      res.render('login', { error: 'Usuario o contraseña incorrectos' });  
    }
  } catch (err) {
    console.error(err);
    res.render('login', { error: 'Ocurrió un error, por favor intenta de nuevo' });
  }
});



app.use('/users', usersRouter);

// Manejo de errores 404
app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

export default app;

