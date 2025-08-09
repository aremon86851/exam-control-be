export type ICreateDepartment = {
  name: string
  isActive?: boolean
}

export type IUpdateDepartment = {
  name?: string
  isActive?: boolean
}

export type IDepartmentFilters = {
  searchTerm?: string
  name?: string
  isActive?: boolean
}
