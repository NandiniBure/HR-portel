import { DollarSign, Download, Calendar } from "lucide-react";
import { useState } from "react";
import HRLayout from "@/components/hr/HRLayout";
import StatCard from "@/components/hr/StatCard";
import { useGetAllPayrollQuery } from "@/store/api/payrollApi";
// import { useCreatePayrollMutation } from "@/store/api/payrollApi"; // optional

const Payroll = () => {
  const { data, error, isLoading } = useGetAllPayrollQuery();

  // const [createPayroll] = useCreatePayrollMutation(); // optional

  const [isOpen, setIsOpen] = useState(false);

  const [formData, setFormData] = useState({
    employeeId: "",
    month: "",
    salary: "",
    bonus: "",
    deductions: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    const payload = {
      ...formData,
      netSalary:
        Number(formData.salary || 0) +
        Number(formData.bonus || 0) -
        Number(formData.deductions || 0),
    };

    console.log("Create Payroll:", payload);

    // 🔥 Uncomment when API ready
    // await createPayroll(payload);

    setIsOpen(false);

    // reset form
    setFormData({
      employeeId: "",
      month: "",
      salary: "",
      bonus: "",
      deductions: "",
    });
  };

  const payrollData = data?.data.payrolls
    || []; // fallback
  const summery = data?.data.summary || {}

  console.log(data)

  return (
    <HRLayout
      title="Payroll"
      subtitle="Process salaries and manage compensation."
    >
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            title="Total Payroll"
            value={summery.totalPayroll}
            change={new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}       
            changeType="neutral"
            icon={DollarSign}
          />
          <StatCard
            title="Avg. Salary"
            value={Number(summery.avgPayroll).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}       
            change="+3.2% vs last quarter"
            changeType="positive"
            icon={DollarSign}
            iconColor="bg-success"
          />
          <StatCard
            title="Next Run Date"
            value={(() => {
              const now = new Date();
              // Go to the 1st of next month
              const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
              // Format like "Apr 1"
              return nextMonth.toLocaleString('default', { month: 'short' }) + " " + nextMonth.getDate();
            })()}
 
            change={`In ${Math.ceil(
              ((
                (d => new Date(d.getFullYear(), d.getMonth() + 1, 1))(new Date())
              ) - new Date()
              ) / (1000 * 60 * 60 * 24)
            )} days`}
       
            changeType="neutral"
            icon={Calendar}
            iconColor="bg-info"
          />
        </div>

        {/* Payroll Table */}
        <div className="bg-card rounded-xl shadow-[var(--shadow-card)] border border-border overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h3 className="font-semibold text-card-foreground">
              Payroll List
            </h3>

            <div className="flex gap-2">
              

              <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium">
                <Download className="w-4 h-4" /> Export
              </button>
            </div>
          </div>

          {/* Table */}
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-5 py-3 text-xs font-semibold">
                  Employee Name
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold">
                  Month
                </th>
                <th className="text-right px-5 py-3 text-xs font-semibold">
                  Salary
                </th>
                <th className="text-right px-5 py-3 text-xs font-semibold">
                  Bonus
                </th>
                <th className="text-right px-5 py-3 text-xs font-semibold">
                  Deductions
                </th>
                <th className="text-right px-5 py-3 text-xs font-semibold">
                  Net Pay
                </th>
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <tr>
                  <td className="p-5">Loading...</td>
                </tr>
              ) : payrollData?.length === 0 ? (
                <tr>
                  <td className="p-5">No data</td>
                </tr>
              ) : (
                payrollData?.map((emp: any) => (
                  <tr
                    key={emp.id}
                    className="border-b border-border hover:bg-muted/30"
                  >
                    <td className="px-5 py-3">{emp.firstName} {emp.lastName}</td>
                    <td className="px-5 py-3">{emp.month}</td>
                    <td className="px-5 py-3 text-right">
                      ₹{emp.basicSalary}
                    </td>
                    <td className="px-5 py-3 text-right text-green-600">
                      ₹{emp.bonus}
                    </td>
                    <td className="px-5 py-3 text-right text-red-600">
                      ₹{emp.deductions}
                    </td>
                    <td className="px-5 py-3 text-right font-semibold">
                      ₹{emp.netSalary}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {isOpen && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-[400px] space-y-4 shadow-lg">
              <h2 className="text-lg font-semibold">Create Payroll</h2>

              <input
                type="text"
                name="employeeId"
                placeholder="Employee ID"
                value={formData.employeeId}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />

              <input
                type="text"
                name="month"
                placeholder="Month (YYYY-MM)"
                value={formData.month}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />

              <input
                type="number"
                name="salary"
                placeholder="Salary"
                value={formData.salary}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />

              <input
                type="number"
                name="bonus"
                placeholder="Bonus"
                value={formData.bonus}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />

              <input
                type="number"
                name="deductions"
                placeholder="Deductions"
                value={formData.deductions}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />

              {/* Net Salary Preview */}
              <div className="text-sm font-medium text-gray-600">
                Net Salary: ₹
                {Number(formData.salary || 0) +
                  Number(formData.bonus || 0) -
                  Number(formData.deductions || 0)}
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-2 border rounded"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-primary text-white rounded"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </HRLayout>
  );
};

export default Payroll;