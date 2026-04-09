import { CalendarDays, Check, X, Filter } from "lucide-react";
import HRLayout from "@/components/hr/HRLayout";
import { Badge } from "@/components/ui/badge";
import { useGetAllLeavesQuery, useUpdateLeaveStatusMutation } from "@/store/api/leaveApi";


const statusStyles: Record<string, string> = {
  Pending: "bg-warning/10 text-warning border-warning/20",
  Approved: "bg-success/10 text-success border-success/20",
  Rejected: "bg-destructive/10 text-destructive border-destructive/20",
};

const leaveBalance = [
  { type: "Annual Leave", total: 20, used: 8, color: "bg-primary" },
  { type: "Sick Leave", total: 10, used: 3, color: "bg-warning" },
  { type: "Personal", total: 5, used: 2, color: "bg-info" },
];

const LeaveManagement = () => {


  const { data: allLeaves, isLoading: loadingLeaves, error: leavesError } = useGetAllLeavesQuery();
  const [updateLeaveStatus, { isLoading: updatingStatus }] = useUpdateLeaveStatusMutation();

  console.log(allLeaves?.data)

  const handleApproval = ({ leaveId, status }: any) => {
    updateLeaveStatus({ leaveId, status })
  }

  return (
    <HRLayout title="Leave Management" subtitle="Track and manage employee leave requests.">
      <div className="space-y-6">
        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {leaveBalance.map((item) => (
            <div key={item.type} className="bg-card rounded-xl p-5 shadow-[var(--shadow-card)] border border-border">
              <p className="text-sm text-muted-foreground font-medium mb-3">{item.type}</p>
              <div className="flex items-end justify-between mb-3">
                <span className="text-2xl font-bold text-card-foreground">{item.used}/{item.total}</span>
                <span className="text-xs text-muted-foreground">{item.total - item.used} remaining</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${item.color}`} style={{ width: `${(item.used / item.total) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>

        {/* Requests Table */}
        <div className="bg-card rounded-xl shadow-[var(--shadow-card)] border border-border overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h3 className="font-semibold text-card-foreground">All Leave Requests</h3>
            <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted rounded-lg transition-colors">
              <Filter className="w-4 h-4" /> Filter
            </button>
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
                  <td className="px-5 py-3.5"><Badge variant="outline" className={statusStyles[req.status]}>{req.status}</Badge></td>
                  <td className="px-5 py-3.5">
                    {req.status === "PENDING" && (
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleApproval({ leaveId: req.leaveId, status: "APPROVED" })} className="w-7 h-7 rounded-md bg-success/10 flex items-center justify-center hover:bg-success/20 transition-colors"><Check className="w-3.5 h-3.5 text-success" /></button>
                        <button  onClick={() => handleApproval({ leaveId: req.leaveId, status: "REJECTED" })} className="w-7 h-7 rounded-md bg-destructive/10 flex items-center justify-center hover:bg-destructive/20 transition-colors"><X className="w-3.5 h-3.5 text-destructive" /></button>
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
