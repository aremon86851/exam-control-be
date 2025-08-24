import type { Exam } from '@prisma/client';
import httpStatus from 'http-status';
import prisma from '../../../constants/prisma-client';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import type { IGenericResponse } from '../../../interfaces/common';
import type { IPaginationOptions } from '../../../interfaces/pagination';

/**
 * Get exams for a specific student based on their semester and course
 */
const getStudentExams = async (
  studentId: string,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Exam[]>> => {
  // Find student info to get their semester and course
  const studentInfo = await prisma.studentInfo.findUnique({
    where: { userId: studentId },
    include: {
      semester: true,
      course: true,
      department: true,
    },
  });

  if (!studentInfo) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Student information not found. Please contact an administrator.'
    );
  }

  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  // Find exams that match the student's semester, course, and department
  // and where the student is not in the restrictedStudents list
  const result = await prisma.exam.findMany({
    where: {
      semesterId: studentInfo.semesterId,
      courseId: studentInfo.courseId,
      departmentId: studentInfo.departmentId,
      restrictedStudents: {
        none: {
          id: studentId,
        },
      },
    },
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
      // Don't include other students' results
      result: {
        where: {
          studentId: studentId,
        },
      },
      // Only include this student's submissions
      submissions: {
        where: {
          studentId: studentId,
        },
      },
    },
  });

  const total = await prisma.exam.count({
    where: {
      semesterId: studentInfo.semesterId,
      courseId: studentInfo.courseId,
      departmentId: studentInfo.departmentId,
      restrictedStudents: {
        none: {
          id: studentId,
        },
      },
    },
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

export const StudentExamService = {
  getStudentExams,
};
