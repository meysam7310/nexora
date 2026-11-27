
import {
  Wallet,
  Users,
  FolderKanban,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";

import type { StatCard as StatCardType } from "@/types/dashboard";

const iconMap = {
  wallet: Wallet,
  users: Users,
  folder: FolderKanban,
  trending: TrendingUp,
};

const colorMap = {
  purple: {
    bg: "bg-violet-50 dark:bg-violet-500/10",
    text: "text-violet-600 dark:text-violet-400",
  },
  blue: {
    bg: "bg-blue-50 dark:bg-blue-500/10",
    text: "text-blue-600 dark:text-blue-400",
  },
  green: {
    bg: "bg-emerald-50 dark:bg-emerald-500/10",
    text: "text-emerald-600 dark:text-emerald-400",
  },
  orange: {
    bg: "bg-orange-50 dark:bg-orange-500/10",
    text: "text-orange-600 dark:text-orange-400",
  },
};

interface StatCardProps {
  stat: StatCardType;
}

export default function StatCard({ stat }: StatCardProps) {
  const Icon = iconMap[stat.icon as keyof typeof iconMap];
  const colors = colorMap[stat.color];

  return (
    <div className="rounded-2xl border border-[#edf0f5] bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-gray-800 dark:bg-[#111827] dark:shadow-black/10">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {stat.title}
        </p>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${colors.bg} ${colors.text}`}
        >
          <Icon size={21} />
        </div>
      </div>

      <div className="mt-5 flex items-end justify-between">
        <h3 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          {stat.value}
        </h3>

        <span className="flex items-center gap-1 rounded-lg bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
          <ArrowUpRight size={14} />
          {stat.change}%
        </span>
      </div>

      <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
        {stat.description}
      </p>
    </div>
  );
}
