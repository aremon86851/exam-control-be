import type { Course } from '@prisma/client';
import httpStatus from 'http-status';
import prisma from '../../../constants/prisma-client';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import type { IGenericResponse } from '../../../interfaces/common';
import type { IPaginationOptions } from '../../../interfaces/pagination';
import type {
  ICourseFilters,
  ICreateCourse,
  IUpdateCourse,
} from './course.interface';

const createCourse = async (payload: ICreateCourse): Promise<Course> => {
  // Verify department exists
  const department = await prisma.department.findUnique({
    where: { id: payload.departmentId },
  });

  if (!department) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Department not found!');
  }

  // Verify instructor exists
  const instructor = await prisma.user.findUnique({
    where: { id: payload.instructorId },
  });

  if (!instructor) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Instructor not found!');
  }

  const result = await prisma.course.create({
    data: payload,
    include: {
      department: true,
      instructor: true,
      studentInfo: true,
      semester: true,
      exam: true,
      result: true,
    },
  });

  return result;
};

const getAllCourses = async (
  filters: ICourseFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Course[]>> => {
  const { searchTerm, ...filterData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  // Search term
  if (searchTerm) {
    andConditions.push({
      title: { contains: searchTerm, mode: 'insensitive' },
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

  const result = await prisma.course.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
    include: {
      department: true,
      instructor: true,
      studentInfo: true,
      semester: true,
      exam: true,
      result: true,
    },
  });

  const total = await prisma.course.count({
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

const getSingleCourse = async (id: string): Promise<Course | null> => {
  const result = await prisma.course.findUnique({
    where: { id },
    include: {
      department: true,
      instructor: true,
      studentInfo: true,
      semester: true,
      exam: true,
      result: true,
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Course not found!');
  }

  return result;
};

const updateCourse = async (
  id: string,
  payload: IUpdateCourse
): Promise<Course> => {
  const course = await prisma.course.findUnique({
    where: { id },
  });

  if (!course) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Course not found!');
  }

  // Verify department exists if updating
  if (payload.departmentId) {
    const department = await prisma.department.findUnique({
      where: { id: payload.departmentId },
    });

    if (!department) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Department not found!');
    }
  }

  // Verify instructor exists if updating
  if (payload.instructorId) {
    const instructor = await prisma.user.findUnique({
      where: { id: payload.instructorId },
    });

    if (!instructor) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Instructor not found!');
    }
  }

  const result = await prisma.course.update({
    where: { id },
    data: payload,
    include: {
      department: true,
      instructor: true,
      studentInfo: true,
      semester: true,
      exam: true,
      result: true,
    },
  });

  return result;
};

const deleteCourse = async (id: string): Promise<Course> => {
  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      exam: true,
      result: true,
      studentInfo: true,
    },
  });

  if (!course) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Course not found!');
  }

  // Check if course has associated records
  if (
    course.exam.length > 0 ||
    course.result.length > 0 ||
    course.studentInfo.length > 0
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Cannot delete course with associated exams, results, or students!'
    );
  }

  const result = await prisma.course.delete({
    where: { id },
  });

  return result;
};

export const CourseServices = {
  createCourse,
  getAllCourses,
  getSingleCourse,
  updateCourse,
  deleteCourse,
};
