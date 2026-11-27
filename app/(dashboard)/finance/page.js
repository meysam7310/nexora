"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";

import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  Download,
  FileText,
  Plus,
  Search,
  SlidersHorizontal,
  TrendingUp,
  Wallet,
  Pencil,
  Trash2,
  X,
  ArrowLeftRight,
  Receipt,
  Target,
} from "lucide-react";

// Constants

const STORAGE_KEY = "nexora-finance-transactions";
const BUDGET_KEY = "nexora-finance-monthly-budget";

const INITIAL_BUDGET = 5000;

const categories = [
  "Development",
  "Design",
  "Software",
  "Marketing",
  "Equipment",
  "Operations",
  "Subscription",
  "Other",
];

const methods = [
  "Bank Transfer",
  "Credit Card",
  "PayPal",
  "Cash",
  "Other",
];

const initialTransactions = [
  {
    id: "tx-001",
    title: "Website Redesign",
    client: "Acme Corporation",
    category: "Development",
    type: "Income",
    amount: 4500,
    date: "2026-11-14",
    status: "Paid",
    method: "Bank Transfer",
    notes: "Website redesign project milestone.",
  },
  {
    id: "tx-002",
    title: "Software Subscription",
    client: "Internal",
    category: "Software",
    type: "Expense",
    amount: 249,
    date: "2026-11-12",
    status: "Paid",
    method: "Credit Card",
    notes: "Monthly software subscription.",
  },
  {
    id: "tx-003",
    title: "Brand Identity",
    client: "Nova Studio",
    category: "Design",
    type: "Income",
    amount: 2500,
    date: "2026-11-09",
    status: "Paid",
    method: "Bank Transfer",
    notes: "Brand identity delivery.",
  },
  {
    id: "tx-004",
    title: "Marketing Campaign",
    client: "Internal",
    category: "Marketing",
    type: "Expense",
    amount: 680,
    date: "2026-11-07",
    status: "Paid",
    method: "Credit Card",
    notes: "Campaign promotion expenses.",
  },
  {
    id: "tx-005",
    title: "Dashboard Development",
    client: "TechFlow",
    category: "Development",
    type: "Income",
    amount: 1800,
    date: "2026-10-28",
    status: "Pending",
    method: "Bank Transfer",
    notes: "Awaiting client payment.",
  },
  {
    id: "tx-006",
    title: "E-commerce Platform",
    client: "Urban Market",
    category: "Development",
    type: "Income",
    amount: 3600,
    date: "2026-10-22",
    status: "Paid",
    method: "PayPal",
    notes: "Development payment.",
  },
  {
    id: "tx-007",
    title: "New Equipment",
    client: "Internal",
    category: "Equipment",
    type: "Expense",
    amount: 1250,
    date: "2026-10-18",
    status: "Paid",
    method: "Credit Card",
    notes: "Office equipment.",
  },
  {
    id: "tx-008",
    title: "Operating Costs",
    client: "Internal",
    category: "Operations",
    type: "Expense",
    amount: 420,
    date: "2026-10-05",
    status: "Paid",
    method: "Bank Transfer",
    notes: "General operating costs.",
  },
  {
    id: "tx-009",
    title: "Creative Direction",
    client: "Nova Studio",
    category: "Design",
    type: "Income",
    amount: 5200,
    date: "2026-09-18",
    status: "Paid",
    method: "Bank Transfer",
    notes: "Creative direction services.",
  },
  {
    id: "tx-010",
    title: "Software Tools",
    client: "Internal",
    category: "Software",
    type: "Expense",
    amount: 199,
    date: "2026-09-12",
    status: "Paid",
    method: "Credit Card",
    notes: "Software tools.",
  },
  {
    id: "tx-011",
    title: "Frontend Development",
    client: "Acme Corporation",
    category: "Development",
    type: "Income",
    amount: 4100,
    date: "2026-08-20",
    status: "Paid",
    method: "Bank Transfer",
    notes: "Frontend development work.",
  },
  {
    id: "tx-012",
    title: "Advertising",
    client: "Internal",
    category: "Marketing",
    type: "Expense",
    amount: 850,
    date: "2026-08-08",
    status: "Paid",
    method: "Credit Card",
    notes: "Advertising expenses.",
  },
  {
    id: "tx-013",
    title: "Marketing Website",
    client: "Bright Media",
    category: "Development",
    type: "Income",
    amount: 3800,
    date: "2026-07-15",
    status: "Paid",
    method: "PayPal",
    notes: "Website development.",
  },
  {
    id: "tx-014",
    title: "Hardware Upgrade",
    client: "Internal",
    category: "Equipment",
    type: "Expense",
    amount: 670,
    date: "2026-07-02",
    status: "Paid",
    method: "Credit Card",
    notes: "Hardware expenses.",
  },
  {
    id: "tx-015",
    title: "Web Application",
    client: "TechFlow",
    category: "Development",
    type: "Income",
    amount: 3200,
    date: "2026-06-10",
    status: "Paid",
    method: "Bank Transfer",
    notes: "Web application development.",
  },
  {
    id: "tx-016",
    title: "Operations",
    client: "Internal",
    category: "Operations",
    type: "Expense",
    amount: 540,
    date: "2026-06-04",
    status: "Paid",
    method: "Bank Transfer",
    notes: "General expenses.",
  },
];

// Helpers

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatInputDate = (timestamp) => {
  if (timestamp === null) return "";
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

function normalizeTransaction(transaction, index = 0) {
  return {
    id: String(transaction.id ?? `tx-${index}`),
    title: transaction.title || "Untitled Transaction",
    client: transaction.client || "Internal",
    category: transaction.category || "Other",
    type: transaction.type === "Expense" ? "Expense" : "Income",
    amount: Math.max(0, Number(transaction.amount) || 0),
    date: transaction.date || "",
    status: transaction.status === "Pending" ? "Pending" : "Paid",
    method: transaction.method || "Other",
    notes: transaction.notes || "",
  };
}

function buildMonthlyData(transactions, timestamp) {
  if (timestamp === null) return [];

  const current = new Date(timestamp);
  current.setDate(1);
  current.setHours(12, 0, 0, 0);

  const months = [];

  for (let i = 5; i >= 0; i--) {
    const date = new Date(current);
    date.setMonth(current.getMonth() - i);

    const key = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
    ].join("-");

    const income = transactions
      .filter(
        (item) =>
          item.type === "Income" &&
          item.status === "Paid" &&
          item.date.startsWith(key)
      )
      .reduce((sum, item) => sum + item.amount, 0);

    const expense = transactions
      .filter(
        (item) =>
          item.type === "Expense" &&
          item.status === "Paid" &&
          item.date.startsWith(key)
      )
      .reduce((sum, item) => sum + item.amount, 0);

    months.push({
      key,
      label: date.toLocaleDateString("en-US", { month: "short" }),
      income,
      expense,
    });
  }

  return months;
}

// Count up animation

function useCountUp(target, duration = 1650, enabled = true) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!enabled) {
      setCount(0);
      return;
    }

    const end = Number(target) || 0;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCount(end);
      return;
    }

    let animationFrame;
    let startTime = null;

    setCount(0);

    const animate = (currentTime) => {
      if (startTime === null) {
        startTime = currentTime;
      }

      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      setCount(progress === 1 ? end : Math.round(end * easedProgress));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [target, duration, enabled]);

  return count;
}

// Shared styles

const cardClass =
  "rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#635BFF] focus:ring-4 focus:ring-[#635BFF]/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white";

const primaryButtonClass =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-[#635BFF] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:-translate-y-0.5 hover:bg-[#5148e5] active:translate-y-0";

// Stat Card

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
  trend,
  negative,
  featured = false,
}) {
  return (
    <div
      className={`${cardClass} group relative overflow-hidden p-5 transition duration-200 hover:-translate-y-1 hover:shadow-lg ${
        featured ? "border-violet-200 dark:border-violet-500/20" : ""
      }`}
    >
      {featured && (
        <div className="absolute right-0 top-0 h-20 w-20 rounded-bl-[70px] bg-violet-50/80 dark:bg-violet-500/5" />
      )}

      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <h3 className="mt-3 break-all text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {value}
          </h3>
        </div>

        <div className={`shrink-0 rounded-xl p-3 ${color}`}>
          <Icon size={21} />
        </div>
      </div>

      <div className="relative mt-4 flex flex-wrap items-center gap-2 text-xs">
        {trend && (
          <span
            className={`flex items-center gap-1 font-semibold ${
              negative
                ? "text-rose-500"
                : "text-emerald-600 dark:text-emerald-400"
            }`}
          >
            {negative ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />}
            {trend}
          </span>
        )}
        <span className="text-slate-400">{subtitle}</span>
      </div>
    </div>
  );
}

// Monthly Chart

function MonthlyChart({ data }) {
  const chartRef = useRef(null);
  const [hasEnteredView, setHasEnteredView] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);

  useEffect(() => {
    const element = chartRef.current;
    if (!element || hasEnteredView) return;

    if (!("IntersectionObserver" in window)) {
      setHasEnteredView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setHasEnteredView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [hasEnteredView]);

  useEffect(() => {
    if (!hasEnteredView || !data.length) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setAnimationProgress(1);
      return;
    }

    let animationFrame;
    let startTime = null;

    setAnimationProgress(0);

    const duration = 1100;

    const animate = (currentTime) => {
      if (startTime === null) {
        startTime = currentTime;
      }

      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      setAnimationProgress(easedProgress);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [hasEnteredView, data]);

  const maxValue = Math.max(
    1,
    ...data.map((item) => Math.max(item.income, item.expense))
  );

  const chartHeight = 135;
  const baseline = 170;

  return (
    <div ref={chartRef} className="w-full">
      <div className="mb-5 flex flex-wrap items-center gap-5">
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="h-2.5 w-2.5 rounded-full bg-[#635BFF]" />
          Revenue
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
          Expenses
        </div>
      </div>

      {data.length === 0 ? (
        <div className="flex h-56 items-center justify-center text-sm text-slate-400">
          Loading financial analytics...
        </div>
      ) : (
        <svg
          viewBox="0 0 600 225"
          className="w-full overflow-visible"
          role="img"
          aria-label="Monthly revenue and expenses bar chart"
        >
          <defs>
            <linearGradient
              id="revenueGradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor="#635BFF" />
              <stop offset="100%" stopColor="#8B83FF" />
            </linearGradient>
          </defs>

          {[35, 80, 125, 170].map((y) => (
            <line
              key={y}
              x1="25"
              y1={y}
              x2="575"
              y2={y}
              stroke="currentColor"
              strokeDasharray="4 6"
              className="text-slate-200 dark:text-slate-800"
            />
          ))}

          {data.map((item, index) => {
            const center = 65 + index * 94;
            const incomeHeight = (item.income / maxValue) * chartHeight;
            const expenseHeight = (item.expense / maxValue) * chartHeight;
            const animatedIncomeHeight = incomeHeight * animationProgress;
            const animatedExpenseHeight = expenseHeight * animationProgress;

            return (
              <g key={item.key}>
                <rect
                  x={center - 25}
                  y={baseline - animatedIncomeHeight}
                  width="23"
                  height={animatedIncomeHeight}
                  rx="6"
                  fill="url(#revenueGradient)"
                >
                  <title>
                    {item.label} revenue: {formatCurrency(item.income)}
                  </title>
                </rect>

                <rect
                  x={center + 3}
                  y={baseline - animatedExpenseHeight}
                  width="23"
                  height={animatedExpenseHeight}
                  rx="6"
                  fill="#FBBF24"
                >
                  <title>
                    {item.label} expenses: {formatCurrency(item.expense)}
                  </title>
                </rect>

                <text
                  x={center}
                  y="202"
                  textAnchor="middle"
                  fontSize="12"
                  fill="currentColor"
                  className="text-slate-400"
                >
                  {item.label}
                </text>
              </g>
            );
          })}
        </svg>
      )}
    </div>
  );
}

// Transaction Modal

function TransactionModal({ transaction, today, onClose, onSave }) {
  const [form, setForm] = useState(() =>
    transaction
      ? { ...transaction, amount: String(transaction.amount) }
      : {
          title: "",
          client: "",
          category: "Development",
          type: "Income",
          amount: "",
          date: today,
          status: "Paid",
          method: "Bank Transfer",
          notes: "",
        }
  );

  const [error, setError] = useState("");

  const update = (key, value) => {
    setForm((previous) => ({ ...previous, [key]: value }));
    setError("");
  };

  const submit = (event) => {
    event.preventDefault();

    const amount = Number(form.amount);

    if (!form.title.trim()) {
      setError("Please enter a transaction title.");
      return;
    }

    if (!form.date) {
      setError("Please select a transaction date.");
      return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      setError("Enter a valid amount greater than zero.");
      return;
    }

    onSave({ ...form, amount });
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 sm:p-7">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#635BFF] dark:text-[#635BFF]">
              <CircleDollarSign size={15} />
              Finance Management
            </div>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {transaction ? "Edit Transaction" : "New Transaction"}
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              Enter the transaction information below.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={submit} className="space-y-5">
          <div>
            <label className="mb-2 block text-xs font-semibold text-slate-600 dark:text-slate-300">
              Transaction Type
            </label>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => update("type", "Income")}
                className={`flex items-center justify-center gap-2 rounded-xl border py-3 text-sm font-semibold transition ${
                  form.type === "Income"
                    ? "border-[#635BFF] bg-[#635BFF]/10 text-[#635BFF] ring-2 ring-[#635BFF]/10 dark:bg-[#635BFF]/10 dark:text-[#635BFF]"
                    : "border-slate-200 text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
                }`}
              >
                <ArrowDownRight size={17} />
                Income
              </button>

              <button
                type="button"
                onClick={() => update("type", "Expense")}
                className={`flex items-center justify-center gap-2 rounded-xl border py-3 text-sm font-semibold transition ${
                  form.type === "Expense"
                    ? "border-rose-500 bg-rose-50 text-rose-700 ring-2 ring-rose-500/10 dark:bg-rose-500/10 dark:text-rose-300"
                    : "border-slate-200 text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
                }`}
              >
                <ArrowUpRight size={17} />
                Expense
              </button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-2 block text-xs font-semibold text-slate-600 dark:text-slate-300">
                Transaction Title *
              </label>

              <input
                required
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
                placeholder="e.g. Website Development"
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold text-slate-600 dark:text-slate-300">
                Client / Vendor
              </label>

              <input
                value={form.client}
                onChange={(e) => update("client", e.target.value)}
                placeholder="Client or company"
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold text-slate-600 dark:text-slate-300">
                Category
              </label>

              <select
                value={form.category}
                onChange={(e) => update("category", e.target.value)}
                className={inputClass}
              >
                {categories.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold text-slate-600 dark:text-slate-300">
                Amount (USD) *
              </label>

              <input
                required
                type="number"
                min="0.01"
                step="0.01"
                value={form.amount}
                onChange={(e) => update("amount", e.target.value)}
                placeholder="2500"
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold text-slate-600 dark:text-slate-300">
                Date *
              </label>

              <input
                required
                type="date"
                value={form.date}
                onChange={(e) => update("date", e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold text-slate-600 dark:text-slate-300">
                Payment Status
              </label>

              <select
                value={form.status}
                onChange={(e) => update("status", e.target.value)}
                className={inputClass}
              >
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold text-slate-600 dark:text-slate-300">
                Payment Method
              </label>

              <select
                value={form.method}
                onChange={(e) => update("method", e.target.value)}
                className={inputClass}
              >
                {methods.map((method) => (
                  <option key={method}>{method}</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="mb-2 block text-xs font-semibold text-slate-600 dark:text-slate-300">
                Notes
              </label>

              <textarea
                rows={3}
                value={form.notes}
                onChange={(e) => update("notes", e.target.value)}
                placeholder="Additional information..."
                className={`${inputClass} resize-none`}
              />
            </div>
          </div>

          {error && (
            <p className="rounded-xl bg-rose-50 px-4 py-3 text-xs font-medium text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-5 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Cancel
            </button>

            <button type="submit" className={primaryButtonClass}>
              {transaction ? "Save Changes" : "Create Transaction"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Delete Transaction Modal

function DeleteTransactionModal({ transaction, onClose, onConfirm }) {
  if (!transaction) return null;

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-[420px] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-950/20 dark:border-slate-800 dark:bg-slate-900">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
              <Trash2 size={23} />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Delete transaction?
              </h3>

              <p className="mt-1.5 text-sm leading-6 text-slate-500 dark:text-slate-400">
                Are you sure you want to delete this transaction? This action
                cannot be undone.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Transaction to be deleted
            </p>

            <p className="mt-1.5 truncate text-sm font-bold text-slate-800 dark:text-slate-200">
              {transaction.title}
            </p>

            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
              <span>{transaction.client || "Internal"}</span>
              <span className="text-slate-300 dark:text-slate-600">·</span>
              <span>{transaction.type}</span>
              <span className="text-slate-300 dark:text-slate-600">·</span>
              <span
                className={
                  transaction.type === "Income"
                    ? "font-semibold text-emerald-600 dark:text-emerald-400"
                    : "font-semibold text-rose-500"
                }
              >
                {transaction.type === "Income" ? "+" : "-"}
                {formatCurrency(transaction.amount)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-100 bg-slate-50/80 px-6 py-4 dark:border-slate-800 dark:bg-slate-800/30">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm shadow-rose-500/20 transition hover:bg-rose-700"
          >
            <Trash2 size={15} />
            Delete transaction
          </button>
        </div>
      </div>
    </div>
  );
}

// Main Finance Page

export default function FinancePage() {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [monthlyBudget, setMonthlyBudget] = useState(INITIAL_BUDGET);

  const [todayTimestamp, setTodayTimestamp] = useState(null);
  const [loaded, setLoaded] = useState(false);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [deletingTransaction, setDeletingTransaction] = useState(null);

  const [budgetEditing, setBudgetEditing] = useState(false);
  const [budgetDraft, setBudgetDraft] = useState(String(INITIAL_BUDGET));

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    setTodayTimestamp(today.getTime());
  }, []);

  useEffect(() => {
    try {
      const savedTransactions = localStorage.getItem(STORAGE_KEY);

      if (savedTransactions) {
        const parsed = JSON.parse(savedTransactions);

        if (Array.isArray(parsed)) {
          setTransactions(
            parsed.map((item, index) => normalizeTransaction(item, index))
          );
        }
      }

      const savedBudget = localStorage.getItem(BUDGET_KEY);

      if (savedBudget !== null) {
        const parsedBudget = Number(savedBudget);

        if (Number.isFinite(parsedBudget) && parsedBudget >= 0) {
          setMonthlyBudget(parsedBudget);
          setBudgetDraft(String(parsedBudget));
        }
      }
    } catch (error) {
      console.error("Could not load finance data:", error);
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!loaded) return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    } catch (error) {
      console.error("Could not save transactions:", error);
    }
  }, [transactions, loaded]);

  useEffect(() => {
    if (!loaded) return;

    try {
      localStorage.setItem(BUDGET_KEY, String(monthlyBudget));
    } catch (error) {
      console.error("Could not save budget:", error);
    }
  }, [monthlyBudget, loaded]);

  const monthlyData = useMemo(
    () => buildMonthlyData(transactions, todayTimestamp),
    [transactions, todayTimestamp]
  );

  const currentMonth = monthlyData[monthlyData.length - 1];
  const currentMonthKey = currentMonth?.key || null;

  const stats = useMemo(() => {
    const income = transactions
      .filter((item) => item.type === "Income" && item.status === "Paid")
      .reduce((sum, item) => sum + item.amount, 0);

    const expense = transactions
      .filter((item) => item.type === "Expense" && item.status === "Paid")
      .reduce((sum, item) => sum + item.amount, 0);

    const outstanding = transactions
      .filter((item) => item.type === "Income" && item.status === "Pending")
      .reduce((sum, item) => sum + item.amount, 0);

    return {
      income,
      expense,
      profit: income - expense,
      outstanding,
    };
  }, [transactions]);

  const animatedNetProfit = useCountUp(stats.profit, 1650, loaded);

  const collectionRate =
    stats.income + stats.outstanding > 0
      ? Math.round((stats.income / (stats.income + stats.outstanding)) * 100)
      : 0;

  const pendingCount = transactions.filter(
    (item) => item.type === "Income" && item.status === "Pending"
  ).length;

  const currentMonthExpenses = useMemo(() => {
    if (!currentMonthKey) return 0;

    return transactions
      .filter(
        (item) =>
          item.type === "Expense" && item.date.startsWith(currentMonthKey)
      )
      .reduce((sum, item) => sum + item.amount, 0);
  }, [transactions, currentMonthKey]);

  const budgetUsage =
    monthlyBudget > 0
      ? Math.min(100, (currentMonthExpenses / monthlyBudget) * 100)
      : currentMonthExpenses > 0
        ? 100
        : 0;

  const remainingBudget = Math.max(0, monthlyBudget - currentMonthExpenses);

  const expenseCategories = useMemo(() => {
    const colorClasses = [
      "bg-[#635BFF]",
      "bg-blue-500",
      "bg-amber-400",
      "bg-pink-500",
      "bg-cyan-500",
      "bg-indigo-400",
    ];

    const grouped = {};

    transactions
      .filter((item) => item.type === "Expense" && item.status === "Paid")
      .forEach((item) => {
        grouped[item.category] = (grouped[item.category] || 0) + item.amount;
      });

    return Object.entries(grouped)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5)
      .map((item, index) => ({
        ...item,
        color: colorClasses[index % colorClasses.length],
      }));
  }, [transactions]);

  const maxCategoryAmount = Math.max(
    1,
    ...expenseCategories.map((item) => item.amount)
  );

  const filteredTransactions = useMemo(() => {
    return [...transactions]
      .filter((item) => {
        const query = search.toLowerCase();

        const matchesSearch =
          item.title.toLowerCase().includes(query) ||
          item.client.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query);

        const matchesType = typeFilter === "All" || item.type === typeFilter;

        const matchesStatus =
          statusFilter === "All" || item.status === statusFilter;

        return matchesSearch && matchesType && matchesStatus;
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [transactions, search, typeFilter, statusFilter]);

  const openCreateModal = () => {
    setEditingTransaction(null);
    setModalOpen(true);
  };

  const openEditModal = (transaction) => {
    setEditingTransaction(transaction);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingTransaction(null);
  };

  const saveTransaction = (transaction) => {
    if (editingTransaction) {
      setTransactions((previous) =>
        previous.map((item) =>
          String(item.id) === String(editingTransaction.id)
            ? { ...transaction, id: editingTransaction.id }
            : item
        )
      );
    } else {
      setTransactions((previous) => [
        { ...transaction, id: `txn-${Date.now()}` },
        ...previous,
      ]);
    }

    closeModal();
  };

  const deleteTransaction = (id) => {
    const transaction = transactions.find(
      (item) => String(item.id) === String(id)
    );

    if (transaction) {
      setDeletingTransaction(transaction);
    }
  };

  const confirmDeleteTransaction = () => {
    if (!deletingTransaction) return;

    setTransactions((previous) =>
      previous.filter(
        (item) => String(item.id) !== String(deletingTransaction.id)
      )
    );

    setDeletingTransaction(null);
  };

  const saveBudget = (event) => {
    event.preventDefault();

    const value = Number(budgetDraft);

    if (!Number.isFinite(value) || value < 0) return;

    setMonthlyBudget(value);
    setBudgetEditing(false);
  };

  const exportCSV = () => {
    const headers = [
      "Transaction",
      "Client",
      "Category",
      "Type",
      "Amount",
      "Date",
      "Status",
      "Payment Method",
      "Notes",
    ];

    const rows = filteredTransactions.map((item) => [
      item.title,
      item.client,
      item.category,
      item.type,
      item.amount,
      item.date,
      item.status,
      item.method,
      item.notes,
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "nexora-finance-transactions.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  if (!loaded) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[450px] items-center justify-center bg-slate-50 dark:bg-slate-950">
          <div className="h-9 w-9 animate-spin rounded-full border-4 border-[#635BFF] border-t-transparent" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="w-full min-w-0 space-y-7">
        {/* Header */}

        <section className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-[2px] text-[#635BFF]">
                FINANCIAL MANAGEMENT
              </span>

              <span className="h-1 w-1 rounded-full bg-gray-300" />

              <span className="text-[10px] text-gray-400">
                Workspace / Finance
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-3xl">
              Finance overview
            </h1>

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Monitor your revenue, manage expenses and stay in control of your
              business finances.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={exportCSV}
              className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs font-medium text-gray-600 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <Download size={15} />
              Export
            </button>

            <button
              type="button"
              onClick={openCreateModal}
              className="flex items-center gap-2 rounded-xl bg-[#635BFF] px-4 py-2.5 text-xs font-semibold text-white shadow-sm shadow-violet-500/20 transition hover:bg-[#5148e5]"
            >
              <Plus size={16} />
              Add Transaction
            </button>
          </div>
        </section>

        {/* Financial Overview */}

        <section className={`${cardClass} relative overflow-hidden`}>
          <div className="grid lg:grid-cols-[1fr_340px]">
            <div className="relative overflow-hidden p-6 sm:p-8">
              <div className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full border-[35px] border-[#635BFF]/10 dark:border-[#635BFF]/10" />

              <div className="relative">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#635BFF]/15 bg-[#635BFF]/5 px-3 py-1.5 text-xs font-semibold text-[#635BFF] dark:border-[#635BFF]/20 dark:bg-[#635BFF]/10 dark:text-[#635BFF]">
                  <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-white/20">
                    <img src="/nexora2.webp" className="w-4" alt="Nexora" />
                  </div>
                  <span className="text-[10px] mt-0.5 font-bold uppercase tracking-[1.5px] text-[#635BFF]">
                    Financial Overview
                  </span>
                  <span className="ml-1 h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_8px_rgba(110,231,183,0.9)]" />
                </div>

                <h2 className="mt-5 max-w-xl text-2xl font-bold leading-tight text-slate-900 dark:text-white sm:text-3xl">
                  Make every financial decision count.
                </h2>

                <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Track your cash flow, understand your performance and keep
                  your business finances organized in one place.
                </p>

                <div className="mt-7 flex flex-wrap gap-8">
                  <div>
                    <p className="text-[11px] font-medium text-slate-400">
                      Total Transactions
                    </p>
                    <p className="mt-1 text-xl font-bold tabular-nums text-slate-900 dark:text-white">
                      {transactions.length.toLocaleString("en-US")}
                    </p>
                  </div>

                  <div className="h-10 w-px bg-slate-200 dark:bg-slate-700" />

                  <div>
                    <p className="text-[11px] font-medium text-slate-400">
                      Collection Rate
                    </p>
                    <p className="mt-1 text-xl font-bold tabular-nums text-slate-900 dark:text-white">
                      {collectionRate}%
                    </p>
                  </div>

                  <div className="h-10 w-px bg-slate-200 dark:bg-slate-700" />

                  <div>
                    <p className="text-[11px] font-medium text-slate-400">
                      Pending Payments
                    </p>
                    <p className="mt-1 text-xl font-bold tabular-nums text-slate-900 dark:text-white">
                      {pendingCount}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Net Profit */}

            <div className="relative overflow-hidden bg-gradient-to-br from-[#29245f] via-[#4337a8] to-[#635BFF] p-6 text-white sm:p-8">
              <div className="pointer-events-none absolute -bottom-20 -right-10 h-56 w-56 rounded-full border-[30px] border-white/10" />

              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
                    <Wallet size={22} />
                  </div>

                  <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-semibold text-white/80">
                    OVERALL PERFORMANCE
                  </span>
                </div>

                <p className="mt-7 text-xs font-medium text-white/80">
                  Net Profit
                </p>

                <h3 className="mt-2 break-all text-3xl font-bold tracking-tight tabular-nums sm:text-4xl">
                  {formatCurrency(animatedNetProfit)}
                </h3>

                <div className="mt-7 space-y-4 border-t border-white/15 pt-5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2 text-white/80">
                      <span className="h-2 w-2 rounded-full bg-emerald-300" />
                      Revenue
                    </span>
                    <span className="font-semibold">
                      {formatCurrency(stats.income)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2 text-white/80">
                      <span className="h-2 w-2 rounded-full bg-amber-300" />
                      Expenses
                    </span>
                    <span className="font-semibold">
                      {formatCurrency(stats.expense)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Revenue"
            value={formatCurrency(stats.income)}
            subtitle="Successfully received payments"
            icon={TrendingUp}
            color="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
            featured
          />

          <StatCard
            title="Total Expenses"
            value={formatCurrency(stats.expense)}
            subtitle="Successfully paid expenses"
            icon={ArrowUpRight}
            color="bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400"
          />

          <StatCard
            title="Net Profit"
            value={formatCurrency(stats.profit)}
            subtitle="Revenue minus expenses"
            icon={CircleDollarSign}
            color="bg-[#635BFF]/10 text-[#635BFF] dark:bg-[#635BFF]/10 dark:text-[#635BFF]"
            negative={stats.profit < 0}
          />

          <StatCard
            title="Outstanding Payments"
            value={formatCurrency(stats.outstanding)}
            subtitle="Awaiting client payments"
            icon={Clock3}
            color="bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
          />
        </section>

        {/* Analytics */}

        <section className="grid gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(300px,0.8fr)]">
          <div className={`${cardClass} p-5 sm:p-6`}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#635BFF]/10 text-[#635BFF] dark:bg-[#635BFF]/10 dark:text-[#635BFF]">
                    <Activity size={18} />
                  </div>

                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    Revenue & Expenses
                  </h2>
                </div>

                <p className="mt-2 text-xs text-slate-400">
                  Monthly financial performance
                </p>
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-400">
                <CalendarDays size={14} />
                Last 6 months
              </div>
            </div>

            <div className="mt-7">
              <MonthlyChart data={monthlyData} />
            </div>

            <div className="mt-5 grid grid-cols-2 gap-4 border-t border-slate-100 pt-5 dark:border-slate-800">
              <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60">
                <p className="text-[10px] font-medium text-slate-400">
                  Total Revenue
                </p>
                <p className="mt-2 text-lg font-bold text-slate-900 dark:text-white">
                  {formatCurrency(stats.income)}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60">
                <p className="text-[10px] font-medium text-slate-400">
                  Total Expenses
                </p>
                <p className="mt-2 text-lg font-bold text-slate-900 dark:text-white">
                  {formatCurrency(stats.expense)}
                </p>
              </div>
            </div>
          </div>

          {/* Monthly Budget */}

          <div className={`${cardClass} relative overflow-hidden p-5 sm:p-6`}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#635BFF]/10 text-[#635BFF] dark:bg-[#635BFF]/10 dark:text-[#635BFF]">
                    <Target size={18} />
                  </div>

                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    Monthly Budget
                  </h2>
                </div>

                <p className="mt-2 text-xs text-slate-400">
                  Track your spending limit
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setBudgetDraft(String(monthlyBudget));
                  setBudgetEditing((value) => !value);
                }}
                className="rounded-xl border border-slate-200 p-2.5 text-slate-400 transition hover:border-[#635BFF]/20 hover:bg-[#635BFF]/10 hover:text-[#635BFF] dark:border-slate-700 dark:hover:border-[#635BFF]/30 dark:hover:bg-[#635BFF]/10 dark:hover:text-[#635BFF]"
                aria-label="Edit monthly budget"
              >
                <Pencil size={15} />
              </button>
            </div>

            {budgetEditing ? (
              <form onSubmit={saveBudget} className="mt-7">
                <label className="mb-2 block text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Monthly budget (USD)
                </label>

                <input
                  autoFocus
                  type="number"
                  min="0"
                  step="0.01"
                  value={budgetDraft}
                  onChange={(e) => setBudgetDraft(e.target.value)}
                  className={inputClass}
                />

                <div className="mt-3 flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 rounded-xl bg-[#635BFF] py-3 text-xs font-semibold text-white transition hover:bg-[#5148e5]"
                  >
                    Save Budget
                  </button>

                  <button
                    type="button"
                    onClick={() => setBudgetEditing(false)}
                    className="rounded-xl border border-slate-200 px-4 py-3 text-xs font-semibold text-slate-500 transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="mt-8">
                  <p className="text-xs text-slate-400">
                    Monthly spending limit
                  </p>

                  <h3 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                    {formatCurrency(monthlyBudget)}
                  </h3>
                </div>

                <div className="mt-8">
                  <div className="mb-3 flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400">
                      Budget used
                    </span>

                    <span className="font-bold text-[#635BFF] dark:text-[#635BFF]">
                      {budgetUsage.toFixed(1)}%
                    </span>
                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        budgetUsage >= 100
                          ? "bg-rose-500"
                          : budgetUsage >= 80
                            ? "bg-amber-500"
                            : "bg-[#635BFF]"
                      }`}
                      style={{ width: `${budgetUsage}%` }}
                    />
                  </div>
                </div>

                <div className="mt-7 space-y-4 border-t border-slate-100 pt-5 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Spent this month
                    </span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {formatCurrency(currentMonthExpenses)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Budget remaining
                    </span>
                    <span
                      className={`text-sm font-bold ${
                        remainingBudget > 0
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-rose-500"
                      }`}
                    >
                      {formatCurrency(remainingBudget)}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        </section>

        {/* Transactions + Sidebar */}

        <section className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
          {/* Transactions */}

          <div className={`${cardClass} min-w-0 overflow-hidden`}>
            <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 dark:border-slate-800 sm:flex-row sm:items-center">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#635BFF]/10 text-[#635BFF] dark:bg-[#635BFF]/10 dark:text-[#635BFF]">
                    <Receipt size={18} />
                  </div>

                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    Recent Transactions
                  </h2>
                </div>

                <p className="mt-2 text-xs text-slate-400">
                  Manage all your financial activities.
                </p>
              </div>

              <button
                type="button"
                onClick={openCreateModal}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#635BFF] px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-violet-500/15 transition hover:bg-[#5148e5]"
              >
                <Plus size={15} />
                Add Transaction
              </button>
            </div>

            <div className="flex flex-col gap-3 border-b border-slate-100 p-4 dark:border-slate-800">
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative min-w-0 flex-1">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search transactions..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-xs outline-none transition focus:border-[#635BFF] focus:ring-4 focus:ring-[#635BFF]/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs text-slate-600 outline-none transition focus:border-[#635BFF] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                >
                  <option value="All">All Types</option>
                  <option value="Income">Income</option>
                  <option value="Expense">Expense</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs text-slate-600 outline-none transition focus:border-[#635BFF] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                >
                  <option value="All">All Statuses</option>
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>

              <div className="flex items-center gap-2 text-[10px] text-slate-400">
                <SlidersHorizontal size={13} />
                Showing {filteredTransactions.length} of {transactions.length}{" "}
                transactions
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/80 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:border-slate-800 dark:bg-slate-800/40">
                    <th className="px-5 py-4">Transaction</th>
                    <th className="px-4 py-4">Date</th>
                    <th className="px-4 py-4">Category</th>
                    <th className="px-4 py-4">Amount</th>
                    <th className="px-4 py-4">Status</th>
                    <th className="px-4 py-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((item) => (
                      <tr
                        key={item.id}
                        className="transition hover:bg-[#635BFF]/[0.03] dark:hover:bg-[#635BFF]/[0.03]"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                                item.type === "Income"
                                  ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                                  : "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400"
                              }`}
                            >
                              {item.type === "Income" ? (
                                <ArrowDownRight size={18} />
                              ) : (
                                <ArrowUpRight size={18} />
                              )}
                            </div>

                            <div className="min-w-0">
                              <p className="max-w-[190px] truncate text-xs font-bold text-slate-800 dark:text-slate-200">
                                {item.title}
                              </p>

                              <p className="mt-1 max-w-[190px] truncate text-[10px] text-slate-400">
                                {item.client}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-4 text-xs text-slate-500 dark:text-slate-400">
                          {formatDate(item.date)}
                        </td>

                        <td className="px-4 py-4">
                          <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                            {item.category}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <span
                            className={`whitespace-nowrap text-xs font-bold ${
                              item.type === "Income"
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "text-rose-500"
                            }`}
                          >
                            {item.type === "Income" ? "+" : "-"}
                            {formatCurrency(item.amount)}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                              item.status === "Paid"
                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                                : "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
                            }`}
                          >
                            {item.status === "Paid" ? (
                              <CheckCircle2 size={11} />
                            ) : (
                              <Clock3 size={11} />
                            )}

                            {item.status}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => openEditModal(item)}
                              aria-label="Edit transaction"
                              className="rounded-lg p-2 text-slate-400 transition hover:bg-[#635BFF]/10 hover:text-[#635BFF] dark:hover:bg-[#635BFF]/10 dark:hover:text-[#635BFF]"
                            >
                              <Pencil size={14} />
                            </button>

                            <button
                              type="button"
                              onClick={() => deleteTransaction(item.id)}
                              aria-label="Delete transaction"
                              className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-5 py-14 text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#635BFF]/10 text-[#635BFF] dark:bg-[#635BFF]/10">
                          <FileText size={22} />
                        </div>

                        <p className="mt-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
                          No transactions found
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          Try changing your filters or add a new transaction.
                        </p>

                        <button
                          type="button"
                          onClick={() => {
                            setSearch("");
                            setTypeFilter("All");
                            setStatusFilter("All");
                          }}
                          className="mt-4 text-xs font-semibold text-[#635BFF] transition hover:text-[#5148e5]"
                        >
                          Clear filters
                        </button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-slate-100 px-5 py-4 dark:border-slate-800">
              <p className="text-[10px] text-slate-400">
                Nexora Finance · Transaction Management
              </p>

              <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                {filteredTransactions.length} records
              </p>
            </div>
          </div>

          {/* Sidebar */}

          <aside className="space-y-5">
            {/* Expense Breakdown */}

            <div className={`${cardClass} p-5`}>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Expense Breakdown
                  </h3>

                  <p className="mt-1 text-[10px] text-slate-400">
                    Expenses by category
                  </p>
                </div>

                <div className="rounded-xl bg-[#635BFF]/10 p-2.5 text-[#635BFF] dark:bg-[#635BFF]/10 dark:text-[#635BFF]">
                  <ArrowLeftRight size={17} />
                </div>
              </div>

              <div className="mt-6 space-y-5">
                {expenseCategories.length > 0 ? (
                  expenseCategories.map((item) => (
                    <div key={item.category}>
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                          {item.category}
                        </span>

                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          {formatCurrency(item.amount)}
                        </span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${item.color}`}
                          style={{
                            width: `${(item.amount / maxCategoryAmount) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="py-6 text-center text-xs text-slate-400">
                    No expense data available.
                  </p>
                )}
              </div>
            </div>

            {/* Outstanding Payments */}

            <div className={`${cardClass} overflow-hidden`}>
              <div className="h-1 bg-amber-400" />

              <div className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Outstanding Payments
                    </h3>

                    <p className="mt-1 text-[10px] text-slate-400">
                      Payments awaiting collection
                    </p>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
                    <Clock3 size={18} />
                  </div>
                </div>

                <h2 className="mt-6 text-2xl font-bold tabular-nums text-slate-900 dark:text-white">
                  {formatCurrency(stats.outstanding)}
                </h2>

                <p className="mt-2 text-[10px] leading-5 text-slate-400">
                  Total amount of income transactions that are currently
                  pending.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setTypeFilter("Income");
                    setStatusFilter("Pending");
                    setSearch("");
                  }}
                  className="mt-5 flex items-center gap-2 text-xs font-bold text-[#635BFF] transition hover:gap-3 dark:text-[#635BFF]"
                >
                  View pending payments
                  <ArrowUpRight size={14} />
                </button>
              </div>
            </div>

            {/* Financial Insight */}

            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#635BFF] to-[#5148e5] p-5 text-white shadow-lg shadow-violet-500/10">
              <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full border border-white/10" />
              <div className="pointer-events-none absolute -bottom-12 -left-10 h-32 w-32 rounded-full bg-white/5 blur-2xl" />

              <div className="relative">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
                  <Activity size={19} />
                </div>

                <h3 className="mt-4 text-sm font-bold">Financial Insight</h3>

                <p className="mt-2 text-[11px] leading-6 text-white/75">
                  {stats.profit >= 0
                    ? "Your recorded revenue is currently higher than your paid expenses. Keep monitoring your cash flow and outstanding payments."
                    : "Your recorded expenses are currently higher than your received revenue. Review your spending and pending collections."}
                </p>

                <div className="mt-5 flex items-center justify-between border-t border-white/15 pt-4">
                  <span className="text-[10px] text-white/60">
                    Current net profit
                  </span>

                  <span className="text-sm font-bold tabular-nums">
                    {formatCurrency(stats.profit)}
                  </span>
                </div>
              </div>
            </div>
          </aside>
        </section>

        {/* Footer */}

        <footer className="flex flex-col items-center justify-between gap-2 border-t border-slate-200/70 pt-5 text-xs text-slate-400 sm:flex-row dark:border-slate-800">
          <p>Nexora Workspace · Finance Management</p>
          <p>Financial data is stored locally in your browser.</p>
        </footer>

        {/* Transaction Modal */}

        {modalOpen && (
          <TransactionModal
            transaction={editingTransaction}
            today={formatInputDate(todayTimestamp)}
            onClose={closeModal}
            onSave={saveTransaction}
          />
        )}

        {/* Delete Transaction Modal */}

        {deletingTransaction && (
          <DeleteTransactionModal
            transaction={deletingTransaction}
            onClose={() => setDeletingTransaction(null)}
            onConfirm={confirmDeleteTransaction}
          />
        )}
      </div>
    </DashboardLayout>
  );
}