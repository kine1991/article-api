"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createArticle = exports.getArticles = void 0;
const articleModel_1 = __importDefault(require("../models/articleModel"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
exports.getArticles = catchAsync_1.default(async (req, res, next) => {
    const articles = await articleModel_1.default.find({});
    res.status(200).json({
        articles
    });
});
exports.createArticle = catchAsync_1.default(async (req, res, next) => {
    // console.log('@@@', req.body);
    const newArticle = await articleModel_1.default.create(req.body);
    res.status(201).json({
        article: newArticle
    });
});
