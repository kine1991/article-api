"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../utils/errors");
const errorController = (err, req, res, next) => {
    if (err instanceof errors_1.CustomError) {
        return res.status(err.statusCode).json({
            errors: err.serializeErrors()
        });
    }
    if (err.name === 'CastError') {
        // @ts-ignore
        const message = `This route is not found: (${err.path}: ${err.value})`;
        return res.status(404).json({
            errors: [{ message }]
        });
    }
    console.error('@log (errorController)', err);
    // res.status(400).send({
    //   errors: [{ message: err }]
    // })
    res.status(400).send({
        errors: [{ message: 'Something went wrong' }]
    });
};
exports.default = errorController;
