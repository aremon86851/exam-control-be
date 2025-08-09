import { Status } from '@prisma/client';
import { z } from 'zod';

const registerUserZodSchema = z.object({
  body: z.object({
    data: z.object({
      name: z.string().optional(),
      email: z.string().email('Invalid email format'),
      password: z
        .string()
        .min(6, 'Password must be at least 6 characters')
        .optional(),
      mobile: z.string().optional(),
      roles: z.array(z.string()).optional(),
      status: z.nativeEnum(Status).optional(),
      avatar: z.string().optional(),
    }),
  }),
});

const loginUserZodSchema = z.object({
  body: z.object({
    data: z.object({
      email: z.string().email('Invalid email format'),
      password: z.string().min(1, 'Password is required'),
    }),
  }),
});

const changePasswordZodSchema = z.object({
  body: z.object({
    data: z.object({
      currentPassword: z.string().min(1, 'Current password is required'),
      newPassword: z
        .string()
        .min(6, 'New password must be at least 6 characters'),
    }),
  }),
});

const refreshTokenZodSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: 'Refresh Token is required',
    }),
  }),
});

export const AuthValidation = {
  registerUserZodSchema,
  loginUserZodSchema,
  changePasswordZodSchema,
  refreshTokenZodSchema,
};
