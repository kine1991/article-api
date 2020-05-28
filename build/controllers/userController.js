"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = exports.getUsers = void 0;
const errors_1 = require("../utils/errors");
const userModel_1 = __importDefault(require("../models/userModel"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
// import { BadRequestError } from '../utils/errors/bad-request-error';
exports.getUsers = catchAsync_1.default(async (req, res, next) => {
    const users = await userModel_1.default.find({});
    res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
            users
        }
    });
});
exports.getUser = catchAsync_1.default(async (req, res, next) => {
    // const isValidId = mongoose.Types.ObjectId.isValid(req.params.id)
    const user = await userModel_1.default.findOne({ _id: req.params.id });
    if (!user) {
        throw new errors_1.BadRequestError(`This route is not found (_id: ${req.params.id})`, 404);
        // throw new NotFoundError();
    }
    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    });
});
