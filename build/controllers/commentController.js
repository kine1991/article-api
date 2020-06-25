"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.likesComment = exports.createComment = exports.deleteComment = exports.updateComment = exports.getComment = exports.getCommentsByArticle = exports.getComments = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const errors_1 = require("../utils/errors");
const commentModel_1 = __importDefault(require("../models/commentModel"));
// import User from '../models/userModel';
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const articleModel_1 = __importDefault(require("../models/articleModel"));
exports.getComments = catchAsync_1.default(async (req, res) => {
    console.log('req.params - getComments', req.params);
    const comments = await commentModel_1.default.find({})
        .populate({ path: 'user', select: 'role name email photo' });
    res.status(200).json({
        status: 'success',
        results: comments.length,
        allResults: 'allResults',
        data: {
            comments
        }
    });
});
exports.getCommentsByArticle = catchAsync_1.default(async (req, res) => {
    if (!req.params.articleId)
        throw new errors_1.BadRequestError('Routes articleId is undefined', 404);
    if (!mongoose_1.default.Types.ObjectId.isValid(req.params.articleId))
        throw new errors_1.BadRequestError(`Routes articleId: ${req.params.articleId} is incorrect`, 404);
    const isExistArticle = await articleModel_1.default.exists({ _id: req.params.articleId });
    if (!isExistArticle)
        throw new errors_1.BadRequestError('Article with routes articleId do not exists', 404);
    // 1) Filtering
    const queryObj = { ...req.query, article: req.params.articleId };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);
    // console.log('queryObj', queryObj);
    let query = commentModel_1.default.find(queryObj).populate({ path: 'user', select: 'role name email photo' });
    // Sorting
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        // console.log('sortBy', sortBy);
        query = query.sort(sortBy);
    }
    else {
        query = query.sort('-createdAt');
    }
    // Pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 20;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    const numComments = await commentModel_1.default.countDocuments(queryObj);
    if (req.query.page) {
        if (skip > numComments)
            throw new errors_1.BadRequestError('This page of comments does not exist', 404);
    }
    const comments = await query;
    res.status(200).json({
        status: 'success',
        results: comments.length,
        allResults: numComments,
        data: {
            comments
        }
    });
});
exports.getComment = catchAsync_1.default(async (req, res) => {
    console.log('commentId - getComment', req.params.commentId);
    const comment = await commentModel_1.default.findById(req.params.commentId)
        .populate({ path: 'user', select: 'role name email photo' });
    ;
    res.status(200).json({
        status: 'success',
        data: {
            comment
        }
    });
});
exports.updateComment = catchAsync_1.default(async (req, res) => {
    var _a;
    if (!mongoose_1.default.Types.ObjectId.isValid(req.params.commentId))
        throw new errors_1.BadRequestError(`Routes commentId: ${req.params.commentId} is incorrect`, 404);
    const isExistComment = await commentModel_1.default.exists({ _id: req.params.commentId });
    if (!isExistComment)
        throw new errors_1.BadRequestError('Comment with routes commentId do not exists', 404);
    const comment = await commentModel_1.default.findById(req.params.commentId)
        .populate({ path: 'user', select: 'role name email photo' });
    // if comment do not belong to user
    if ((comment === null || comment === void 0 ? void 0 : comment.user._id.toString()) !== ((_a = req.user) === null || _a === void 0 ? void 0 : _a._id.toString()))
        throw new errors_1.BadRequestError('You do not have permission to perform this action', 403);
    comment.comment = req.body.comment;
    comment.updatedAt = Date.now();
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
    if (!mongoose_1.default.Types.ObjectId.isValid(req.params.commentId))
        throw new errors_1.BadRequestError(`Routes commentId: ${req.params.commentId} is incorrect`, 404);
    const isExistComment = await commentModel_1.default.exists({ _id: req.params.commentId });
    if (!isExistComment)
        throw new errors_1.BadRequestError('Comment with routes commentId do not exists', 404);
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
    var _a;
    if (!mongoose_1.default.Types.ObjectId.isValid(req.params.articleId))
        throw new errors_1.BadRequestError(`Routes articleId: ${req.params.articleId} is incorrect`, 404);
    const isExistArticle = await articleModel_1.default.exists({ _id: req.params.articleId });
    if (!isExistArticle)
        throw new errors_1.BadRequestError('Article with routes articleId do not exists', 404);
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
exports.likesComment = catchAsync_1.default(async (req, res) => {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    if (!mongoose_1.default.Types.ObjectId.isValid(userId))
        throw new errors_1.BadRequestError(`User with this id: ${req.params.commentId} is incorrect`, 404);
    const comment = await commentModel_1.default.findById(req.params.commentId);
    if (comment === null || comment === void 0 ? void 0 : comment.likes.includes(userId)) {
        // @ts-ignore
        comment === null || comment === void 0 ? void 0 : comment.likes = comment === null || comment === void 0 ? void 0 : comment.likes.filter(usrId => {
            return usrId.toString() !== userId.toString();
        });
    }
    else {
        comment === null || comment === void 0 ? void 0 : comment.likes.unshift(userId);
    }
    await (comment === null || comment === void 0 ? void 0 : comment.save());
    res.status(200).json({
        status: 'success',
        data: {
            comment: comment
        }
    });
});
