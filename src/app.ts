import express from 'express';
import bodyParser from 'body-parser';

import userRouter from './routes/userRoutes';
import articleRouter from './routes/articleRoutes';

const app = express();

// bodyParser
app.use(bodyParser.urlencoded({ extended: true }));

// ROUTES
app.use('/api/v1/users', userRouter);
app.use('/api/v1/articles', articleRouter);



export default app;