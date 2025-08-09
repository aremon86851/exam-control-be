import httpStatus from "http-status"
import type { Request, Response } from "express"
import catchAsync from "../../../shared/catchAsync"
import sendResponse from "../../../shared/sendResponse"
import { QuestionServices } from "./question.service"
import pick from "../../../shared/pick"
import { questionFilterableFields } from "./question.constants"
import { paginationFields } from "../../../constants/pagination"

const createQuestion = catchAsync(async (req: Request, res: Response) => {
  const body = req.body.data
  const result = await QuestionServices.createQuestion(body)

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Question created successfully!",
    data: result,
  })
})

const getAllQuestions = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, questionFilterableFields)
  const paginationOptions = pick(req.query, paginationFields)

  const result = await QuestionServices.getAllQuestions(filters, paginationOptions)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Questions retrieved successfully!",
    meta: result.meta,
    data: result.data,
  })
})

const getSingleQuestion = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await QuestionServices.getSingleQuestion(id)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Question retrieved successfully!",
    data: result,
  })
})

const updateQuestion = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const body = req.body.data
  const result = await QuestionServices.updateQuestion(id, body)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Question updated successfully!",
    data: result,
  })
})

const deleteQuestion = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await QuestionServices.deleteQuestion(id)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Question deleted successfully!",
    data: result,
  })
})

export const QuestionController = {
  createQuestion,
  getAllQuestions,
  getSingleQuestion,
  updateQuestion,
  deleteQuestion,
}
