import httpStatus from "http-status"
import type { Request, Response } from "express"
import catchAsync from "../../../shared/catchAsync"
import sendResponse from "../../../shared/sendResponse"
import { SemesterServices } from "./semester.service"
import pick from "../../../shared/pick"
import { semesterFilterableFields } from "./semester.constants"
import { paginationFields } from "../../../constants/pagination"

const createSemester = catchAsync(async (req: Request, res: Response) => {
  const body = req.body.data
  const result = await SemesterServices.createSemester(body)

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Semester created successfully!",
    data: result,
  })
})

const getAllSemesters = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, semesterFilterableFields)
  const paginationOptions = pick(req.query, paginationFields)

  const result = await SemesterServices.getAllSemesters(filters, paginationOptions)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Semesters retrieved successfully!",
    meta: result.meta,
    data: result.data,
  })
})

const getSingleSemester = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await SemesterServices.getSingleSemester(id)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Semester retrieved successfully!",
    data: result,
  })
})

const updateSemester = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const body = req.body.data
  const result = await SemesterServices.updateSemester(id, body)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Semester updated successfully!",
    data: result,
  })
})

const deleteSemester = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await SemesterServices.deleteSemester(id)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Semester deleted successfully!",
    data: result,
  })
})

export const SemesterController = {
  createSemester,
  getAllSemesters,
  getSingleSemester,
  updateSemester,
  deleteSemester,
}
