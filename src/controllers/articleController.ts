import { Request, Response, NextFunction } from 'express';
import Article from '../models/articleModel';
import catchAsync from '../utils/catchAsync';
import { NotFoundError } from '../utils/errors';

export const getArticles = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const articles = await Article.find({});

  res.status(200).json({
    articles
  });
});

export const getArticle = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const article = await Article.findById(req.params.id);
  // console.log('article@', article);

  if (!article) {
    throw new NotFoundError();
  }

  res.status(200).json({
    article: article
  });
});

export const createArticle = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // console.log('@@@', req.body);
  const newArticle = await Article.create(req.body);

  res.status(201).json({
    article: newArticle
  });
});