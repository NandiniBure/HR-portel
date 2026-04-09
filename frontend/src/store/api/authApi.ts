import { createApi } from "@reduxjs/toolkit/query/react";
import login, { signup } from "@/api/loginApi"; // Assume appropriate path aliasing, adjust if needed

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  name?: string;
  email: string;
  password: string;
  role?: string;
  first_name?: string;
  last_name?: string;
  department_id?: string | number;
  designation_id?: string | number;
  joining_date?: string;
  employment_type?: string;
  salary?: string | number;
}

export interface User {
  id: string;
  name?: string;
  email: string;
  [key: string]: any;
}

export interface AuthResponse {
  accessToken: string;
  user?: User;
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: async (_args, api, extraOptions) => {
    return { error: { status: 500, data: "Not Implemented" } };
  },
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginPayload>({
      async queryFn(loginPayload: LoginPayload) {
        try {
          const data = await login(loginPayload);
          return { data };
        } catch (error: any) {
          return {
            error: {
              status: error.response?.status || 500,
              data: error.response?.data || error.message || "Login failed",
            },
          };
        }
      },
    }),
    signup: builder.mutation<AuthResponse, SignupPayload>({
      async queryFn(signupPayload: SignupPayload) {
        try {
          const data = await signup(signupPayload);
          return { data };
        } catch (error: any) {
          return {
            error: {
              status: error.response?.status || 500,
              data: error.response?.data || error.message || "Signup failed",
            },
          };
        }
      },
    }),
  }),
});

export const { useLoginMutation, useSignupMutation } = authApi;
