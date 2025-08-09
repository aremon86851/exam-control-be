/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Roles, Status, type User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import prisma from '../../../constants/prisma-client';
import ApiError from '../../../errors/ApiError';
import type {
  IChangePassword,
  ILoginUser,
  ILoginUserResponse,
  IRegisterUser,
} from './auth.interface';

const registerUser = async (payload: IRegisterUser): Promise<Partial<User>> => {
  const isUserExists = await prisma.user.findFirst({
    where: {
      email: payload.email,
    },
  });

  if (isUserExists && isUserExists.status === Status.USER) {
    throw new ApiError(httpStatus.CONFLICT, 'User already exists!');
  }

  // Hash password if provided
  let hashedPassword;
  if (payload.password) {
    hashedPassword = await bcrypt.hash(payload.password, 12);
  }

  let result;

  if (isUserExists && isUserExists.status === Status.INVITED) {
    // Update existing invited user
    result = await prisma.user.update({
      where: {
        email: payload.email,
      },
      data: {
        ...payload,
        password: hashedPassword,
        status: Status.USER,
        lastLogin: new Date(),
      },
    });
  } else {
    // Create new user
    result = await prisma.user.create({
      data: {
        ...payload,
        password: hashedPassword,
        roles: payload.roles || ['STUDENT'],
        status: Status.USER,
        lastLogin: new Date(),
      },
    });
  }

  // Remove password from response
  const { password: _, ...userWithoutPassword } = result;
  return userWithoutPassword;
};

const loginUser = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
  const user = await prisma.user.findFirst({
    where: {
      email: payload.email,
      status: Status.USER,
    },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found!');
  }

  if (!user.isActive) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'User account is deactivated!');
  }

  // Check password
  if (
    !user.password ||
    !(await bcrypt.compare(payload.password, user.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid credentials!');
  }

  // Create access token
  const jwtPayload = {
    userId: user.id,
    email: user.email,
    roles: user.roles,
  };

  const accessToken = jwt.sign(jwtPayload, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

  const refreshToken = jwt.sign(
    jwtPayload,
    process.env.JWT_REFRESH_SECRET as string,
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
    }
  );

  // Update last login
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLogin: new Date() },
  });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      name: user.name as string,
      email: user.email,
      mobile: user.mobile as string,
      roles: user.roles as Roles[],
      status: user.status as Status,
      avatar: user.avatar as string,
      isActive: user.isActive,
      lastLogin: user.lastLogin as any,
    },
  };
};

const changePassword = async (
  userId: string,
  payload: IChangePassword
): Promise<void> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user || !user.password) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found!');
  }

  // Verify current password
  const isCurrentPasswordValid = await bcrypt.compare(
    payload.currentPassword,
    user.password
  );
  if (!isCurrentPasswordValid) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Current password is incorrect!'
    );
  }

  // Hash new password
  const hashedNewPassword = await bcrypt.hash(payload.newPassword, 12);

  // Update password
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedNewPassword },
  });
};

const refreshToken = async (token: string) => {
  // Verify token
  let verifiedToken = null;
  try {
    verifiedToken = jwt.verify(token, process.env.JWT_REFRESH_SECRET as string);
  } catch (err) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid Refresh Token');
  }

  const { userId } = verifiedToken as any;

  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  // Generate new access token
  const jwtPayload = {
    userId: user.id,
    email: user.email,
    roles: user.roles,
  };

  const accessToken = jwt.sign(jwtPayload, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

  return {
    accessToken,
  };
};

const getProfile = async (userId: string): Promise<Partial<User>> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
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

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found!');
  }

  // Remove password from response
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const AuthServices = {
  registerUser,
  loginUser,
  changePassword,
  refreshToken,
  getProfile,
};
