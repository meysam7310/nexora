"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useCustomers } from "@/hooks/useCustomers";
import { formatCurrency } from "@/data/customers";

import {
  Users,
  UserCheck,
  Clock3,
  TrendingUp,
  Search,
  Plus,
  Download,
  Mail,
  Building2,
  CalendarDays,
  X,
  Phone,
  MapPin,
  Pencil,
  Trash2,
  CircleDollarSign,
  Star,
  Activity,
  ChevronRight,
  Filter,
  LayoutGrid,
  List,
} from "lucide-react";

// Constants

const statusStyles = {
  Active:
    "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
  Pending:
    "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
  Inactive:
    "bg-gray-100 text-gray-500 dark:bg-gray-700/60 dark:text-gray-400",
};

const avatarColors = [
  "bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400",
  "bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",
  "bg-pink-100 text-pink-600 dark:bg-pink-500/15 dark:text-pink-400",
  "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
];

const progressMap = {
  1: 78,
  2: 92,
  3: 45,
  4: 100,
  5: 32,
  6: 85,
  7: 56,
  8: 68,
};

const emptyCustomer = {
  name: "",
  email: "",
  company: "",
  phone: "",
  location: "",
  spent: "0",
  status: "Active",
  notes: "",
};

const inputClass =
  "h-10 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#635BFF] focus:bg-white dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-[#635BFF] dark:focus:bg-gray-800";

const labelClass =
  "mb-1.5 block text-xs font-medium text-gray-600 dark:text-gray-300";

const filters = ["All", "Active", "Pending", "Inactive"];

// Helpers

const getProgress = (id) => progressMap[id] ?? 0;

const getProgressColor = (progress) => {
  if (progress >= 80) return "bg-emerald-500";
  if (progress >= 50) return "bg-violet-500";
  return "bg-amber-500";
};

// Main Component

export default function CustomersPage() {
  const router = useRouter();
  const { customers, setCustomers } = useCustomers();

  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ ...emptyCustomer });
  const [editingCustomerId, setEditingCustomerId] = useState(null);

  const [viewMode, setViewMode] = useState("grid");
  const [customerToDelete, setCustomerToDelete] = useState(null);

  const isEditing = editingCustomerId !== null;

  // Customer Statistics

  const activeCount = customers.filter(
    (customer) => customer.status === "Active"
  ).length;

  const pendingCount = customers.filter(
    (customer) => customer.status === "Pending"
  ).length;

  const inactiveCount = customers.filter(
    (customer) => customer.status === "Inactive"
  ).length;

  const totalSpent = customers.reduce(
    (total, customer) => total + Number(customer.spent || 0),
    0
  );

  const averageSpent =
    customers.length > 0 ? totalSpent / customers.length : 0;

  const activePercentage =
    customers.length > 0
      ? Math.round((activeCount / customers.length) * 100)
      : 0;

  const topCustomers = useMemo(() => {
    return [...customers]
      .sort((a, b) => Number(b.spent || 0) - Number(a.spent || 0))
      .slice(0, 4);
  }, [customers]);

  const maxSpent = Math.max(
    1,
    ...customers.map((customer) => Number(customer.spent || 0))
  );

  // Search & Filters

  const filteredCustomers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return customers.filter((customer) => {
      const matchesSearch =
        customer.name.toLowerCase().includes(query) ||
        customer.email.toLowerCase().includes(query) ||
        customer.company.toLowerCase().includes(query);

      const matchesFilter =
        activeFilter === "All" || customer.status === activeFilter;

      return matchesSearch && matchesFilter;
    });
  }, [customers, search, activeFilter]);

  // Customer Actions

  const openCustomerProfile = (id) => {
    router.push(`/customers/${id}`);
  };

  const openAddModal = () => {
    setEditingCustomerId(null);
    setFormData({ ...emptyCustomer });
    setIsModalOpen(true);
  };

  const openEditModal = (customer) => {
    setEditingCustomerId(customer.id);

    setFormData({
      name: customer.name,
      email: customer.email,
      company: customer.company,
      phone: customer.phone ?? "",
      location: customer.location ?? "",
      spent: String(customer.spent ?? 0),
      status: customer.status,
      notes: customer.notes ?? "",
    });

    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCustomerId(null);
    setFormData({ ...emptyCustomer });
  };

  const updateField = (field, value) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSaveCustomer = (event) => {
    event.preventDefault();

    const name = formData.name.trim();
    const email = formData.email.trim();
    const company = formData.company.trim();

    if (!name || !email || !company) return;

    const existingCustomer = customers.find(
      (customer) => customer.id === editingCustomerId
    );

    const initials = name
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    const savedCustomer = {
      id: editingCustomerId ?? Date.now(),
      name,
      email,
      company,
      phone: formData.phone.trim(),
      location: formData.location.trim(),
      spent: Math.max(0, Number(formData.spent) || 0),
      status: formData.status,
      notes: formData.notes.trim(),
      initials,
      color:
        existingCustomer?.color ??
        avatarColors[customers.length % avatarColors.length],
      joined:
        existingCustomer?.joined ??
        new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        }),
    };

    if (isEditing) {
      setCustomers((current) =>
        current.map((customer) =>
          customer.id === editingCustomerId ? savedCustomer : customer
        )
      );
    } else {
      setCustomers((current) => [savedCustomer, ...current]);
    }

    closeModal();
  };

  const handleDeleteCustomer = () => {
    if (!customerToDelete) return;

    setCustomers((current) =>
      current.filter((customer) => customer.id !== customerToDelete.id)
    );

    setCustomerToDelete(null);
  };

  // Export CSV

  const exportCustomers = () => {
    const headers = [
      "Name",
      "Email",
      "Company",
      "Phone",
      "Location",
      "Status",
      "Joined",
      "Total Spent",
      "Notes",
    ];

    const rows = filteredCustomers.map((customer) => [
      customer.name,
      customer.email,
      customer.company,
      customer.phone ?? "",
      customer.location ?? "",
      customer.status,
      customer.joined,
      customer.spent,
      customer.notes ?? "",
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "nexora-customers.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  // Render

  return (
    <DashboardLayout>
      <div className="w-full min-w-0 space-y-6">
        {/* Header */}

        <section className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-[2px] text-[#635BFF]">
                RELATIONSHIP MANAGEMENT
              </span>

              <span className="h-1 w-1 rounded-full bg-gray-300" />

              <span className="text-[10px] text-gray-400">
                Workspace / Customers
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-3xl">
              Customer relationships
            </h1>

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Get to know your clients, understand their value and grow
              stronger relationships.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={exportCustomers}
              className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs font-medium text-gray-600 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <Download size={15} />
              Export
            </button>

            <button
              type="button"
              onClick={openAddModal}
              className="flex items-center gap-2 rounded-xl bg-[#635BFF] px-4 py-2.5 text-xs font-semibold text-white shadow-sm shadow-violet-500/20 transition hover:bg-[#5148e5]"
            >
              <Plus size={16} />
              Add Customer
            </button>
          </div>
        </section>

        {/* Customer Overview */}

        <section className="grid grid-cols-1 gap-4 lg:grid-cols-[1.4fr_1fr]">
          {/* Relationship Overview */}

          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#29245f] via-[#4337a8] to-[#635BFF] p-5 text-white sm:p-6">
            <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full border border-white/[0.08]" />
            <div className="pointer-events-none absolute -right-6 -top-14 h-48 w-48 rounded-full border border-white/[0.08]" />
            <div className="pointer-events-none absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-indigo-400/25 blur-3xl" />
            <div className="pointer-events-none absolute -left-16 -top-10 h-40 w-40 rounded-full bg-white/5 blur-2xl" />

            <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
              <div className="max-w-sm">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 backdrop-blur-md mb-5">
                  <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-white/20">
                    <img src="/nexora.webp" className="w-4" alt="Nexora" />
                  </div>
                  <span className="text-[10px] mt-0.5 font-bold uppercase tracking-[1.5px] text-white">
                    CLIENT OVERVIEW
                  </span>
                  <span className="ml-1 h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_8px_rgba(110,231,183,0.9)]" />
                </div>

                <h2 className="mt-4 text-xl font-bold leading-snug sm:text-2xl">
                  Your customer base
                  <br />
                  <span className="bg-gradient-to-r from-white to-violet-200 bg-clip-text text-transparent">
                    is growing with purpose.
                  </span>
                </h2>

                <p className="mt-3 max-w-xs text-xs leading-5 text-white/75">
                  Keep track of customer activity, spending and relationship
                  health from one central place.
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2 backdrop-blur-md">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400/20 text-emerald-300">
                      <TrendingUp size={13} />
                    </span>
                    <div className="leading-tight">
                      <p className="text-[10px] text-white/70">Active rate</p>
                      <p className="text-xs font-bold text-white">
                        {activePercentage}%
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2 backdrop-blur-md">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15 text-white">
                      <Users size={13} />
                    </span>
                    <div className="leading-tight">
                      <p className="text-[10px] text-white/70">Total clients</p>
                      <p className="text-xs font-bold text-white">
                        {customers.length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative flex shrink-0 items-center gap-4 rounded-2xl border border-white/20 bg-white/[0.12] p-4 shadow-xl shadow-indigo-950/20 backdrop-blur-xl">
                <div className="relative flex h-20 w-20 items-center justify-center">
                  <svg
                    className="absolute inset-0 -rotate-90"
                    viewBox="0 0 80 80"
                  >
                    <circle
                      cx="40"
                      cy="40"
                      r="34"
                      fill="none"
                      stroke="rgba(255,255,255,0.15)"
                      strokeWidth="6"
                    />
                    <circle
                      cx="40"
                      cy="40"
                      r="34"
                      fill="none"
                      stroke="url(#activeGradient)"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={`${(activePercentage / 100) * 213.6} 213.6`}
                      className="transition-all duration-700"
                    />
                    <defs>
                      <linearGradient
                        id="activeGradient"
                        x1="0"
                        y1="0"
                        x2="1"
                        y2="1"
                      >
                        <stop offset="0%" stopColor="#6EE7B7" />
                        <stop offset="100%" stopColor="#34D399" />
                      </linearGradient>
                    </defs>
                  </svg>

                  <div className="text-center">
                    <p className="text-2xl font-bold tabular-nums text-white">
                      {customers.length}
                    </p>
                    <p className="text-[9px] text-white/60">Clients</p>
                  </div>
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] text-white/60">Customer value</p>

                  <p className="mt-1 truncate text-lg font-bold text-white">
                    {formatCurrency(totalSpent)}
                  </p>

                  <div className="mt-2 flex items-center gap-1.5 rounded-lg bg-emerald-400/15 px-2 py-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                    <p className="text-[10px] font-semibold text-emerald-200">
                      {activeCount} active
                    </p>
                  </div>

                  <p className="mt-1.5 text-[9px] text-white/50">
                    Total recorded spending
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Average Customer Value */}

          <div className="flex flex-col justify-between rounded-2xl border border-gray-200/80 bg-white p-5 dark:border-gray-800 dark:bg-[#111827] sm:p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Average customer value
                </p>

                <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                  {formatCurrency(averageSpent)}
                </h2>

                <p className="mt-1 text-[10px] text-gray-400">
                  Average recorded spending per customer
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                <CircleDollarSign size={21} />
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-800">
              <div>
                <p className="text-[10px] text-gray-400">Active customers</p>

                <p className="mt-1 text-sm font-bold text-gray-900 dark:text-gray-100">
                  {activeCount}
                  <span className="ml-1 text-[10px] font-normal text-gray-400">
                    / {customers.length} total
                  </span>
                </p>
              </div>

              <div className="text-right">
                <p className="text-[10px] text-gray-400">Engagement</p>

                <p className="mt-1 text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  {activePercentage}%
                </p>
              </div>
            </div>

            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                style={{ width: `${activePercentage}%` }}
              />
            </div>
          </div>
        </section>

        {/* Statistics */}

        <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          <div className="rounded-2xl border border-gray-200/80 bg-white p-4 dark:border-gray-800 dark:bg-[#111827]">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400">
                Total Customers
              </span>

              <Users size={17} className="text-violet-500" />
            </div>

            <h3 className="mt-3 text-2xl font-bold text-gray-900 dark:text-gray-100">
              {customers.length}
            </h3>

            <p className="mt-1 text-[10px] text-gray-400">
              All registered clients
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200/80 bg-white p-4 dark:border-gray-800 dark:bg-[#111827]">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400">
                Active
              </span>

              <UserCheck size={17} className="text-emerald-500" />
            </div>

            <h3 className="mt-3 text-2xl font-bold text-gray-900 dark:text-gray-100">
              {activeCount}
            </h3>

            <p className="mt-1 text-[10px] text-gray-400">
              Currently active customers
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200/80 bg-white p-4 dark:border-gray-800 dark:bg-[#111827]">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400">
                Pending
              </span>

              <Clock3 size={17} className="text-amber-500" />
            </div>

            <h3 className="mt-3 text-2xl font-bold text-gray-900 dark:text-gray-100">
              {pendingCount}
            </h3>

            <p className="mt-1 text-[10px] text-gray-400">
              Awaiting activation
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200/80 bg-white p-4 dark:border-gray-800 dark:bg-[#111827]">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400">
                Total Revenue
              </span>

              <TrendingUp size={17} className="text-blue-500" />
            </div>

            <h3 className="mt-3 text-xl font-bold text-gray-900 dark:text-gray-100">
              {formatCurrency(totalSpent)}
            </h3>

            <p className="mt-1 text-[10px] text-gray-400">
              Total customer spending
            </p>
          </div>
        </section>

        {/* Directory + Insights */}

        <section className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_290px]">
          {/* Customer Directory */}

          <div className="min-w-0 space-y-4">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">
                    Customer directory
                  </h2>

                  <span className="rounded-full bg-violet-50 px-2 py-0.5 text-[10px] font-semibold text-violet-600 dark:bg-violet-500/10 dark:text-violet-400">
                    {filteredCustomers.length}
                  </span>
                </div>

                <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                  Your people, their activity and account details.
                </p>
              </div>

              <div className="flex items-center self-start rounded-xl border border-gray-200 bg-white p-1 dark:border-gray-700 dark:bg-gray-800 sm:self-auto">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  aria-label="Grid view"
                  title="Grid view"
                  className={`rounded-lg p-2 transition ${
                    viewMode === "grid"
                      ? "bg-violet-50 text-[#635BFF] shadow-sm dark:bg-violet-500/15 dark:text-violet-300"
                      : "text-gray-400 hover:bg-gray-50 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                  }`}
                >
                  <LayoutGrid size={16} />
                </button>

                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  aria-label="List view"
                  title="List view"
                  className={`rounded-lg p-2 transition ${
                    viewMode === "list"
                      ? "bg-violet-50 text-[#635BFF] shadow-sm dark:bg-violet-500/15 dark:text-violet-300"
                      : "text-gray-400 hover:bg-gray-50 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                  }`}
                >
                  <List size={16} />
                </button>
              </div>
            </div>

            {/* Search & Filters */}

            <div className="rounded-2xl border border-gray-200/80 bg-white p-3 dark:border-gray-800 dark:bg-[#111827]">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                <div className="relative flex-1">
                  <Search
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search name, email or company..."
                    className="h-10 w-full rounded-xl border border-gray-200 bg-gray-50 pl-9 pr-3 text-xs text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-[#635BFF] focus:bg-white dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:bg-gray-800"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="mr-1 flex items-center gap-1 text-[10px] text-gray-400">
                    <Filter size={12} />
                    Filter
                  </span>

                  {filters.map((filter) => (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => setActiveFilter(filter)}
                      className={`rounded-lg px-3 py-2 text-[10px] font-medium transition ${
                        activeFilter === filter
                          ? "bg-[#635BFF] text-white shadow-sm"
                          : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Customer Cards */}

            {filteredCustomers.length > 0 ? (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 gap-3 2xl:grid-cols-2"
                    : "flex flex-col gap-3"
                }
              >
                {filteredCustomers.map((customer, index) => {
                  const progress = getProgress(customer.id);
                  const avatarColor =
                    customer.color ||
                    avatarColors[index % avatarColors.length];

                  return (
                    <article
                      key={customer.id}
                      className={`group relative rounded-2xl border border-gray-200/80 bg-white transition duration-200 hover:border-violet-200 hover:shadow-lg hover:shadow-violet-900/[0.04] dark:border-gray-800 dark:bg-[#111827] dark:hover:border-violet-500/30 ${
                        viewMode === "grid"
                          ? "p-4 hover:-translate-y-0.5 sm:p-5"
                          : "flex flex-col gap-4 p-4 lg:flex-row lg:items-center lg:gap-5"
                      }`}
                    >
                      {/* Card Header */}

                      <div
                        className={`flex items-start justify-between gap-3 ${
                          viewMode === "list"
                            ? "lg:w-[240px] lg:shrink-0"
                            : ""
                        }`}
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <button
                            type="button"
                            onClick={() => openCustomerProfile(customer.id)}
                            aria-label={`View ${customer.name} profile`}
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-xs font-bold transition group-hover:rounded-xl ${avatarColor}`}
                          >
                            {customer.initials}
                          </button>

                          <div className="min-w-0">
                            <button
                              type="button"
                              onClick={() => openCustomerProfile(customer.id)}
                              className="block max-w-full truncate text-left text-sm font-bold text-gray-900 transition hover:text-[#635BFF] dark:text-gray-100 dark:hover:text-violet-400"
                            >
                              {customer.name}
                            </button>

                            <p className="mt-1 flex items-center gap-1.5 truncate text-[10px] text-gray-400 dark:text-gray-500">
                              <Building2 size={11} />
                              {customer.company}
                            </p>
                          </div>
                        </div>

                        {/* Status + Direct Actions */}

                        <div className="flex shrink-0 items-center gap-1.5">
                          <span
                            className={`hidden rounded-full px-2.5 py-1 text-[9px] font-semibold sm:inline-flex ${
                              statusStyles[customer.status] ||
                              statusStyles.Inactive
                            }`}
                          >
                            {customer.status}
                          </span>

                          <button
                            type="button"
                            aria-label={`Edit ${customer.name}`}
                            title="Edit customer"
                            onClick={() => openEditModal(customer)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-600 dark:border-gray-700 dark:text-gray-400 dark:hover:border-violet-500/30 dark:hover:bg-violet-500/10 dark:hover:text-violet-400"
                          >
                            <Pencil size={14} />
                          </button>

                          <button
                            type="button"
                            aria-label={`Delete ${customer.name}`}
                            title="Delete customer"
                            onClick={() => setCustomerToDelete(customer)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 dark:border-gray-700 dark:text-gray-400 dark:hover:border-rose-500/30 dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Mobile Status */}

                      <div className="mt-3 sm:hidden">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-[9px] font-semibold ${
                            statusStyles[customer.status] ||
                            statusStyles.Inactive
                          }`}
                        >
                          {customer.status}
                        </span>
                      </div>

                      {/* Contact Details */}

                      <div
                        className={`mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 ${
                          viewMode === "list"
                            ? "lg:mt-0 lg:min-w-0 lg:flex-1"
                            : ""
                        }`}
                      >
                        <div className="flex min-w-0 items-center gap-2 text-[10px] text-gray-500 dark:text-gray-400">
                          <Mail size={12} className="shrink-0 text-gray-400" />
                          <span className="truncate">{customer.email}</span>
                        </div>

                        <div className="flex min-w-0 items-center gap-2 text-[10px] text-gray-500 dark:text-gray-400">
                          <Phone size={12} className="shrink-0 text-gray-400" />
                          <span className="truncate">
                            {customer.phone || "No phone added"}
                          </span>
                        </div>

                        <div className="flex min-w-0 items-center gap-2 text-[10px] text-gray-500 dark:text-gray-400 sm:col-span-2">
                          <MapPin size={12} className="shrink-0 text-gray-400" />
                          <span className="truncate">
                            {customer.location || "Location not specified"}
                          </span>
                        </div>
                      </div>

                      {/* Customer Value */}

                      <div
                        className={`mt-4 rounded-xl bg-gray-50 p-3 dark:bg-gray-800/60 ${
                          viewMode === "list"
                            ? "lg:mt-0 lg:w-[210px] lg:shrink-0"
                            : ""
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-[9px] text-gray-400 dark:text-gray-500">
                              Total customer value
                            </p>

                            <p className="mt-1 text-sm font-bold text-gray-900 dark:text-gray-100">
                              {formatCurrency(customer.spent)}
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="text-[9px] text-gray-400 dark:text-gray-500">
                              Relationship score
                            </p>

                            <p className="mt-1 text-xs font-bold text-violet-600 dark:text-violet-400">
                              {progress}%
                            </p>
                          </div>
                        </div>

                        <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${getProgressColor(
                              progress
                            )}`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Card Footer */}

                      <div
                        className={`mt-3 flex items-center justify-between gap-2 ${
                          viewMode === "list"
                            ? "lg:mt-0 lg:w-[145px] lg:shrink-0 lg:flex-col lg:items-start"
                            : ""
                        }`}
                      >
                        <span className="flex items-center gap-1.5 text-[9px] text-gray-400 dark:text-gray-500">
                          <CalendarDays size={11} />
                          Joined {customer.joined}
                        </span>

                        <button
                          type="button"
                          onClick={() => openCustomerProfile(customer.id)}
                          className="flex items-center gap-1 text-[10px] font-semibold text-violet-600 transition hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300"
                        >
                          View details
                          <ChevronRight size={12} />
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-16 text-center dark:border-gray-700 dark:bg-[#111827]">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500">
                  <Users size={24} />
                </div>

                <h3 className="mt-4 text-sm font-semibold text-gray-800 dark:text-gray-200">
                  No customers found
                </h3>

                <p className="mt-1 text-xs text-gray-400">
                  Try another search or add a new customer.
                </p>

                <button
                  type="button"
                  onClick={openAddModal}
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#635BFF] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#5148e5]"
                >
                  <Plus size={14} />
                  Add Customer
                </button>
              </div>
            )}

            {/* Directory Footer */}

            <div className="flex flex-wrap items-center justify-between gap-2 px-1 py-1">
              <p className="text-[10px] text-gray-400">
                Showing{" "}
                <span className="font-semibold text-gray-600 dark:text-gray-300">
                  {filteredCustomers.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-600 dark:text-gray-300">
                  {customers.length}
                </span>{" "}
                customers
              </p>

              <p className="flex items-center gap-1.5 text-[10px] text-gray-400">
                <Activity size={12} />
                Customer data overview
              </p>
            </div>
          </div>

          {/* Customer Insights */}

          <aside className="space-y-4">
            {/* Customer Segments */}

            <div className="rounded-2xl border border-gray-200/80 bg-white p-5 dark:border-gray-800 dark:bg-[#111827]">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                    Customer segments
                  </h3>

                  <p className="mt-1 text-[10px] text-gray-400">
                    Based on account status
                  </p>
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400">
                  <Users size={16} />
                </div>
              </div>

              <div className="mt-5 flex h-2.5 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                <div
                  className="bg-emerald-500 transition-all"
                  style={{
                    width: `${
                      customers.length
                        ? (activeCount / customers.length) * 100
                        : 0
                    }%`,
                  }}
                />

                <div
                  className="bg-amber-400 transition-all"
                  style={{
                    width: `${
                      customers.length
                        ? (pendingCount / customers.length) * 100
                        : 0
                    }%`,
                  }}
                />

                <div
                  className="bg-gray-400 transition-all"
                  style={{
                    width: `${
                      customers.length
                        ? (inactiveCount / customers.length) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>

              <div className="mt-5 space-y-4">
                {[
                  {
                    label: "Active customers",
                    count: activeCount,
                    color: "bg-emerald-500",
                  },
                  {
                    label: "Pending customers",
                    count: pendingCount,
                    color: "bg-amber-400",
                  },
                  {
                    label: "Inactive customers",
                    count: inactiveCount,
                    color: "bg-gray-400",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`h-2 w-2 rounded-full ${item.color}`} />

                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {item.label}
                      </span>
                    </div>

                    <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Customers */}

            <div className="rounded-2xl border border-gray-200/80 bg-white p-5 dark:border-gray-800 dark:bg-[#111827]">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                    Top customers
                  </h3>

                  <p className="mt-1 text-[10px] text-gray-400">
                    Ranked by total spending
                  </p>
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-500 dark:bg-amber-500/10">
                  <Star size={16} />
                </div>
              </div>

              <div className="mt-5 space-y-4">
                {topCustomers.length > 0 ? (
                  topCustomers.map((customer, index) => {
                    const percentage = Math.round(
                      (Number(customer.spent || 0) / maxSpent) * 100
                    );

                    return (
                      <div key={customer.id}>
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-[9px] font-bold ${
                              customer.color ||
                              avatarColors[index % avatarColors.length]
                            }`}
                          >
                            {customer.initials}
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-semibold text-gray-800 dark:text-gray-200">
                              {customer.name}
                            </p>

                            <p className="mt-0.5 truncate text-[9px] text-gray-400">
                              {customer.company}
                            </p>
                          </div>

                          <p className="shrink-0 text-[10px] font-bold text-gray-700 dark:text-gray-300">
                            {formatCurrency(customer.spent)}
                          </p>
                        </div>

                        <div className="mt-2 h-1 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                          <div
                            className={`h-full rounded-full ${
                              index === 0
                                ? "bg-violet-500"
                                : index === 1
                                ? "bg-blue-500"
                                : index === 2
                                ? "bg-emerald-500"
                                : "bg-amber-500"
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="py-6 text-center text-xs text-gray-400">
                    No customer data available.
                  </p>
                )}
              </div>
            </div>

            {/* Relationship Insight */}

            <div className="relative overflow-hidden rounded-2xl border border-violet-100 bg-gradient-to-br from-[#f6f3ff] to-[#f0efff] p-5 dark:border-violet-500/15 dark:from-[#201c3b] dark:to-[#191c34]">
              <div className="absolute -right-7 -top-7 h-24 w-24 rounded-full bg-violet-200/40 blur-2xl dark:bg-violet-500/10" />

              <div className="relative">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-violet-600 shadow-sm dark:bg-white/10 dark:text-violet-300">
                  <img src="/nexora2.webp" className="w-7" alt="Nexora" />
                </div>

                <h3 className="mt-4 text-sm font-bold text-gray-900 dark:text-white">
                  Relationship insights
                </h3>

                <p className="mt-2 text-[10px] leading-5 text-gray-500 dark:text-gray-400">
                  {pendingCount > 0
                    ? `You have ${pendingCount} pending customer${
                        pendingCount > 1 ? "s" : ""
                      }. Review their accounts to keep your customer base up to date.`
                    : "All your customer accounts are currently active or inactive. Keep their information up to date."}
                </p>

                <div className="mt-4 flex items-center gap-2 text-[10px] font-semibold text-violet-600 dark:text-violet-300">
                  <Activity size={13} />
                  {activePercentage}% active customer ratio
                </div>
              </div>
            </div>
          </aside>
        </section>

        {/* Add / Edit Customer Modal */}

        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="flex max-h-[90vh] w-full max-w-[520px] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-[#111827]">
              <div className="flex shrink-0 items-center justify-between border-b border-gray-100 p-5 dark:border-gray-800">
                <div>
                  <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                    {isEditing ? "Edit Customer" : "Add New Customer"}
                  </h2>

                  <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                    {isEditing
                      ? "Update customer information and account details."
                      : "Create a customer profile with detailed information."}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeModal}
                  aria-label="Close modal"
                  className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X size={17} />
                </button>
              </div>

              <form
                onSubmit={handleSaveCustomer}
                className="space-y-5 overflow-y-auto p-5"
              >
                {/* Basic Information */}

                <div>
                  <div className="mb-3 flex items-center gap-2">
                    <div className="rounded-lg bg-violet-50 p-1.5 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400">
                      <Users size={15} />
                    </div>

                    <h3 className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                      Basic Information
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className={labelClass}>
                        Full Name <span className="text-rose-500">*</span>
                      </label>

                      <input
                        required
                        value={formData.name}
                        onChange={(event) =>
                          updateField("name", event.target.value)
                        }
                        placeholder="e.g. John Smith"
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>
                        Email Address <span className="text-rose-500">*</span>
                      </label>

                      <input
                        required
                        type="email"
                        value={formData.email}
                        onChange={(event) =>
                          updateField("email", event.target.value)
                        }
                        placeholder="john@example.com"
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>
                        Company <span className="text-rose-500">*</span>
                      </label>

                      <input
                        required
                        value={formData.company}
                        onChange={(event) =>
                          updateField("company", event.target.value)
                        }
                        placeholder="Company name"
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100 dark:border-gray-800" />

                {/* Contact Details */}

                <div>
                  <div className="mb-3 flex items-center gap-2">
                    <div className="rounded-lg bg-blue-50 p-1.5 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                      <Phone size={15} />
                    </div>

                    <h3 className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                      Contact Details
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label className={labelClass}>Phone Number</label>

                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(event) =>
                          updateField("phone", event.target.value)
                        }
                        placeholder="+1 555 123 4567"
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Location</label>

                      <input
                        value={formData.location}
                        onChange={(event) =>
                          updateField("location", event.target.value)
                        }
                        placeholder="City, Country"
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100 dark:border-gray-800" />

                {/* Account Details */}

                <div>
                  <div className="mb-3 flex items-center gap-2">
                    <div className="rounded-lg bg-emerald-50 p-1.5 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                      <CircleDollarSign size={15} />
                    </div>

                    <h3 className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                      Account Details
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label className={labelClass}>
                        Total Spent (USD)
                      </label>

                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={formData.spent}
                        onChange={(event) =>
                          updateField("spent", event.target.value)
                        }
                        placeholder="0"
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Customer Status</label>

                      <select
                        value={formData.status}
                        onChange={(event) =>
                          updateField("status", event.target.value)
                        }
                        className={inputClass}
                      >
                        <option value="Active">Active</option>
                        <option value="Pending">Pending</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100 dark:border-gray-800" />

                {/* Notes */}

                <div>
                  <div className="mb-3 flex items-center gap-2">
                    <div className="rounded-lg bg-amber-50 p-1.5 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
                      <Activity size={15} />
                    </div>

                    <h3 className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                      Additional Notes
                    </h3>
                  </div>

                  <textarea
                    rows={3}
                    value={formData.notes}
                    onChange={(event) =>
                      updateField("notes", event.target.value)
                    }
                    placeholder="Add any important details about this customer..."
                    className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#635BFF] focus:bg-white dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-[#635BFF] dark:focus:bg-gray-800"
                  />
                </div>

                {/* Actions */}

                <div className="flex gap-2 border-t border-gray-100 pt-4 dark:border-gray-800">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 rounded-xl border border-gray-200 py-2.5 text-xs font-semibold text-gray-600 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#635BFF] py-2.5 text-xs font-semibold text-white transition hover:bg-[#5148e5]"
                  >
                    {isEditing ? (
                      <>
                        <Pencil size={14} />
                        Save Changes
                      </>
                    ) : (
                      <>
                        <Plus size={14} />
                        Add Customer
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Customer Confirmation Modal */}

        {customerToDelete && (
          <div
            className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                setCustomerToDelete(null);
              }
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
                      Delete customer?
                    </h3>

                    <p className="mt-1.5 text-sm leading-6 text-slate-500 dark:text-slate-400">
                      Are you sure you want to delete this customer? This
                      action cannot be undone.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setCustomerToDelete(null)}
                    className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
                    aria-label="Close"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Customer to be deleted
                  </p>

                  <p className="mt-1.5 truncate text-sm font-bold text-slate-800 dark:text-slate-200">
                    {customerToDelete.name}
                  </p>

                  <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">
                    {customerToDelete.company}
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 bg-slate-50/80 px-6 py-4 dark:border-slate-800 dark:bg-slate-800/30">
                <button
                  type="button"
                  onClick={() => setCustomerToDelete(null)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleDeleteCustomer}
                  className="flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm shadow-rose-500/20 transition hover:bg-rose-700"
                >
                  <Trash2 size={15} />
                  Delete customer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}