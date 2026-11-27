
import {
  ArrowUpRight,
  Wallet,
  TrendingUp,
} from "lucide-react";

const breakdown = [
  {
    label: "Total Income",
    amount: "$84,254",
    percentage: 72,
    color: "bg-[#635BFF]",
  },
  {
    label: "Total Expenses",
    amount: "$32,480",
    percentage: 38,
    color: "bg-orange-400",
  },
  {
    label: "Net Profit",
    amount: "$51,774",
    percentage: 61,
    color: "bg-emerald-500",
  },
];

export default function RevenueBreakdown() {
  return (
    <section className="h-full rounded-2xl border border-[#e9ecf2] bg-white p-5 transition-colors duration-200 dark:border-gray-800 dark:bg-[#111827]">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            Revenue Breakdown
          </h2>

          <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
            Financial performance
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eeeaff] text-[#635BFF] dark:bg-violet-500/10 dark:text-violet-400">
          <Wallet size={19} />
        </div>
      </div>

      <div className="mt-5">
        <p className="text-xs text-gray-400 dark:text-gray-500">
          Net Profit
        </p>

        <h3 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          $51,774
        </h3>

        <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
          <ArrowUpRight size={14} />
          18.6%

          <span className="font-normal text-emerald-500 dark:text-emerald-400">
            vs last period
          </span>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        {breakdown.map((item) => (
          <div key={item.label}>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                {item.label}
              </span>

              <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                {item.amount}
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
              <div
                className={`h-full rounded-full ${item.color}`}
                style={{ width: `${item.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-xl bg-[#f7f8fc] p-3 dark:bg-gray-800/70">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
          <TrendingUp size={17} className="text-emerald-500" />
          Healthy growth
        </div>

        <p className="mt-2 text-xs leading-5 text-gray-500 dark:text-gray-400">
          Your revenue is performing well compared to the previous period.
        </p>
      </div>
    </section>
  );
}
