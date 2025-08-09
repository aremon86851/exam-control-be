import express from "express"
import { ExamController } from "./exam.controller"
import validateRequest from "../../middlewares/validateRequest"
import { ExamValidation } from "./exam.validation"
import auth from "../../middlewares/auth"
import { ENUM_USER_ROLE } from "../../../enums/user"

const routes = express.Router()

routes.post(
  "/",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.TEACHER),
  validateRequest(ExamValidation.createExamZodSchema),
  ExamController.createExam,
)

routes.get("/", auth(), ExamController.getAllExams)

routes.get("/:id", auth(), ExamController.getSingleExam)

routes.patch(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.TEACHER),
  validateRequest(ExamValidation.updateExamZodSchema),
  ExamController.updateExam,
)

routes.delete("/:id", auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN), ExamController.deleteExam)

export const ExamRoutes = routes
