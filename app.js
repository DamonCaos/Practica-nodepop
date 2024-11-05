import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import createError from 'http-errors';
import mongoose from './config/connectMongoose.js';
import indexRouter from './routes/index.js';
import usersRouter from './routes/users.js';

// Obtener el __dirname en un módulo ES6
const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

const app = express();


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
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

