-- AddForeignKey
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_exam_fkey" FOREIGN KEY ("exam") REFERENCES "exams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
