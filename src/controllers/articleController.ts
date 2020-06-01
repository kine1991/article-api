import { Request, Response, NextFunction } from 'express';
import Article from '../models/articleModel';
import catchAsync from '../utils/catchAsync';
import { NotFoundError, BadRequestError } from '../utils/errors';

export const getArticles = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // 1) Filtering
  const queryObj = { ...req.query };
  const excludedFields = ['page', 'sort', 'limit', 'fields'];
  excludedFields.forEach(el => delete queryObj[el]);

  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
  console.log('queryStr', queryStr);

  let query = Article.find(JSON.parse(queryStr));

  // 2) Sorting
  if (req.query.sort) {
    const sortBy = (req.query.sort as string).split(',').join(' ');
    // console.log('sortBy', sortBy);
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // 3) Field limiting limiting
  if (req.query.fields) {
    const fields = (req.query.fields as string).split(',').join(' ');
  } else {
    query = query.select('-__v -content');
  }

  // Pagination
  const page = (<any>req.query.page) * 1 || 1;
  const limit = (<any>req.query.limit) * 1 || 20;
  const skip = (page - 1) * limit;
  query = query.skip(skip).limit(limit);
  if (req.query.page) {
    const numArticles = await Article.countDocuments();
    if (skip > numArticles) throw new BadRequestError('This page does not exist', 404);
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