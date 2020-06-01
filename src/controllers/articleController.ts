import { Request, Response, NextFunction } from 'express';
import Article from '../models/articleModel';
import catchAsync from '../utils/catchAsync';
import { NotFoundError } from '../utils/errors';

export const getArticles = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  console.log('query', req.query);
  // console.log('author', req.query.author);
  // console.log('author2', req.query.author2);
  const articles = await Article.find(req.query);

  res.status(200).json({
    status: "success",
    results: articles.length,
    data: {
      articles
    }
  });
});

export const getArticle = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const article = await Article.findById(req.params.id);
  // console.log('article@', article);

  if (!article) {
    throw new NotFoundError();
  }

  res.status(200).json({
    status: "success",
    data: {
      article
    }
  });
});

export const createArticle = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // console.log('@@@', req.body);
  // console.log('@@@2', req.user);
  const newArticle = await Article.create({ ...req.body, user: req.user });

  res.status(201).json({
    status: "success",
    data: {
      article: newArticle
    }
  });
});


export const getFilter = catchAsync(async (req: Request, res: Response) => {
  const category = await Article.distinct('category');
  const author = await Article.distinct('author');
  const priority = await Article.distinct('priority');

  res.status(200).json({
    status: 'success',
    data: {
      category,
      author,
      priority
    }
  });
});