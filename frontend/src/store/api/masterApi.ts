import { createApi } from "@reduxjs/toolkit/query/react";
import { fetchDepartments, fetchDesignations } from "@/api/master";

export interface Department {
  id: string;
  name: string;
}

export interface Designation {
  id: string;
  name: string;
}

export const masterApi = createApi({
  reducerPath: "masterApi",
  baseQuery: async (_args, api, extraOptions) => {
    // Not used, endpoints use custom queryFn
    return { error: { status: 500, data: "Not Implemented" } };
  },
  endpoints: (builder) => ({
    getDepartments: builder.query<Department[], void>({
      async queryFn() {
        try {
          const data = await fetchDepartments();
          return { data };
        } catch (error: any) {
          return {
            error: {
              status: error.response?.status || 500,
              data:
                error.response?.data ||
                error.message ||
                "Failed to fetch departments",
            },
          };
        }
      },
    }),
    getDesignations: builder.query<Designation[], void>({
      async queryFn() {
        try {
          const data = await fetchDesignations();
          return { data };
        } catch (error: any) {
          return {
            error: {
              status: error.response?.status || 500,
              data:
                error.response?.data ||
                error.message ||
                "Failed to fetch designations",
            },
          };
        }
      },
    }),
  }),
});

export const { useGetDepartmentsQuery, useGetDesignationsQuery } = masterApi;