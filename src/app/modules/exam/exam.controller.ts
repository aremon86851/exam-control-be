import httpStatus from "http-status"
import type { Request, Response } from "express"
import catchAsync from "../../../shared/catchAsync"
import sendResponse from "../../../shared/sendResponse"
import { ExamServices } from "./exam.service"
import pick from "../../../shared/pick"
import { examFilterableFields } from "./exam.constants"
import { paginationFields } from "../../../constants/pagination"

const createExam = catchAsync(async (req: Request, res: Response) => {
  const body = req.body.data
  const result = await ExamServices.createExam(body)

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Exam created successfully!",
    data: result,
  })
})

const getAllExams = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, examFilterableFields)
  const paginationOptions = pick(req.query, paginationFields)

  const result = await ExamServices.getAllExams(filters, paginationOptions)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Exams retrieved successfully!",
    meta: result.meta,
    data: result.data,
  })
})

const getSingleExam = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await ExamServices.getSingleExam(id)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Exam retrieved successfully!",
    data: result,
  })
})

const updateExam = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const body = req.body.data
  const result = await ExamServices.updateExam(id, body)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Exam updated successfully!",
    data: result,
  })
})

const deleteExam = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await ExamServices.deleteExam(id)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Exam deleted successfully!",
    data: result,
  })
})

export const ExamController = {
  createExam,
  getAllExams,
  getSingleExam,
  updateExam,
  deleteExam,
}
