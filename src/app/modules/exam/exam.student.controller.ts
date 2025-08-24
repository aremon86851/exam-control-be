import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { StudentExamService } from './exam.student.service';

const getStudentExams = catchAsync(async (req: Request, res: Response) => {
  // Get student ID from authenticated user
  const studentId = req.user?.userId;
  const paginationOptions = pick(req.query, paginationFields);

  const result = await StudentExamService.getStudentExams(
    studentId,
    paginationOptions
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student exams retrieved successfully!',
    meta: result.meta,
    data: result.data,
  });
});

export const StudentExamController = {
  getStudentExams,
};
