import { api } from "./api-base";
import {
  IUser,
  IGetUsersResponse,
  IGetUserResponse,
  ICreateUserRequest,
  IUpdateUserRequest
} from "@/types/user";

export const usersApi = api.injectEndpoints({
  endpoints: (build) => ({
    
    // GET ALL USERS
    getUsers: build.query<IGetUsersResponse, void>({
      query: () => ({
        url: "/users",
        method: "GET",
      }),
      providesTags: ["Users"],
    }),

    // GET SINGLE USER
    getUserById: build.query<IGetUserResponse, string>({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Users", id }],
    }),

    // CREATE USER
    createUser: build.mutation<IUser, ICreateUserRequest>({
      query: (body) => ({
        url: "/users/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Users"],
    }),

    // UPDATE USER
    updateUser: build.mutation<
      IUser,
      { userId: string; body: IUpdateUserRequest }
    >({
      query: ({ userId, body }) => ({
        url: `/users/${userId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { userId }) => [
        "Users",
        { type: "Users", id: userId },
      ],
    }),

    // DELETE USER
    deleteUser: build.mutation<{ success: boolean }, string>({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),
  }),

  overrideExisting: false,
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation
} = usersApi;
