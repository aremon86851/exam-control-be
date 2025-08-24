import { z } from 'zod';

/**
 * Validation schema for setting up invited user's password
 */
const setupInvitedUserSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
  }),
});

export const InvitedUserValidation = {
  setupInvitedUserSchema,
};
