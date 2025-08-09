import express from "express"
import { UserController } from "./user.controller"
import validateRequest from "../../middlewares/validateRequest"
import { UserValidation } from "./user.validation"
import auth from "../../middlewares/auth"
import { ENUM_USER_ROLE } from "../../../enums/user"

const routes = express.Router()

routes.post(
  "/",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(UserValidation.createUserZodSchema),
  UserController.createUser,
)

routes.get(
  "/",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.TEACHER),
  UserController.getAllUsers,
)

routes.get("/:id", auth(), UserController.getSingleUser)

routes.patch("/:id", auth(), validateRequest(UserValidation.updateUserZodSchema), UserController.updateUser)

routes.patch(
  "/:id/roles",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(UserValidation.updateUserRolesZodSchema),
  UserController.updateUserRoles,
)

routes.delete("/:id", auth(ENUM_USER_ROLE.SUPER_ADMIN), UserController.deleteUser)

export const UserRoutes = routes
