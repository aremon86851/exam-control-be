import type { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { UserInvitationService } from './user.invitation.service';

const inviteUser = catchAsync(async (req: Request, res: Response) => {
  const invitationData = req.body.data;
  const result = await UserInvitationService.inviteUser(invitationData);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'User invitation sent successfully! Temporary password generated.',
    data: {
      ...result,
      // Include temporary password in response for admin to share with the invited user
      tempPassword: result.tempPassword,
    },
  });
});

const getInvitedUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await UserInvitationService.getInvitedUsers();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Invited users retrieved successfully!',
    data: result,
  });
});

export const UserInvitationController = {
  inviteUser,
  getInvitedUsers,
};
