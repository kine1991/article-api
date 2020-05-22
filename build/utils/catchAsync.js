"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
const catchAsync = fn => {
    return (req, res, next) => {
        fn(req, res, next).catch(err => next(err));
    };
};
exports.default = catchAsync;
