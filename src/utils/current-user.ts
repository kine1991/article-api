import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import User, { UserDoc } from '../models/userModel';

interface UserDecoded {
  id: string,
}

declare global {
  namespace Express {
    interface Request {
      user?: UserDoc | null | undefined;
    }
  }
}

const currentUser = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.cookies?.jwt) {
    req.user = null;
    return next();
  }

  const token = req.cookies.jwt;

  try {
    const decoded = jwt.verify('token', process.env.JWT_SECRET!) as UserDecoded
    
    const user = await User.findById(decoded.id);
    req.user = user
  } catch (error) {
    req.user = null;
  }
  next();
}

export default currentUser;