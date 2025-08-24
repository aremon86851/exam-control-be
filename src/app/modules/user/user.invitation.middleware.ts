import { Roles } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';

const validateInvitationData = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const { roles, departmentId, semesterId, courseId } = req.body.data;

    // Check if roles is present
    if (!roles || !Array.isArray(roles) || roles.length === 0) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'At least one role must be provided'
      );
    }

    // If user has STUDENT role, require department, semester, and course
    if (roles.includes(Roles.STUDENT)) {
      if (!departmentId) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          'Department ID is required for student users'
        );
      }
      if (!semesterId) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          'Semester ID is required for student users'
        );
      }
      //   if (!courseId) {
      //     throw new ApiError(
      //       httpStatus.BAD_REQUEST,
      //       'Course ID is required for student users'
      //     );
      //   }
    }

    // If everything is valid, proceed
    next();
  } catch (error) {
    next(error);
  }
};

export default validateInvitationData;
