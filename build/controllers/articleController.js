"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilter = exports.getCountArticles = exports.deleteArticle = exports.createArticle = exports.getArticle = exports.getArticlesByPublisher = exports.getArticlesByAuthor = exports.getArticlesByCategory = exports.getArticles = void 0;
const articleModel_1 = __importDefault(require("../models/articleModel"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const errors_1 = require("../utils/errors");
exports.getArticles = catchAsync_1.default(async (req, res) => {
    // 1) Filtering
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    console.log('queryStr', queryStr);
    let query = articleModel_1.default.find(JSON.parse(queryStr)).populate('publisher');
    // 2) Sorting
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        // console.log('sortBy', sortBy);
        query = query.sort(sortBy);
    }
    else {
        query = query.sort('-createdAt');
    }
    // 3) Field limit limiting
    if (req.query.fields) {
        console.log('req.query.fields', req.query.fields);
        const fields = req.query.fields.split(',').join(' ');
        query = query.select(`-__v ${fields}`);
    }
    else {
        query = query.select('-__v');
    }
    // Pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 20;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    const numArticles = await articleModel_1.default.countDocuments(JSON.parse(queryStr));
    if (req.query.page) {
        if (skip > numArticles)
            throw new errors_1.BadRequestError('This page does not exist', 404);
    }
    // 
    const articles = await query;
    // const articles = await Article.find(req.query).select('-content');
    res.status(200).json({
        status: "success",
        results: articles.length,
        allResults: numArticles,
        data: {
            articles
        }
    });
});
exports.getArticlesByCategory = catchAsync_1.default(async (req, res) => {
    const { categoryName, numberOfPage, countOfPerPage } = req.params;
    const regexCategoryName = new RegExp(['^', categoryName, '$'].join(''), 'i');
    let query = articleModel_1.default.find({ category: regexCategoryName }).select('-content -__v').populate('publisher');
    // Pagination
    const page = numberOfPage * 1 || 1;
    const limit = (countOfPerPage * 1) || 20;
    // const limit = 20;
    let skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    const numArticles = await articleModel_1.default.countDocuments({ category: regexCategoryName });
    ;
    if (req.query.page) {
        if (skip > numArticles)
            throw new errors_1.BadRequestError('This page does not exist', 404);
    }
    const articles = await query;
    res.status(200).json({
        status: 'success',
        results: articles.length,
        allResults: numArticles,
        data: {
            articles
        }
    });
});
exports.getArticlesByAuthor = catchAsync_1.default(async (req, res) => {
    const { authorName, numberOfPage, countOfPerPage } = req.params;
    const regexAuthorName = new RegExp(['^', authorName, '$'].join(''), 'i');
    let query = articleModel_1.default.find({ author: regexAuthorName }).select('-content -__v').populate('publisher');
    // Pagination
    const page = numberOfPage * 1 || 1;
    const limit = (countOfPerPage * 1) || 20;
    // const limit = 20;
    let skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    const numArticles = await articleModel_1.default.countDocuments({ author: regexAuthorName });
    ;
    if (req.query.page) {
        if (skip > numArticles)
            throw new errors_1.BadRequestError('This page does not exist', 404);
    }
    const articles = await query;
    res.status(200).json({
        status: 'success',
        results: articles.length,
        allResults: numArticles,
        data: {
            articles
        }
    });
});
exports.getArticlesByPublisher = catchAsync_1.default(async (req, res) => {
    const { publisherId, numberOfPage, countOfPerPage } = req.params;
    let query = articleModel_1.default.find({ publisher: publisherId }).select('-content -__v').populate('publisher');
    // Pagination
    const page = numberOfPage * 1 || 1;
    const limit = (countOfPerPage * 1) || 20;
    // const limit = 20;
    let skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    const numArticles = await articleModel_1.default.countDocuments({ publisher: publisherId });
    ;
    if (req.query.page) {
        if (skip > numArticles)
            throw new errors_1.BadRequestError('This page does not exist', 404);
    }
    const articles = await query;
    res.status(200).json({
        status: 'success',
        results: articles.length,
        allResults: numArticles,
        data: {
            articles
        }
    });
});
exports.getArticle = catchAsync_1.default(async (req, res) => {
    const article = await articleModel_1.default.findById(req.params.id).populate('publisher');
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
exports.createArticle = catchAsync_1.default(async (req, res) => {
    const newArticle = await articleModel_1.default.create({ ...req.body, user: req.user });
    res.status(201).json({
        status: "success",
        data: {
            article: newArticle
        }
    });
});
exports.deleteArticle = catchAsync_1.default(async (req, res) => {
    await articleModel_1.default.findByIdAndRemove(req.params.id);
    res.status(204).json({
        status: 'success',
        data: null
    });
});
exports.getCountArticles = catchAsync_1.default(async (req, res) => {
    const count = await articleModel_1.default.countDocuments({});
    res.status(200).json({
        count
    });
});
exports.getFilter = catchAsync_1.default(async (req, res) => {
    const categories = await articleModel_1.default.distinct('category');
    const authors = await articleModel_1.default.distinct('author');
    const priorities = await articleModel_1.default.distinct('priority');
    res.status(200).json({
        status: 'success',
        data: {
            categories,
            authors,
            priorities
        }
    });
});
