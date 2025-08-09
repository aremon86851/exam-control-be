import express from "express"
import { ENUM_USER_ROLE } from "../../../enums/user"
import auth from "../../middlewares/auth"
import validateRequest from "../../middlewares/validateRequest"
import { SemesterController } from "./semester.controller"
import { SemesterValidation } from "./semester.validation"

const routes = express.Router()

routes.post(
  "/",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(SemesterValidation.createSemesterZodSchema),
  SemesterController.createSemester,
)

routes.get("/", auth(), SemesterController.getAllSemesters)

routes.get("/:id", auth(), SemesterController.getSingleSemester)

routes.patch(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(SemesterValidation.updateSemesterZodSchema),
  SemesterController.updateSemester,
)

routes.delete("/:id", auth(ENUM_USER_ROLE.SUPER_ADMIN), SemesterController.deleteSemester)

export const SemesterRoutes = routes
