import httpStatus from "http-status"
import type { Request, Response } from "express"
import catchAsync from "../../../shared/catchAsync"
import sendResponse from "../../../shared/sendResponse"
import { CourseServices } from "./course.service"
import pick from "../../../shared/pick"
import { courseFilterableFields } from "./course.constants"
import { paginationFields } from "../../../constants/pagination"

const createCourse = catchAsync(async (req: Request, res: Response) => {
  const body = req.body.data
  const result = await CourseServices.createCourse(body)

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Course created successfully!",
    data: result,
  })
})

const getAllCourses = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, courseFilterableFields)
  const paginationOptions = pick(req.query, paginationFields)

  const result = await CourseServices.getAllCourses(filters, paginationOptions)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Courses retrieved successfully!",
    meta: result.meta,
    data: result.data,
  })
})

const getSingleCourse = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await CourseServices.getSingleCourse(id)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Course retrieved successfully!",
    data: result,
  })
})

const updateCourse = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const body = req.body.data
  const result = await CourseServices.updateCourse(id, body)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Course updated successfully!",
    data: result,
  })
})

const deleteCourse = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await CourseServices.deleteCourse(id)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Course deleted successfully!",
    data: result,
  })
})

export const CourseController = {
  createCourse,
  getAllCourses,
  getSingleCourse,
  updateCourse,
  deleteCourse,
}
