import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { AuthController } from './auth.controller';
import { AuthValidation } from './auth.validation';

const routes = express.Router();

// Public routes
routes.post(
  '/register',
  validateRequest(AuthValidation.registerUserZodSchema),
  AuthController.registerUser
);
routes.post(
  '/login',
  validateRequest(AuthValidation.loginUserZodSchema),
  AuthController.loginUser
);
routes.post(
  '/refresh-token',
  validateRequest(AuthValidation.refreshTokenZodSchema),
  AuthController.refreshToken
);

// Protected routes
routes.post(
  '/change-password',
  auth(),
  validateRequest(AuthValidation.changePasswordZodSchema),
  AuthController.changePassword
);
routes.get('/profile', auth(), AuthController.getProfile);
routes.get('/test', (req, res) => {
  res.send({ message: 'Thiss is test message' });
});
routes.post('/logout', auth(), AuthController.logout);

export const AuthUser = routes;
