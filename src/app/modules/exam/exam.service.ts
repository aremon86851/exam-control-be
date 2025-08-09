import type { Exam, Prisma } from "@prisma/client"
import httpStatus from "http-status"
import prisma from "../../../constants/prisma-client"
import ApiError from "../../../errors/ApiError"
import type { ICreateExam, IUpdateExam, IExamFilters } from "./exam.interface"
import type { IPaginationOptions } from "../../../interfaces/pagination"
import type { IGenericResponse } from "../../../interfaces/common"
import { paginationHelpers } from "../../../helpers/paginationHelper"

const createExam = async (payload: ICreateExam): Promise<Exam> => {
  // Verify all related entities exist
  const [department, semester, course, faculty] = await Promise.all([
    prisma.department.findUnique({ where: { id: payload.departmentId } }),
    prisma.semester.findUnique({ where: { id: payload.semesterId } }),
    prisma.course.findUnique({ where: { id: payload.courseId } }),
    prisma.user.findUnique({ where: { id: payload.facultyId } }),
  ])

  if (!department) throw new ApiError(httpStatus.NOT_FOUND, "Department not found!")
  if (!semester) throw new ApiError(httpStatus.NOT_FOUND, "Semester not found!")
  if (!course) throw new ApiError(httpStatus.NOT_FOUND, "Course not found!")
  if (!faculty) throw new ApiError(httpStatus.NOT_FOUND, "Faculty not found!")

  const result = await prisma.exam.create({
    data: {
      duration: payload.duration,
      description: payload.description,
      startDate: payload.startDate,
      endDate: payload.endDate,
      departmentId: payload.departmentId,
      semesterId: payload.semesterId,
      courseId: payload.courseId,
      facultyId: payload.facultyId,
      questions: payload.questionIds
        ? {
            connect: payload.questionIds.map((id) => ({ id })),
          }
        : undefined,
    },
    include: {
      department: true,
      semester: true,
      course: true,
      faculty: true,
      questions: true,
      restrictedStudents: true,
      result: true,
    },
  })

  return result
}

const getAllExams = async (
  filters: IExamFilters,
  paginationOptions: IPaginationOptions,
): Promise<IGenericResponse<Exam[]>> => {
  const { searchTerm, ...filterData } = filters
  const { page, limit, skip, sortBy, sortOrder } = paginationHelpers.calculatePagination(paginationOptions)

  const andConditions = []

  // Search term
  if (searchTerm) {
    andConditions.push({
      description: { contains: searchTerm, mode: "insensitive" },
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

  const whereConditions: Prisma.ExamWhereInput = andConditions.length > 0 ? { AND: andConditions } : {}

  const result = await prisma.exam.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
    include: {
      department: true,
      semester: true,
      course: true,
      faculty: true,
      questions: true,
      restrictedStudents: true,
      result: true,
    },
  })

  const total = await prisma.exam.count({
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

const getSingleExam = async (id: string): Promise<Exam | null> => {
  const result = await prisma.exam.findUnique({
    where: { id },
    include: {
      department: true,
      semester: true,
      course: true,
      faculty: true,
      questions: true,
      restrictedStudents: true,
      result: true,
    },
  })

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Exam not found!")
  }

  return result
}

const updateExam = async (id: string, payload: IUpdateExam): Promise<Exam> => {
  const exam = await prisma.exam.findUnique({
    where: { id },
  })

  if (!exam) {
    throw new ApiError(httpStatus.NOT_FOUND, "Exam not found!")
  }

  const result = await prisma.exam.update({
    where: { id },
    data: payload,
    include: {
      department: true,
      semester: true,
      course: true,
      faculty: true,
      questions: true,
      restrictedStudents: true,
      result: true,
    },
  })

  return result
}

const deleteExam = async (id: string): Promise<Exam> => {
  const exam = await prisma.exam.findUnique({
    where: { id },
    include: {
      result: true,
    },
  })

  if (!exam) {
    throw new ApiError(httpStatus.NOT_FOUND, "Exam not found!")
  }

  // Check if exam has associated results
  if (exam.result.length > 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Cannot delete exam with associated results!")
  }

  const result = await prisma.exam.delete({
    where: { id },
  })

  return result
}

export const ExamServices = {
  createExam,
  getAllExams,
  getSingleExam,
  updateExam,
  deleteExam,
}
