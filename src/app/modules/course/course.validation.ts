import { z } from 'zod';

const createCourseZodSchema = z.object({
  body: z.object({
    data: z.object({
      title: z.string({
        required_error: 'Course title is required',
      }),
      departmentId: z.string({
        required_error: 'Department ID is required',
      }),
      instructorId: z.string({
        required_error: 'Instructor ID is required',
      }),
      credits: z.number({
        required_error: 'Credits is required',
      }),
      durations: z.number({
        required_error: 'Duration is required',
      }),
      maxStudent: z.number({
        required_error: 'Max student is required',
      }),
      isActive: z.string(),
    }),
  }),
});

const updateCourseZodSchema = z.object({
  body: z.object({
    data: z.object({
      title: z.string().optional(),
      departmentId: z.string().optional(),
      instructorId: z.string().optional(),
      credits: z.number().optional(),
      durations: z.number().optional(),
      maxStudent: z.number().optional(),
      isActive: z.string().optional(),
    }),
  }),
});

export const CourseValidation = {
  createCourseZodSchema,
  updateCourseZodSchema,
};
