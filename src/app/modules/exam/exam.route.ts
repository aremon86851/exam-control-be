import express from "express"
import { ENUM_USER_ROLE } from "../../../enums/user"
import auth from "../../middlewares/auth"
import validateRequest from "../../middlewares/validateRequest"
import { ExamController } from "./exam.controller"
import { ExamValidation } from "./exam.validation"

const routes = express.Router()

routes.post(
  "/",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.TEACHER,ENUM_USER_ROLE.STUDENT),
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
