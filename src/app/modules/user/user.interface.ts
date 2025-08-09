import type { Roles, Status } from "@prisma/client"

export type ICreateUser = {
  name?: string
  email: string
  password?: string
  mobile?: string
  roles?: Roles[]
  status?: Status
  avatar?: string
}

export type IUpdateUser = {
  name?: string
  mobile?: string
  avatar?: string
  isActive?: boolean
}

export type IUserFilters = {
  searchTerm?: string
  email?: string
  mobile?: string
  role?: Roles
  status?: Status
  isActive?: boolean
}

export type IUpdateUserRoles = {
  roles: Roles[]
}
