import { Search, Filter, Plus, Mail, Phone, MoreHorizontal } from "lucide-react";
import HRLayout from "@/components/hr/HRLayout";
import { Badge } from "@/components/ui/badge";
import axios from "axios"
import { useEffect, useState } from "react";
import { useGetAllEmployeesQuery } from "@/store/api/employeeApi";

const statusStyles: Record<string, string> = {
  Active: "bg-success/10 text-success border-success/20",
  "On Leave": "bg-warning/10 text-warning border-warning/20",
  Remote: "bg-info/10 text-info border-info/20",
};


const Employees = () => {


  const [search, setSearch] = useState()


  const { data, isLoading, error: fetchError } = useGetAllEmployeesQuery(search);



  return (
    <HRLayout title="Employees" subtitle="Manage your team members and their information.">
      <div className="space-y-6">
        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                onChange={e => setSearch(e.target.value)}
                type="text"
                placeholder="Search employees..."
                className="pl-9 pr-4 py-2 bg-card rounded-lg text-sm border border-border focus:outline-none focus:ring-2 focus:ring-ring w-72"
              />

            </div>
            <button className="flex items-center gap-2 px-3 py-2 bg-card rounded-lg text-sm border border-border text-muted-foreground hover:bg-muted transition-colors">
              <Filter className="w-4 h-4" /> Filter
            </button>
          </div>
          {/* <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
            <Plus className="w-4 h-4" /> Add Employee
          </button> */}
        </div>

        {/* Table */}
        <div className="bg-card rounded-xl shadow-[var(--shadow-card)] border border-border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Employee</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Department</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Contact</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Joined</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {data?.map((emp: any) => (
                <tr key={emp?.first_name} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">
                        {emp?.first_name?.charAt(0)?.toUpperCase() || ""}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-card-foreground">{emp?.first_name} </p>
                        <p className="text-xs text-muted-foreground">{emp?.user_role}  </p>
                      </div>

                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-muted-foreground">{emp?.department_name}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{emp?.user_email}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-muted-foreground">
                    {emp?.created_at
                      ? new Date(emp.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "2-digit",
                      })
                      : "--"}
                  </td>

                  <td className="px-5 py-4">
                    <Badge variant="outline" className={statusStyles[emp?.is_active ? "Active" : "Inactive"]}>
                      {emp?.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </td>
                  <td className="px-5 py-4">
                    <button className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors">
                      <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                    </button>
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

export default Employees;
