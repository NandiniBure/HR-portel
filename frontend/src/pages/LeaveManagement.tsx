import { CalendarDays, Check, X, Filter, Search } from "lucide-react";
import HRLayout from "@/components/hr/HRLayout";
import { Badge } from "@/components/ui/badge";
import { useGetAllLeavesQuery, useUpdateLeaveStatusMutation } from "@/store/api/leaveApi";
import React, { useState } from "react";

const statusStyles: Record<string, string> = {
  // For the table mapped status
  PENDING: "bg-warning/10 text-warning border-warning/20",
  APPROVED: "bg-success/10 text-success border-success/20",
  REJECTED: "bg-destructive/10 text-destructive border-destructive/20",
};



const defaultFilters = {
  employeeName: "",
  employeeId: "",
  status: "",
  fromDate: "",
  toDate: "",
  overlapsDate: "",
};

const LeaveManagement = () => {

  const [updateLeaveStatus, { isLoading: updatingStatus }] = useUpdateLeaveStatusMutation();

  const [filters, setFilters] = useState(defaultFilters);

  const handleApproval = ({ leaveId, status }: any) => {
    updateLeaveStatus({ leaveId, status });
  };

  const { data: allLeaves, isLoading: loadingLeaves, error: leavesError } = useGetAllLeavesQuery(filters);


  return (
    <HRLayout title="Leave Management" subtitle="Track and manage employee leave requests.">
      <div className="space-y-6">

        <div className="bg-card border border-border rounded-xl p-5 shadow-[var(--shadow-card)] 
flex flex-col gap-5 transition-all duration-300">

          {/* Row 1 */}
          <div className="flex flex-col md:flex-row gap-4 md:items-end">

            {/* Search Employee */}
            <div className="flex flex-col gap-1 w-full md:w-72">
              <label className="text-xs text-muted-foreground ml-1">Employee Name</label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search by name..."
                  value={filters.employeeName}
                  onChange={(e) =>
                    setFilters({ ...filters, employeeName: e.target.value })
                  }
                  className="pl-9 pr-4 py-2 bg-background rounded-lg text-sm border border-border focus:ring-2 focus:ring-ring w-full"
                />
              </div>
            </div>


            {/* Status */}
            <div className="flex flex-col gap-1 w-full md:w-48">
              <label className="text-xs text-muted-foreground ml-1">Status</label>
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
                className="px-3 py-2 bg-background border border-border rounded-md text-sm focus:ring-2 focus:ring-ring"
              >
                <option value="">All</option>
                <option value="APPROVED">Approved</option>
                <option value="PENDING">Pending</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          </div>

          {/* Row 2 */}
          <div className="flex flex-col md:flex-row gap-4 md:items-end">

            {/* From Date */}
            <div className="flex flex-col gap-1 w-full md:w-48">
              <label className="text-xs text-muted-foreground ml-1">From Date</label>
              <input
                type="date"
                value={filters.fromDate}
                onChange={(e) =>
                  setFilters({ ...filters, fromDate: e.target.value })
                }
                className="px-3 py-2 bg-background border border-border rounded-md text-sm focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* To Date */}
            <div className="flex flex-col gap-1 w-full md:w-48">
              <label className="text-xs text-muted-foreground ml-1">To Date</label>
              <input
                type="date"
                value={filters.toDate}
                onChange={(e) =>
                  setFilters({ ...filters, toDate: e.target.value })
                }
                className="px-3 py-2 bg-background border border-border rounded-md text-sm focus:ring-2 focus:ring-ring"
              />
            </div>



            {/* Clear Button */}
            <div className="w-full md:w-auto">
              <button
                onClick={() => setFilters({ ...defaultFilters })}
                className="px-4 py-2 rounded-md text-sm border border-border bg-muted hover:bg-muted/70 transition"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Requests Table */}
        <div className="bg-card rounded-xl shadow-[var(--shadow-card)] border border-border overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h3 className="font-semibold text-card-foreground">All Leave Requests</h3>
          
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Employee</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Type</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Dates</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Days</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allLeaves?.data?.map((req: any, i: number) => (
                <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">
                        {req.employeeName && req.employeeName.trim().length > 0
                          ? req.employeeName.trim()[0].toUpperCase()
                          : ""}
                      </div>
                      <span className="text-sm font-medium text-card-foreground">{req.employeeName}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-muted-foreground">{req.leaveType}</td>
                  <td className="px-5 py-3.5 text-sm text-muted-foreground">
                    {req.startDate
                      ? new Date(req.startDate).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
                      : ""}
                    {req.endDate && req.endDate !== req.startDate ? (
                      <>
                        {" "}—{" "}
                        {new Date(req.endDate).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
                      </>
                    ) : ""}
                  </td>

                  <td className="px-5 py-3.5 text-sm text-muted-foreground">{req.totalDays}</td>
                  <td className="px-5 py-3.5">
                    <Badge
                      variant="outline"
                      className={statusStyles[req.status]}
                    >
                      {req.status}
                    </Badge>
                  </td>
                  <td className="px-5 py-3.5">
                    {req.status === "PENDING" && (
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleApproval({ leaveId: req.leaveId, status: "APPROVED" })}
                          className="w-7 h-7 rounded-md bg-success/10 flex items-center justify-center hover:bg-success/20 transition-colors"
                          disabled={updatingStatus}
                        >
                          <Check className="w-3.5 h-3.5 text-success" />
                        </button>
                        <button
                          onClick={() => handleApproval({ leaveId: req.leaveId, status: "REJECTED" })}
                          className="w-7 h-7 rounded-md bg-destructive/10 flex items-center justify-center hover:bg-destructive/20 transition-colors"
                          disabled={updatingStatus}
                        >
                          <X className="w-3.5 h-3.5 text-destructive" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </HRLayout>
  );
};

export default LeaveManagement;
