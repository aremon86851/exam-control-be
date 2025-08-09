import { z } from "zod"

const createSubmissionZodSchema = z.object({
  body: z.object({
    data: z.object({
      exam: z.string({
        required_error: "Exam is required",
      }),
      studentId: z.string({
        required_error: "Student ID is required",
      }),
      startTime: z.string().transform((str) => new Date(str)),
      endTime: z.string().transform((str) => new Date(str)),
      submittedAt: z.string().transform((str) => new Date(str)),
      timeSpent: z.number({
        required_error: "Time spent is required",
      }),
      answer: z.array(z.string()),
      totalScore: z.number({
        required_error: "Total score is required",
      }),
      percent: z.string({
        required_error: "Percent is required",
      }),
      passed: z.string({
        required_error: "Passed status is required",
      }),
    }),
  }),
})

const updateSubmissionZodSchema = z.object({
  body: z.object({
    data: z.object({
      exam: z.string().optional(),
      studentId: z.string().optional(),
      startTime: z
        .string()
        .transform((str) => new Date(str))
        .optional(),
      endTime: z
        .string()
        .transform((str) => new Date(str))
        .optional(),
      submittedAt: z
        .string()
        .transform((str) => new Date(str))
        .optional(),
      timeSpent: z.number().optional(),
      answer: z.array(z.string()).optional(),
      totalScore: z.number().optional(),
      percent: z.string().optional(),
      passed: z.string().optional(),
    }),
  }),
})

export const SubmissionValidation = {
  createSubmissionZodSchema,
  updateSubmissionZodSchema,
}
