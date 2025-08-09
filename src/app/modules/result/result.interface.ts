export type ICreateResult = {
  examId: string
  studentId: string
  courseId: string
  semesterId: string
  rawScore: string
  classRank: string
  message: string
}

export type IUpdateResult = Partial<ICreateResult>

export type IResultFilters = {
  searchTerm?: string
  examId?: string
  studentId?: string
  courseId?: string
  semesterId?: string
}
