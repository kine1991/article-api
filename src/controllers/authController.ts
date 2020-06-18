import { Request, Response, NextFunction } from 'express';
import jwt, { decode } from 'jsonwebtoken';
import bcript from 'bcryptjs';
import { promisify } from 'util';

import User from '../models/userModel';
import catchAsync from '../utils/catchAsync';
import { BadRequestError } from '../utils/errors/bad-request-error';

const signToken = (id: any) => {
  return jwt.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: '1d'
    // expiresIn: process.env.JWT_EXPIRES_IN
  })
}

const createSendToken = (user: any, statusCode: number, res: Response) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      //@ts-ignore
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };
  //@ts-ignore
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

  const existingUser = await User.findOne({ email: req.body.email }).select('+password');
  
  if (!existingUser) {
    throw new BadRequestError('Incorrect email or password!', 401);
  }
  const comparePassword = await bcript.compare(password, existingUser.password!);
  if (!comparePassword) {
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
    photo: req.body.photo,
  });

  createSendToken(newUser, 201, res);
});

export const currentUser = (req: Request, res: Response) => {
  res.json({
    status: "success",
    data: {
      user: req.user
    }
  });
};

export const checkAuth = async (req: Request, res: Response) => {
  try {
    let user;
    if(!req.cookies?.jwt) {
      // console.log('cookies', req.cookies?.jwt)
      user = null;
    } else {
      const token = req.cookies.jwt
      const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET!) as { id: string };

      user = await User.findById(decoded.id)
    }

    res.json({
      status: "success",
      data: {
        user: user
      }
    });
  } catch (error) {
    console.log('checkAuth - error: ', error);
    res.json({
      status: "success",
      data: {
        user: null
      }
    });
  }
};

export const logout = (req: Request, res: Response) => {
  res.cookie('jwt', '', {
    expires: new Date(Date.now() + 10 * 100),
    httpOnly: true
  });
  res.status(200).json({ 
    status: 'success',
    data: {
      user: null
    }
  });
};

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  // console.log('cookies2', req.cookies)
  try {
    if (!req.cookies?.jwt) {
      next(new BadRequestError('You are not logged in! Please log in to get access.', 401));
    }
    const token = req.cookies.jwt;
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string }
    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
      next(new BadRequestError('The user belonging to this token does no longer exist.', 401));
    }

    req.user = currentUser;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      next(new BadRequestError('invalid token.', 401));
    }
    // console.log('error@', error);
    // console.log('error@@', error.name);

    next(new BadRequestError('Something went wrong', 500));
  }
};
