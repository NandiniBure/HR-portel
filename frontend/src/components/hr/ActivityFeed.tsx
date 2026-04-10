import { UserPlus, CalendarCheck, Award, ArrowUpRight } from "lucide-react";

const activities = [
  { icon: UserPlus, text: "New employee Maria Garcia joined Design team", time: "2h ago", color: "text-primary bg-primary/10" },
  { icon: CalendarCheck, text: "Payroll for March has been processed", time: "5h ago", color: "text-success bg-success/10" },
  { icon: Award, text: "Alex Johnson completed onboarding", time: "1d ago", color: "text-warning bg-warning/10" },
  { icon: ArrowUpRight, text: "3 new applications for Senior Dev role", time: "1d ago", color: "text-info bg-info/10" },
];

const ActivityFeed = () => {
  return (
    <div className="bg-card rounded-xl shadow-[var(--shadow-card)] border border-border">
      <div className="px-5 py-4 border-b border-border">
        <h3 className="font-semibold text-card-foreground">Recent Activity</h3>
      </div>
      <div className="divide-y divide-border">
        {activities.map((a, i) => (
          <div key={i} className="px-5 py-3.5 flex items-start gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${a.color}`}>
              <a.icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-card-foreground">{a.text}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{a.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed;
