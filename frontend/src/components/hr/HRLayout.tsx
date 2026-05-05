import { Bell, Search } from "lucide-react";
import Sidebar from "@/components/hr/Sidebar";

interface HRLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

const HRLayout = ({ title, subtitle, children }: HRLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar is fixed-position, outside normal flow */}
      <Sidebar />

      {/* On mobile: full width (sidebar is fixed/overlaid, not in flow)
          On md+: offset left by sidebar width */}
      <div className="md:ml-64 min-h-screen flex flex-col">
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          {/* pl-10 reserves space for the hamburger button on mobile (fixed at left-3) */}
          <div className="pl-10 md:pl-0">
            <h2 className="text-xl font-bold text-foreground leading-tight">
              {title}
            </h2>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>

        </header>

        <div className="flex-1 p-4 sm:p-6 md:p-8 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default HRLayout;