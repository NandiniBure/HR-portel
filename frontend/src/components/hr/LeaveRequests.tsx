import { useGetAllPendingLeavesQuery } from "@/store/api/leaveApi";
import { Check, X } from "lucide-react";

const requests = [
  { name: "David Kim", type: "Vacation", dates: "Mar 28 – Apr 2", days: 4, avatar: "DK" },
  { name: "Sarah Chen", type: "Sick Leave", dates: "Mar 26", days: 1, avatar: "SC" },
  { name: "Priya Patel", type: "Personal", dates: "Apr 5 – Apr 6", days: 2, avatar: "PP" },
];

const LeaveRequests = () => {

  const { data: pendingLeavesData, isLoading: pendingLeavesLoading, error: pendingLeavesError } = useGetAllPendingLeavesQuery();

  console.log("===?", pendingLeavesData?.data)

  return (
    <div className="bg-card rounded-xl shadow-[var(--shadow-card)] border border-border">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <h3 className="font-semibold text-card-foreground">Pending Leave Requests</h3>
        <span className="text-xs font-bold bg-destructive/10 text-destructive px-2 py-1 rounded-full">{pendingLeavesData?.data?.length} pending</span>
      </div>
      <div className="divide-y divide-border">
        {pendingLeavesData?.data?.map((req: any) => (
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
              <button className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center hover:bg-success/20 transition-colors">
                <Check className="w-4 h-4 text-success" />
              </button>
              <button className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center hover:bg-destructive/20 transition-colors">
                <X className="w-4 h-4 text-destructive" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeaveRequests;
