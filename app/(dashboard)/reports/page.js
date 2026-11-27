"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/layout/DashboardLayout";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  ArrowUpRight,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Download,
  FileSpreadsheet,
  FolderKanban,
  MoreHorizontal,
  X,
  Sparkles,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";

// Report data

const chartData = {
  "7d": [
    { label: "Mon", revenue: 1200, expenses: 450 },
    { label: "Tue", revenue: 1800, expenses: 620 },
    { label: "Wed", revenue: 1450, expenses: 520 },
    { label: "Thu", revenue: 2300, expenses: 760 },
    { label: "Fri", revenue: 1950, expenses: 680 },
    { label: "Sat", revenue: 2800, expenses: 850 },
    { label: "Sun", revenue: 2450, expenses: 720 },
  ],
  "30d": [
    { label: "Week 1", revenue: 5200, expenses: 2100 },
    { label: "Week 2", revenue: 6800, expenses: 2450 },
    { label: "Week 3", revenue: 5900, expenses: 2200 },
    { label: "Week 4", revenue: 8500, expenses: 3100 },
  ],
  "90d": [
    { label: "Aug", revenue: 14200, expenses: 5200 },
    { label: "Sep", revenue: 16800, expenses: 6100 },
    { label: "Oct", revenue: 15400, expenses: 5700 },
    { label: "Nov", revenue: 21300, expenses: 7600 },
    { label: "Dec", revenue: 19200, expenses: 6800 },
    { label: "Jan", revenue: 25800, expenses: 8900 },
  ],
  "12m": [
    { label: "Dec", revenue: 11200, expenses: 4200 },
    { label: "Jan", revenue: 14500, expenses: 5100 },
    { label: "Feb", revenue: 12800, expenses: 4600 },
    { label: "Mar", revenue: 16900, expenses: 5900 },
    { label: "Apr", revenue: 15500, expenses: 5700 },
    { label: "May", revenue: 18800, expenses: 6400 },
    { label: "Jun", revenue: 17200, expenses: 6100 },
    { label: "Jul", revenue: 21400, expenses: 7300 },
    { label: "Aug", revenue: 19800, expenses: 6900 },
    { label: "Sep", revenue: 23600, expenses: 8200 },
    { label: "Oct", revenue: 22100, expenses: 7800 },
    { label: "Nov", revenue: 26800, expenses: 9100 },
  ],
};

const metrics = {
  "7d": {
    revenue: "$2,450",
    revenueChange: "12.8%",
    profit: "$1,730",
    profitChange: "9.4%",
    completed: "3",
    completedChange: "+1",
    clients: "4",
    clientsChange: "+2",
  },
  "30d": {
    revenue: "$26,400",
    revenueChange: "18.6%",
    profit: "$18,750",
    profitChange: "14.2%",
    completed: "12",
    completedChange: "+3",
    clients: "18",
    clientsChange: "+4",
  },
  "90d": {
    revenue: "$106,800",
    revenueChange: "22.4%",
    profit: "$74,600",
    profitChange: "16.8%",
    completed: "34",
    completedChange: "+8",
    clients: "42",
    clientsChange: "+6",
  },
  "12m": {
    revenue: "$218,600",
    revenueChange: "28.5%",
    profit: "$151,200",
    profitChange: "21.3%",
    completed: "86",
    completedChange: "+18",
    clients: "124",
    clientsChange: "+24",
  },
};

const projectStatus = [
  { name: "Completed", value: 24, color: "#16A34A" },
  { name: "In progress", value: 14, color: "#635BFF" },
  { name: "On hold", value: 6, color: "#F59E0B" },
];

const serviceData = [
  { name: "Web Design", revenue: 12500 },
  { name: "Development", revenue: 9800 },
  { name: "Branding", revenue: 7600 },
  { name: "Marketing", revenue: 5200 },
];

const topClients = [
  {
    name: "Alex Morgan",
    company: "Vertex Studio",
    initials: "AM",
    revenue: "$12,400",
    projects: 8,
    percentage: 92,
  },
  {
    name: "Sophia Wilson",
    company: "Nova Agency",
    initials: "SW",
    revenue: "$9,850",
    projects: 6,
    percentage: 76,
  },
  {
    name: "James Carter",
    company: "Pixel House",
    initials: "JC",
    revenue: "$7,200",
    projects: 5,
    percentage: 58,
  },
  {
    name: "Olivia Brown",
    company: "Creative Labs",
    initials: "OB",
    revenue: "$5,600",
    projects: 4,
    percentage: 45,
  },
];

const topProjects = [
  {
    name: "E-commerce Platform",
    category: "Development",
    revenue: "$8,500",
    progress: 85,
    status: "In progress",
    color: "#635BFF",
  },
  {
    name: "Brand Identity Design",
    category: "Branding",
    revenue: "$6,200",
    progress: 100,
    status: "Completed",
    color: "#16A34A",
  },
  {
    name: "Corporate Website",
    category: "Web Design",
    revenue: "$4,800",
    progress: 65,
    status: "In progress",
    color: "#635BFF",
  },
];

// Shared components

function MetricCard({
  title,
  value,
  change,
  description,
  icon: Icon,
  iconColor,
  iconBg,
}) {
  return (
    <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-gray-800 dark:bg-[#111827]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
            {title}
          </p>

          <h3 className="mt-3 text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            {value}
          </h3>
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconBg}`}
        >
          <Icon size={19} className={iconColor} />
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
          <ArrowUpRight size={13} />
          {change}
        </span>

        <span className="text-[11px] text-gray-400">{description}</span>
      </div>
    </div>
  );
}

function SectionHeader({ title, subtitle, action }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">
          {title}
        </h3>

        {subtitle && (
          <p className="mt-1 text-xs text-gray-400">{subtitle}</p>
        )}
      </div>

      {action}
    </div>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-xl dark:border-gray-700 dark:bg-[#111827]">
      <p className="mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400">
        {label}
      </p>

      {payload.map((item) => (
        <div
          key={item.dataKey}
          className="flex items-center justify-between gap-5 py-1"
        >
          <span className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            {item.name}
          </span>

          <span className="text-xs font-bold text-gray-900 dark:text-gray-100">
            ${Number(item.value).toLocaleString("en-US")}
          </span>
        </div>
      ))}
    </div>
  );
}

// Reports page

export default function ReportsPage() {
  const [range, setRange] = useState("30d");
  const [isServiceDetailsOpen, setIsServiceDetailsOpen] = useState(false);

  const currentMetrics = metrics[range];
  const currentChart = chartData[range];

  const totalProjects = projectStatus.reduce(
    (sum, item) => sum + item.value,
    0
  );

  const dateLabel = {
    "7d": "Last 7 days",
    "30d": "Last 30 days",
    "90d": "Last 90 days",
    "12m": "Last 12 months",
  };

  // Export CSV

  const exportCSV = () => {
    const rows = [
      ["Nexora Reports"],
      ["Period", dateLabel[range]],
      [],
      ["Metric", "Value"],
      ["Total Revenue", currentMetrics.revenue],
      ["Net Profit", currentMetrics.profit],
      ["Completed Projects", currentMetrics.completed],
      ["Active Clients", currentMetrics.clients],
      [],
      ["Period", "Revenue", "Expenses"],
      ...currentChart.map((item) => [
        item.label,
        item.revenue,
        item.expenses,
      ]),
    ];

    const csvContent = rows
      .map((row) =>
        row
          .map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `nexora-report-${range}.csv`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  };

  // Chart totals

  const totalRevenue = useMemo(
    () => currentChart.reduce((sum, item) => sum + item.revenue, 0),
    [currentChart]
  );

  const totalExpenses = useMemo(
    () => currentChart.reduce((sum, item) => sum + item.expenses, 0),
    [currentChart]
  );

  const totalServiceRevenue = serviceData.reduce(
    (sum, item) => sum + item.revenue,
    0
  );

  return (
    <DashboardLayout>
      <div className="w-full min-w-0 space-y-7 pb-8">

        {/* Page header */}

        <section className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-[2px] text-[#635BFF]">
                BUSINESS INTELLIGENCE
              </span>

              <span className="h-1 w-1 rounded-full bg-gray-300" />

              <span className="text-[10px] text-gray-400">
                Workspace / Reports
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-3xl">
              Reports & analytics
            </h1>

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Track your business performance and insights.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <CalendarDays
                size={15}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <select
                value={range}
                onChange={(e) => setRange(e.target.value)}
                className="h-10 cursor-pointer appearance-none rounded-xl border border-gray-200 bg-white py-2 pl-9 pr-9 text-xs font-semibold text-gray-700 outline-none transition hover:border-gray-300 focus:border-[#635BFF] dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="12m">Last 12 months</option>
              </select>

              <ChevronDown
                size={14}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>

            <button
              onClick={exportCSV}
              className="flex items-center gap-2 rounded-xl bg-[#635BFF] px-4 py-2.5 text-xs font-semibold text-white shadow-sm shadow-violet-500/20 transition hover:bg-[#5148e5]"
            >
              <Download size={15} />
              Export CSV
            </button>
          </div>
        </section>

        {/* Overview metrics */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            title="Total Revenue"
            value={currentMetrics.revenue}
            change={currentMetrics.revenueChange}
            description="vs. previous period"
            icon={Wallet}
            iconColor="text-[#635BFF]"
            iconBg="bg-[#635BFF]/10"
          />

          <MetricCard
            title="Net Profit"
            value={currentMetrics.profit}
            change={currentMetrics.profitChange}
            description="vs. previous period"
            icon={TrendingUp}
            iconColor="text-emerald-600"
            iconBg="bg-emerald-50 dark:bg-emerald-500/10"
          />

          <MetricCard
            title="Completed Projects"
            value={currentMetrics.completed}
            change={currentMetrics.completedChange}
            description="more than before"
            icon={FolderKanban}
            iconColor="text-blue-600"
            iconBg="bg-blue-50 dark:bg-blue-500/10"
          />

          <MetricCard
            title="Active Clients"
            value={currentMetrics.clients}
            change={currentMetrics.clientsChange}
            description="vs. previous period"
            icon={Users}
            iconColor="text-orange-500"
            iconBg="bg-orange-50 dark:bg-orange-500/10"
          />
        </div>

        {/* Revenue chart and project status */}

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">

          {/* Revenue Chart */}

          <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-[#111827] xl:col-span-2">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                  Revenue Overview
                </h3>

                <p className="mt-1 text-xs text-gray-400">
                  Revenue and expenses over time
                </p>
              </div>

              <button
                type="button"
                className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800"
                aria-label="More revenue chart options"
              >
                <MoreHorizontal size={19} />
              </button>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
              <div>
                <p className="text-[11px] text-gray-400">
                  Total revenue
                </p>

                <p className="mt-1 text-lg font-bold text-gray-900 dark:text-gray-100">
                  ${totalRevenue.toLocaleString("en-US")}
                </p>
              </div>

              <div>
                <p className="text-[11px] text-gray-400">
                  Total expenses
                </p>

                <p className="mt-1 text-lg font-bold text-gray-900 dark:text-gray-100">
                  ${totalExpenses.toLocaleString("en-US")}
                </p>
              </div>

              <div className="ml-auto flex flex-wrap items-center gap-4">
                <span className="flex items-center gap-2 text-[11px] font-medium text-gray-500 dark:text-gray-400">
                  <span className="h-2 w-2 rounded-full bg-[#635BFF]" />
                  Revenue
                </span>

                <span className="flex items-center gap-2 text-[11px] font-medium text-gray-500 dark:text-gray-400">
                  <span className="h-2 w-2 rounded-full bg-[#A5B4FC]" />
                  Expenses
                </span>
              </div>
            </div>

            <div className="mt-5 h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={currentChart}
                  margin={{ top: 8, right: 8, left: -18, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="revenueGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#635BFF"
                        stopOpacity={0.18}
                      />

                      <stop
                        offset="95%"
                        stopColor="#635BFF"
                        stopOpacity={0}
                      />
                    </linearGradient>

                    <linearGradient
                      id="expenseGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#A5B4FC"
                        stopOpacity={0.16}
                      />

                      <stop
                        offset="95%"
                        stopColor="#A5B4FC"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    stroke="#F1F3F7"
                    vertical={false}
                    strokeDasharray="4 4"
                  />

                  <XAxis
                    dataKey="label"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94A3B8", fontSize: 11 }}
                    dy={10}
                  />

                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94A3B8", fontSize: 10 }}
                    tickFormatter={(value) =>
                      value >= 1000 ? `$${value / 1000}k` : `$${value}`
                    }
                  />

                  <Tooltip content={<CustomTooltip />} />

                  <Area
                    type="monotone"
                    dataKey="revenue"
                    name="Revenue"
                    stroke="#635BFF"
                    strokeWidth={2.5}
                    fill="url(#revenueGradient)"
                    activeDot={{
                      r: 5,
                      fill: "#635BFF",
                      stroke: "#fff",
                      strokeWidth: 2,
                    }}
                  />

                  <Area
                    type="monotone"
                    dataKey="expenses"
                    name="Expenses"
                    stroke="#A5B4FC"
                    strokeWidth={2}
                    fill="url(#expenseGradient)"
                    activeDot={{
                      r: 4,
                      fill: "#A5B4FC",
                      stroke: "#fff",
                      strokeWidth: 2,
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Project Status */}

          <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-[#111827]">
            <SectionHeader
              title="Project Status"
              subtitle="Distribution of all projects"
              action={
                <button
                  type="button"
                  className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 dark:hover:bg-gray-800"
                  aria-label="More project status options"
                >
                  <MoreHorizontal size={19} />
                </button>
              }
            />

            <div className="relative mt-3 h-[215px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={projectStatus}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={66}
                    outerRadius={88}
                    paddingAngle={5}
                    stroke="none"
                  >
                    {projectStatus.map((item) => (
                      <Cell key={item.name} fill={item.color} />
                    ))}
                  </Pie>

                  <Tooltip
                    formatter={(value, name) => [
                      `${value} projects`,
                      name,
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>

              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                  {totalProjects}
                </span>

                <span className="mt-1 text-[11px] text-gray-400">
                  Total Projects
                </span>
              </div>
            </div>

            <div className="mt-1 space-y-4">
              {projectStatus.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />

                    <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                      {item.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-gray-900 dark:text-gray-100">
                      {item.value}
                    </span>

                    <span className="w-9 text-right text-[11px] text-gray-400">
                      {Math.round((item.value / totalProjects) * 100)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Revenue by service and insights */}

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">

          {/* Revenue by Service */}

          <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-[#111827] xl:col-span-2">
            <SectionHeader
              title="Revenue by Service"
              subtitle="Your highest earning service categories"
              action={
                <button
                  type="button"
                  onClick={() => setIsServiceDetailsOpen(true)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-[#635BFF] transition hover:text-[#5148e5]"
                  aria-haspopup="dialog"
                  aria-expanded={isServiceDetailsOpen}
                >
                  View details
                  <ArrowUpRight size={14} />
                </button>
              }
            />

            <div className="mt-6 h-[245px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={serviceData}
                  layout="vertical"
                  margin={{ top: 0, right: 18, left: 5, bottom: 0 }}
                  barCategoryGap={18}
                >
                  <CartesianGrid
                    stroke="#F1F3F7"
                    horizontal={false}
                    strokeDasharray="4 4"
                  />

                  <XAxis
                    type="number"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94A3B8", fontSize: 10 }}
                    tickFormatter={(value) => `$${value / 1000}k`}
                  />

                  <YAxis
                    type="category"
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    width={92}
                    tick={{ fill: "#64748B", fontSize: 11 }}
                  />

                  <Tooltip
                    formatter={(value) => [
                      `$${Number(value).toLocaleString("en-US")}`,
                      "Revenue",
                    ]}
                    cursor={{ fill: "#F8FAFC" }}
                  />

                  <Bar
                    dataKey="revenue"
                    fill="#635BFF"
                    radius={[0, 7, 7, 0]}
                    barSize={19}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Business Insights */}

          <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm dark:border-gray-800 dark:bg-[#111827]">
            <div className="relative overflow-hidden bg-gradient-to-br from-[#29245f] via-[#4337a8] to-[#635BFF] p-5 text-white">
              <div className="absolute -right-8 -top-10 h-36 w-36 rounded-full border-[22px] border-white/10" />
              <div className="absolute -bottom-12 right-20 h-28 w-28 rounded-full bg-white/10" />

              <div className="relative">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
                  <img src="/nexora.webp" className="w-6" alt="Nexora" />
                </div>

                <h3 className="mt-4 text-sm font-bold">
                  Business Insights
                </h3>

                <p className="mt-1 text-[11px] leading-5 text-white/75">
                  Highlights from your latest performance data.
                </p>
              </div>
            </div>

            <div className="space-y-5 p-5">
              <div className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-500/10">
                  <TrendingUp size={15} className="text-emerald-600" />
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                    Revenue is growing
                  </p>

                  <p className="mt-1 text-[11px] leading-5 text-gray-500 dark:text-gray-400">
                    Your revenue increased by 18.6% compared with the previous period.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-500/10">
                  <BarChart3 size={15} className="text-blue-600" />
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                    Top earning category
                  </p>

                  <p className="mt-1 text-[11px] leading-5 text-gray-500 dark:text-gray-400">
                    Web Design currently generates the highest revenue among your service categories.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-50 dark:bg-orange-500/10">
                  <Clock3 size={15} className="text-orange-500" />
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                    Project activity
                  </p>

                  <p className="mt-1 text-[11px] leading-5 text-gray-500 dark:text-gray-400">
                    Keep an eye on your ongoing projects and upcoming deadlines.
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-[#635BFF]/10 bg-[#635BFF]/5 p-3 dark:border-[#635BFF]/20 dark:bg-[#635BFF]/5">
                <p className="text-[11px] font-medium text-[#635BFF]">
                  Performance summary
                </p>

                <p className="mt-1 text-xs leading-5 text-gray-600 dark:text-gray-300">
                  Your workspace is showing positive growth across revenue, projects and client activity.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Top clients and projects */}

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">

          {/* Top Clients */}

          <div className="min-w-0 rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-[#111827]">
            <SectionHeader
              title="Top Clients"
              subtitle="Clients ranked by total revenue"
              action={
                <Link
                  href="/customers"
                  className="flex items-center gap-1.5 text-xs font-semibold text-[#635BFF] transition hover:text-[#5148e5]"
                >
                  View all
                  <ArrowUpRight size={14} />
                </Link>
              }
            />

            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[430px] text-left">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <th className="pb-3 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                      Client
                    </th>

                    <th className="pb-3 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                      Projects
                    </th>

                    <th className="pb-3 text-right text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                      Revenue
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {topClients.map((client) => (
                    <tr
                      key={client.name}
                      className="border-b border-gray-50 last:border-0 dark:border-gray-800/60"
                    >
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#635BFF]/10 text-[11px] font-bold text-[#635BFF]">
                            {client.initials}
                          </div>

                          <div>
                            <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                              {client.name}
                            </p>

                            <p className="mt-0.5 text-[10px] text-gray-400">
                              {client.company}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 text-xs font-medium text-gray-600 dark:text-gray-300">
                        {client.projects}
                      </td>

                      <td className="py-4 text-right text-xs font-bold text-gray-900 dark:text-gray-100">
                        {client.revenue}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Projects */}

          <div className="min-w-0 rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-[#111827]">
            <SectionHeader
              title="Top Performing Projects"
              subtitle="Projects with the highest revenue"
              action={
                <Link
                  href="/projects"
                  className="flex items-center gap-1.5 text-xs font-semibold text-[#635BFF] transition hover:text-[#5148e5]"
                >
                  View all
                  <ArrowUpRight size={14} />
                </Link>
              }
            />

            <div className="mt-5 space-y-5">
              {topProjects.map((project) => (
                <div key={project.name}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-gray-800 dark:text-gray-200">
                        {project.name}
                      </p>

                      <p className="mt-1 text-[10px] text-gray-400">
                        {project.category}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs font-bold text-gray-900 dark:text-gray-100">
                        {project.revenue}
                      </p>

                      <span
                        className={`mt-1 inline-flex items-center gap-1 text-[10px] font-medium ${project.status === "Completed"
                            ? "text-emerald-600"
                            : "text-[#635BFF]"
                          }`}
                      >
                        {project.status === "Completed" ? (
                          <CheckCircle2 size={11} />
                        ) : (
                          <Clock3 size={11} />
                        )}

                        {project.status}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${project.progress}%`,
                        backgroundColor: project.color,
                      }}
                    />
                  </div>

                  <div className="mt-1.5 flex justify-end">
                    <span className="text-[10px] font-medium text-gray-400">
                      {project.progress}% complete
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-gray-200/70 pt-4 dark:border-gray-800">
          <div className="flex items-center gap-2 text-[10px] text-gray-400">
            <FileSpreadsheet size={14} />
            Reports overview
          </div>

          <p className="text-[10px] text-gray-400">
            Showing data for {dateLabel[range]}
          </p>
        </div>

      </div>

      {/* Service revenue details modal */}

      {isServiceDetailsOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-[3px]"
          onClick={() => setIsServiceDetailsOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="service-details-title"
            className="w-full max-w-xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-[#111827]"
            onClick={(event) => event.stopPropagation()}
          >
            {/* Modal Header */}

            <div className="flex items-start justify-between border-b border-gray-100 px-5 py-5 dark:border-gray-800 sm:px-6">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#635BFF]/10 text-[#635BFF]">
                    <BarChart3 size={16} />
                  </span>

                  <span className="text-[10px] font-bold uppercase tracking-[1.5px] text-[#635BFF]">
                    Revenue breakdown
                  </span>
                </div>

                <h2
                  id="service-details-title"
                  className="text-lg font-bold text-gray-900 dark:text-gray-100"
                >
                  Service revenue details
                </h2>

                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Revenue contribution by service category
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsServiceDetailsOpen(false)}
                aria-label="Close service revenue details"
                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Content */}

            <div className="p-5 sm:p-6">

              {/* Total Revenue */}

              <div className="rounded-xl border border-[#635BFF]/10 bg-[#635BFF]/[0.06] p-4 dark:border-[#635BFF]/20 dark:bg-[#635BFF]/10">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Total service revenue
                </p>

                <p className="mt-1.5 text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                  ${totalServiceRevenue.toLocaleString("en-US")}
                </p>

                <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">
                  Across {serviceData.length} service categories
                </p>
              </div>

              {/* Service Breakdown */}

              <div className="mt-5 space-y-5">
                {serviceData
                  .slice()
                  .sort((a, b) => b.revenue - a.revenue)
                  .map((service, index) => {
                    const share =
                      (service.revenue / totalServiceRevenue) * 100;

                    return (
                      <div key={service.name}>
                        <div className="mb-2 flex items-center justify-between gap-3">
                          <div className="flex min-w-0 items-center gap-3">
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-[10px] font-bold text-gray-500 dark:bg-gray-800 dark:text-gray-300">
                              {index + 1}
                            </span>

                            <span className="truncate text-xs font-semibold text-gray-800 dark:text-gray-200">
                              {service.name}
                            </span>
                          </div>

                          <div className="shrink-0 text-right">
                            <span className="text-xs font-bold text-gray-900 dark:text-gray-100">
                              ${service.revenue.toLocaleString("en-US")}
                            </span>

                            <span className="ml-2 text-[10px] font-medium text-gray-400">
                              {share.toFixed(1)}%
                            </span>
                          </div>
                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                          <div
                            className="h-full rounded-full bg-[#635BFF] transition-all"
                            style={{ width: `${share}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>

              {/* Modal Footer */}

              <div className="mt-6 flex justify-end border-t border-gray-100 pt-4 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setIsServiceDetailsOpen(false)}
                  className="rounded-xl bg-[#635BFF] px-4 py-2.5 text-xs font-semibold text-white shadow-sm shadow-violet-500/20 transition hover:bg-[#5148e5]"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
