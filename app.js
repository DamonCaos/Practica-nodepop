import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import createError from 'http-errors';
import connectMongoose from './config/connectMongoose.js';
import initDB from './initDB.js';
import indexRouter from './routes/index.js';
import usersRouter from './routes/users.js';
import productsRouter from './routes/products.js';
import User from './models/User.js';
import session from 'express-session';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs'

// Obtener el __dirname en un módulo ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();

// Configurar el middleware de sesión antes de cualquier ruta
app.use(
  session({
    secret: 'dkjbaljdsvblajvs',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

// Hacer que `session` esté disponible en todas las vistas
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Rutas principales
app.get('/', (req, res) => {
  res.render('index', { session: req.session });
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error al cerrar sesión:', err);
    }
    res.redirect('/login');
  });
});
// Ruta de login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  console.log(`Intento de login con el email: ${email}`);
  console.log('Contraseña ingresada:', password);

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log('Usuario no encontrado');
      return res.render('login', { error: 'Usuario o contraseña incorrectos' });
    }

    console.log('Usuario encontrado:', user.email);
    console.log('Contraseña ingresada:', password);
    console.log('Contraseña almacenada(hashed)', user.password)

    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Contraseña ingresada:', password);
    console.log('Contraseña almacenada en DB:', user.password);
    console.log('Contraseña coincidente:', isMatch);  // Esto debería devolver `true` si es correcto

    if (isMatch) {
      req.session.isAuthenticated = true;
      req.session.user = user;  
      return res.redirect('/');
    } else {
      console.log('Contraseña incorrecta');
      return res.render('login', { error: 'Usuario o contraseña incorrectos' });
    }
  } catch (error) {
    console.error('Error al procesar el login:', error);
    return res.render('login', { error: 'Hubo un error al procesar tu solicitud' });
  }
});



// Cargar rutas después de la configuración de sesión y middleware
app.use('/products', productsRouter);
app.use('/users', usersRouter);

// Manejo de errores 404
app.use((req, res, next) => {
  next(createError(404));
});

// Manejo de errores internos
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

export default app;

// Iniciar conexión y cargar base de datos
async function startServer() {
  try {
    await connectMongoose();
    await initDB();
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Servidor escuchando en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
  }
}

startServer();
