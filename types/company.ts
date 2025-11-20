import { IUser } from "./user";

export interface IDepartment {
  name: string;
  description?: string;
}

export interface ICompany {
  _id: string;
  name: string;
  email: string;
  address: string;
  phone: string;
  companyAdmin: IUser; // User ID
  employees: string[]; // Array of User IDs
  departments: IDepartment[];
  createdAt: string;
  updatedAt: string;
}
