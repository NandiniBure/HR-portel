import { useGetAllPendingLeavesQuery, useUpdateLeaveStatusMutation } from "@/store/api/leaveApi";
import { Check, X } from "lucide-react";

const requests = [
  { name: "David Kim", type: "Vacation", dates: "Mar 28 – Apr 2", days: 4, avatar: "DK" },
  { name: "Sarah Chen", type: "Sick Leave", dates: "Mar 26", days: 1, avatar: "SC" },
  { name: "Priya Patel", type: "Personal", dates: "Apr 5 – Apr 6", days: 2, avatar: "PP" },
];

const LeaveRequests = () => {

  const { data: pendingLeavesData, isLoading: pendingLeavesLoading, error: pendingLeavesError } = useGetAllPendingLeavesQuery();
  const [updateLeaveStatus, { isLoading: updatingStatus }] = useUpdateLeaveStatusMutation();

  const handleApproval = ({ leaveId, status }: any) => {
    updateLeaveStatus({ leaveId, status })
  }
  return (
    <div className="bg-card min-h-[300px] rounded-xl shadow-[var(--shadow-card)] border border-border">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <h3 className="font-semibold text-card-foreground">Pending Leave Requests</h3>
        <span className="text-xs font-bold bg-destructive/10 text-destructive px-2 py-1 rounded-full">{pendingLeavesData?.data?.length} pending</span>
      </div>
      <div className="divide-y divide-border">
        {pendingLeavesData?.data?.length ? pendingLeavesData?.data?.map((req: any) => (
          <div key={req.name} className="px-5 py-4 flex items-center gap-4">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold shrink-0">
              {req.employeeName ? req.employeeName.charAt(0).toUpperCase() : ''}

            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-card-foreground">{req.employeeName}</p>
              <p className="text-xs text-muted-foreground">
                {req.leaveId} &middot;{" "}
                {new Date(req.startDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "2-digit",
                })}{" "}
                {req.endDate &&
                  req.endDate !== req.startDate && (
                    <>
                      –{" "}
                      {new Date(req.endDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "2-digit",
                      })}
                    </>
                  )}{" "}
                ({req.totalDays}d)
              </p>

            </div>
            <div className="flex items-center gap-1.5">
              <button onClick={() => handleApproval({ leaveId: req.leaveId, status: "APPROVED" })} className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center hover:bg-success/20 transition-colors">
                <Check className="w-4 h-4 text-success" />
              </button>
              <button onClick={() => handleApproval({ leaveId: req.leaveId, status: "REJECTED" })} className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center hover:bg-destructive/20 transition-colors">
                <X className="w-4 h-4 text-destructive" />
              </button>
            </div>
          </div>
        )) : (
          <div className="flex flex-col items-center justify-center py-10 text-center gap-2 text-muted-foreground">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mx-auto w-10 h-10 text-muted"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.75 9.25v1.125m6.5-1.125v1.125m-10 2.125c0-3.728 3.064-6.75 7-6.75s7 3.022 7 6.75c0 2.381-1.476 4.436-3.757 5.592-.781.409-1.34 1.202-1.34 2.091v.317m-2.206 0v-.317c0-.889-.559-1.682-1.34-2.091C6.226 16.936 4.75 14.881 4.75 12.5z"
              />
            </svg>
            <span className="font-medium">No pending leaves to approve.</span>
            <span className="text-xs">All good! No actions needed right now.</span>
          </div>
        )}
  
      </div>
    </div>
  );
};

export default LeaveRequests;
