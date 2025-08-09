import { z } from "zod"
import { Roles, Status } from "@prisma/client"

const createUserZodSchema = z.object({
  body: z.object({
    data: z.object({
      name: z.string().optional(),
      email: z.string().email("Invalid email format"),
      password: z.string().min(6, "Password must be at least 6 characters").optional(),
      mobile: z.string().optional(),
      roles: z.array(z.nativeEnum(Roles)).optional(),
      status: z.nativeEnum(Status).optional(),
      avatar: z.string().optional(),
    }),
  }),
})

const updateUserZodSchema = z.object({
  body: z.object({
    data: z.object({
      name: z.string().optional(),
      mobile: z.string().optional(),
      avatar: z.string().optional(),
      isActive: z.boolean().optional(),
    }),
  }),
})

const updateUserRolesZodSchema = z.object({
  body: z.object({
    data: z.object({
      roles: z.array(z.nativeEnum(Roles)),
    }),
  }),
})

export const UserValidation = {
  createUserZodSchema,
  updateUserZodSchema,
  updateUserRolesZodSchema,
}
