import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import createError from 'http-errors';
import connectMongoose from './config/connectMongoose.js';
import initDB from './initDB.js';
import indexRouter from './routes/index.js';
import usersRouter from './routes/users.js';
import User from './models/User.js';
import { fileURLToPath } from 'url';

// Obtener el __dirname en un módulo ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();

app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Iniciar conexión y cargar base de datos
async function startServer() {
  try {
    // Conectar a MongoDB
    await connectMongoose();

    // Inicializar la base de datos
    await initDB();

    // Iniciar el servidor solo después de inicializar la base de datos
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Servidor escuchando en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
  }
}

startServer();

// Rutas
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body; // Cambia 'username' a 'email'

  console.log(`Intento de login con el email: ${email}`);

  try {
    const user = await User.findOne({ email });

    if (!user) {
      console.log(`Login fallido: Usuario no encontrado`);
      return res.render('login', { error: 'Usuario o contraseña incorrectos' });
    }

    const isMatch = await user.comparePassword(password);

    if (isMatch) {
      console.log(`Login exitoso con el email: ${email}`);
      res.redirect('/');
    } else {
      console.log(`Login fallido: Contraseña incorrecta`);
      res.render('login', { error: 'Usuario o contraseña incorrectos' });
    }
  } catch (error) {
    console.error('Error al procesar el login:', error);
    res.render('login', { error: 'Hubo un error al procesar tu solicitud' });
  }
});


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
