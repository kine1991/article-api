"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signUp = exports.signIn = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const bad_request_error_1 = require("../utils/errors/bad-request-error");
exports.signIn = (req, res, next) => {
};
exports.signUp = catchAsync_1.default(async (req, res, next) => {
    const existingUser = await userModel_1.default.findOne({ email: req.body.email });
    if (existingUser) {
        throw new bad_request_error_1.BadRequestError('This email was already taken');
    }
    const newUser = await userModel_1.default.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    });
    res.status(201).json({
        user: newUser
    });
});
