import HRLayout from "@/components/hr/HRLayout";
import { useCheckInMutation, useCheckOutMutation, useGetEmployeeAttendanceQuery } from "@/store/api/attendenceApi";
import { useGetEmployeeByIdQuery } from "@/store/api/employeeApi";
import { useGetEmployeesOnLeaveTodayQuery } from "@/store/api/leaveApi";
import { useEffect, useState } from "react";

export default function EmployeeAttendanceMarking() {
    const {
        data: employeeData,
        isLoading: isEmployeeLoading,
        error: employeeError,
    } = useGetEmployeeByIdQuery();

    const { data: employeesOnLeaveToday, isLoading: isLoadingEmployeesOnLeaveToday, error: employeesOnLeaveTodayError } = useGetEmployeesOnLeaveTodayQuery();


    const [checkIn, { isLoading: isCheckingIn, error: checkInError, data: checkInData }] = useCheckInMutation();

    const [checkOut, { isLoading: isCheckingOut, error: checkOutError, data: checkOutData }] = useCheckOutMutation();


    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];
    const employeeId = employeeData?.employee_id;

    const {
        data: employeeAttendance,
        isLoading: isEmployeeAttendanceLoading,
        error: employeeAttendanceError
    } = useGetEmployeeAttendanceQuery(
        { employeeId, date: today },
        {
            skip: !employeeId // Only run when employeeId is available
        }
    );

    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date());
        }, 1000); // update every second

        return () => clearInterval(interval); // cleanup
    }, []);


    const handleCheckIn = async () => {
        // Handle errors from API during check-in
        try {
            const res = await checkIn({ employeeId: employeeData?.employee_id }); // use 'id' instead of 'employee_id'
            if (res && !res.error) {
                console.log("Check-in successful:", res);
            }
        } catch (error) {
            console.error("Check-in failed:", error);
            // Optionally: display error to user with toast or similar
        }
    }

    const handleCheckOut = async () => {
        // Handle errors from API during check-out
        try {
            const res = await checkOut({ employeeId: employeeData?.employee_id }); // use 'id' instead of 'employee_id'
            if (res && !res.error) {
                console.log("Check-out successful:", res);
            }
        } catch (error) {
            console.error("Check-out failed:", error);
            // Optionally: display error to user with toast or similar
        }
    }

    console.log(employeeAttendance?.data)

    return (
        <HRLayout title="Dashboard" subtitle="Welcome back, Jane. Here's what's happening today.">
            <div className="min-h-screen bg-background p-6">
                <div className="max-w-5xl mx-auto space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold text-card-foreground">Attendance</h1>
                        <p className="text-muted-foreground mt-1">
                            Mark your attendance and track your daily activity.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                            <p className="text-sm text-muted-foreground">Today's Status</p>
                            <div className="mt-3 flex items-center gap-3">
                                <div className="h-11 w-11 rounded-xl bg-green-100 flex items-center justify-center">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 text-green-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    {employeeAttendance?.data[0]?.check_out_time ? (
                                        <>
                                            <p className="font-semibold text-card-foreground text-green-700 flex items-center gap-1">
                                                Checked Out
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-4 w-4 text-green-600"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M5 13l4 4L19 7"
                                                    />
                                                </svg>
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                You checked out at{" "}
                                                {new Date(employeeAttendance.data[0].check_out_time).toLocaleTimeString([], {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    hour12: true
                                                })}
                                            </p>
                                        </>
                                    ) : employeeAttendance?.data[0]?.check_in_time ? (
                                        <>
                                            <p className="font-semibold text-card-foreground text-yellow-700 flex items-center gap-1">
                                                Checked In
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-4 w-4 text-yellow-500"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M5 13l4 4L19 7"
                                                    />
                                                </svg>
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                You checked in at{" "}
                                                {new Date(employeeAttendance.data[0].check_in_time).toLocaleTimeString([], {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    hour12: true
                                                })}
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <p className="font-semibold text-card-foreground text-gray-700 flex items-center gap-1">
                                                Not Checked In
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-4 w-4 text-gray-400"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M6 18L18 6M6 6l12 12"
                                                    />
                                                </svg>
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                You have not checked in yet.
                                            </p>
                                        </>
                                    )}
                                </div>

                            </div>
                        </div>

                        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                            <p className="text-sm text-muted-foreground">This Month</p>
                            <p className="mt-3 text-3xl font-bold text-card-foreground">21</p>
                            <p className="text-xs text-muted-foreground mt-1">Days Present</p>
                        </div>

                        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                            <p className="text-sm text-muted-foreground">Working Hours Today</p>
                            <p className="mt-3 text-3xl font-bold text-card-foreground">
                                {employeeAttendance?.data[0]?.check_in_time
                                    ? (() => {
                                        const checkIn = new Date(employeeAttendance.data[0].check_in_time);
                                        const now = new Date();
                                        const diffMs = now.getTime() - checkIn.getTime();
                                        const hours = Math.floor(diffMs / (1000 * 60 * 60));
                                        const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
                                        return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")} hrs`;
                                    })()
                                    : "--:--"
                                }
                            </p>


                            <p className="text-xs text-muted-foreground mt-1">Updated live</p>
                        </div>
                    </div>

                    <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-[var(--shadow-card)]">
                        <div className="border-b border-border px-6 py-5 flex items-center justify-between flex-wrap gap-4">
                            <div>
                                <h2 className="text-lg font-semibold text-card-foreground">Mark Attendance</h2>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Use the buttons below to check in or check out.
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={handleCheckIn} className="h-11 px-6 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition">
                                    Check In
                                </button>
                                <button
                                    onClick={handleCheckOut} className="h-11 px-6 rounded-xl border border-border bg-muted/40 text-card-foreground font-medium hover:bg-muted transition">
                                    Check Out
                                </button>
                            </div>
                        </div>

                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="rounded-2xl border border-border bg-muted/20 p-5">
                                <p className="text-sm text-muted-foreground">Current Time</p>
                                {`${((time.getHours() % 12) || 12).toString().padStart(2, "0")}:${time.getMinutes().toString().padStart(2, "0")} ${time.getHours() >= 12 ? "PM" : "AM"}`}



                                <p className="mt-2 text-sm text-muted-foreground">
                                    {new Date().toLocaleDateString(undefined, {
                                        weekday: "long",
                                        day: "2-digit",
                                        month: "long",
                                        year: "numeric"
                                    })}
                                </p>

                            </div>

                            <div className="rounded-2xl border border-border bg-muted/20 p-5 space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Check In</span>
                                    <span className="font-semibold text-card-foreground">{
                                        employeeAttendance?.data[0]?.check_in_time
                                            ? new Date(employeeAttendance.data[0].check_in_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
                                            : ""
                                    }</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Check Out</span>
                                    <span className="font-semibold text-card-foreground">
                                        {
                                            employeeAttendance?.data[0]?.check_out_time
                                                ? new Date(employeeAttendance.data[0].check_out_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
                                                : "--"
                                        }
                                    </span>

                                </div>
                                {/* <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Break Time</span>
                                    <span className="font-semibold text-card-foreground">00h 18m</span>
                                </div> */}
                            </div>
                        </div>
                    </div>

                    <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-[var(--shadow-card)]">
                        <div className="px-6 py-5 border-b border-border flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-card-foreground">Attendance History</h2>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Review your recent attendance records.
                                </p>
                            </div>

                            <button className="h-10 px-4 rounded-xl border border-border bg-muted/40 text-sm text-card-foreground hover:bg-muted transition">
                                View Full History
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[700px]">
                                <thead>
                                    <tr className="bg-muted/30 border-b border-border text-left">
                                        <th className="px-6 py-4 text-sm font-semibold text-card-foreground">Date</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-card-foreground">Check In</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-card-foreground">Check Out</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-card-foreground">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {employeeAttendance?.data?.map((item: any, index: number) => (
                                        <tr
                                            key={index}
                                            className="border-b border-border last:border-none hover:bg-muted/20 transition"
                                        >
                                            <td className="px-6 py-4 text-sm text-card-foreground">
                                                {item.date
                                                    ? new Date(item.date).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
                                                    : "--"}
                                            </td>

                                            <td className="px-6 py-4 text-sm text-card-foreground">
                                                {item.check_in_time
                                                    ? new Date(item.check_in_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
                                                    : "--"}
                                            </td>

                                            <td className="px-6 py-4 text-sm text-card-foreground">
                                                {item.check_out_time
                                                    ? new Date(item.check_out_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
                                                    : "--"}
                                            </td>

                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${item.status === "Present"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700"
                                                        }`}
                                                >
                                                    {item.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </HRLayout>
    );

}
