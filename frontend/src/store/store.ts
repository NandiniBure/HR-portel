import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./api/authApi";
import { employeeApi } from "./api/employeeApi";
import { masterApi } from "./api/masterApi";
import { leaveApi } from "./api/leaveApi";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [employeeApi.reducerPath]: employeeApi.reducer,
    [masterApi.reducerPath]: masterApi.reducer,
    [leaveApi.reducerPath]: leaveApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(employeeApi.middleware)
      .concat(masterApi.middleware)
      .concat(leaveApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
