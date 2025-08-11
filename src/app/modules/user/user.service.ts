import type { User } from '@prisma/client';
import { Roles } from '@prisma/client';
import bcrypt from 'bcryptjs';
import httpStatus from 'http-status';
import prisma from '../../../constants/prisma-client';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import type { IGenericResponse } from '../../../interfaces/common';
import type { IPaginationOptions } from '../../../interfaces/pagination';
import type {
  ICreateUser,
  IUpdateUser,
  IUpdateUserRoles,
  IUserFilters,
} from './user.interface';

const createUser = async (payload: ICreateUser): Promise<Partial<User>> => {
  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (existingUser) {
    throw new ApiError(
      httpStatus.CONFLICT,
      'User already exists with this email!'
    );
  }

  // Hash password if provided
  let hashedPassword;
  if (payload.password) {
    hashedPassword = await bcrypt.hash(payload.password, 12);
  }

  const result = await prisma.user.create({
    data: {
      ...payload,
      password: hashedPassword,
      roles: payload.roles || ['STUDENT'],
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

  // Remove password from response
  const { password, ...userWithoutPassword } = result;
  return userWithoutPassword;
};

const getAllUsers = async (
  filters: IUserFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Partial<User>[]>> => {
  const { searchTerm, ...filterData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  // Search term
  if (searchTerm) {
    andConditions.push({
      OR: [
        { name: { contains: searchTerm, mode: 'insensitive' as const } },
        { email: { contains: searchTerm, mode: 'insensitive' as const } },
        { mobile: { contains: searchTerm, mode: 'insensitive' as const } },
      ],
    });
  }

  // Filters
  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map(key => {
        if (key === 'role') {
          return {
            roles: {
              has: (filterData as any)[key] as Roles,
            },
          };
        }
        return {
          [key]: {
            equals: (filterData as any)[key],
          },
        };
      }),
    });
  }

  const whereConditions =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.user.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
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

  const total = await prisma.user.count({
    where: whereConditions,
  });

  // Remove passwords from response
  const usersWithoutPassword = result.map(user => {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: usersWithoutPassword,
  };
};

const getSingleUser = async (id: string): Promise<Partial<User> | null> => {
  const result = await prisma.user.findUnique({
    where: { id },
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

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found!');
  }

  // Remove password from response
  const { password, ...userWithoutPassword } = result;
  return userWithoutPassword;
};

const updateUser = async (
  id: string,
  payload: IUpdateUser
): Promise<Partial<User>> => {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found!');
  }

  const result = await prisma.user.update({
    where: { id },
    data: payload,
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

  // Remove password from response
  const { password, ...userWithoutPassword } = result;
  return userWithoutPassword;
};

const updateUserRoles = async (
  id: string,
  payload: IUpdateUserRoles
): Promise<Partial<User>> => {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found!');
  }

  const result = await prisma.user.update({
    where: { id },
    data: { roles: payload.roles },
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

  // Remove password from response
  const { password, ...userWithoutPassword } = result;
  return userWithoutPassword;
};

const deleteUser = async (id: string): Promise<Partial<User>> => {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found!');
  }

  const result = await prisma.user.delete({
    where: { id },
  });

  // Remove password from response
  const { password, ...userWithoutPassword } = result;
  return userWithoutPassword;
};

export const UserServices = {
  createUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  updateUserRoles,
  deleteUser,
};
