import { Status } from '@prisma/client';
import bcrypt from 'bcryptjs';
import httpStatus from 'http-status';
import prisma from '../../../constants/prisma-client';
import ApiError from '../../../errors/ApiError';

/**
 * Interface for password setup data for invited users
 */
interface ISetupInvitedUser {
  email: string;
  password: string;
}

/**
 * Service to handle the setup process for invited users
 */
const setupInvitedUser = async (payload: ISetupInvitedUser): Promise<void> => {
  // Find the invited user by email
  const user = await prisma.user.findFirst({
    where: {
      email: payload.email,
      status: Status.INVITED,
    },
  });

  if (!user) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'No invited user found with this email address.'
    );
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(payload.password, 12);

  // Update the user's password while keeping the INVITED status
  // The user remains in INVITED status throughout their lifecycle in the system
  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      password: hashedPassword,
      lastLogin: new Date(),
    },
  });
};

export const InvitedUserService = {
  setupInvitedUser,
};
