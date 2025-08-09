export type ICreateCourse = {
  title: string;
  departmentId: string;
  instructorId: string;
  credits: number;
  durations: number;
  maxStudent: number;
  isActive: string;
};

export type IUpdateCourse = {
  title?: string;
  departmentId?: string;
  instructorId?: string;
  credits?: number;
  durations?: number;
  maxStudent?: number;
  isActive?: string;
};

export type ICourseFilters = {
  searchTerm?: string;
  title?: string;
  departmentId?: string;
  instructorId?: string;
  isActive?: string;
};
