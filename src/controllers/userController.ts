import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import multer from 'multer';

import { NotFoundError, BadRequestError } from '../utils/errors';
import User from '../models/userModel';
import catchAsync from '../utils/catchAsync';
// import { BadRequestError } from '../utils/errors/bad-request-error';

const multerStorage = multer.diskStorage({
  destination: (req, res, cb) => {
    // cb(null, './uuu')
    cb(null, 'build/public/img/users')
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    cb(null, `user-${req.user?._id}-${Date.now()}.${ext}`);
  }
});

const multerFilter = (req: Request, file: any, cb: any) => {
  if(file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new BadRequestError('Not an image! Please upload only images.', 400), false);
  }
}

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});
// const upload = multer({ dest: '../../build/public/img/users' });

export const uploadUserPhoto = upload.single('photo');

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
    throw new BadRequestError(`This route is not found (_id: ${req.params.id})`, 404);
    // throw new NotFoundError();
  }

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});

// photo - https://sun9-23.userapi.com/iF2G3PzlBo98CQWy6yQ_EwRVN1h2FnQNVpBSRw/78DA2RMPkZw.jpg?ava=1
export const updateMe = catchAsync(async (req: Request, res: Response) => {
  console.log('req.file', req.file);
  console.log('req.body', req.body);
  // console.log('id', req.user?._id);
  const user = await User.findByIdAndUpdate(req.user?._id, req.body, {
    new: true,
    runValidators: true
  })

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});
