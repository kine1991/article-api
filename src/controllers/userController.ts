import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import sharp from 'sharp';

import { NotFoundError, BadRequestError } from '../utils/errors';
import User from '../models/userModel';
import catchAsync from '../utils/catchAsync';
// import { BadRequestError } from '../utils/errors/bad-request-error';

// const multerStorage = multer.diskStorage({
//   destination: (req, res, cb) => {
//     // cb(null, './uuu')
//     cb(null, 'build/public/img/users')
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `user-${req.user?._id}-${Date.now()}.${ext}`);
//   }
// });
const multerStorage = multer.memoryStorage();

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

export const resizeUserPhoto = catchAsync( async(req: Request, res: Response, next: NextFunction) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user?._id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`build/public/images/users/${req.file.filename}`);

  next();
});

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
  const url = req.protocol + '://' + req.get('host');
  const filterObj = (obj: any, ...allowedFields: any) => {
    const newObj: any = {};
    Object.keys(obj).forEach(el => {
      if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
  };

  const filteredBody: any = filterObj(req.body, 'name', 'email', 'photo');
  if(req.file) filteredBody.photo = url + '/images/users/' + req.file.filename;

  const user = await User.findByIdAndUpdate(req.user?._id, filteredBody, {
    new: true,
    runValidators: true
  });


  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});
