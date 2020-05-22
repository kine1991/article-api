import { Request, Response, NextFunction } from 'express';
import Article from '../models/articleModel';
import catchAsync from '../utils/catchAsync';

export const getArticles = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const articles = await Article.find({});

  res.status(200).json({
    articles
  });
});

export const createArticle = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // console.log('@@@', req.body);
  const newArticle = await Article.create(req.body);

  res.status(201).json({
    article: newArticle
  });
});