import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { SubmissionController } from './submission.controller';
import { SubmissionValidation } from './submission.validation';

const routes = express.Router();

routes.post(
  '/',
  auth(ENUM_USER_ROLE.STUDENT, ENUM_USER_ROLE.ADMIN),
  validateRequest(SubmissionValidation.createSubmissionZodSchema),
  SubmissionController.createSubmission
);

routes.get(
  '/',
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.TEACHER
  ),
  SubmissionController.getAllSubmissions
);

routes.get('/:id', auth(), SubmissionController.getSingleSubmission);

routes.patch(
  '/:id',
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.TEACHER
  ),
  validateRequest(SubmissionValidation.updateSubmissionZodSchema),
  SubmissionController.updateSubmission
);

routes.delete(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  SubmissionController.deleteSubmission
);

// Add these routes for exam/student specific queries
routes.get(
  '/exam/:examId/student/:studentId',
  auth(), // Add role checks if needed
  SubmissionController.getByExamAndStudent
);

routes.get(
  '/student/:id',
  auth(ENUM_USER_ROLE.STUDENT, ENUM_USER_ROLE.ADMIN), // Add role checks if needed
  SubmissionController.getByStudent
);

export const SubmissionRoutes = routes;
