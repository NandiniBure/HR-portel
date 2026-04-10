import { DollarSign, Download, Calendar } from "lucide-react";
import HRLayout from "@/components/hr/HRLayout";
import StatCard from "@/components/hr/StatCard";

const payrollData = [
  { name: "Alex Johnson", department: "Engineering", salary: "$8,500", bonus: "$500", deductions: "$1,200", net: "$7,800", avatar: "AJ" },
  { name: "Maria Garcia", department: "Design", salary: "$7,200", bonus: "$300", deductions: "$980", net: "$6,520", avatar: "MG" },
  { name: "David Kim", department: "Product", salary: "$9,000", bonus: "$600", deductions: "$1,350", net: "$8,250", avatar: "DK" },
  { name: "Sarah Chen", department: "Analytics", salary: "$7,800", bonus: "$400", deductions: "$1,100", net: "$7,100", avatar: "SC" },
  { name: "James Wilson", department: "Human Resources", salary: "$6,500", bonus: "$200", deductions: "$880", net: "$5,820", avatar: "JW" },
  { name: "Priya Patel", department: "Engineering", salary: "$8,200", bonus: "$450", deductions: "$1,150", net: "$7,500", avatar: "PP" },
];

const Payroll = () => {
  return (
    <HRLayout title="Payroll" subtitle="Process salaries and manage compensation.">
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard title="Total Payroll" value="$385,400" change="March 2026" changeType="neutral" icon={DollarSign} />
          <StatCard title="Avg. Salary" value="$7,540" change="+3.2% vs last quarter" changeType="positive" icon={DollarSign} iconColor="bg-success" />
          <StatCard title="Next Run Date" value="Apr 1" change="In 7 days" changeType="neutral" icon={Calendar} iconColor="bg-info" />
        </div>

        {/* Payroll Table */}
        <div className="bg-card rounded-xl shadow-[var(--shadow-card)] border border-border overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h3 className="font-semibold text-card-foreground">March 2026 Payroll</h3>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
              <Download className="w-4 h-4" /> Export
            </button>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Employee</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Department</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Salary</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Bonus</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Deductions</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Net Pay</th>
              </tr>
            </thead>
            <tbody>
              {payrollData.map((emp) => (
                <tr key={emp.name} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">{emp.avatar}</div>
                      <span className="text-sm font-medium text-card-foreground">{emp.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-muted-foreground">{emp.department}</td>
                  <td className="px-5 py-3.5 text-sm text-card-foreground text-right">{emp.salary}</td>
                  <td className="px-5 py-3.5 text-sm text-success text-right">{emp.bonus}</td>
                  <td className="px-5 py-3.5 text-sm text-destructive text-right">{emp.deductions}</td>
                  <td className="px-5 py-3.5 text-sm font-semibold text-card-foreground text-right">{emp.net}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </HRLayout>
  );
};

export default Payroll;
