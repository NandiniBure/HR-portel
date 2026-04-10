import { createApi } from "@reduxjs/toolkit/query/react";
import applyLeave from "@/api/LeavesApi/applyLeaveApi";
import getLeaveBalance from "@/api/LeavesApi/getbalanceleavesApi";
import getAllLeaves from "@/api/LeavesApi/getAllLeavesApi";
import updateLeaveStatus from "@/api/LeavesApi/aproveLeaveApi";
import { getAllPendingLeaveApi } from "@/api/LeavesApi/getAllpendingLeaveApi";
import { getEmployeesOnLeaveToday } from "@/api/LeavesApi/getEmployeesOnLeaves"; // <-- Added

// Matches the structure used in LeaveApplication.tsx's API call
export interface ApplyLeavePayload {
  leaveTypeId: number;
  startDate: string;
  endDate: string;
  startSession: string;
  endSession: string;
  totalDays: number;
  reason: string;
}

// For updating leave status
export interface UpdateLeaveStatusPayload {
  leaveId: string | number;
  status: string;
}

export const leaveApi = createApi({
  reducerPath: "leaveApi",
  baseQuery: async (_args, api, extraOptions) => {
    return { error: { status: 500, data: "Not Implemented" } };
  },
  tagTypes: ["Leaves", "LeaveBalance", "PendingLeaves", "EmployeesOnLeaveToday"],
  endpoints: (builder) => ({
    applyLeave: builder.mutation<any, ApplyLeavePayload>({
      async queryFn(payload: ApplyLeavePayload) {
        try {
          const data = await applyLeave({
            leaveTypeId: payload.leaveTypeId,
            startDate: payload.startDate,
            endDate: payload.endDate,
            startSession: payload.startSession,
            endSession: payload.endSession,
            totalDays: payload.totalDays,
            reason: payload.reason,
          });
          return { data };
        } catch (error: any) {
          return {
            error: {
              status: error.response?.status || 500,
              data: error.response?.data || error.message || "Apply leave failed",
            },
          };
        }
      },
      // Invalidate leave balance and leaves list after applying a leave
      invalidatesTags: ["LeaveBalance", "Leaves", "PendingLeaves", "EmployeesOnLeaveToday"],
    }),
    getLeaveBalance: builder.query<any, number>({
      async queryFn(year: number) {
        try {
          const data = await getLeaveBalance(year);
          return { data };
        } catch (error: any) {
          return {
            error: {
              status: error.response?.status || 500,
              data: error.response?.data || error.message || "Get leave balance failed",
            },
          };
        }
      },
      providesTags: ["LeaveBalance"],
    }),
    getAllLeaves: builder.query<any, void>({
      async queryFn() {
        try {
          const data = await getAllLeaves();
          return { data };
        } catch (error: any) {
          return {
            error: {
              status: error.response?.status || 500,
              data: error.response?.data || error.message || "Get all leaves failed",
            },
          };
        }
      },
      providesTags: ["Leaves"],
    }),
    getAllPendingLeaves: builder.query<any, void>({
      async queryFn() {
        try {
          const data = await getAllPendingLeaveApi();
          return { data };
        } catch (error: any) {
          // Match error handling of other endpoints
          return {
            error: {
              status: error.response?.status || 500,
              data: error.response?.data?.message || error.message || "Failed to fetch pending leaves",
            },
          };
        }
      },
      providesTags: ["PendingLeaves"],
    }),
    getEmployeesOnLeaveToday: builder.query<any, void>({
      async queryFn() {
        try {
          const data = await getEmployeesOnLeaveToday();
          return { data };
        } catch (error: any) {
          return {
            error: {
              status: error.response?.status || 500,
              data: error.response?.data || error.message || "Failed to fetch employees on leave today",
            },
          };
        }
      },
      providesTags: ["EmployeesOnLeaveToday"],
    }),
    updateLeaveStatus: builder.mutation<any, UpdateLeaveStatusPayload>({
      async queryFn(payload: UpdateLeaveStatusPayload) {
        try {
          const data = await updateLeaveStatus({
            leaveId: payload.leaveId,
            status: payload.status,
          });
          return { data };
        } catch (error: any) {
          return {
            error: {
              status: error.response?.status || 500,
              data: error.response?.data || error.message || "Update leave status failed",
            },
          };
        }
      },
      // Invalidate leaves, leave balance and pending leaves after status update
      invalidatesTags: ["Leaves", "LeaveBalance", "PendingLeaves", "EmployeesOnLeaveToday"],
    }),
  }),
});

export const {
  useApplyLeaveMutation,
  useGetLeaveBalanceQuery,
  useGetAllLeavesQuery,
  useGetAllPendingLeavesQuery,
  useGetEmployeesOnLeaveTodayQuery, // <-- Export new hook
  useUpdateLeaveStatusMutation,
} = leaveApi;