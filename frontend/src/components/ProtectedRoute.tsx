import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetEmployeeByIdQuery } from "@/store/api/employeeApi";

type ProtectedRouteProps = {
  allowedRoles: string[];
};

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  // Try to get userId from localStorage for querying employee details
  const userId = localStorage.getItem("userId");
  const {
    data: employeeData,
    isLoading: isEmployeeLoading,
    error: employeeError,
  } = useGetEmployeeByIdQuery(
    { userId: userId || "" },
    { skip: !userId }
  );

  // If loading employee details, you can display a loading spinner or null
  if (isEmployeeLoading) return null;

  // If error or no user data (not logged in)
  if (!userId || !employeeData) {
    return <Navigate to="/auth" replace />;
  }

  // You can set the role property received from your employeeData, fallback to string for robustness
  const userRole =
    "role" in employeeData
      ? (employeeData as any).role
      : (employeeData as any).user_role || (employeeData as any).userType;

  // If still not found, treat as unauthorized
  if (!userRole || !allowedRoles.includes(userRole)) {
    return <Navigate to="/not-authorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;