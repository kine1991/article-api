import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
// @ts-ignore
import xss from 'xss-clean';

import userRouter from './routes/userRoutes';
import articleRouter from './routes/articleRoutes';

const app = express();

// 1) GLOBAL MIDDLEWARES
// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  morgan('dev');
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

// bodyParser
// app.use(bodyParser.urlencoded({ extended: true }));
// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' })); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// ROUTES
app.use('/api/v1/users', userRouter);
app.use('/api/v1/articles', articleRouter);



export default app;