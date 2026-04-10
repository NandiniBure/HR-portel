import { Users, CalendarDays, Briefcase, TrendingUp, Bell, Search } from "lucide-react";
import Sidebar from "@/components/hr/Sidebar";
import StatCard from "@/components/hr/StatCard";
import EmployeeTable from "@/components/hr/EmployeeTable";
import LeaveRequests from "@/components/hr/LeaveRequests";
import ActivityFeed from "@/components/hr/ActivityFeed";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      {/* Main Content */}
      <main className="ml-64 min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border px-8 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">Dashboard</h2>
            <p className="text-sm text-muted-foreground">Welcome back, Jane. Here's what's happening today.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-9 pr-4 py-2 bg-secondary rounded-lg text-sm text-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-ring w-56"
              />
            </div>
            <button className="relative w-10 h-10 rounded-lg bg-secondary flex items-center justify-center hover:bg-muted transition-colors">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-destructive rounded-full" />
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="p-8 space-y-6">
          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Employees"
              value={248}
              change="+12 this month"
              changeType="positive"
              icon={Users}
            />
            <StatCard
              title="On Leave Today"
              value={7}
              change="3 pending approval"
              changeType="neutral"
              icon={CalendarDays}
              iconColor="bg-warning"
            />
            <StatCard
              title="Open Positions"
              value={15}
              change="5 new this week"
              changeType="positive"
              icon={Briefcase}
              iconColor="bg-info"
            />
            <StatCard
              title="Attendance Rate"
              value="96.2%"
              change="+1.3% vs last month"
              changeType="positive"
              icon={TrendingUp}
              iconColor="bg-success"
            />
          </div>

          {/* Tables & Panels */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <EmployeeTable />
            </div>
            <div className="space-y-6">
              <LeaveRequests />
              <ActivityFeed />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
