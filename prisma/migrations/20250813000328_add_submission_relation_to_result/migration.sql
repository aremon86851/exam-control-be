/*
  Warnings:

  - A unique constraint covering the columns `[submissionId]` on the table `results` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "results" ADD COLUMN     "submissionId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "results_submissionId_key" ON "results"("submissionId");

-- AddForeignKey
ALTER TABLE "results" ADD CONSTRAINT "results_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "submissions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
