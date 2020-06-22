import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

import { NotFoundError, BadRequestError } from '../utils/errors';
import Comment from '../models/commentModel';
// import User from '../models/userModel';
import catchAsync from '../utils/catchAsync';
import Article from '../models/articleModel';

export const getComments = catchAsync( async (req: Request, res: Response) => {
  console.log('req.params - getComments', req.params);
  const comments = await Comment.find({})
    .populate({ path: 'user', select: 'role name email photo' });

  res.status(200).json({
    status: 'success',
    results: comments.length,
    allResults: 'allResults',
    data: {
      comments
    }
  })
});

export const getCommentsByArticle = catchAsync( async (req: Request, res: Response) => {
  if(!req.params.articleId) throw new BadRequestError('Routes articleId is undefined', 404);
  if (!mongoose.Types.ObjectId.isValid(req.params.articleId)) throw new BadRequestError(`Routes articleId: ${req.params.articleId} is incorrect`, 404);
  const isExistArticle = await Article.exists({ _id: req.params.articleId});
  if(!isExistArticle) throw new BadRequestError('Article with routes articleId do not exists', 404);

  // 1) Filtering
  const queryObj: any = { ...req.query, article: req.params.articleId };
  const excludedFields = ['page', 'sort', 'limit', 'fields'];
  excludedFields.forEach(el => delete queryObj[el]);

  // console.log('queryObj', queryObj);
  let query = Comment.find(queryObj).populate({ path: 'user', select: 'role name email photo' });

  // Sorting
  if (req.query.sort) {
    const sortBy = (req.query.sort as string).split(',').join(' ');
    // console.log('sortBy', sortBy);
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // Pagination
  const page = (req.query.page as any) * 1 || 1;
  const limit = (req.query.limit as any) * 1 || 20;
  const skip = (page - 1) * limit;
  query = query.skip(skip).limit(limit);

  const numComments = await Comment.countDocuments(queryObj);
  if(req.query.page) {
    if(skip > numComments) throw new BadRequestError('This page of comments does not exist', 404);
  }

  const comments = await query;

  res.status(200).json({
    status: 'success',
    results: comments.length,
    allResults: numComments,
    data: {
      comments
    }
  })
});

export const getComment = catchAsync( async (req: Request, res: Response) => {
  console.log('commentId - getComment', req.params.commentId);
  const comment = await Comment.findById(req.params.commentId)
    .populate({ path: 'user', select: 'role name email photo' });;

  res.status(200).json({
    status: 'success',
    data: {
      comment
    }
  })
});

export const updateComment = catchAsync( async (req: Request, res: Response) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.commentId)) throw new BadRequestError(`Routes commentId: ${req.params.commentId} is incorrect`, 404);
  const isExistComment = await Comment.exists({ _id: req.params.commentId});
  if(!isExistComment) throw new BadRequestError('Comment with routes commentId do not exists', 404);

  const comment = await Comment.findById(req.params.commentId)
    .populate({ path: 'user', select: 'role name email photo' });

  // if comment do not belong to user
  if(comment?.user._id.toString() !== req.user?._id.toString()) throw new BadRequestError('You do not have permission to perform this action', 403);

  comment!.comment = req.body.comment;
  await comment?.save();

  res.status(201).json({
    status: 'success',
    data: {
      comment
    }
  });
});

export const deleteComment = catchAsync( async (req: Request, res: Response) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.commentId)) throw new BadRequestError(`Routes commentId: ${req.params.commentId} is incorrect`, 404);
  const isExistComment = await Comment.exists({ _id: req.params.commentId});
  if(!isExistComment) throw new BadRequestError('Comment with routes commentId do not exists', 404);

  const comment = await Comment.findById(req.params.commentId)
    .populate({ path: 'user', select: 'role name email photo' });

  // if comment do not exists
  if(!comment) throw new BadRequestError('This comment do not exists', 404);
  // if comment do not belong to user
  if(comment?.user._id.toString() !== req.user?._id.toString()) throw new BadRequestError('You do not have permission to perform this action', 403);
  await Comment.findByIdAndDelete(req.params.commentId);

  res.status(204).json({
    status: 'success'
  });
});

export const createComment = catchAsync( async (req: Request, res: Response) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.articleId)) throw new BadRequestError(`Routes articleId: ${req.params.articleId} is incorrect`, 404);
  const isExistArticle = await Article.exists({ _id: req.params.articleId});
  if(!isExistArticle) throw new BadRequestError('Article with routes articleId do not exists', 404);

  const comment = await Comment.create({
    comment: req.body.comment,
    user: req.user?._id,
    article: req.params.articleId
  });
  res.status(201).json({
    status: 'success',
    data: {
      comment
    }
  });
});
