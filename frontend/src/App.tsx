import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import LeaveManagement from "./pages/LeaveManagement";
import Payroll from "./pages/Payroll";
import Recruitment from "./pages/Recruitment";
import Settings from "./pages/Settings";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import { Provider } from "react-redux";
import { store } from "./store/store";
import EmployeeApplyLeave from "./pages/LeaveApplication";
import ProtectedRoute from "./components/ProtectedRoute";
import EmployeeAttendanceMarking from "./pages/Attendence";
import ManagerAttendanceDashboard from "./pages/ManageAttendence";
import React from "react";

const queryClient = new QueryClient();

const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const userId = localStorage.getItem("userId");
  // if not on /auth, and NOT logged in, redirect to /auth
  if (!userId && location.pathname !== "/auth") {
    return <Navigate to="/auth" replace />;
  }
  return <>{children}</>;
};

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <RequireAuth>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/employees" element={<Employees />} />
              <Route element={<ProtectedRoute allowedRoles={["manager"]} />}>
                <Route path="/leave" element={<LeaveManagement />} />
              </Route>
              <Route path="/leave-apply" element={<EmployeeApplyLeave />} />
              <Route path="/attendence" element={<EmployeeAttendanceMarking />} />
              <Route path="/attendence-manager" element={<ManagerAttendanceDashboard />} />
              <Route path="/payroll" element={<Payroll />} />
              <Route path="/recruitment" element={<Recruitment />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </RequireAuth>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </Provider>
);

export default App;
