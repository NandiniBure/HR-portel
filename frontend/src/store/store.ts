import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./api/authApi";
import { employeeApi } from "./api/employeeApi";
import { masterApi } from "./api/masterApi";
import { leaveApi } from "./api/leaveApi";
import { attendenceApi } from "./api/attendenceApi";
import { payrollApi } from "./api/payrollApi";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [employeeApi.reducerPath]: employeeApi.reducer,
    [masterApi.reducerPath]: masterApi.reducer,
    [leaveApi.reducerPath]: leaveApi.reducer,
    [attendenceApi.reducerPath]: attendenceApi.reducer,
    [payrollApi.reducerPath]: payrollApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(employeeApi.middleware)
      .concat(masterApi.middleware)
      .concat(leaveApi.middleware)
      .concat(attendenceApi.middleware)
      .concat(payrollApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
