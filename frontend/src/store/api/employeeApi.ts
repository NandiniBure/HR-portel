import { createApi } from "@reduxjs/toolkit/query/react";
import fetchEmployeeById from "@/api/getEmployeeDetailsApi";
import getAllEmployeesApi from "@/api/EmployeesApi/getAllEmployeesApi";

export interface GetEmployeeByIdPayload {
  userId: string;
}

export interface Employee {
  // Update these fields based on expected API response
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  // Add additional fields if needed
}

export const employeeApi = createApi({
  reducerPath: "employeeApi",
  baseQuery: async (_args, api, extraOptions) => {
    // baseQuery not used, custom endpoint below
    return { error: { status: 500, data: "Not Implemented" } };
  },
  endpoints: (builder) => ({
    getEmployeeById: builder.query<Employee, GetEmployeeByIdPayload>({
      async queryFn(getEmployeePayload: GetEmployeeByIdPayload) {
        try {
          const data = await fetchEmployeeById(getEmployeePayload);
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
    }),
    getAllEmployees: builder.query<Employee[], { search?: string } | void>({
      async queryFn(arg) {
        try {
          console.log(arg);
          const data = await getAllEmployeesApi(
            typeof arg === "string"
              ? arg
              : undefined
          );
     
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
    }),
  }),
});

export const { useGetEmployeeByIdQuery, useGetAllEmployeesQuery } = employeeApi;
