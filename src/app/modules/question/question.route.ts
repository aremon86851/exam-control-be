import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { QuestionController } from './question.controller';
import { QuestionValidation } from './question.validation';

const routes = express.Router();

routes.post(
  '/',
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.TEACHER
  ),
  validateRequest(QuestionValidation.createQuestionZodSchema),
  QuestionController.createQuestion
);

routes.get('/', auth(), QuestionController.getAllQuestions);
routes.get('/instructor', auth(), QuestionController.getAllQuestions);

routes.get('/:id', auth(), QuestionController.getSingleQuestion);

routes.patch(
  '/:id',
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.TEACHER
  ),
  validateRequest(QuestionValidation.updateQuestionZodSchema),
  QuestionController.updateQuestion
);

routes.delete(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  QuestionController.deleteQuestion
);

export const QuestionRoutes = routes;
