import { Request, Response, NextFunction } from 'express';

import User from '../models/userModel';
import catchAsync from '../utils/catchAsync';
import { BadRequestError } from '../utils/errors/bad-request-error';

export const signIn = (req: Request, res: Response, next: NextFunction) => {

};

export const signUp = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const existingUser = await User.findOne({ email: req.body.email });
  if (existingUser) {
    throw new BadRequestError('This email was already taken');
  }
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  res.status(201).json({
    user: newUser
  });
});
