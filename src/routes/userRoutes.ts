import express, { Request, Response, NextFunction } from 'express';

import * as authController from '../controllers/authController';
import * as userController from '../controllers/userController';
import currentUserMiddleware from '../utils/current-user';

const router = express.Router();

router.route('/').get(userController.getUsers);
router.route('/sign-in').post(authController.signIn);
router.route('/sign-up').post(authController.signUp);
router.route('/update-me').patch(
  authController.protect,
  userController.uploadUserPhoto,
  userController.updateMe
);
router.route('/current-user').get(currentUserMiddleware, authController.currentUser);
router.route('/check-auth').get(authController.checkAuth);
router.route('/logout').get(authController.logout);
router.route('/:id').get(userController.getUser);

export default router;