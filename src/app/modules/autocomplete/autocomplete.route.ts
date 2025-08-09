import express from 'express';
import auth from '../../middlewares/auth';
import { AutocompleteController } from './autocomplete.controller';

const routes = express.Router();

// General autocomplete endpoint
// routes.get('/', auth(), AutocompleteController.getAutocomplete);

// Specific entity endpoints
routes.get('/departments', auth(), AutocompleteController.getDepartments);
routes.get('/courses', auth(), AutocompleteController.getCourses);
routes.get('/semesters', auth(), AutocompleteController.getSemesters);
routes.get('/instructors', auth(), AutocompleteController.getInstructors);
routes.get('/students', auth(), AutocompleteController.getStudents);
routes.get('/exams', auth(), AutocompleteController.getExams);
routes.get('/questions', auth(), AutocompleteController.getQuestions);

export const AutocompleteRoutes = routes;
