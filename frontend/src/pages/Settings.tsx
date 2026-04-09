import { Section } from "lucide-react";
import HRLayout from "@/components/hr/HRLayout";
import { useGetEmployeeByIdQuery } from "@/store/api/employeeApi";

const labels = {
  profile: "Personal Information",
  profileDesc: "Discover and manage the essential details that define your professional identity.",
  contact: "Contact & Details",
  contactDesc: "Easily review and update your vital contact information and employment highlights.",
  fullName: "Full Name",
  department: "Department",
  designation: "Designation",
  email: "Corporate Email",
  salary: "Monthly Salary",
  joined: "Date of Joining",
  save: "Save Profile Updates"
};

const Settings = () => {
  // Fetching userId from localStorage only once per render (optimization)
  const userId = localStorage.getItem("userId") || "";

  const {
    data: employeeData,
    isLoading: isEmployeeLoading,
    error: employeeError,
  } = useGetEmployeeByIdQuery(
    { userId },
    { skip: !userId }
  );

  // For demonstration and debugging
  // console.log(employeeData)

  return (
    <HRLayout
      title="Settings"
      subtitle="Tailor your employee portal and personal details to fit your professional journey."
    >
      <div className="space-y-6 max-w-3xl">
        {/* Personal / Profile Section */}
        <div className="bg-card rounded-xl shadow-[var(--shadow-card)] border border-border overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <Section className="w-4.5 h-4.5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-card-foreground text-sm">{labels.profile}</h3>
              <p className="text-xs text-muted-foreground">{labels.profileDesc}</p>
            </div>
          </div>
          <div className="divide-y divide-border">
            <div className="flex items-center justify-between px-5 py-3.5">
              <span className="text-sm text-muted-foreground">{labels.fullName}</span>
              <span className="text-sm font-medium text-card-foreground">
                {employeeData?.first_name} {employeeData?.last_name}
              </span>
            </div>
            <div className="flex items-center justify-between px-5 py-3.5">
              <span className="text-sm text-muted-foreground">{labels.department}</span>
              <span className="text-sm font-medium text-card-foreground">
                {"department_name" in (employeeData ?? {}) ? (employeeData as any).department_name : "-"}
              </span>
            </div>
            <div className="flex items-center justify-between px-5 py-3.5">
              <span className="text-sm text-muted-foreground">{labels.designation}</span>
              <span className="text-sm font-medium text-card-foreground">
                {"designation_title" in (employeeData ?? {}) ? (employeeData as any).designation_title : "-"}
              </span>
            </div>
          </div>
        </div>

        {/* Contact / Employment Details Section */}
        <div className="bg-card rounded-xl shadow-[var(--shadow-card)] border border-border overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <Section className="w-4.5 h-4.5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-card-foreground text-sm">{labels.contact}</h3>
              <p className="text-xs text-muted-foreground">{labels.contactDesc}</p>
            </div>
          </div>
          <div className="divide-y divide-border">
            <div className="flex items-center justify-between px-5 py-3.5">
              <span className="text-sm text-muted-foreground">{labels.email}</span>
              <span className="text-sm font-medium text-card-foreground">
                {"user_email" in (employeeData ?? {}) ? (employeeData as any).user_email : employeeData?.email || "-"}
              </span>
            </div>
            <div className="flex items-center justify-between px-5 py-3.5">
              <span className="text-sm text-muted-foreground">{labels.salary}</span>
              <span className="text-sm font-medium text-card-foreground">
                {"salary" in (employeeData ?? {}) ? (employeeData as any).salary : "-"}
              </span>
            </div>
            <div className="flex items-center justify-between px-5 py-3.5">
              <span className="text-sm text-muted-foreground">{labels.joined}</span>
              <span className="text-sm font-medium text-card-foreground">
                {"joining_date" in (employeeData ?? {}) && (employeeData as any).joining_date
                  ? new Date((employeeData as any).joining_date).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : ""}
              </span>
            </div>
          </div>
        </div>

        <button className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
          {labels.save}
        </button>
      </div>
    </HRLayout>
  );
};

export default Settings;
