import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import usersRoutes from './routes/userRoutes';
import adminRoutes from './routes/admin/adminRoutes';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import errorHandler from './helpers/errorHandler';

const app = express();

// default middleware
app.use(
  cors({
    origin: [process.env.FRONTEND_URL!, process.env.FRONTEND_URL_ADMIN!],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'UPDATE', 'PATCH'],
    credentials: true,
  })
);

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 50,
  handler: (req, res, next) => {
    console.log(`Rate limit hit`);
    res.status(429).json({ message: 'Too many requests, slow down!' });
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);
app.use(cookieParser());
app.use(helmet());
app.use(compression());
app.use(morgan('short'));

app.use(
  express.json({
    limit: '5mb',
  })
);
app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: '5mb',
  })
);
app.use(express.static('./public'));

// error handler
errorHandler();


// user routes api
app.use('/api/v1/users', usersRoutes);
app.use('/api/v1/admin', adminRoutes);



// server check api
app.get('/', async (req, res) => {
  res.send('World Hindu Vision Server is running');
});


export { app};
