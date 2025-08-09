import prisma from '../../../constants/prisma-client';
import type {
  IAutocompleteOption,
  IAutocompleteQuery,
} from '../../../interfaces/autocomplete';

const getDepartments = async (
  query: IAutocompleteQuery
): Promise<IAutocompleteOption[]> => {
  const { q = '', limit = 10 } = query;

  const departments = await prisma.department.findMany({
    where: {
      AND: [
        { isActive: true },
        q
          ? {
              name: {
                contains: q,
                mode: 'insensitive',
              },
            }
          : {},
      ],
    },
    select: {
      id: true,
      name: true,
    },
    take: limit,
    orderBy: {
      name: 'asc',
    },
  });

  return departments.map(dept => ({
    id: dept.id,
    label: dept.name,
    value: dept.id,
  }));
};

const getCourses = async (
  query: IAutocompleteQuery
): Promise<IAutocompleteOption[]> => {
  const { q = '', limit = 10, filters = {} } = query;

  const courses = await prisma.course.findMany({
    where: {
      AND: [
        { isActive: 'true' },
        q
          ? {
              title: { contains: q, mode: 'insensitive' },
            }
          : {},
        filters.departmentId ? { departmentId: filters.departmentId } : {},
      ],
    },
    select: {
      id: true,
      title: true,
    },
    take: limit,
    orderBy: {
      title: 'asc',
    },
  });

  return courses.map(course => ({
    id: course.id,
    label: course.title,
    value: course.id,
  }));
};

const getSemesters = async (
  query: IAutocompleteQuery
): Promise<IAutocompleteOption[]> => {
  const { q = '', limit = 10 } = query;

  const semesters = await prisma.semester.findMany({
    where: q
      ? {
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { code: { contains: q, mode: 'insensitive' } },
            { year: { contains: q, mode: 'insensitive' } },
          ],
        }
      : {},
    select: {
      id: true,
      name: true,
      code: true,
      year: true,
    },
    take: limit,
    orderBy: [{ year: 'desc' }, { name: 'asc' }],
  });

  return semesters.map(semester => ({
    id: semester.id,
    label: `${semester.name} ${semester.year} (${semester.code})`,
    value: semester.id,
  }));
};

const getUsers = async (
  query: IAutocompleteQuery
): Promise<IAutocompleteOption[]> => {
  const { q = '', limit = 10, filters = {} } = query;

  const users = await prisma.user.findMany({
    where: {
      AND: [
        q
          ? {
              OR: [
                { name: { contains: q, mode: 'insensitive' } },
                { email: { contains: q, mode: 'insensitive' } },
              ],
            }
          : {},
        filters.role
          ? {
              roles: {
                has: filters.role,
              },
            }
          : {},
      ],
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
    take: limit,
    orderBy: {
      name: 'asc',
    },
  });

  return users.map(user => ({
    id: user.id,
    label: `${user.name} (${user.email})`,
    value: user.id,
  }));
};

const getInstructors = async (
  query: IAutocompleteQuery
): Promise<IAutocompleteOption[]> => {
  const { q = '', limit = 10 } = query;

  const instructors = await prisma.user.findMany({
    where: {
      AND: [
        {
          roles: {
            hasSome: ['TEACHER', 'ADMIN', 'SUPER_ADMIN'],
          },
        },
        q
          ? {
              OR: [
                { name: { contains: q, mode: 'insensitive' } },
                { email: { contains: q, mode: 'insensitive' } },
              ],
            }
          : {},
      ],
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
    take: limit,
    orderBy: {
      name: 'asc',
    },
  });

  return instructors.map(instructor => ({
    id: instructor.id,
    label: `${instructor.name} (${instructor.email})`,
    value: instructor.id,
  }));
};

const getStudents = async (
  query: IAutocompleteQuery
): Promise<IAutocompleteOption[]> => {
  const { q = '', limit = 10, filters = {}, roles } = query;

  const students = await prisma.user.findMany({
    where: {
      AND: [
        {
          roles: {
            has: roles,
          },
        },
        q
          ? {
              OR: [
                { name: { contains: q, mode: 'insensitive' } },
                { email: { contains: q, mode: 'insensitive' } },
              ],
            }
          : {},
        filters.departmentId
          ? {
              studentInfo: {
                departmentId: filters.departmentId,
              },
            }
          : {},
      ],
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
    take: limit,
    orderBy: {
      name: 'asc',
    },
  });

  return students.map(student => ({
    id: student.id,
    label: student.email,
    value: student.id,
  }));
};

const getExams = async (
  query: IAutocompleteQuery
): Promise<IAutocompleteOption[]> => {
  const { q = '', limit = 10, filters = {} }: any = query;

  const exams = await prisma.exam.findMany({
    where: {
      AND: [
        q
          ? {
              title: { contains: q, mode: 'insensitive' },
            }
          : {},
        filters.courseId ? { courseId: filters.courseId } : {},
        filters.departmentId ? { departmentId: filters.departmentId } : {},
        filters.semesterId ? { semesterId: filters.semesterId } : {},
      ],
    },
    select: {
      id: true,
      title: true,
    },
    take: limit,
    orderBy: {
      title: 'asc',
    },
  });

  return exams.map(exam => ({
    id: exam.id,
    label: exam.title,
    value: exam.id,
  }));
};

const getQuestions = async (
  query: IAutocompleteQuery
): Promise<IAutocompleteOption[]> => {
  const { q = '', limit = 10, filters = {} }: any = query;

  const questions = await prisma.question.findMany({
    where: {
      AND: [
        q
          ? {
              question: { contains: q, mode: 'insensitive' },
            }
          : {},
        filters.courseId ? { courseId: filters.courseId } : {},
        filters.type ? { type: filters.type } : {},
        filters.difficulty ? { difficulty: filters.difficulty } : {},
      ],
    },
    select: {
      id: true,
      question: true,
    },
    take: limit,
    orderBy: {
      createdAt: 'desc',
    },
  });

  return questions.map(question => ({
    id: question.id,
    label:
      question.question.length > 50
        ? `${question.question.substring(0, 50)}...`
        : question.question,
    value: question.id,
  }));
};

export const AutocompleteServices = {
  getDepartments,
  getCourses,
  getSemesters,
  getUsers,
  getInstructors,
  getStudents,
  getExams,
  getQuestions,
};
