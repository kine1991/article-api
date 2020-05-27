"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadRequestError = void 0;
const custom_error_1 = require("./custom-error");
class BadRequestError extends custom_error_1.CustomError {
    // statusCode = 400;
    constructor(message, statusCode) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }
    serializeErrors() {
        return [{ message: this.message }];
    }
}
exports.BadRequestError = BadRequestError;
