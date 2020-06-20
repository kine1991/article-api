"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createComment = exports.deleteComment = exports.updateComment = exports.getComment = exports.getComments = void 0;
const errors_1 = require("../utils/errors");
const commentModel_1 = __importDefault(require("../models/commentModel"));
// import User from '../models/userModel';
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
exports.getComments = catchAsync_1.default(async (req, res) => {
    console.log('req.params - getComments', req.params);
    const comments = await commentModel_1.default.find({});
    res.status(200).json({
        status: 'success',
        results: comments.length,
        allResults: 'allResults',
        data: {
            comments
        }
    });
});
exports.getComment = catchAsync_1.default(async (req, res) => {
    console.log('commentId - getComment', req.params.commentId);
    const comment = await commentModel_1.default.findById(req.params.commentId);
    res.status(200).json({
        status: 'success',
        data: {
            comment
        }
    });
});
exports.updateComment = catchAsync_1.default(async (req, res) => {
    var _a;
    const comment = await commentModel_1.default.findById(req.params.commentId)
        .populate({ path: 'user', select: 'role name email photo' });
    // if comment do not exists
    if (!comment)
        throw new errors_1.BadRequestError('This comment do not exists', 404);
    // if comment do not belong to user
    if ((comment === null || comment === void 0 ? void 0 : comment.user._id.toString()) !== ((_a = req.user) === null || _a === void 0 ? void 0 : _a._id.toString()))
        throw new errors_1.BadRequestError('You do not have permission to perform this action', 403);
    comment.comment = req.body.comment;
    await (comment === null || comment === void 0 ? void 0 : comment.save());
    res.status(201).json({
        status: 'success',
        data: {
            comment
        }
    });
});
exports.deleteComment = catchAsync_1.default(async (req, res) => {
    var _a;
    const comment = await commentModel_1.default.findById(req.params.commentId)
        .populate({ path: 'user', select: 'role name email photo' });
    // if comment do not exists
    if (!comment)
        throw new errors_1.BadRequestError('This comment do not exists', 404);
    // if comment do not belong to user
    if ((comment === null || comment === void 0 ? void 0 : comment.user._id.toString()) !== ((_a = req.user) === null || _a === void 0 ? void 0 : _a._id.toString()))
        throw new errors_1.BadRequestError('You do not have permission to perform this action', 403);
    await commentModel_1.default.findByIdAndDelete(req.params.commentId);
    res.status(204).json({
        status: 'success'
    });
});
exports.createComment = catchAsync_1.default(async (req, res) => {
    // console.log('articleId - createComment', req.params.articleId );
    // console.log('user - createComment', req.user );
    var _a;
    const comment = await commentModel_1.default.create({
        comment: req.body.comment,
        user: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id,
        article: req.params.articleId
    });
    res.status(201).json({
        status: 'success',
        data: {
            comment
        }
    });
});
// export const setArticleId = (req: Request, res: Response, next: NextFunction) => {
//   console.log('articleId - setArticleId', req.params.articleId);
//   req.body.articleId = req.params.articleId;
//   next();
// }
