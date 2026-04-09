import { Plus, MapPin, Clock, Users } from "lucide-react";
import HRLayout from "@/components/hr/HRLayout";
import { Badge } from "@/components/ui/badge";

const jobs = [
  { title: "Senior Frontend Developer", department: "Engineering", location: "Remote", type: "Full-time", applicants: 24, posted: "5 days ago", status: "Active" },
  { title: "Product Designer", department: "Design", location: "New York", type: "Full-time", applicants: 18, posted: "1 week ago", status: "Active" },
  { title: "Data Engineer", department: "Analytics", location: "San Francisco", type: "Full-time", applicants: 12, posted: "2 weeks ago", status: "Active" },
  { title: "Marketing Manager", department: "Marketing", location: "Remote", type: "Full-time", applicants: 31, posted: "3 days ago", status: "Active" },
  { title: "DevOps Engineer", department: "Engineering", location: "Austin", type: "Contract", applicants: 9, posted: "1 week ago", status: "Active" },
  { title: "HR Coordinator", department: "Human Resources", location: "New York", type: "Full-time", applicants: 15, posted: "4 days ago", status: "Paused" },
];

const pipeline = [
  { stage: "Applied", count: 89, color: "bg-info" },
  { stage: "Screening", count: 34, color: "bg-warning" },
  { stage: "Interview", count: 18, color: "bg-primary" },
  { stage: "Offer", count: 5, color: "bg-success" },
];

const Recruitment = () => {
  return (
    <HRLayout title="Recruitment" subtitle="Manage job postings and track candidates.">
      <div className="space-y-6">
        {/* Pipeline */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {pipeline.map((stage) => (
            <div key={stage.stage} className="bg-card rounded-xl p-5 shadow-[var(--shadow-card)] border border-border">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-2.5 h-2.5 rounded-full ${stage.color}`} />
                <p className="text-sm text-muted-foreground font-medium">{stage.stage}</p>
              </div>
              <p className="text-2xl font-bold text-card-foreground">{stage.count}</p>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Open Positions</h3>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
            <Plus className="w-4 h-4" /> Post New Job
          </button>
        </div>

        {/* Job Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map((job) => (
            <div key={job.title} className="bg-card rounded-xl p-5 shadow-[var(--shadow-card)] border border-border hover:shadow-[var(--shadow-elevated)] transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="text-sm font-semibold text-card-foreground">{job.title}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">{job.department}</p>
                </div>
                <Badge variant="outline" className={job.status === "Active" ? "bg-success/10 text-success border-success/20" : "bg-muted text-muted-foreground border-border"}>
                  {job.status}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{job.location}</span>
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{job.type}</span>
                <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{job.applicants} applicants</span>
              </div>
              <p className="text-xs text-muted-foreground mt-3">Posted {job.posted}</p>
            </div>
          ))}
        </div>
      </div>
    </HRLayout>
  );
};

export default Recruitment;
