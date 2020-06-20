import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

import { NotFoundError, BadRequestError } from '../utils/errors';
import Comment from '../models/commentModel';
// import User from '../models/userModel';
import catchAsync from '../utils/catchAsync';
import Article from '../models/articleModel';

export const getComments = catchAsync( async (req: Request, res: Response) => {
  console.log('req.params - getComments', req.params);
  const comments = await Comment.find({});

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

  const comments = await Comment.find({ article: req.params.articleId });

  res.status(200).json({
    status: 'success',
    results: comments.length,
    allResults: 'allResults',
    data: {
      comments
    }
  })
});

export const getComment = catchAsync( async (req: Request, res: Response) => {
  console.log('commentId - getComment', req.params.commentId);
  const comment = await Comment.findById(req.params.commentId);

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
