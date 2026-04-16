import {
  LayoutDashboard,
  Users,
  CalendarDays,
  DollarSign,
  UserPlus,
  Settings,
  LogOut,
  Building2,
  AppleIcon,
  Send,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocation, useNavigate } from "react-router-dom";
import { useGetEmployeeByIdQuery } from "@/store/api/employeeApi";
import { useEffect, useState } from "react";
// Define roles
const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/", roles: ["employee", "manager", "admin"] },
  { icon: Users, label: "Employees", path: "/employees", roles: ["manager", "admin"] },
  { icon: CalendarDays, label: "Leave Management", path: "/leave", roles: ["manager", "admin"] },
  { icon: Send, label: "Attendance Management", path: "/attendence", roles: ["employee", "manager", "admin"] },
  { icon: Send, label: "Attendance Management (Manager)", path: "/attendence-manager", roles: ["manager", "admin"] },
  { icon: AppleIcon, label: "Apply Leave", path: "/leave-apply", roles: ["employee"] },
  { icon: DollarSign, label: "Payroll", path: "/payroll", roles: ["manager", "admin"] },
  { icon: UserPlus, label: "Recruitment", path: "/recruitment", roles: ["admin"] },
  { icon: Settings, label: "Settings", path: "/settings", roles: ["employee", "manager", "admin"] },
];

// Extract role safely
function extractUserRole(employeeData) {
  if (!employeeData) return undefined;
  if (employeeData.role) return employeeData.role;
  if (employeeData.user_role) return employeeData.user_role;
  if (employeeData.userType) return employeeData.userType;
  return undefined;
}

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");



  const {
    data: employeeData,
    refetch,
    isLoading,
  } = useGetEmployeeByIdQuery(undefined, {
    skip: !userId,
  });
  const userRole = extractUserRole(employeeData);


  // Default values
  let displayName = "Jane Doe";
  let displayRole = userRole || "Employee";
  let displayInitials = "JD";

  if (employeeData?.first_name && employeeData?.last_name) {
    displayName = `${employeeData.first_name} ${employeeData.last_name}`;
    displayInitials = `${employeeData.first_name[0]}${employeeData.last_name[0]}`.toUpperCase();
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-sidebar flex flex-col z-50">

      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-sidebar-border">
        <div className="w-9 h-9 rounded-lg bg-sidebar-primary flex items-center justify-center">
          <Building2 className="w-5 h-5 text-sidebar-primary-foreground" />
        </div>
        <div>
          <h1 className="text-sidebar-accent-foreground font-bold text-lg">
            HR Portal
          </h1>
          <p className="text-sidebar-foreground text-xs">
            People Management
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.filter(
          (item) => !item.roles || (userRole && item.roles.includes(userRole))
        ).map((item) => (
          <button
            key={item.label}
            onClick={() => navigate(item.path)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
              location.pathname === item.path
                ? "bg-sidebar-accent text-sidebar-primary"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </button>
        ))}
      </nav>

      {/* User Profile */}
      <div className="px-3 pb-4">
        <div className="flex items-center gap-3 px-3 py-3 rounded-lg bg-sidebar-accent">
          <div className="w-8 h-8 rounded-full bg-sidebar-primary flex items-center justify-center text-sidebar-primary-foreground text-sm font-bold">
            {displayInitials}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-accent-foreground truncate">
              {isLoading ? "Loading..." : displayName}
            </p>
            <p className="text-xs text-sidebar-foreground truncate">
              {displayRole}
            </p>
          </div>

          <LogOut
            className="w-4 h-4 text-sidebar-foreground cursor-pointer hover:text-sidebar-accent-foreground transition-colors"
            onClick={() => {
              localStorage.removeItem("userId");
              localStorage.removeItem("token");
              // navigate("/login");
            }}
          />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar; 