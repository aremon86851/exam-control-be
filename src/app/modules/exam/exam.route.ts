import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { ExamController } from './exam.controller';
import { StudentExamController } from './exam.student.controller';
import { ExamValidation } from './exam.validation';

const routes = express.Router();

// Regular exam routes (admin, faculty)
routes.post(
  '/',
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.TEACHER
  ),
  validateRequest(ExamValidation.createExamZodSchema),
  ExamController.createExam
);

routes.get(
  '/',
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.TEACHER
  ),
  ExamController.getAllExams
);

routes.get('/:id', auth(), ExamController.getSingleExam);

routes.patch(
  '/:id',
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.TEACHER
  ),
  validateRequest(ExamValidation.updateExamZodSchema),
  ExamController.updateExam
);

routes.delete(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  ExamController.deleteExam
);

// Student-specific exam routes
routes.get(
  '/student/my-exams',
  auth(ENUM_USER_ROLE.STUDENT),
  StudentExamController.getStudentExams
);

export const ExamRoutes = routes;
