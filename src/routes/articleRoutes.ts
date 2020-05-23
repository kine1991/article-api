import express from 'express';

import * as articleController from '../controllers/articleController';

const router = express.Router();

router.route('/')
  .get(articleController.getArticles)
  .post(articleController.createArticle)

router.route('/:id')
  .get(articleController.getArticle)

// router.get('/', (req, res) => {
//   res.send('hi there! articles');
// });

// router.post('/', )

export default router;