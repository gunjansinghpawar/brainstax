import { ICompany } from "./company";
import { IUser } from "./user";

export interface IEmployee {
  _id: string;      // userId only
  userId: IUser;    // ⬅ added for UI
  companyId: ICompany;
  department: string;
  createdAt: string;
  updatedAt: string;
  user: {
    name?: string;
    email?: string;
    password?: string;
  }; // userId only
}

export interface RawEmployee {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  companyId: {
    _id: string;
    name: string;
    email: string;
  };
  department: string;
  createdAt: string;
  updatedAt: string;
}
