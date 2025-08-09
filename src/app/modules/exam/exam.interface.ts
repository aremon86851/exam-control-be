export type ICreateExam = {
  duration: number
  description: string
  startDate: string
  endDate: string
  departmentId: string
  semesterId: string
  courseId: string
  facultyId: string
  questionIds?: string[]
}

export type IUpdateExam = Partial<ICreateExam>

export type IExamFilters = {
  searchTerm?: string
  departmentId?: string
  semesterId?: string
  courseId?: string
  facultyId?: string
}
