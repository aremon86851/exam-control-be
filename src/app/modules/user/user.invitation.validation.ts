import { Roles } from '@prisma/client';
import { z } from 'zod';

// Combined schema that conditionally requires fields based on roles
const inviteUserSchema = z.object({
  body: z.object({
    data: z.object({
      email: z.string().email('Invalid email format'),
      name: z.string().optional(),
      roles: z.array(z.nativeEnum(Roles)),
      // These fields are optional in the schema but validated in the middleware
      departmentId: z
        .string()
        .uuid('Department ID must be a valid UUID')
        .optional(),
      semesterId: z
        .string()
        .uuid('Semester ID must be a valid UUID')
        .optional(),
      courseId: z.string().uuid('Course ID must be a valid UUID').optional(),
    }),
  }),
});

export const UserInvitationValidation = {
  inviteUserSchema,
};
