import { useMemo, useState } from "react";
import { CalendarDays, FileText, Send, BadgeCheck, X } from "lucide-react";
import HRLayout from "@/components/hr/HRLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useApplyLeaveMutation, useGetLeaveBalanceQuery } from "@/store/api/leaveApi";


const leaveTypes = [
  { id: 1, name: "Sick Leave" },
  { id: 2, name: "Annual Leave" },
  { id: 3, name: "Personal Leave" },
  { id: 4, name: "Work From Home" },
];

const sessions = ["FULL", "FIRST_HALF", "SECOND_HALF"];

const EmployeeApplyLeave = () => {
  const [formData, setFormData] = useState({
    leaveTypeId: "",
    startDate: "",
    endDate: "",
    startSession: "FULL",
    endSession: "FULL",
    reason: "",
  });

  const [showForm, setShowForm] = useState(false);
  const [payloadSubmitted, setPayloadSubmitted] = useState(null);
  const [
    applyLeave,
    { isLoading: isApplyingLeave, error: applyLeaveError, data: applyLeaveData },
  ] = useApplyLeaveMutation();


  const currentYear = new Date().getFullYear();
  const { data: liveBalance, isLoading: isLoadingBalance, error: balanceError } = useGetLeaveBalanceQuery(currentYear);

  const totalDays = useMemo(() => {
    if (!formData.startDate || !formData.endDate) return 0;

    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);

    if (end < start) return 0;

    const diffInDays =
      Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    let days = diffInDays;

    if (formData.startSession !== "FULL") days -= 0.5;
    if (formData.endSession !== "FULL") days -= 0.5;

    return days;
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      leaveTypeId: Number(formData.leaveTypeId),
      startDate: formData.startDate,
      endDate: formData.endDate,
      startSession: formData.startSession,
      endSession: formData.endSession,
      totalDays,
      reason: formData.reason,
    };

    setPayloadSubmitted(payload);

    try {
      await applyLeave(payload).unwrap();
    } catch (e) {
      // leave handled by RTKQ
    }
  };

  console.log(liveBalance?.data)

  // Renders balance leaves at the top
  function renderBalanceLeaves() {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {liveBalance?.data?.map((item: any) => {
          // Parse values and format as integers to avoid decimals
          const usedDays = Number(item.usedDays);
          const allocatedDays = Number(item.allocatedDays);
          const remainingDays = Number(item.remainingDays);

          return (
            <div key={item.leaveTypeId} className="bg-card rounded-xl p-5 shadow-[var(--shadow-card)] border border-border">
              <p className="text-sm text-muted-foreground font-medium mb-3">{item.leaveType}</p>
              <div className="flex items-end justify-between mb-3">
                <span className="text-2xl font-bold text-card-foreground">
                  {Math.round(usedDays)}/{Math.round(allocatedDays)}
                </span>
                <span className="text-xs text-muted-foreground">
                  {Math.round(remainingDays)} remaining
                </span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                {/* You can set item.color if available, otherwise use a default or by leaveType */}
                <div
                  className={`h-full rounded-full ${item.color || 'bg-primary'}`}
                  style={{
                    width: `${allocatedDays > 0 ? (usedDays / allocatedDays) * 100 : 0}%`
                  }}
                />
              </div>
              <div className="mt-3 text-xs text-muted-foreground flex justify-between">
                <span>Code: {item.leaveCode}</span>
                <span>Year: {item.year}</span>
              </div>
            </div>
          );
        })}
  
      </div>

    );
  }

  // Success UI after applying leave
  function renderSuccessUi() {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="flex items-center gap-3 bg-primary/10 border border-primary rounded-xl px-6 py-4 mb-5">
          <BadgeCheck className="text-green-600 w-8 h-8" />
          <div>
            <div className="text-xl font-semibold text-green-700">Leave Applied Successfully!</div>
            <div className="text-sm text-card-foreground">Your leave request has been submitted for approval.</div>
          </div>
        </div>
        {payloadSubmitted && (
          <div className="bg-muted/30 border border-border rounded-2xl p-4 space-y-2 max-w-xl w-full">
            <p className="text-sm font-semibold text-card-foreground text-center">
              Submitted Request Preview
            </p>
            <pre className="text-xs text-muted-foreground overflow-auto whitespace-pre-wrap break-all">
              {JSON.stringify(payloadSubmitted, null, 2)}
            </pre>
          </div>
        )}
        <Button
          className="mt-8 rounded-xl px-6 flex items-center gap-2"
          onClick={() => {
            setShowForm(false);
            setPayloadSubmitted(null);
            setFormData({
              leaveTypeId: "",
              startDate: "",
              endDate: "",
              startSession: "FULL",
              endSession: "FULL",
              reason: "",
            });
          }}
        >
          <X className="w-4 h-4" />
          Close
        </Button>
      </div>
    );
  }

  return (
    <HRLayout
      title="Apply Leave"
      subtitle="Submit a leave request for approval."
    >
      <div className="max-w-4xl mx-auto">
        {renderBalanceLeaves()}

        {!showForm && (
          <div className="text-center py-10">
            <Button
              onClick={() => setShowForm(true)}
              className="rounded-xl px-8 py-4 text-xl"
              variant="default"
            >
              <Send className="w-5 h-5 mr-2" /> Apply for Leave
            </Button>
          </div>
        )}

        {/* Show success or form based on mutation state */}
        {showForm && (
          <div className="bg-card border border-border rounded-2xl shadow-[var(--shadow-card)] overflow-hidden">
            <div className="px-6 py-5 border-b border-border flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                <CalendarDays className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-card-foreground">
                  Leave Application Form
                </h2>
                <p className="text-sm text-muted-foreground">
                  Fill in the details below to request leave.
                </p>
              </div>
            </div>

            {(applyLeaveData && !applyLeaveError) ? (
              renderSuccessUi()
            ) : (
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label>Leave Type</Label>
                    <Select
                      value={formData.leaveTypeId}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, leaveTypeId: value }))
                      }
                    >
                      <SelectTrigger className="h-11 rounded-xl">
                        <SelectValue placeholder="Select leave type" />
                      </SelectTrigger>
                      <SelectContent>
                        {leaveTypes.map((type) => (
                          <SelectItem key={type.id} value={String(type.id)}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Total Days</Label>
                    <div className="h-11 rounded-xl border border-border bg-muted/40 px-4 flex items-center text-sm font-medium text-card-foreground">
                      {totalDays || 0} day{totalDays !== 1 ? "s" : ""}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Input
                      type="date"
                      className="h-11 rounded-xl"
                      value={formData.startDate}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, startDate: e.target.value }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Input
                      type="date"
                      className="h-11 rounded-xl"
                      value={formData.endDate}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, endDate: e.target.value }))
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label>Start Session</Label>
                    <Select
                      value={formData.startSession}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, startSession: value }))
                      }
                    >
                      <SelectTrigger className="h-11 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {sessions.map((session) => (
                          <SelectItem key={session} value={session}>
                            {session.replace("_", " ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>End Session</Label>
                    <Select
                      value={formData.endSession}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, endSession: value }))
                      }
                    >
                      <SelectTrigger className="h-11 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {sessions.map((session) => (
                          <SelectItem key={session} value={session}>
                            {session.replace("_", " ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Reason
                  </Label>
                  <Textarea
                    rows={5}
                    placeholder="Describe the reason for your leave request..."
                    className="rounded-2xl resize-none"
                    value={formData.reason}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, reason: e.target.value }))
                    }
                  />
                </div>

                <div className="bg-muted/30 border border-border rounded-2xl p-4 space-y-2">
                  <p className="text-sm font-semibold text-card-foreground">
                    Request Preview
                  </p>
                  <pre className="text-xs text-muted-foreground overflow-auto whitespace-pre-wrap break-all">
                    {JSON.stringify(
                      {
                        leaveTypeId: Number(formData.leaveTypeId) || null,
                        startDate: formData.startDate,
                        endDate: formData.endDate,
                        startSession: formData.startSession,
                        endSession: formData.endSession,
                        totalDays,
                        reason: formData.reason,
                      },
                      null,
                      2
                    )}
                  </pre>
                </div>

                {applyLeaveError && (
                  <div className="bg-red-100 border-red-400 border rounded-xl p-2 text-red-700 text-sm">
                    Failed to apply for leave. {(applyLeaveError && applyLeaveError.data) || "Please try again."}
                  </div>
                )}

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={isApplyingLeave}
                    className="h-11 rounded-xl px-6 flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    {isApplyingLeave ? "Submitting..." : "Submit Leave Request"}
                  </Button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </HRLayout>
  );
};

export default EmployeeApplyLeave;
