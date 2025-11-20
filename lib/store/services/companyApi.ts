import { createApi } from "@reduxjs/toolkit/query/react";

import type { ICompany, IDepartment } from "@/types/company";
import type { IEmployee } from "@/types/employee";
import type { ApiSuccess } from "@/types/api";

import { BACKEND_URL } from "@/URLS";
import { baseQueryWithAuth } from "../baseQuery"; // ✅ GLOBAL QUERY

export interface CreateCompanyPayload {
  name: string;
  email: string;
  address: string;
  phone: string;

  adminName: string;
  adminEmail: string;
  adminPassword: string;

  departments?: IDepartment[];
}

export interface UpdateCompanyPayload {
  name?: string;
  email?: string;
  address?: string;
  phone?: string;
  departments?: IDepartment[];
}

export const companyApi = createApi({
  reducerPath: "companyApi",

  // ✅ Use global baseQuery
  baseQuery: baseQueryWithAuth(`${BACKEND_URL}/companies`),

  tagTypes: ["Companies", "Company", "Employees"],

  endpoints: (builder) => ({
    /* ---------------------------------------------
     * COMPANIES CRUD
     * --------------------------------------------- */

    getCompanies: builder.query<ApiSuccess<ICompany[]>, void>({
      query: () => "/",
      providesTags: ["Companies"],
    }),

    getCompanyById: builder.query<ApiSuccess<ICompany>, string>({
      query: (id) => `/${id}`,
      providesTags: (_r, _e, id) => [{ type: "Company", id }],
    }),

    createCompany: builder.mutation<ApiSuccess<ICompany>, CreateCompanyPayload>({
      query: (body) => ({
        url: "/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Companies"],
    }),

    updateCompany: builder.mutation<
      ApiSuccess<ICompany>,
      { id: string; body: UpdateCompanyPayload }
    >({
      query: ({ id, body }) => ({
        url: `/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        "Companies",
        { type: "Company", id },
      ],
    }),

    deleteCompany: builder.mutation<ApiSuccess<string>, string>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Companies"],
    }),

    /* ---------------------------------------------
     * EMPLOYEES
     * --------------------------------------------- */

    getCompanyEmployees: builder.query<ApiSuccess<IEmployee[]>, string>({
      query: (companyId) => `/${companyId}/employees`,
      providesTags: ["Employees"],
    }),

    getEmployeeById: builder.query<
      ApiSuccess<IEmployee>,
      { companyId: string; employeeId: string }
    >({
      query: ({ companyId, employeeId }) =>
        `/${companyId}/employees/${employeeId}`,
      providesTags: ["Employees"],
    }),

    addEmployee: builder.mutation<
      ApiSuccess<IEmployee>,
      { companyId: string; body: Partial<IEmployee> }
    >({
      query: ({ companyId, body }) => ({
        url: `/${companyId}/employees`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Employees"],
    }),

    removeEmployee: builder.mutation<
      ApiSuccess<string>,
      { companyId: string; employeeId: string }
    >({
      query: ({ companyId, employeeId }) => ({
        url: `/${companyId}/employees/${employeeId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Employees"],
    }),
  }),
});

export const {
  useGetCompaniesQuery,
  useGetCompanyByIdQuery,
  useCreateCompanyMutation,
  useUpdateCompanyMutation,
  useDeleteCompanyMutation,

  useGetCompanyEmployeesQuery,
  useGetEmployeeByIdQuery,
  useAddEmployeeMutation,
  useRemoveEmployeeMutation,
} = companyApi;
