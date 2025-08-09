import express from "express"
import { CourseController } from "./course.controller"
import validateRequest from "../../middlewares/validateRequest"
import { CourseValidation } from "./course.validation"
import auth from "../../middlewares/auth"
import { ENUM_USER_ROLE } from "../../../enums/user"

const routes = express.Router()

routes.post(
  "/",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.TEACHER),
  validateRequest(CourseValidation.createCourseZodSchema),
  CourseController.createCourse,
)

routes.get("/", auth(), CourseController.getAllCourses)

routes.get("/:id", auth(), CourseController.getSingleCourse)

routes.patch(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.TEACHER),
  validateRequest(CourseValidation.updateCourseZodSchema),
  CourseController.updateCourse,
)

routes.delete("/:id", auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN), CourseController.deleteCourse)

export const CourseRoutes = routes
