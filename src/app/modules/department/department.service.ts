import type { Department, Prisma } from "@prisma/client"
import httpStatus from "http-status"
import prisma from "../../../constants/prisma-client"
import ApiError from "../../../errors/ApiError"
import type { ICreateDepartment, IUpdateDepartment, IDepartmentFilters } from "./department.interface"
import type { IPaginationOptions } from "../../../interfaces/pagination"
import type { IGenericResponse } from "../../../interfaces/common"
import { paginationHelpers } from "../../../helpers/paginationHelper"

const createDepartment = async (payload: ICreateDepartment): Promise<Department> => {
  // Check if department already exists
  const existingDepartment = await prisma.department.findFirst({
    where: { name: payload.name },
  })

  if (existingDepartment) {
    throw new ApiError(httpStatus.CONFLICT, "Department already exists with this name!")
  }

  const result = await prisma.department.create({
    data: payload,
    include: {
      heads: true,
      faculties: true,
      studentInfo: true,
      course: true,
      exam: true,
    },
  })

  return result
}

const getAllDepartments = async (
  filters: IDepartmentFilters,
  paginationOptions: IPaginationOptions,
): Promise<IGenericResponse<Department[]>> => {
  const { searchTerm, ...filterData } = filters
  const { page, limit, skip, sortBy, sortOrder } = paginationHelpers.calculatePagination(paginationOptions)

  const andConditions = []

  // Search term
  if (searchTerm) {
    andConditions.push({
      name: { contains: searchTerm, mode: "insensitive" },
    })
  }

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

  const whereConditions: Prisma.DepartmentWhereInput = andConditions.length > 0 ? { AND: andConditions } : {}

  const result = await prisma.department.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
    include: {
      heads: true,
      faculties: true,
      studentInfo: true,
      course: true,
      exam: true,
    },
  })

  const total = await prisma.department.count({
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

const getSingleDepartment = async (id: string): Promise<Department | null> => {
  const result = await prisma.department.findUnique({
    where: { id },
    include: {
      heads: true,
      faculties: true,
      studentInfo: true,
      course: true,
      exam: true,
    },
  })

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Department not found!")
  }

  return result
}

const updateDepartment = async (id: string, payload: IUpdateDepartment): Promise<Department> => {
  const department = await prisma.department.findUnique({
    where: { id },
  })

  if (!department) {
    throw new ApiError(httpStatus.NOT_FOUND, "Department not found!")
  }

  // Check if name already exists (if updating name)
  if (payload.name && payload.name !== department.name) {
    const existingDepartment = await prisma.department.findFirst({
      where: { name: payload.name, id: { not: id } },
    })

    if (existingDepartment) {
      throw new ApiError(httpStatus.CONFLICT, "Department already exists with this name!")
    }
  }

  const result = await prisma.department.update({
    where: { id },
    data: payload,
    include: {
      heads: true,
      faculties: true,
      studentInfo: true,
      course: true,
      exam: true,
    },
  })

  return result
}

const deleteDepartment = async (id: string): Promise<Department> => {
  const department = await prisma.department.findUnique({
    where: { id },
    include: {
      course: true,
      exam: true,
      studentInfo: true,
    },
  })

  if (!department) {
    throw new ApiError(httpStatus.NOT_FOUND, "Department not found!")
  }

  // Check if department has associated records
  if (department.course.length > 0 || department.exam.length > 0 || department.studentInfo.length > 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Cannot delete department with associated courses, exams, or students!")
  }

  const result = await prisma.department.delete({
    where: { id },
  })

  return result
}

export const DepartmentServices = {
  createDepartment,
  getAllDepartments,
  getSingleDepartment,
  updateDepartment,
  deleteDepartment,
}
