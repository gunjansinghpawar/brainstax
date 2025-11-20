export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin" | "superadmin";
  phone?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  password: string;
  isFirstLogin: boolean;
  companies: string[];
}

export interface IGetUsersResponse {
  success: boolean;
  data: IUser[];
}

export interface IGetUserResponse {
  success: boolean;
  data: IUser;
}

export interface ICreateUserRequest {
  name: string;
  email: string;
  password: string;
  role: string;
  phone?: string;
}

export interface IUpdateUserRequest {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
  phone?: string;
}
