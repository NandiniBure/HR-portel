import { createApi } from "@reduxjs/toolkit/query/react";
import fetchEmployeeById from "@/api/getEmployeeDetailsApi";
import getAllEmployeesApi from "@/api/EmployeesApi/getAllEmployeesApi";

export interface GetEmployeeByIdPayload {
  userId: string;
}

export interface Employee {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

const TAGS = ["Employee"];

export const employeeApi = createApi({
  reducerPath: "employeeApi",
  baseQuery: async (_args, api, extraOptions) => {
    // baseQuery not used, custom endpoint below
    return { error: { status: 500, data: "Not Implemented" } };
  },
  tagTypes: TAGS,
  endpoints: (builder) => ({
    getEmployeeById: builder.query<Employee, void>({
      async queryFn() {
        try {
          const data = await fetchEmployeeById();
          return { data };
        } catch (error: any) {
          return {
            error: {
              status: error.response?.status || 500,
              data:
                error.response?.data ||
                error.message ||
                "Fetch employee failed",
            },
          };
        }
      },
      providesTags: (result) =>
        result
          ? [{ type: "Employee" }]
          : [{ type: "Employee" }],
    }),
    getAllEmployees: builder.query<Employee[], { search?: string; department?: string; designation?: string; status?: string; joinedFrom?: string; joinedTo?: string } | void>({
      async queryFn(filters = {}) {
        try {
          // Pass filters (including search) as object to getAllEmployeesApi
          const data = await getAllEmployeesApi(filters);
          return { data };
        } catch (error: any) {
          return {
            error: {
              status: error.response?.status || 500,
              data:
                error.response?.data ||
                error.message ||
                "Fetch all employees failed",
            },
          };
        }
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map((emp) => ({
                type: "Employee" as const,
                id: emp.id,
              })),
              { type: "Employee" },
            ]
          : [{ type: "Employee" }],
    }),
  }),
});

export const { useGetEmployeeByIdQuery, useGetAllEmployeesQuery } = employeeApi;
