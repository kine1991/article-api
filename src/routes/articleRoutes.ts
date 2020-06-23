import express from 'express';

import * as articleController from '../controllers/articleController';
import * as authController from '../controllers/authController';
import commentRouter from '../routes/commentRoutes';


const router = express.Router();

router.use('/:articleId/comments', commentRouter);

router.route('/')
  .get(articleController.getArticles)
  .post(authController.protect, articleController.createArticle)

router.route('/filter').get(articleController.getFilter);
router.route('/count').get(articleController.getCountArticles);
router.route('/category/:categoryName/:numberOfPage?/:countOfPerPage?').get(articleController.getArticlesByCategory);
router.route('/author/:authorName/:numberOfPage?/:countOfPerPage?').get(articleController.getArticlesByAuthor);
router.route('/publisher/:publisherId/:numberOfPage?/:countOfPerPage?').get(articleController.getArticlesByPublisher);
router.route('/like/:articleId').patch(authController.protect, articleController.likesArticle);

router.route('/:id')
  .get(articleController.getArticle)
  .patch(authController.protect, articleController.updateArticle)
  .delete(authController.protect, articleController.deleteArticle)

// router.get('/', (req, res) => {
//   res.send('hi there! articles');
// });

// router.post('/', )

export default router;