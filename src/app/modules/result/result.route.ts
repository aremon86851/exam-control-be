import express from "express"
import { ResultController } from "./result.controller"
import validateRequest from "../../middlewares/validateRequest"
import { ResultValidation } from "./result.validation"
import auth from "../../middlewares/auth"
import { ENUM_USER_ROLE } from "../../../enums/user"

const routes = express.Router()

routes.post(
  "/",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.TEACHER),
  validateRequest(ResultValidation.createResultZodSchema),
  ResultController.createResult,
)

routes.get("/", auth(), ResultController.getAllResults)

routes.get("/:id", auth(), ResultController.getSingleResult)

routes.patch(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.TEACHER),
  validateRequest(ResultValidation.updateResultZodSchema),
  ResultController.updateResult,
)

routes.delete("/:id", auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN), ResultController.deleteResult)

export const ResultRoutes = routes
