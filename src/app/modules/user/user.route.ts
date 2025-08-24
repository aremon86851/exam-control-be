import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { UserController } from './user.controller';
import { UserInvitationController } from './user.invitation.controller';
import validateInvitationData from './user.invitation.middleware';
import { UserInvitationValidation } from './user.invitation.validation';
import { UserValidation } from './user.validation';

const routes = express.Router();

// Regular user routes
routes.post(
  '/',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(UserValidation.createUserZodSchema),
  UserController.createUser
);

routes.get(
  '/',
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.TEACHER
  ),
  UserController.getAllUsers
);

routes.get('/:id', auth(), UserController.getSingleUser);

routes.patch(
  '/:id',
  auth(),
  validateRequest(UserValidation.updateUserZodSchema),
  UserController.updateUser
);

routes.patch(
  '/:id/roles',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(UserValidation.updateUserRolesZodSchema),
  UserController.updateUserRoles
);

routes.delete(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  UserController.deleteUser
);

// User invitation routes
routes.post(
  '/invite',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(UserInvitationValidation.inviteUserSchema),
  validateInvitationData,
  UserInvitationController.inviteUser
);

routes.get(
  '/invite/all',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  UserInvitationController.getInvitedUsers
);

export const UserRoutes = routes;
