import express, { Request, Response, NextFunction } from 'express';

import * as authController from '../controllers/authController';
import * as userController from '../controllers/userController';

const router = express.Router();

router.route('/').get(userController.getUsers);
router.route('/sign-in').post(authController.signIn);
router.route('/sign-up').post(authController.signUp);
router.route('/current-user').get(authController.currentUser);
router.route('/:id').get(userController.getUser);

export default router;