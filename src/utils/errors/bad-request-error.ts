import { CustomError } from './custom-error';

export class BadRequestError extends CustomError {
  // statusCode = 400;

  constructor(public message: string, public statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}