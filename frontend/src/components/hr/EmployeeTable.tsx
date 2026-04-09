import { Badge } from "@/components/ui/badge";
import { useGetAllEmployeesQuery } from "@/store/api/employeeApi";


const statusStyles: Record<string, string> = {
  Active: "bg-success/10 text-success border-success/20",
  "On Leave": "bg-warning/10 text-warning border-warning/20",
  Remote: "bg-info/10 text-info border-info/20",
};


const EmployeeTable = () => {
  const { data, isLoading, error: fetchError } = useGetAllEmployeesQuery();
console.log(data)


  return (
    <div className="bg-card rounded-xl shadow-[var(--shadow-card)] border border-border">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <h3 className="font-semibold text-card-foreground">Recent Employees</h3>
        <button className="text-sm text-primary font-medium hover:underline">View All</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Employee</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Department</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((emp: any) => (
              <tr key={emp.first_name} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">
                      {emp.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-card-foreground">{emp.first_name}</p>
                      <p className="text-xs text-muted-foreground">{emp.user_role}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-sm text-muted-foreground">{emp?.department_name}</td>
                <td className="px-5 py-3.5">
                  <Badge variant="outline" className={statusStyles[emp.is_active]}>active</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeTable;
