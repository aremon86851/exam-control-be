import httpStatus from "http-status"
import type { Request, Response } from "express"
import catchAsync from "../../../shared/catchAsync"
import sendResponse from "../../../shared/sendResponse"
import { UserServices } from "./user.service"
import pick from "../../../shared/pick"
import { userFilterableFields } from "./user.constants"
import { paginationFields } from "../../../constants/pagination"

const createUser = catchAsync(async (req: Request, res: Response) => {
  const body = req.body.data
  const result = await UserServices.createUser(body)

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "User created successfully!",
    data: result,
  })
})

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, userFilterableFields)
  const paginationOptions = pick(req.query, paginationFields)

  const result = await UserServices.getAllUsers(filters, paginationOptions)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users retrieved successfully!",
    meta: result.meta,
    data: result.data,
  })
})

const getSingleUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await UserServices.getSingleUser(id)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User retrieved successfully!",
    data: result,
  })
})

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const body = req.body.data
  const result = await UserServices.updateUser(id, body)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User updated successfully!",
    data: result,
  })
})

const updateUserRoles = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const body = req.body.data
  const result = await UserServices.updateUserRoles(id, body)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User roles updated successfully!",
    data: result,
  })
})

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await UserServices.deleteUser(id)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User deleted successfully!",
    data: result,
  })
})

export const UserController = {
  createUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  updateUserRoles,
  deleteUser,
}
