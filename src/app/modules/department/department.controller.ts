import httpStatus from "http-status"
import type { Request, Response } from "express"
import catchAsync from "../../../shared/catchAsync"
import sendResponse from "../../../shared/sendResponse"
import { DepartmentServices } from "./department.service"
import pick from "../../../shared/pick"
import { departmentFilterableFields } from "./department.constants"
import { paginationFields } from "../../../constants/pagination"

const createDepartment = catchAsync(async (req: Request, res: Response) => {
  const body = req.body.data
  const result = await DepartmentServices.createDepartment(body)

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Department created successfully!",
    data: result,
  })
})

const getAllDepartments = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, departmentFilterableFields)
  const paginationOptions = pick(req.query, paginationFields)

  const result = await DepartmentServices.getAllDepartments(filters, paginationOptions)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Departments retrieved successfully!",
    meta: result.meta,
    data: result.data,
  })
})

const getSingleDepartment = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await DepartmentServices.getSingleDepartment(id)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Department retrieved successfully!",
    data: result,
  })
})

const updateDepartment = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const body = req.body.data
  const result = await DepartmentServices.updateDepartment(id, body)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Department updated successfully!",
    data: result,
  })
})

const deleteDepartment = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await DepartmentServices.deleteDepartment(id)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Department deleted successfully!",
    data: result,
  })
})

export const DepartmentController = {
  createDepartment,
  getAllDepartments,
  getSingleDepartment,
  updateDepartment,
  deleteDepartment,
}
