
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import RevenueChart from "@/components/dashboard/RevenueChart";
import ProjectsTable from "@/components/dashboard/ProjectsTable";
import RecentActivity from "@/components/dashboard/RecentActivity";
import RadialProgress from "@/components/dashboard/RadialProgress";

import { stats } from "@/data/dashboard";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <section>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Welcome to <span className="text-[#635BFF]">NEXORA</span>
          </h1>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Your business intelligence workspace.
          </p>
        </section>

        {/* Statistics Cards */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.id} stat={stat} />
          ))}
        </section>

        {/* Revenue Chart & Radial Progress */}
        <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="min-w-0 xl:col-span-2">
            <RevenueChart />
          </div>

          <div className="min-w-0">
            <RadialProgress />
          </div>
        </section>

        {/* Projects */}
        <ProjectsTable />

        {/* Recent Activity */}
        <RecentActivity />
      </div>
    </DashboardLayout>
  );
}
