"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilter = exports.createArticle = exports.getArticle = exports.getArticles = void 0;
const articleModel_1 = __importDefault(require("../models/articleModel"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const errors_1 = require("../utils/errors");
exports.getArticles = catchAsync_1.default(async (req, res, next) => {
    // 1) Filtering
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    console.log('queryStr', queryStr);
    let query = articleModel_1.default.find(JSON.parse(queryStr));
    // 2) Sorting
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        // console.log('sortBy', sortBy);
        query = query.sort(sortBy);
    }
    else {
        query = query.sort('-createdAt');
    }
    // 3) Field limiting limiting
    if (req.query.fields) {
        const fields = req.query.fields.split(',').join(' ');
    }
    else {
        query = query.select('-__v -content');
    }
    // Pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 20;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    if (req.query.page) {
        const numArticles = await articleModel_1.default.countDocuments();
        if (skip > numArticles)
            throw new errors_1.BadRequestError('This page does not exist', 404);
    }
    // 
    const articles = await query;
    // const articles = await Article.find(req.query).select('-content');
    res.status(200).json({
        status: "success",
        results: articles.length,
        data: {
            articles
        }
    });
});
exports.getArticle = catchAsync_1.default(async (req, res, next) => {
    const article = await articleModel_1.default.findById(req.params.id);
    // console.log('article@', article);
    if (!article) {
        throw new errors_1.NotFoundError();
    }
    res.status(200).json({
        status: "success",
        data: {
            article
        }
    });
});
exports.createArticle = catchAsync_1.default(async (req, res, next) => {
    // console.log('@@@', req.body);
    // console.log('@@@2', req.user);
    const newArticle = await articleModel_1.default.create({ ...req.body, user: req.user });
    res.status(201).json({
        status: "success",
        data: {
            article: newArticle
        }
    });
});
exports.getFilter = catchAsync_1.default(async (req, res) => {
    const category = await articleModel_1.default.distinct('category');
    const author = await articleModel_1.default.distinct('author');
    const priority = await articleModel_1.default.distinct('priority');
    res.status(200).json({
        status: 'success',
        data: {
            category,
            author,
            priority
        }
    });
});
