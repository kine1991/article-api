import express from 'express';

import * as commentController from '../controllers/commentController';
import * as authController from '../controllers/authController';

const router = express.Router();

router.route('/').get(commentController.getComments);

router.route('/:articleId')
  .get(commentController.getComment)
  .post(authController.protect, commentController.createComment);


export default router;