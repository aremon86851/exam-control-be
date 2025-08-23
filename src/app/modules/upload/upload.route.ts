import express from 'express';
import multer from 'multer';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { UploadController } from './upload.controller';

const routes = express.Router();

// Configure multer for in-memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Route for generating questions from uploaded documents
routes.post(
  '/generate-questions',
  auth(
    ENUM_USER_ROLE.TEACHER,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN
  ),
  upload.single('file'),
  UploadController.generateQuestions
);

// Route for generating questions using OpenAI
routes.post(
  '/generate-questions-ai',
  auth(
    ENUM_USER_ROLE.TEACHER,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN
  ),
  upload.single('file'),
  UploadController.generateQuestionsWithAI
);

export const UploadRoutes = routes;
