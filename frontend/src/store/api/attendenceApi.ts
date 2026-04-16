import { createApi } from "@reduxjs/toolkit/query/react";
import { checkInAttendance } from "@/api/AttendenceApi/checkInApi";
import { checkOutAttendance } from "@/api/AttendenceApi/checkoutApi";
import { getEmployeeAttendance } from "@/api/AttendenceApi/getAttendenceByEmployeeId";
import { getAllAttendance } from "@/api/AttendenceApi/getAllAttendenceApi";

export const attendenceApi = createApi({
  reducerPath: "attendenceApi",
  baseQuery: async (_args, api, extraOptions) => {
    // baseQuery not used, endpoints are handled via queryFn
    return { error: { status: 500, data: "Not Implemented" } };
  },
  tagTypes: ["Attendance"],
  endpoints: (builder) => ({
    checkIn: builder.mutation<any, { employeeId: string }>({
      async queryFn(payload) {
        try {
          console.log(payload.employeeId);
          const data = await checkInAttendance(payload.employeeId);
          return { data };
        } catch (error: any) {
          return {
            error: {
              status: error.response?.status || 500,
              data:
                error.response?.data ||
                error.message ||
                "Attendance check-in failed",
            },
          };
        }
      },
      invalidatesTags: ["Attendance"],
    }),
    checkOut: builder.mutation<any, { employeeId: string }>({
      async queryFn(payload) {
        try {
          console.log(payload);
          const data = await checkOutAttendance(payload);
          return { data };
        } catch (error: any) {
          return {
            error: {
              status: error.response?.status || 500,
              data:
                error.response?.data ||
                error.message ||
                "Attendance check-out failed",
            },
          };
        }
      },
      invalidatesTags: ["Attendance"],
    }),
    getEmployeeAttendance: builder.query<
      any,
      { employeeId: string; date?: string }
    >({
      async queryFn({ employeeId, date }) {
        try {
          const data = await getEmployeeAttendance(employeeId, date);
          return { data };
        } catch (error: any) {
          return {
            error: {
              status: error.response?.status || 500,
              data:
                error.response?.data ||
                error.message ||
                "Fetch employee attendance failed",
            },
          };
        }
      },
      providesTags: ["Attendance"],
    }),
    getAllAttendance: builder.query<any, { date: string; search?: string }>({
      async queryFn({ date, search = "" }) {
        try {
          const data = await getAllAttendance(date, search);
          return { data };
        } catch (error: any) {
          return {
            error: {
              status: error.response?.status || 500,
              data:
                error.response?.data ||
                error.message ||
                "Fetch all attendance failed",
            },
          };
        }
      },
      providesTags: ["Attendance"],
    }),
  }),
});

export const {
  useCheckInMutation,
  useCheckOutMutation,
  useGetEmployeeAttendanceQuery,
  useGetAllAttendanceQuery,
} = attendenceApi;
