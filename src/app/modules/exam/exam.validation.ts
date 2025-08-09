import { z } from "zod"

const createExamZodSchema = z.object({
  body: z.object({
    data: z.object({
      duration: z.number({
        required_error: "Duration is required",
      }),
      description: z.string({
        required_error: "Description is required",
      }),
      startDate: z.string({
        required_error: "Start date is required",
      }),
      endDate: z.string({
        required_error: "End date is required",
      }),
      departmentId: z.string({
        required_error: "Department ID is required",
      }),
      semesterId: z.string({
        required_error: "Semester ID is required",
      }),
      courseId: z.string({
        required_error: "Course ID is required",
      }),
      facultyId: z.string({
        required_error: "Faculty ID is required",
      }),
      questionIds: z.array(z.string()).optional(),
    }),
  }),
})

const updateExamZodSchema = z.object({
  body: z.object({
    data: z.object({
      duration: z.number().optional(),
      description: z.string().optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      departmentId: z.string().optional(),
      semesterId: z.string().optional(),
      courseId: z.string().optional(),
      facultyId: z.string().optional(),
      questionIds: z.array(z.string()).optional(),
    }),
  }),
})

export const ExamValidation = {
  createExamZodSchema,
  updateExamZodSchema,
}
