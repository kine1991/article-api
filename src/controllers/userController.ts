import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

import { NotFoundError, BadRequestError } from '../utils/errors';
import User from '../models/userModel';
import catchAsync from '../utils/catchAsync';
// import { BadRequestError } from '../utils/errors/bad-request-error';

export const getUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const users = await User.find({});

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users
    }
  });
});
export const getUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // const isValidId = mongoose.Types.ObjectId.isValid(req.params.id)
  const user = await User.findOne({ _id: req.params.id});

  if (!user) {
    throw new BadRequestError(`This route is not found (_id: ${req.params.id})`);
    // throw new NotFoundError();
  }

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});
