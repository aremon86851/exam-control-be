import express from "express"
import { SubmissionController } from "./submission.controller"
import validateRequest from "../../middlewares/validateRequest"
import { SubmissionValidation } from "./submission.validation"
import auth from "../../middlewares/auth"
import { ENUM_USER_ROLE } from "../../../enums/user"

const routes = express.Router()

routes.post(
  "/",
  auth(ENUM_USER_ROLE.STUDENT),
  validateRequest(SubmissionValidation.createSubmissionZodSchema),
  SubmissionController.createSubmission,
)

routes.get(
  "/",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.TEACHER),
  SubmissionController.getAllSubmissions,
)

routes.get("/:id", auth(), SubmissionController.getSingleSubmission)

routes.patch(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.TEACHER),
  validateRequest(SubmissionValidation.updateSubmissionZodSchema),
  SubmissionController.updateSubmission,
)

routes.delete("/:id", auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN), SubmissionController.deleteSubmission)

export const SubmissionRoutes = routes
