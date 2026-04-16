import { Search, Filter, Mail, MoreHorizontal } from "lucide-react";
import HRLayout from "@/components/hr/HRLayout";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useGetAllEmployeesQuery } from "@/store/api/employeeApi";
import { useGetDepartmentsQuery, useGetDesignationsQuery } from "@/store/api/masterApi";

const statusStyles: Record<string, string> = {
  Active: "bg-success/10 text-success border-success/20",
  Inactive: "bg-destructive/10 text-destructive border-destructive/20",
};

const Employees = () => {
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const { data: departmentsData, isLoading: isDepartmentsLoading, error: departmentsError } = useGetDepartmentsQuery();
  const { data: designationsData, isLoading: isDesignationsLoading, error: designationsError } = useGetDesignationsQuery();

  const [filters, setFilters] = useState({
    department: "",
    designation: "",
    status: "",
    joinedFrom: "",
    joinedTo: "",
  });

  const { data, isLoading } = useGetAllEmployeesQuery({
    search,
    ...filters,
  });


  return (
    <HRLayout
      title="Employees"
      subtitle="Manage your team members and their information."
    >
      <div className="space-y-6">
        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                type="text"
                placeholder="Search employees..."
                className="pl-9 pr-4 py-2 bg-card rounded-lg text-sm border border-border focus:outline-none focus:ring-2 focus:ring-ring w-72"
              />
            </div>


          </div>
        </div>

        {/* Filter Panel */}

        <div className="bg-card border border-border rounded-xl p-5 shadow-[var(--shadow-card)] space-y-5 transition-all duration-300">
          <div className="grid grid-cols-5 gap-4">
            <div>
              <label className="text-xs text-muted-foreground">
                Department
              </label>
              <select
                value={filters.department}
                onChange={(e) =>
                  setFilters({ ...filters, department: e.target.value })
                }
                className="mt-1 w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:ring-2 focus:ring-ring"
              >
                <option value="">All</option>
                {departmentsData?.data?.map((dept) => (
                  <option key={dept.id} value={dept.name}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-muted-foreground">Designation</label>
              <select
                value={filters.designation}
                onChange={(e) =>
                  setFilters({ ...filters, designation: e.target.value })
                }
                className="mt-1 w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:ring-2 focus:ring-ring"
              >
                <option value="">All</option>
                {designationsData?.data?.map((designation) => (
                  <option key={designation.id} value={designation.title}>
                    {designation.title}
                  </option>
                ))}
              </select>
            </div>


            <div>
              <label className="text-xs text-muted-foreground">Status</label>
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
                className="mt-1 w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:ring-2 focus:ring-ring"
              >
                <option value="">All</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-muted-foreground">
                Joined From
              </label>
              <input
                type="date"
                value={filters.joinedFrom}
                onChange={(e) =>
                  setFilters({ ...filters, joinedFrom: e.target.value })
                }
                className="mt-1 w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label className="text-xs text-muted-foreground">
                Joined To
              </label>
              <input
                type="date"
                value={filters.joinedTo}
                onChange={(e) =>
                  setFilters({ ...filters, joinedTo: e.target.value })
                }
                className="mt-1 w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
        </div>


        {/* Table */}
        <div className="bg-card rounded-xl shadow-[var(--shadow-card)] border border-border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Employee
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Department
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Contact
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Joined
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {data?.map((emp: any) => (
                <tr
                  key={emp.id}
                  className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">
                        {emp?.first_name?.charAt(0)?.toUpperCase() || ""}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-card-foreground">
                          {emp?.first_name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {emp?.user_role}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-sm text-muted-foreground">
                    {emp?.department_name}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {emp?.user_email}
                      </span>
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
                    <Badge
                      variant="outline"
                      className={
                        statusStyles[emp?.is_active ? "Active" : "Inactive"]
                      }
                    >
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