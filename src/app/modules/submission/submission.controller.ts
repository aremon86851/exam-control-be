import type { Request, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { submissionFilterableFields } from './submission.constants';
import { SubmissionServices } from './submission.service';

const createSubmission = catchAsync(async (req: Request, res: Response) => {
  const body = req.body.data;
  const result = await SubmissionServices.createSubmission(body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Submission created successfully!',
    data: result,
  });
});

const getAllSubmissions = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, submissionFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await SubmissionServices.getAllSubmissions(
    filters,
    paginationOptions
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Submissions retrieved successfully!',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleSubmission = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await SubmissionServices.getSingleSubmission(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Submission retrieved successfully!',
    data: result,
  });
});

const updateSubmission = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const body = req.body.data;
  const result = await SubmissionServices.updateSubmission(id, body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Submission updated successfully!',
    data: result,
  });
});

const deleteSubmission = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await SubmissionServices.deleteSubmission(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Submission deleted successfully!',
    data: result,
  });
});

const getByExamAndStudent = catchAsync(async (req: Request, res: Response) => {
  const { examId, studentId } = req.params;
  const result = await SubmissionServices.getByExamAndStudent(
    examId,
    studentId
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Submission fetched successfully!',
    data: result,
  });
});

const getByStudent = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await SubmissionServices.getByStudent(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Submissions fetched successfully!',
    data: result,
  });
});

export const SubmissionController = {
  createSubmission,
  getAllSubmissions,
  getSingleSubmission,
  updateSubmission,
  deleteSubmission,
  getByExamAndStudent,
  getByStudent,
};
