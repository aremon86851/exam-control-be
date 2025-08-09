import { z } from "zod"

const createResultZodSchema = z.object({
  body: z.object({
    data: z.object({
      examId: z.string({
        required_error: "Exam ID is required",
      }),
      studentId: z.string({
        required_error: "Student ID is required",
      }),
      courseId: z.string({
        required_error: "Course ID is required",
      }),
      semesterId: z.string({
        required_error: "Semester ID is required",
      }),
      rawScore: z.string({
        required_error: "Raw score is required",
      }),
      classRank: z.string({
        required_error: "Class rank is required",
      }),
      message: z.string({
        required_error: "Message is required",
      }),
    }),
  }),
})

const updateResultZodSchema = z.object({
  body: z.object({
    data: z.object({
      examId: z.string().optional(),
      studentId: z.string().optional(),
      courseId: z.string().optional(),
      semesterId: z.string().optional(),
      rawScore: z.string().optional(),
      classRank: z.string().optional(),
      message: z.string().optional(),
    }),
  }),
})

export const ResultValidation = {
  createResultZodSchema,
  updateResultZodSchema,
}
