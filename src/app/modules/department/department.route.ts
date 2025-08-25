import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { DepartmentController } from './department.controller';
import { DepartmentValidation } from './department.validation';

const routes = express.Router();

routes.post(
  '/',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(DepartmentValidation.createDepartmentZodSchema),
  DepartmentController.createDepartment
);

routes.get(
  '/',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  DepartmentController.getAllDepartments
);

routes.get('/:id', auth(), DepartmentController.getSingleDepartment);

routes.patch(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(DepartmentValidation.updateDepartmentZodSchema),
  DepartmentController.updateDepartment
);

routes.delete(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  DepartmentController.deleteDepartment
);

export const DepartmentRoutes = routes;
