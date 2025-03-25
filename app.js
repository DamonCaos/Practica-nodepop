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
import bcrypt from 'bcryptjs';
import i18n from './config/i18n_config.js';
import upload from './config/multer_config.js';
import * as langController from './routes/langController.js';
import apiRouter from './routes/api.js';
import swaggerSetup from './config/swaggerConfig.js'; // Import Swagger

// Obtener el __dirname en un módulo ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Integrar Swagger antes de definir las rutas
swaggerSetup(app);

app.use(cookieParser());
app.use(i18n.init);
app.get('/change-locale/:locale', langController.changeLocale);

// Configurar el middleware de sesión antes de cualquier ruta
app.use(
  session({
    secret: 'dkjbaljdsvblajvs',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

// Middleware para hacer que `session` esté disponible en todas las vistas
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

app.use((req, res, next) => {
  const locale = req.query.lang || req.cookies['nodeapp-locale'] || 'en';
  res.setLocale(locale);
  if (!req.cookies['nodeapp-locale']) {
    res.cookie('nodeapp-locale', locale, { maxAge: 90000, httpOnly: true });
  }
  next();
});

app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use('/images/uploads', express.static(path.join(__dirname, 'public/images/uploads')));

// Rutas principales
app.use('/api', apiRouter); // API REST
app.use('/products', productsRouter);
app.use('/users', usersRouter);
app.use('/', indexRouter);

// Rutas de autenticación
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

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log('Usuario no encontrado');
      return res.render('login', { error: 'Usuario o contraseña incorrectos' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
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

// Iniciar conexión y cargar base de datos
async function startServer() {
  try {
    await connectMongoose();
    await initDB();
    const PORT = process.env.PORT || 3000;
    app.listen(PORT,'0.0.0.0', () => {
      console.log(`Servidor escuchando en http://localhost:${PORT}`);
      console.log(`📄 Documentación Swagger disponible en http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
  }
}

startServer();

export default app;

