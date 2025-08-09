export type ICreateSemester = {
  name: string
  code: string
  year: string
  startDate: Date
  endDate: Date
  examStart: Date
  examEnd: Date
  coursesId: string
}

export type IUpdateSemester = Partial<ICreateSemester>

export type ISemesterFilters = {
  searchTerm?: string
  name?: string
  code?: string
  year?: string
  coursesId?: string
}
