import { QuestionType } from '@prisma/client';
import { z } from 'zod';

const createQuestionZodSchema = z.object({
  body: z.object({
    data: z.object({
      type: z.nativeEnum(QuestionType, {
        required_error: 'Question type is required',
      }),
      question: z.string({
        required_error: 'Question is required',
      }),
      options: z.array(z.string()).default([]),
      correctAnswer: z.string().optional(),
      category: z.string().optional(),
      correctAnswers: z.array(z.string()).optional(),
    }),
  }),
});

const updateQuestionZodSchema = z.object({
  body: z.object({
    data: z.object({
      type: z.nativeEnum(QuestionType).optional(),
      question: z.string().optional(),
      category: z.string().optional(),
      options: z.array(z.string()).optional(),
      correctAnswer: z.string().optional(),
      correctAnswers: z.array(z.string()).optional(),
    }),
  }),
});

export const QuestionValidation = {
  createQuestionZodSchema,
  updateQuestionZodSchema,
};
