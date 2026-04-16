import HRLayout from "@/components/hr/HRLayout";
import { useGetAllAttendanceQuery } from "@/store/api/attendenceApi";
import { useGetAllEmployeesQuery } from "@/store/api/employeeApi";
import { useGetDepartmentsQuery, useGetDesignationsQuery } from "@/store/api/masterApi";
import { useGetEmployeesOnLeaveTodayQuery } from "@/store/api/leaveApi";
import { useState } from "react";
import { Search } from "lucide-react";

export default function ManagerAttendanceDashboard() {
    const today = new Date().toISOString().split("T")[0];

    const [name, setName] = useState();

    // Filters state
    const [filters, setFilters] = useState({
        date: ""
    });

    const { data: employeesData, isLoading: isEmployeesLoading } = useGetAllEmployeesQuery({
        search: "",
        ...filters,
    });


    const {
        data: allAttendanceData,
        isLoading: isAllAttendanceLoading,
    } = useGetAllAttendanceQuery({
        date: filters.date ? filters.date : today,
   
        search: name

    });



    const totalEmployees = employeesData?.length;

    return (
        <HRLayout
            title="Manager Dashboard"
            subtitle="Track and manage team attendance"
        >
            <div className="p-6 space-y-6">

                {/* 🔹 Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                    <Card title="Total Employees" value={totalEmployees} />
                    <Card title="Present Today" value={(allAttendanceData?.data?.counts?.present || 0) + (allAttendanceData?.data?.counts?.halfDay || 0)} />
                    <Card title="Absent" value={allAttendanceData?.data?.counts?.absent || 0} />
                    <Card title="On Leave" value={allAttendanceData?.data?.counts?.leave || 0} />
                </div>

                {/* 🔹 Filter Panel (Mimics Employees.tsx) */}
                <div className="bg-card border border-border rounded-xl p-5 shadow-[var(--shadow-card)] flex flex-col md:flex-row md:items-end md:justify-between gap-4 transition-all duration-300">
                    {/* Search */}
                    <div className="flex flex-col gap-1 w-full md:w-auto">
                        <label className="text-xs text-muted-foreground ml-1 mb-1">Search</label>
                        <div className="relative w-full">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                type="text"
                                placeholder="Search employees..."
                                className="pl-9 pr-4 py-2 bg-background rounded-lg text-sm border border-border focus:outline-none focus:ring-2 focus:ring-ring w-full md:w-72"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1 w-full md:w-48">
                        <label className="text-xs text-muted-foreground ml-1 mb-1">Date</label>
                        <input
                            type="date"
                            value={filters.date}
                            onChange={e => setFilters({ ...filters, date: e.target.value })}
                            className="mt-0 w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:ring-2 focus:ring-ring"
                            max={today}
                        />
                    </div>
                </div>


                {/* 🔹 Attendance Table */}
                <div className="rounded-3xl border bg-card overflow-hidden">
                    <div className="px-6 py-5 border-b">
                        <h2 className="text-lg font-semibold">Team Attendance</h2>
                    </div>

                    <table className="w-full">
                        <thead>
                            <tr className="border-b text-left">
                                <th className="px-6 py-4">Employee</th>
                                <th className="px-6 py-4">Check In</th>
                                <th className="px-6 py-4">Check Out</th>
                                <th className="px-6 py-4">Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {allAttendanceData?.data?.data?.map((emp: any) => (
                                <tr key={emp.employeeId || emp.employee_id} className="border-b">
                                    <td className="px-6 py-4">
                                        {emp.name}
                                    </td>
                                    <td className="px-6 py-4">
                                        {emp.checkInTime
                                            ? new Date(emp.checkInTime).toLocaleTimeString("en-IN", {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                hour12: false,
                                                timeZone: "Asia/Kolkata",
                                            })
                                            : "--"}
                                    </td>
                                    <td className="px-6 py-4">
                                        {emp.checkOutTime
                                            ? new Date(emp.checkOutTime).toLocaleTimeString("en-IN", {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                hour12: false,
                                                timeZone: "Asia/Kolkata",
                                            })
                                            : "--"}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs ${emp.status === "PRESENT" || emp.status === "present"
                                                ? "bg-green-100 text-green-700"
                                                : emp.status === "ABSENT" || emp.status === "absent"
                                                    ? "bg-red-100 text-red-700"
                                                    : emp.status === "HALF_DAY" || emp.status?.toLowerCase() === "half_day"
                                                        ? "bg-yellow-200 text-yellow-800"
                                                        : "bg-gray-100 text-gray-700"
                                                }`}
                                        >
                                            {emp.status === "PRESENT" || emp.status === "present"
                                                ? "Present"
                                                : emp.status === "ABSENT" || emp.status === "absent"
                                                    ? "Absent"
                                                    : emp.status === "HALF_DAY" || emp.status?.toLowerCase() === "half_day"
                                                        ? "Half Day"
                                                        : emp.status === "ON_LEAVE" || emp.status === "on_leave"
                                                            ? "On Leave"
                                                            : emp.status || "--"}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </HRLayout>
    );
}

/* 🔹 Reusable Card */
function Card({ title, value }: { title: string; value: number }) {
    return (
        <div className="rounded-xl border p-5 bg-card">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-2">{value}</p>
        </div>
    );
}