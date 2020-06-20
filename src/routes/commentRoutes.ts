import express from 'express';

import * as commentController from '../controllers/commentController';
import * as authController from '../controllers/authController';

const router = express.Router({ mergeParams: true });

router.route('/')
  .get(commentController.getComments)
  .post(authController.protect, commentController.createComment);
// /:articleId/comments/:commentId
router.route('/:commentId')
  .get(commentController.getComment)
  .patch(commentController.updateComment)
  .delete(commentController.deleteComment)

// router.route('/create-article/:articleId')
//   .post(authController.protect, commentController.createComment);

// router.route('/edit-article/:articleId')
//   .patch()

export default router;