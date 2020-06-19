import { Request, Response, NextFunction } from 'express';

import { NotFoundError, BadRequestError } from '../utils/errors';
import User from '../models/userModel';
import catchAsync from '../utils/catchAsync';

export const getComments = catchAsync( async (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    data: {
      comments: 'comments'
    }
  })
});

export const getComment = catchAsync( async (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    data: {
      comment: 'comment'
    }
  })
});

export const createComment = catchAsync( async (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    data: {
      comment: 'comment'
    }
  })
});