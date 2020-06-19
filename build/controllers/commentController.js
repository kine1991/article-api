"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createComment = exports.getComment = exports.getComments = void 0;
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
exports.getComments = catchAsync_1.default(async (req, res) => {
    res.status(200).json({
        status: 'success',
        data: {
            comments: 'comments'
        }
    });
});
exports.getComment = catchAsync_1.default(async (req, res) => {
    res.status(200).json({
        status: 'success',
        data: {
            comment: 'comment'
        }
    });
});
exports.createComment = catchAsync_1.default(async (req, res) => {
    res.status(200).json({
        status: 'success',
        data: {
            comment: 'comment'
        }
    });
});
