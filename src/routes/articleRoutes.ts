import express from 'express';

import * as articleController from '../controllers/articleController';
import * as authController from '../controllers/authController';


const router = express.Router();

router.route('/')
  .get(articleController.getArticles)
  .post(authController.protect, articleController.createArticle)

router.route('/:id')
  .get(articleController.getArticle)

// router.get('/', (req, res) => {
//   res.send('hi there! articles');
// });

// router.post('/', )

export default router;