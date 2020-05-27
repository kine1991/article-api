import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcript from 'bcryptjs';
import { promisify } from 'util';


import User from '../models/userModel';
import catchAsync from '../utils/catchAsync';
import { BadRequestError } from '../utils/errors/bad-request-error';

const signToken = (id: any) => {
  return jwt.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN
  })
}

const createSendToken = (user: any, statusCode: number, res: Response) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
}

export const signIn = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError('Please provide email and password!', 400);
  }

  const existingUser = await User.findOne({ email: req.body.email });

  if (!existingUser) {
    throw new BadRequestError('Incorrect email or password!', 401);
  }

  if (!await bcript.compare(password, existingUser.password)) {
    throw new BadRequestError('Incorrect email or password!', 401);
  }

  createSendToken(existingUser, 200, res);
});

export const signUp = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const existingUser = await User.findOne({ email: req.body.email });
  if (existingUser) {
    throw new BadRequestError('This email was already taken', 400);
  }

  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  createSendToken(newUser, 201, res);
});


export const currentUser = catchAsync( async (req: Request, res: Response, next: NextFunction) => {
  console.log('cookies@', req.cookies.jwt);
  const token = req.cookies.jwt;
  if (!req.cookies?.jwt) {
    return res.json({
      currentUser: null
    });
  } else {
    // const decoded = await promisify(jwt.verify)('token', process.env.JWT_SECRET!)
  
    // console.log('decoded', decoded.id);

    jwt.verify('token', process.env.JWT_SECRET!, function(err: any, decoded: any) {
      if (err) {
        return res.json({
          currentUser: null
        });
      }
      // console.log('decoded', decoded) // bar
      // console.log('err', err) // bar
    })
    
    // const user = await User.findById(decoded.id);
    // console.log('user', user);
    // // res.json({
    // //   ss: "sss"
    // // });
    return res.send({});

  }

});