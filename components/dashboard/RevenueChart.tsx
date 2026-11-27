
"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { revenueData } from "@/data/dashboard";
import { useTheme } from "@/components/providers/ThemeProvider";

export default function RevenueChart() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="rounded-2xl border border-[#edf0f5] bg-white p-6 shadow-sm transition-colors duration-200 dark:border-gray-800 dark:bg-[#111827]">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            Revenue Analytics
          </h3>

          <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
            Revenue performance throughout the year
          </p>
        </div>

        <select className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-600 outline-none transition-colors dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
          <option>2026</option>
          <option>2025</option>
        </select>
      </div>

      <div className="h-[348.5px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={revenueData}
            margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
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
                  offset="5%"
                  stopColor="#635BFF"
                  stopOpacity={0.2}
                />
                <stop
                  offset="95%"
                  stopColor="#635BFF"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke={isDark ? "#273449" : "#edf0f5"}
            />

            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: isDark ? "#9ca3af" : "#9ca3af",
                fontSize: 12,
              }}
              dy={10}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{
                fill: isDark ? "#9ca3af" : "#9ca3af",
                fontSize: 12,
              }}
              tickFormatter={(value: number) => `$${value / 1000}k`}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? "#1f2937" : "#ffffff",
                borderRadius: "12px",
                border: `1px solid ${isDark ? "#374151" : "#edf0f5"}`,
                color: isDark ? "#f3f4f6" : "#111827",
                boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
              }}
              labelStyle={{
                color: isDark ? "#f3f4f6" : "#111827",
                fontWeight: 600,
              }}
              itemStyle={{
                color: isDark ? "#e5e7eb" : "#374151",
              }}
            />

            <Area
              type="monotone"
              dataKey="revenue"
              name="Revenue"
              stroke="#635BFF"
              strokeWidth={3}
              fill="url(#revenueGradient)"
              activeDot={{ r: 5 }}
            />

            <Area
              type="monotone"
              dataKey="expenses"
              name="Expenses"
              stroke="#94a3b8"
              strokeWidth={2}
              fill="transparent"
              strokeDasharray="5 5"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
