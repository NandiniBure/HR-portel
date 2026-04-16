import { Users, CalendarDays, Briefcase, TrendingUp } from "lucide-react";
import HRLayout from "@/components/hr/HRLayout";
import StatCard from "@/components/hr/StatCard";
import EmployeeTable from "@/components/hr/EmployeeTable";
import LeaveRequests from "@/components/hr/LeaveRequests";
import ActivityFeed from "@/components/hr/ActivityFeed";
import { useGetAllEmployeesQuery, useGetEmployeeByIdQuery } from "@/store/api/employeeApi";
import { useGetEmployeesOnLeaveTodayQuery } from "@/store/api/leaveApi";
import { useGetAllAttendanceQuery } from "@/store/api/attendenceApi";

const Dashboard = () => {
  const userId = localStorage.getItem("userId") || "";
  const { data, isLoading, error: fetchError } = useGetAllEmployeesQuery();
  const { data: onLeaveToday, isLoading: isLoadingOnLeaveToday, error: onLeaveTodayError } = useGetEmployeesOnLeaveTodayQuery();
  const {
    data: employeeData,
    isLoading: isEmployeeLoading,
    error: employeeError,
  } = useGetEmployeeByIdQuery();
  const today = new Date().toISOString().split("T")[0];
  const {
    data: allAttendanceData,
    isLoading: isAllAttendanceLoading,
    error: allAttendanceError,
  } = useGetAllAttendanceQuery({ date: today });

  return (
    <HRLayout title="Dashboard" subtitle="Welcome back, Jane. Here's what's happening today.">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Employees" value={data?.length} change="+12 this month" changeType="positive" icon={Users} />
          <StatCard title="On Leave Today" value={onLeaveToday?.data?.length} change="3 pending approval" changeType="neutral" icon={CalendarDays} iconColor="bg-warning" />

          <StatCard title="Attendance Rate" value={allAttendanceData?.data?.attendanceRate} change="+1.3% vs last month" changeType="positive" icon={TrendingUp} iconColor="bg-success" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2"><EmployeeTable /></div>
          <div className="space-y-6">
            {employeeData?.user_role === "manager" && <LeaveRequests />}
            {/* <ActivityFeed /> */}
          </div>
        </div>
      </div>
    </HRLayout>
  );
};

export default Dashboard;
