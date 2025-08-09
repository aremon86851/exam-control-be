import type { Semester } from '@prisma/client';
import httpStatus from 'http-status';
import prisma from '../../../constants/prisma-client';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import type { IGenericResponse } from '../../../interfaces/common';
import type { IPaginationOptions } from '../../../interfaces/pagination';
import type {
  ICreateSemester,
  ISemesterFilters,
  IUpdateSemester,
} from './semester.interface';

const createSemester = async (payload: ICreateSemester): Promise<Semester> => {
  // Verify course exists
  const course = await prisma.course.findUnique({
    where: { id: payload.coursesId },
  });

  if (!course) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Course not found!');
  }

  // Validate dates
  if (payload.startDate >= payload.endDate) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'End date must be after start date!'
    );
  }

  if (payload.examStart >= payload.examEnd) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Exam end date must be after exam start date!'
    );
  }

  const result = await prisma.semester.create({
    data: payload,
    include: {
      course: true,
      studentInfo: true,
      exam: true,
      result: true,
    },
  });

  return result;
};

const getAllSemesters = async (
  filters: ISemesterFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Semester[]>> => {
  const { searchTerm, ...filterData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  // Search term
  if (searchTerm) {
    andConditions.push({
      OR: [
        { name: { contains: searchTerm, mode: 'insensitive' } },
        { code: { contains: searchTerm, mode: 'insensitive' } },
      ],
    });
  }

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

  const whereConditions: any =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.semester.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
    include: {
      course: true,
      studentInfo: true,
      exam: true,
      result: true,
    },
  });

  const total = await prisma.semester.count({
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

const getSingleSemester = async (id: string): Promise<Semester | null> => {
  const result = await prisma.semester.findUnique({
    where: { id },
    include: {
      course: true,
      studentInfo: true,
      exam: true,
      result: true,
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Semester not found!');
  }

  return result;
};

const updateSemester = async (
  id: string,
  payload: IUpdateSemester
): Promise<Semester> => {
  const semester = await prisma.semester.findUnique({
    where: { id },
  });

  if (!semester) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Semester not found!');
  }

  // Verify course exists if updating
  if (payload.coursesId) {
    const course = await prisma.course.findUnique({
      where: { id: payload.coursesId },
    });

    if (!course) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Course not found!');
    }
  }

  // Validate dates if provided
  const startDate = payload.startDate || semester.startDate;
  const endDate = payload.endDate || semester.endDate;
  const examStart = payload.examStart || semester.examStart;
  const examEnd = payload.examEnd || semester.examEnd;

  if (startDate >= endDate) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'End date must be after start date!'
    );
  }

  if (examStart >= examEnd) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Exam end date must be after exam start date!'
    );
  }

  const result = await prisma.semester.update({
    where: { id },
    data: payload,
    include: {
      course: true,
      studentInfo: true,
      exam: true,
      result: true,
    },
  });

  return result;
};

const deleteSemester = async (id: string): Promise<Semester> => {
  const semester = await prisma.semester.findUnique({
    where: { id },
    include: {
      exam: true,
      result: true,
      studentInfo: true,
    },
  });

  if (!semester) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Semester not found!');
  }

  // Check if semester has associated records
  if (
    semester.exam.length > 0 ||
    semester.result.length > 0 ||
    semester.studentInfo.length > 0
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Cannot delete semester with associated exams, results, or students!'
    );
  }

  const result = await prisma.semester.delete({
    where: { id },
  });

  return result;
};

export const SemesterServices = {
  createSemester,
  getAllSemesters,
  getSingleSemester,
  updateSemester,
  deleteSemester,
};
