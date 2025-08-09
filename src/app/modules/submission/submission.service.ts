import type { Submission, Prisma } from "@prisma/client"
import httpStatus from "http-status"
import prisma from "../../../constants/prisma-client"
import ApiError from "../../../errors/ApiError"
import type { ICreateSubmission, IUpdateSubmission, ISubmissionFilters } from "./submission.interface"
import type { IPaginationOptions } from "../../../interfaces/pagination"
import type { IGenericResponse } from "../../../interfaces/common"
import { paginationHelpers } from "../../../helpers/paginationHelper"

const createSubmission = async (payload: ICreateSubmission): Promise<Submission> => {
  // Verify student exists
  const student = await prisma.user.findUnique({
    where: { id: payload.studentId },
  })

  if (!student) {
    throw new ApiError(httpStatus.NOT_FOUND, "Student not found!")
  }

  const result = await prisma.submission.create({
    data: payload,
    include: {
      student: true,
    },
  })

  return result
}

const getAllSubmissions = async (
  filters: ISubmissionFilters,
  paginationOptions: IPaginationOptions,
): Promise<IGenericResponse<Submission[]>> => {
  const { searchTerm, ...filterData } = filters
  const { page, limit, skip, sortBy, sortOrder } = paginationHelpers.calculatePagination(paginationOptions)

  const andConditions = []

  // Filters
  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    })
  }

  const whereConditions: Prisma.SubmissionWhereInput = andConditions.length > 0 ? { AND: andConditions } : {}

  const result = await prisma.submission.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
    include: {
      student: true,
    },
  })

  const total = await prisma.submission.count({
    where: whereConditions,
  })

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  }
}

const getSingleSubmission = async (id: string): Promise<Submission | null> => {
  const result = await prisma.submission.findUnique({
    where: { id },
    include: {
      student: true,
    },
  })

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Submission not found!")
  }

  return result
}

const updateSubmission = async (id: string, payload: IUpdateSubmission): Promise<Submission> => {
  const submission = await prisma.submission.findUnique({
    where: { id },
  })

  if (!submission) {
    throw new ApiError(httpStatus.NOT_FOUND, "Submission not found!")
  }

  const result = await prisma.submission.update({
    where: { id },
    data: payload,
    include: {
      student: true,
    },
  })

  return result
}

const deleteSubmission = async (id: string): Promise<Submission> => {
  const submission = await prisma.submission.findUnique({
    where: { id },
  })

  if (!submission) {
    throw new ApiError(httpStatus.NOT_FOUND, "Submission not found!")
  }

  const result = await prisma.submission.delete({
    where: { id },
  })

  return result
}

export const SubmissionServices = {
  createSubmission,
  getAllSubmissions,
  getSingleSubmission,
  updateSubmission,
  deleteSubmission,
}
