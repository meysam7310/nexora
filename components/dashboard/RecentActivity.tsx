
import {
  Activity as ActivityIcon,
  Clock3,
  ArrowUpRight,
} from "lucide-react";

import type { Activity } from "@/types/dashboard";
import { activities } from "@/data/dashboard";

const avatarColors = [
  "bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300",
  "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
  "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300",
];

export default function RecentActivity() {
  return (
    <section className="rounded-2xl border border-[#e9ecf2] bg-white transition-colors duration-200 dark:border-gray-800 dark:bg-[#111827]">
      <div className="flex items-center justify-between border-b border-[#e9ecf2] px-6 py-5 dark:border-gray-800">
        <div>
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            Recent Activity
          </h2>

          <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
            Latest updates from your workspace
          </p>
        </div>

        <button
          aria-label="View all activities"
          className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-gray-200"
        >
          <ArrowUpRight size={18} />
        </button>
      </div>

      <div className="divide-y divide-gray-100 px-6 dark:divide-gray-800">
        {activities.map((activity: Activity, index: number) => (
          <div
            key={activity.id}
            className="flex items-start gap-3 py-5"
          >
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                avatarColors[index % avatarColors.length]
              }`}
            >
              {activity.initials}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm leading-6 text-gray-600 dark:text-gray-300">
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {activity.user}
                </span>{" "}
                {activity.action}{" "}
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  {activity.target}
                </span>
              </p>

              <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
                <Clock3 size={13} />
                {activity.time}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-100 px-6 py-4 dark:border-gray-800">
        <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
          <ActivityIcon size={14} />
          Showing latest workspace activities
        </div>
      </div>
    </section>
  );
}
