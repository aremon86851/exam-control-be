export type ICreateSubmission = {
  exam: string
  studentId: string
  startTime: Date
  endTime: Date
  submittedAt: Date
  timeSpent: number
  answer: string[]
  totalScore: number
  percent: string
  passed: string
}

export type IUpdateSubmission = Partial<ICreateSubmission>

export type ISubmissionFilters = {
  searchTerm?: string
  exam?: string
  studentId?: string
  passed?: string
}
