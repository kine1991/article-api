import express, { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';
import mongoSanitize from 'express-mongo-sanitize';
// @ts-ignore
import xss from 'xss-clean';

import userRouter from './routes/userRoutes';
import articleRouter from './routes/articleRoutes';
import globalErrorHandler from './controllers/errorController';
import { NotFoundError } from './utils/errors/not-found-page';

const app = express();

// CORS
// app.use(cors());
if (process.env.NODE_ENV === 'development') {
  app.use(cors({credentials: true, origin: 'http://localhost:4200'}));
} else if (process.env.NODE_ENV === 'production') {
  app.use(cors({credentials: true, origin: 'http://kron-articles.us-east-2.elasticbeanstalk.com'}));
} else {
  // delete
  app.use(cors({credentials: true, origin: 'http://localhost:4200'}));
}
// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "http://localhost:4200");
//   res.setHeader("Access-Control-Allow-Credentials", "true");
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//   );
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, PATCH, PUT, DELETE, OPTIONS, "
//   );
//   next();
// });

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

// cookie
app.use(cookieParser())

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// ROUTES
app.use('/api/v1/users', userRouter);
app.use('/api/v1/articles', articleRouter);

app.all('*', async (req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError());
});

app.use(globalErrorHandler);

export default app;