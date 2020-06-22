import express from 'express';

import * as commentController from '../controllers/commentController';
import * as authController from '../controllers/authController';

const router = express.Router({ mergeParams: true });

router.route('/')
  .get(commentController.getCommentsByArticle) // work for only: - /articles/:articleId/comments
  .post(authController.protect, commentController.createComment); // work only: /articles/:articleId/comments

router.route('/all').get(commentController.getComments);

router.route('/:commentId')
  .get(commentController.getComment) // work for both: - /comments/:commentId, - /articles/:articleId/comments/:commentId
  .patch(authController.protect, commentController.updateComment) // work only: /articles/:articleId/comments/:commentId
  .delete(authController.protect, commentController.deleteComment) // work only: /articles/:articleId/comments/:commentId

export default router;