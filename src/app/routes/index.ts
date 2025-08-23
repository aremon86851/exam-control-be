import express from 'express';
import { AuthUser } from '../modules/auth/auth.route';
import { AutocompleteRoutes } from '../modules/autocomplete/autocomplete.route';
import { CourseRoutes } from '../modules/course/course.route';
import { DepartmentRoutes } from '../modules/department/department.route';
import { ExamRoutes } from '../modules/exam/exam.route';
import { QuestionRoutes } from '../modules/question/question.route';
import { ResultRoutes } from '../modules/result/result.route';
import { SemesterRoutes } from '../modules/semester/semester.route';
import { SubmissionRoutes } from '../modules/submission/submission.route';
import { UploadRoutes } from '../modules/upload/upload.route';
import { UserRoutes } from '../modules/user/user.route';

const router = express.Router();

const moduleRoutes = [
  // ... routes
  {
    path: '/auth',
    routes: AuthUser,
  },
  {
    path: '/users',
    routes: UserRoutes,
  },
  {
    path: '/departments',
    routes: DepartmentRoutes,
  },
  {
    path: '/courses',
    routes: CourseRoutes,
  },
  {
    path: '/semesters',
    routes: SemesterRoutes,
  },
  {
    path: '/exams',
    routes: ExamRoutes,
  },
  {
    path: '/questions',
    routes: QuestionRoutes,
  },
  {
    path: '/submissions',
    routes: SubmissionRoutes,
  },
  {
    path: '/results',
    routes: ResultRoutes,
  },
  {
    path: '/autocomplete',
    routes: AutocompleteRoutes,
  },
  {
    path: '/uploads',
    routes: UploadRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.routes));
export default router;
