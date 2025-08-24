import { Prisma, Roles, Status, type User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import httpStatus from 'http-status';
import prisma from '../../../constants/prisma-client';
import ApiError from '../../../errors/ApiError';

interface IInviteUserData {
  email: string;
  name?: string;
  roles: Roles[];
  departmentId?: string;
  semesterId?: string;
  courseId?: string;
}

/**
 * Generate a temporary password for invited users
 */
const generateTemporaryPassword = (): string => {
  // Generate a random string of 8 characters
  return crypto.randomBytes(4).toString('hex');
};

/**
 * Service for inviting users to the system
 */
const inviteUser = async (
  payload: IInviteUserData
): Promise<Partial<User> & { tempPassword?: string }> => {
  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (existingUser && existingUser.status === Status.USER) {
    throw new ApiError(
      httpStatus.CONFLICT,
      'User already exists and has completed registration'
    );
  }

  // Generate a temporary password for the invited user
  const tempPassword = generateTemporaryPassword();
  const hashedPassword = await bcrypt.hash(tempPassword, 12);

  // Extract student-specific data
  const { departmentId, semesterId, courseId, ...userData } = payload;

  // Create user with invited status
  try {
    // Use a transaction to ensure both user and studentInfo (if applicable) are created
    return await prisma.$transaction(async tx => {
      // Create or update the user
      let user;
      if (existingUser) {
        // Update existing user
        user = await tx.user.update({
          where: { id: existingUser.id },
          data: {
            ...userData,
            password: hashedPassword, // Set temporary password
            status: Status.INVITED,
          },
        });
      } else {
        // Create new user
        user = await tx.user.create({
          data: {
            ...userData,
            password: hashedPassword, // Set temporary password
            status: Status.INVITED,
          },
        });
      }

      // If user is a student, create student info
      if (
        userData.roles.includes(Roles.STUDENT) &&
        departmentId &&
        semesterId &&
        courseId
      ) {
        // Check if student info already exists
        const existingStudentInfo = await tx.studentInfo.findUnique({
          where: { userId: user.id },
        });

        if (existingStudentInfo) {
          // Update existing student info
          await tx.studentInfo.update({
            where: { userId: user.id },
            data: {
              departmentId,
              semesterId,
              courseId,
            },
          });
        } else {
          // Create new student info
          await tx.studentInfo.create({
            data: {
              userId: user.id,
              departmentId,
              semesterId,
              courseId,
            },
          });
        }
      }

      // Remove password from response but return temporary password
      const { password, ...userWithoutPassword } = user;
      return {
        ...userWithoutPassword,
        tempPassword, // Include temporary password in response
      };
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new ApiError(httpStatus.CONFLICT, 'Email already exists');
      }
      if (error.code === 'P2003') {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          'Invalid department, semester, or course ID'
        );
      }
    }
    throw error;
  }
};

/**
 * Service for getting all invited users
 */
const getInvitedUsers = async (): Promise<Partial<User>[]> => {
  const users = await prisma.user.findMany({
    where: {
      status: Status.INVITED,
    },
    include: {
      studentInfo: {
        include: {
          department: true,
          course: true,
          semester: true,
        },
      },
    },
  });

  // Remove passwords from response
  return users.map(user => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  });
};

export const UserInvitationService = {
  inviteUser,
  getInvitedUsers,
};
