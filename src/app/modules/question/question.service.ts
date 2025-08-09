import type { Question } from '@prisma/client';
import httpStatus from 'http-status';
import prisma from '../../../constants/prisma-client';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import type { IGenericResponse } from '../../../interfaces/common';
import type { IPaginationOptions } from '../../../interfaces/pagination';
import type {
  ICreateQuestion,
  IQuestionFilters,
  IUpdateQuestion,
} from './question.interface';

const createQuestion = async (payload: ICreateQuestion): Promise<Question> => {
  const result = await prisma.question.create({
    data: payload as any,
    include: {
      exams: true,
      Exam: true,
    },
  });

  return result;
};

const getAllQuestions = async (
  filters: IQuestionFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Question[]>> => {
  const { searchTerm, ...filterData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  // Search term
  if (searchTerm) {
    andConditions.push({
      question: { contains: searchTerm, mode: 'insensitive' },
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

  const result = await prisma.question.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
    include: {
      exams: true,
      Exam: true,
    },
  });

  const total = await prisma.question.count({
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

const getSingleQuestion = async (id: string): Promise<Question | null> => {
  const result = await prisma.question.findUnique({
    where: { id },
    include: {
      exams: true,
      Exam: true,
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Question not found!');
  }

  return result;
};

const updateQuestion = async (
  id: string,
  payload: IUpdateQuestion
): Promise<Question> => {
  const question = await prisma.question.findUnique({
    where: { id },
  });

  if (!question) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Question not found!');
  }

  const result = await prisma.question.update({
    where: { id },
    data: payload,
    include: {
      exams: true,
      Exam: true,
    },
  });

  return result;
};

const deleteQuestion = async (id: string): Promise<Question> => {
  const question = await prisma.question.findUnique({
    where: { id },
    include: {
      exams: true,
      Exam: true,
    },
  });

  if (!question) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Question not found!');
  }

  // Check if question is used in any exams
  if (question.exams.length > 0 || question.Exam.length > 0) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Cannot delete question that is used in exams!'
    );
  }

  const result = await prisma.question.delete({
    where: { id },
  });

  return result;
};

export const QuestionServices = {
  createQuestion,
  getAllQuestions,
  getSingleQuestion,
  updateQuestion,
  deleteQuestion,
};
