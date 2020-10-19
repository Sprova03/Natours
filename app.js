const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const xss = require('xss-clean');
const hpp = require('hpp');
const csp = require('express-csp');
const cookieParser = require('cookie-parser');
//importamos la funcion de error
const globalErrorHandler = require('./controllers/errorController');
//importar la class para manejar los errores:
const appError = require('./utils/appError');

//Importando Routers:
const viewRouter = require('./routes/viewRoutes');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//1)GLOBAL MIDDELWARES

app.use(express.static(path.join(__dirname, 'public')));
// Set seguriti Http headers
app.use(helmet());
csp.extend(app, {
  policy: {
    directives: {
      'default-src': ['self', 'unsafe-inline', 'data', 'blob', 'http://*'],
      'style-src': ['self', 'unsafe-inline', 'data:', 'blob:', 'http://*'],
      'script-src': ['self', 'unsafe-inline', 'data', 'blob', 'http://*'],
      'worker-src': ['self', 'unsafe-inline', 'data:', 'blob:', 'http://*'],
      'frame-src': ['self', 'unsafe-inline', 'data:', 'blob:', 'http://*'],
      'img-src': ['self', 'unsafe-inline', 'data:', 'blob:', 'http://*'],
      'connect-src': [
        'self',
        'unsafe-inline',
        'data:',
        'blob:',
        'http://*',
        'ws://127.0.0.1:*/',
      ],
      'font-src': ['self', 'unsafe-inline', 'data:', 'blob:', 'http://*'],
    },
  },
});

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit request from same IP
const limiter = rateLimit({
  max: 200,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP, please try again in a hour',
});
app.use('/api', limiter);

app.use(express.json({ limit: '10kb' })); //Middelware
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
// app.use(mongoSanitize());

app.use(xss());

app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'price',
      'maxGroupSize',
      'difficulty',
    ],
  })
);

app.use((req, res, next) => {
  req.requesTime = new Date().toISOString();
  next();
});

//3.0) ROUTES
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/bookings', bookingRouter);
app.use('/api/v1/reviews', reviewRouter);



//manejo de errores, usamos all para decir que se va a aplicar en todos los metodos HTTP
app.all('*', (req, res, next) => {
  
  next(new appError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

//Exportamos const APP a server
module.exports = app;
