import type { Prisma, Result } from '@prisma/client';
import httpStatus from 'http-status';
import prisma from '../../../constants/prisma-client';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import type { IGenericResponse } from '../../../interfaces/common';
import type { IPaginationOptions } from '../../../interfaces/pagination';
import type {
  ICreateResult,
  IResultFilters,
  IUpdateResult,
} from './result.interface';

const createResult = async (payload: ICreateResult): Promise<Result> => {
  // Verify all related entities exist
  const [exam, student, course, semester] = await Promise.all([
    prisma.exam.findUnique({ where: { id: payload.examId } }),
    prisma.user.findUnique({ where: { id: payload.studentId } }),
    prisma.course.findUnique({ where: { id: payload.courseId } }),
    prisma.semester.findUnique({ where: { id: payload.semesterId } }),
  ]);

  if (!exam) throw new ApiError(httpStatus.NOT_FOUND, 'Exam not found!');
  if (!student) throw new ApiError(httpStatus.NOT_FOUND, 'Student not found!');
  if (!course) throw new ApiError(httpStatus.NOT_FOUND, 'Course not found!');
  if (!semester)
    throw new ApiError(httpStatus.NOT_FOUND, 'Semester not found!');

  const result = await prisma.result.create({
    data: payload,
    include: {
      exam: true,
      student: true,
      course: true,
      semester: true,
    },
  });

  return result;
};

const getAllResults = async (
  filters: IResultFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Result[]>> => {
  const { searchTerm, ...filterData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  // Filters
  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map(key => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.ResultWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.result.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
    include: {
      exam: true,
      student: true,
      course: true,
      semester: true,
    },
  });

  const total = await prisma.result.count({
    where: whereConditions,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleResult = async (id: string): Promise<Result | null> => {
  const result = await prisma.result.findUnique({
    where: { id },
    include: {
      exam: true,
      student: true,
      course: true,
      semester: true,
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Result not found!');
  }

  return result;
};

const updateResult = async (
  id: string,
  payload: IUpdateResult
): Promise<Result> => {
  const result = await prisma.result.findUnique({
    where: { id },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Result not found!');
  }

  const updatedResult = await prisma.result.update({
    where: { id },
    data: payload,
    include: {
      exam: true,
      student: true,
      course: true,
      semester: true,
    },
  });

  return updatedResult;
};

const deleteResult = async (id: string): Promise<Result> => {
  const result = await prisma.result.findUnique({
    where: { id },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Result not found!');
  }

  const deletedResult = await prisma.result.delete({
    where: { id },
  });

  return deletedResult;
};

export const ResultServices = {
  createResult,
  getAllResults,
  getSingleResult,
  updateResult,
  deleteResult,
};
