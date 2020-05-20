import express, { Request, Response, NextFunction } from 'express';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
  res.send('hi there!');
});

export default router;