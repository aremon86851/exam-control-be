-- AlterTable
ALTER TABLE "questions" ALTER COLUMN "correctAnswer" DROP NOT NULL,
ALTER COLUMN "correctAnswers" SET DEFAULT ARRAY[]::TEXT[];
