import { Request, Response, NextFunction } from 'express';

import { NotFoundError, CustomError } from '../utils/errors';


const errorController = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({
      errors: err.serializeErrors()
    });
  }

  if (err.name === 'CastError') {
    // @ts-ignore
    const message = `Not Found: ${err.path}: ${err.value}`;
    return res.status(404).json({
      errors: [{message}]
    });
  }

  console.error('@log (errorController)', err);

  res.status(400).send({
    errors: [{ message: err }]
  })
  // res.status(400).send({
  //   errors: [{ message: 'Something went wrong' }]
  // })
};

export default errorController;