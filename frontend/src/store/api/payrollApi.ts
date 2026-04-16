import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const payrollApi = createApi({
  reducerPath: "payrollApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BASE_URL}payroll`,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getAllPayroll: builder.query<any, void>({
      query: () => ({
        url: "/all/payrolls",
        method: "GET",
      }),
    }),
    // You can define other payroll endpoints here
  }),
});

export const { useGetAllPayrollQuery } = payrollApi;
