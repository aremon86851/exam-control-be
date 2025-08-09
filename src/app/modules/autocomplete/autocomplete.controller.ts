import type { Request, Response } from 'express';
import httpStatus from 'http-status';
import { IAutocompleteQuery } from '../../../interfaces/autocomplete';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { AutocompleteServices } from './autocomplete.service';

const getDepartments = catchAsync(async (req: Request, res: Response) => {
  const { q, limit = '10' } = req.query as Record<string, string>;

  const query: IAutocompleteQuery = {
    q,
    limit: parseInt(limit),
  };

  const result = await AutocompleteServices.getDepartments(query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Departments retrieved successfully!',
    data: result,
  });
});

const getCourses = catchAsync(async (req: Request, res: Response) => {
  const { q, limit = '10', departmentId } = req.query as Record<string, string>;

  const query: IAutocompleteQuery = {
    q,
    limit: parseInt(limit),
    filters: departmentId ? { departmentId } : {},
  };

  const result = await AutocompleteServices.getCourses(query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Courses retrieved successfully!',
    data: result,
  });
});

const getSemesters = catchAsync(async (req: Request, res: Response) => {
  const { q, limit = '10' } = req.query as Record<string, string>;

  const query: IAutocompleteQuery = {
    q,
    limit: parseInt(limit),
  };

  const result = await AutocompleteServices.getSemesters(query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Semesters retrieved successfully!',
    data: result,
  });
});

const getUsers = catchAsync(async (req: Request, res: Response) => {
  const { q, limit = '10', role } = req.query as Record<string, string>;

  const query: IAutocompleteQuery = {
    q,
    limit: parseInt(limit),
    filters: role ? { role } : {},
  };

  const result = await AutocompleteServices.getUsers(query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Users retrieved successfully!',
    data: result,
  });
});

const getInstructors = catchAsync(async (req: Request, res: Response) => {
  const { q, limit = '10' } = req.query as Record<string, string>;

  const query: IAutocompleteQuery = {
    q,
    limit: parseInt(limit),
  };

  const result = await AutocompleteServices.getInstructors(query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Instructors retrieved successfully!',
    data: result,
  });
});

const getStudents = catchAsync(async (req: Request, res: Response) => {
  const {
    q,
    limit = '10',
    departmentId,
    roles,
  } = req.query as Record<string, string>;

  const query: IAutocompleteQuery = {
    q,
    limit: parseInt(limit),
    filters: departmentId ? { departmentId } : {},
    roles: roles ? roles.toUpperCase() : 'STUDENT',
  };

  const result = await AutocompleteServices.getStudents(query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Students retrieved successfully!',
    data: result,
  });
});

const getExams = catchAsync(async (req: Request, res: Response) => {
  const {
    q,
    limit = '10',
    courseId,
    departmentId,
    semesterId,
  } = req.query as Record<string, string>;

  const query: IAutocompleteQuery = {
    q,
    limit: parseInt(limit),
    filters: {
      ...(courseId && { courseId }),
      ...(departmentId && { departmentId }),
      ...(semesterId && { semesterId }),
    },
  };

  const result = await AutocompleteServices.getExams(query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Exams retrieved successfully!',
    data: result,
  });
});

const getQuestions = catchAsync(async (req: Request, res: Response) => {
  const {
    q,
    limit = '10',
    courseId,
    type,
    difficulty,
  } = req.query as Record<string, string>;

  const query: IAutocompleteQuery = {
    q,
    limit: parseInt(limit),
    filters: {
      ...(courseId && { courseId }),
      ...(type && { type }),
      ...(difficulty && { difficulty }),
    },
  };

  const result = await AutocompleteServices.getQuestions(query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Questions retrieved successfully!',
    data: result,
  });
});

export const AutocompleteController = {
  getDepartments,
  getCourses,
  getSemesters,
  getUsers,
  getInstructors,
  getStudents,
  getExams,
  getQuestions,
};
