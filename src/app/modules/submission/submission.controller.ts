import httpStatus from "http-status"
import type { Request, Response } from "express"
import catchAsync from "../../../shared/catchAsync"
import sendResponse from "../../../shared/sendResponse"
import { SubmissionServices } from "./submission.service"
import pick from "../../../shared/pick"
import { submissionFilterableFields } from "./submission.constants"
import { paginationFields } from "../../../constants/pagination"

const createSubmission = catchAsync(async (req: Request, res: Response) => {
  const body = req.body.data
  const result = await SubmissionServices.createSubmission(body)

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Submission created successfully!",
    data: result,
  })
})

const getAllSubmissions = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, submissionFilterableFields)
  const paginationOptions = pick(req.query, paginationFields)

  const result = await SubmissionServices.getAllSubmissions(filters, paginationOptions)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Submissions retrieved successfully!",
    meta: result.meta,
    data: result.data,
  })
})

const getSingleSubmission = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await SubmissionServices.getSingleSubmission(id)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Submission retrieved successfully!",
    data: result,
  })
})

const updateSubmission = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const body = req.body.data
  const result = await SubmissionServices.updateSubmission(id, body)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Submission updated successfully!",
    data: result,
  })
})

const deleteSubmission = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await SubmissionServices.deleteSubmission(id)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Submission deleted successfully!",
    data: result,
  })
})

export const SubmissionController = {
  createSubmission,
  getAllSubmissions,
  getSingleSubmission,
  updateSubmission,
  deleteSubmission,
}
