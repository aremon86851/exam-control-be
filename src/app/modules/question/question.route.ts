import express from "express"
import { QuestionController } from "./question.controller"
import validateRequest from "../../middlewares/validateRequest"
import { QuestionValidation } from "./question.validation"
import auth from "../../middlewares/auth"
import { ENUM_USER_ROLE } from "../../../enums/user"

const routes = express.Router()

routes.post(
  "/",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.TEACHER),
  validateRequest(QuestionValidation.createQuestionZodSchema),
  QuestionController.createQuestion,
)

routes.get("/", auth(), QuestionController.getAllQuestions)

routes.get("/:id", auth(), QuestionController.getSingleQuestion)

routes.patch(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.TEACHER),
  validateRequest(QuestionValidation.updateQuestionZodSchema),
  QuestionController.updateQuestion,
)

routes.delete("/:id", auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN), QuestionController.deleteQuestion)

export const QuestionRoutes = routes
