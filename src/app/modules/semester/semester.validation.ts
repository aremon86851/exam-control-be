import { z } from "zod"

const createSemesterZodSchema = z.object({
  body: z.object({
    data: z.object({
      name: z.string({
        required_error: "Semester name is required",
      }),
      code: z.string({
        required_error: "Semester code is required",
      }),
      year: z.string({
        required_error: "Year is required",
      }),
      startDate: z.string().transform((str) => new Date(str)),
      endDate: z.string().transform((str) => new Date(str)),
      examStart: z.string().transform((str) => new Date(str)),
      examEnd: z.string().transform((str) => new Date(str)),
      coursesId: z.string({
        required_error: "Course ID is required",
      }),
    }),
  }),
})

const updateSemesterZodSchema = z.object({
  body: z.object({
    data: z.object({
      name: z.string().optional(),
      code: z.string().optional(),
      year: z.string().optional(),
      startDate: z
        .string()
        .transform((str) => new Date(str))
        .optional(),
      endDate: z
        .string()
        .transform((str) => new Date(str))
        .optional(),
      examStart: z
        .string()
        .transform((str) => new Date(str))
        .optional(),
      examEnd: z
        .string()
        .transform((str) => new Date(str))
        .optional(),
      coursesId: z.string().optional(),
    }),
  }),
})

export const SemesterValidation = {
  createSemesterZodSchema,
  updateSemesterZodSchema,
}
