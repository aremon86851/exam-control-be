import type { QuestionType } from '@prisma/client';

export type ICreateQuestion = {
  type: QuestionType;
  category?: string;
  question: string;
  options: string[];
  correctAnswer?: string;
  correctAnswers?: string[];
};

export type IUpdateQuestion = Partial<ICreateQuestion>;

export type IQuestionFilters = {
  searchTerm?: string;
  type?: QuestionType;
};
