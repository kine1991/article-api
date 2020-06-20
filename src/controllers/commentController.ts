import { Request, Response, NextFunction } from 'express';

import { NotFoundError, BadRequestError } from '../utils/errors';
import Comment from '../models/commentModel';
// import User from '../models/userModel';
import catchAsync from '../utils/catchAsync';

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
  const comment = await Comment.findById(req.params.commentId)
    .populate({ path: 'user', select: 'role name email photo' });

  // if comment do not exists
  if(!comment) throw new BadRequestError('This comment do not exists', 404);
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
  // console.log('articleId - createComment', req.params.articleId );
  // console.log('user - createComment', req.user );

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

// export const setArticleId = (req: Request, res: Response, next: NextFunction) => {
//   console.log('articleId - setArticleId', req.params.articleId);
//   req.body.articleId = req.params.articleId;
//   next();
// }