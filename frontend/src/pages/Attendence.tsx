import HRLayout from "@/components/hr/HRLayout";

export default function EmployeeAttendanceMarking() {
    const attendanceHistory = [
        {
            date: "09 Apr 2026",
            checkIn: "09:12 AM",
            checkOut: "06:18 PM",
            status: "Present",
        },
        {
            date: "08 Apr 2026",
            checkIn: "09:05 AM",
            checkOut: "06:02 PM",
            status: "Present",
        },
        {
            date: "07 Apr 2026",
            checkIn: "--",
            checkOut: "--",
            status: "Absent",
        },
    ];

    const todayStatus = "Checked In";

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
                                    <p className="font-semibold text-card-foreground">{todayStatus}</p>
                                    <p className="text-xs text-muted-foreground">You checked in at 09:12 AM</p>
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
                            <p className="mt-3 text-3xl font-bold text-card-foreground">07h 14m</p>
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
                                <button className="h-11 px-6 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition">
                                    Check In
                                </button>
                                <button className="h-11 px-6 rounded-xl border border-border bg-muted/40 text-card-foreground font-medium hover:bg-muted transition">
                                    Check Out
                                </button>
                            </div>
                        </div>

                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="rounded-2xl border border-border bg-muted/20 p-5">
                                <p className="text-sm text-muted-foreground">Current Time</p>
                                <p className="mt-2 text-4xl font-bold text-card-foreground">09:32 AM</p>
                                <p className="mt-2 text-sm text-muted-foreground">Thursday, 09 April 2026</p>
                            </div>

                            <div className="rounded-2xl border border-border bg-muted/20 p-5 space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Check In</span>
                                    <span className="font-semibold text-card-foreground">09:12 AM</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Check Out</span>
                                    <span className="font-semibold text-card-foreground">--</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Break Time</span>
                                    <span className="font-semibold text-card-foreground">00h 18m</span>
                                </div>
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
                                    {attendanceHistory.map((item, index) => (
                                        <tr
                                            key={index}
                                            className="border-b border-border last:border-none hover:bg-muted/20 transition"
                                        >
                                            <td className="px-6 py-4 text-sm text-card-foreground">{item.date}</td>
                                            <td className="px-6 py-4 text-sm text-card-foreground">{item.checkIn}</td>
                                            <td className="px-6 py-4 text-sm text-card-foreground">{item.checkOut}</td>
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
