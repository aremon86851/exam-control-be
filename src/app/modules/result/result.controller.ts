import httpStatus from "http-status"
import type { Request, Response } from "express"
import catchAsync from "../../../shared/catchAsync"
import sendResponse from "../../../shared/sendResponse"
import { ResultServices } from "./result.service"
import pick from "../../../shared/pick"
import { resultFilterableFields } from "./result.constants"
import { paginationFields } from "../../../constants/pagination"

const createResult = catchAsync(async (req: Request, res: Response) => {
  const body = req.body.data
  const result = await ResultServices.createResult(body)

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Result created successfully!",
    data: result,
  })
})

const getAllResults = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, resultFilterableFields)
  const paginationOptions = pick(req.query, paginationFields)

  const result = await ResultServices.getAllResults(filters, paginationOptions)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Results retrieved successfully!",
    meta: result.meta,
    data: result.data,
  })
})

const getSingleResult = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await ResultServices.getSingleResult(id)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Result retrieved successfully!",
    data: result,
  })
})

const updateResult = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const body = req.body.data
  const result = await ResultServices.updateResult(id, body)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Result updated successfully!",
    data: result,
  })
})

const deleteResult = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await ResultServices.deleteResult(id)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Result deleted successfully!",
    data: result,
  })
})

export const ResultController = {
  createResult,
  getAllResults,
  getSingleResult,
  updateResult,
  deleteResult,
}
