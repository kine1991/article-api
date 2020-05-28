"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createArticle = exports.getArticle = exports.getArticles = void 0;
const articleModel_1 = __importDefault(require("../models/articleModel"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const errors_1 = require("../utils/errors");
exports.getArticles = catchAsync_1.default(async (req, res, next) => {
    const articles = await articleModel_1.default.find({});
    res.status(200).json({
        articles
    });
});
exports.getArticle = catchAsync_1.default(async (req, res, next) => {
    const article = await articleModel_1.default.findById(req.params.id);
    // console.log('article@', article);
    if (!article) {
        throw new errors_1.NotFoundError();
    }
    res.status(200).json({
        article: article
    });
});
exports.createArticle = catchAsync_1.default(async (req, res, next) => {
    // console.log('@@@', req.body);
    // console.log('@@@2', req.user);
    const newArticle = await articleModel_1.default.create({ ...req.body, user: req.user });
    res.status(201).json({
        article: newArticle
    });
});
