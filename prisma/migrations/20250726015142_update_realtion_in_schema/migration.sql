/*
  Warnings:

  - You are about to drop the column `faculties` on the `departments` table. All the data in the column will be lost.
  - You are about to drop the column `head` on the `departments` table. All the data in the column will be lost.
  - You are about to drop the column `departmentIds` on the `exams` table. All the data in the column will be lost.
  - You are about to drop the column `facultyIds` on the `exams` table. All the data in the column will be lost.
  - You are about to drop the column `questionIds` on the `exams` table. All the data in the column will be lost.
  - You are about to drop the column `restrictedStudentsId` on the `exams` table. All the data in the column will be lost.
  - Added the required column `departmentId` to the `exams` table without a default value. This is not possible if the table is not empty.
  - Added the required column `facultyId` to the `exams` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "departments" DROP CONSTRAINT "departments_faculties_fkey";

-- DropForeignKey
ALTER TABLE "departments" DROP CONSTRAINT "departments_head_fkey";

-- DropForeignKey
ALTER TABLE "exams" DROP CONSTRAINT "exams_departmentIds_fkey";

-- DropForeignKey
ALTER TABLE "exams" DROP CONSTRAINT "exams_facultyIds_fkey";

-- DropForeignKey
ALTER TABLE "exams" DROP CONSTRAINT "exams_questionIds_fkey";

-- DropForeignKey
ALTER TABLE "exams" DROP CONSTRAINT "exams_restrictedStudentsId_fkey";

-- AlterTable
ALTER TABLE "departments" DROP COLUMN "faculties",
DROP COLUMN "head";

-- AlterTable
ALTER TABLE "exams" DROP COLUMN "departmentIds",
DROP COLUMN "facultyIds",
DROP COLUMN "questionIds",
DROP COLUMN "restrictedStudentsId",
ADD COLUMN     "departmentId" TEXT NOT NULL,
ADD COLUMN     "facultyId" TEXT NOT NULL,
ADD COLUMN     "questionId" TEXT;

-- CreateTable
CREATE TABLE "_HeadedDepartments" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_HeadedDepartments_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_FacultyDepartments" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_FacultyDepartments_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ExamQuestions" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ExamQuestions_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_RestrictedStudents" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_RestrictedStudents_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_HeadedDepartments_B_index" ON "_HeadedDepartments"("B");

-- CreateIndex
CREATE INDEX "_FacultyDepartments_B_index" ON "_FacultyDepartments"("B");

-- CreateIndex
CREATE INDEX "_ExamQuestions_B_index" ON "_ExamQuestions"("B");

-- CreateIndex
CREATE INDEX "_RestrictedStudents_B_index" ON "_RestrictedStudents"("B");

-- AddForeignKey
ALTER TABLE "exams" ADD CONSTRAINT "exams_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exams" ADD CONSTRAINT "exams_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exams" ADD CONSTRAINT "exams_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HeadedDepartments" ADD CONSTRAINT "_HeadedDepartments_A_fkey" FOREIGN KEY ("A") REFERENCES "departments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HeadedDepartments" ADD CONSTRAINT "_HeadedDepartments_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FacultyDepartments" ADD CONSTRAINT "_FacultyDepartments_A_fkey" FOREIGN KEY ("A") REFERENCES "departments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FacultyDepartments" ADD CONSTRAINT "_FacultyDepartments_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExamQuestions" ADD CONSTRAINT "_ExamQuestions_A_fkey" FOREIGN KEY ("A") REFERENCES "exams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExamQuestions" ADD CONSTRAINT "_ExamQuestions_B_fkey" FOREIGN KEY ("B") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RestrictedStudents" ADD CONSTRAINT "_RestrictedStudents_A_fkey" FOREIGN KEY ("A") REFERENCES "exams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RestrictedStudents" ADD CONSTRAINT "_RestrictedStudents_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
