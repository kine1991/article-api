import { Request, Response, NextFunction, query } from 'express';
import Article from '../models/articleModel';
import catchAsync from '../utils/catchAsync';
import { NotFoundError, BadRequestError } from '../utils/errors';

export const getArticles = catchAsync(async (req: Request, res: Response) => {
  // 1) Filtering
  const queryObj = { ...req.query };
  const excludedFields = ['page', 'sort', 'limit', 'fields'];
  excludedFields.forEach(el => delete queryObj[el]);

  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
  // console.log('queryStr', queryStr);

  let query = Article.find(JSON.parse(queryStr)).populate('publisher');

  // 2) Sorting
  if (req.query.sort) {
    const sortBy = (req.query.sort as string).split(',').join(' ');
    // console.log('sortBy', sortBy);
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // 3) Field limit limiting
  if (req.query.fields) {
    // console.log('req.query.fields', req.query.fields);
    const fields = (req.query.fields as string).split(',').join(' ');
    query = query.select(`-__v ${fields}`);
  } else {
    query = query.select('-__v');
  }

  // Pagination
  const page = (<any>req.query.page) * 1 || 1;
  const limit = (<any>req.query.limit) * 1 || 20;
  const skip = (page - 1) * limit;
  query = query.skip(skip).limit(limit);
  const numArticles = await Article.countDocuments(JSON.parse(queryStr));
  if (req.query.page) {
    if (skip > numArticles) throw new BadRequestError('This page does not exist', 404);
  }

  // 
  const articles = await query;
  // const articles = await Article.find(req.query).select('-content');

  res.status(200).json({
    status: 'success',
    results: articles.length,
    allResults: numArticles,
    data: {
      articles
    }
  });
});

export const getArticlesByCategory = catchAsync(async (req: Request, res: Response) => {
  const { categoryName, numberOfPage, countOfPerPage } = req.params;
  
  const regexCategoryName = new RegExp(['^', categoryName, '$'].join(''), 'i')
  let query = Article.find({ category: regexCategoryName }).select('-content -__v').populate('publisher');

  // Pagination
  const page = (<any>numberOfPage) * 1 || 1;
  const limit = (<any>countOfPerPage * 1) || 20;
  // const limit = 20;
  let skip = (page - 1) * limit;
  query = query.skip(skip).limit(limit);
  const numArticles = await Article.countDocuments({ category: regexCategoryName });;
  if (req.query.page) {
    if (skip > numArticles) throw new BadRequestError('This page does not exist', 404);
  }

  const articles = await query;
  res.status(200).json({
    status: 'success',
    results: articles.length,
    allResults: numArticles,
    data: {
      articles
    }
  })
});

export const getArticlesByAuthor = catchAsync(async (req: Request, res: Response) => {
  const { authorName, numberOfPage, countOfPerPage } = req.params;
  
  const regexAuthorName = new RegExp(['^', authorName, '$'].join(''), 'i')
  let query = Article.find({ author: regexAuthorName }).select('-content -__v').populate('publisher');

  // Pagination
  const page = (<any>numberOfPage) * 1 || 1;
  const limit = (<any>countOfPerPage * 1) || 20;
  // const limit = 20;
  let skip = (page - 1) * limit;
  query = query.skip(skip).limit(limit);
  const numArticles = await Article.countDocuments({ author: regexAuthorName });;
  if (req.query.page) {
    if (skip > numArticles) throw new BadRequestError('This page does not exist', 404);
  }

  const articles = await query;
  res.status(200).json({
    status: 'success',
    results: articles.length,
    allResults: numArticles,
    data: {
      articles
    }
  })
});

export const getArticlesByPublisher = catchAsync(async (req: Request, res: Response) => {
  const { publisherId, numberOfPage, countOfPerPage } = req.params;
  
  let query = Article.find({ publisher: publisherId }).select('-content -__v').populate('publisher');

  // Pagination
  const page = (<any>numberOfPage) * 1 || 1;
  const limit = (<any>countOfPerPage * 1) || 20;
  // const limit = 20;
  let skip = (page - 1) * limit;
  query = query.skip(skip).limit(limit);
  const numArticles = await Article.countDocuments({ publisher: publisherId });;
  if (req.query.page) {
    if (skip > numArticles) throw new BadRequestError('This page does not exist', 404);
  }

  const articles = await query;
  res.status(200).json({
    status: 'success',
    results: articles.length,
    allResults: numArticles,
    data: {
      articles
    }
  })
});

export const getArticle = catchAsync(async (req: Request, res: Response) => {
  const article = await Article.findById(req.params.id).populate('publisher');
  // console.log('article@', article);

  if (!article) {
    throw new NotFoundError();
  }

  res.status(200).json({
    status: 'success',
    data: {
      article
    }
  });
});

export const createArticle = catchAsync(async (req: Request, res: Response) => {
  console.log('req.user@', req.user)
  const newArticle = await Article.create({ ...req.body, publisher: req.user?._id });

  res.status(201).json({
    status: 'success',
    data: {
      article: newArticle
    }
  });
});

export const updateArticle = catchAsync(async (req: Request, res: Response) => {
  const article = await Article.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
    new: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      article
    }
  })
});

export const deleteArticle = catchAsync(async (req: Request, res: Response) => {
  await Article.findByIdAndRemove(req.params.id);

  res.status(204).json({
    status: 'success',
    data: null
  });
})

export const getCountArticles = catchAsync(async (req: Request, res: Response) => {
  const count = await Article.countDocuments({});

  res.status(200).json({
    count
  });
});


export const getFilter = catchAsync(async (req: Request, res: Response) => {
  const categories = await Article.distinct('category');
  const authors = await Article.distinct('author');
  const priorities = await Article.distinct('priority');

  res.status(200).json({
    status: 'success',
    data: {
      categories,
      authors,
      priorities
    }
  });
});