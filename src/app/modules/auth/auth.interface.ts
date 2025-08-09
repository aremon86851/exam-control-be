import type { Roles, Status } from '@prisma/client';

export type IRegisterUser = {
  name?: string;
  email: string;
  password?: string;
  mobile?: string;
  roles?: Roles[];
  status?: Status;
  avatar?: string;
};

export type ILoginUser = {
  email: string;
  password: string;
};

export type IChangePassword = {
  currentPassword: string;
  newPassword: string;
};

export type IRefreshTokenResponse = {
  accessToken: string;
};

export type ILoginUserResponse = {
  accessToken: string;
  refreshToken?: string;
  user: {
    id: string;
    name?: string;
    email: string;
    mobile?: string;
    roles: Roles[];
    status: Status;
    avatar?: string;
    isActive: boolean;
    lastLogin?: Date;
  };
};
