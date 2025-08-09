import { z } from "zod"

const createDepartmentZodSchema = z.object({
  body: z.object({
    data: z.object({
      name: z.string({
        required_error: "Department name is required",
      }),
      isActive: z.boolean().optional(),
    }),
  }),
})

const updateDepartmentZodSchema = z.object({
  body: z.object({
    data: z.object({
      name: z.string().optional(),
      isActive: z.boolean().optional(),
    }),
  }),
})

export const DepartmentValidation = {
  createDepartmentZodSchema,
  updateDepartmentZodSchema,
}
