import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { InvitedUserService } from './auth.invited.service';

/**
 * Controller to handle the setup process for invited users
 */
const setupInvitedUser = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  await InvitedUserService.setupInvitedUser({ email, password });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password set successfully! You can continue using your account.',
  });
});

export const InvitedUserController = {
  setupInvitedUser,
};
