
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import {
  Search,
  ChevronDown,
  CalendarDays,
  Menu,
  X,
  FolderKanban,
  Users,
  Clock3,
  Sun,
  Moon,
  Check,
} from "lucide-react";

import { projects, activities } from "@/data/dashboard";
import ProfileDropdown from "./ProfileDropdown";
import Notifications from "./Notifications";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useCustomers } from "@/hooks/useCustomers";

type DateRange =
  | "7d"
  | "30d"
  | "90d"
  | "12m";

interface HeaderProps {
  onMenuClick: () => void;
  onDateRangeChange?: (range: DateRange) => void;
}


type SearchCategory = "Project" | "Customer" | "Activity";

type SearchResult = {
  id: string | number;
  title: string;
  subtitle: string;
  category: SearchCategory;
  href: string;
};

type SearchableProject = {
  id: string | number;
  name: string;
  client?: string;
  category?: string;
  status?: string;
};

type SearchableCustomer = {
  id: string | number;
  name: string;
  email?: string;
  company?: string;
  phone?: string;
  location?: string;
};

const searchableText = (...values: unknown[]) =>
  values.map((value) => String(value ?? "")).join(" ").toLowerCase();

function resolveActivityHref(
  activity: (typeof activities)[number],
  projectList: SearchableProject[],
  customerList: SearchableCustomer[]
): string {
  const record = activity as unknown as Record<string, unknown>;
  const activityText = searchableText(
    record.user,
    record.action,
    record.target,
    record.type,
    record.category,
    record.entityType
  );

  const explicitProjectId =
    record.projectId ?? record.project_id ??
    (String(record.entityType ?? record.type ?? "").toLowerCase().includes("project")
      ? record.entityId ?? record.entity_id
      : undefined);

  const explicitCustomerId =
    record.customerId ?? record.customer_id ??
    (String(record.entityType ?? record.type ?? "").toLowerCase().includes("customer")
      ? record.entityId ?? record.entity_id
      : undefined);

  const matchingProject = projectList.find((project) => {
    const projectName = String(project.name ?? "").toLowerCase();
    return (
      (explicitProjectId != null &&
        String(project.id) === String(explicitProjectId)) ||
      (projectName.length > 2 && activityText.includes(projectName))
    );
  });

  if (matchingProject) {
    return `/projects/${encodeURIComponent(String(matchingProject.id))}`;
  }

  const matchingCustomer = customerList.find((customer) => {
    const customerName = String(customer.name ?? "").toLowerCase();
    const company = String(customer.company ?? "").toLowerCase();
    return (
      (explicitCustomerId != null &&
        String(customer.id) === String(explicitCustomerId)) ||
      (customerName.length > 2 && activityText.includes(customerName)) ||
      (company.length > 2 && activityText.includes(company))
    );
  });

  if (matchingCustomer) {
    return `/customers/${encodeURIComponent(String(matchingCustomer.id))}`;
  }

  const destinationRules: Array<{ pattern: RegExp; href: string }> = [
    { pattern: /\b(project|projects|website|branding)\b/i, href: "/projects" },
    { pattern: /\b(customer|customers|client|clients)\b/i, href: "/customers" },
    { pattern: /\b(task|tasks|deadline|todo)\b/i, href: "/tasks" },
    { pattern: /\b(finance|payment|invoice|expense|revenue|budget)\b/i, href: "/finance" },
    { pattern: /\b(team|member|employee)\b/i, href: "/team" },
    { pattern: /\b(report|reports|analytics|performance)\b/i, href: "/reports" },
    { pattern: /\b(setting|settings|preference)\b/i, href: "/settings" },
  ];

  return destinationRules.find((rule) => rule.pattern.test(activityText))?.href ?? "/";
}

const dateRanges: {
  value: DateRange;
  label: string;
  description: string;
}[] = [
  {
    value: "7d",
    label: "Last 7 days",
    description: "Past week",
  },
  {
    value: "30d",
    label: "Last 30 days",
    description: "Past month",
  },
  {
    value: "90d",
    label: "Last 90 days",
    description: "Past 3 months",
  },
  {
    value: "12m",
    label: "Last 12 months",
    description: "Past year",
  },
];

export default function Header({
  onMenuClick,
  onDateRangeChange,
}: HeaderProps) {
  const router = useRouter();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { customers, isLoaded: areCustomersLoaded } = useCustomers();
  const [searchCustomers, setSearchCustomers] = useState<SearchableCustomer[]>(
    customers as SearchableCustomer[]
  );
  const [searchProjects, setSearchProjects] = useState<SearchableProject[]>(
    projects as SearchableProject[]
  );

  const [isDateMenuOpen, setIsDateMenuOpen] = useState(false);
  const [selectedDateRange, setSelectedDateRange] =
    useState<DateRange>("30d");

  const dateMenuRef = useRef<HTMLDivElement>(null);

  const { theme, toggleTheme } = useTheme();

  // Keep customer data current when the search panel is opened.
  // The customer page and header use separate hook instances, so refreshing
  // from localStorage here also picks up same-tab edits made elsewhere.
  useEffect(() => {
    setSearchCustomers(customers as SearchableCustomer[]);
  }, [customers]);

  useEffect(() => {
    if (!isSearchOpen) return;

    try {
      const savedProjects = localStorage.getItem("nexora-projects");
      if (savedProjects) {
        const parsedProjects: unknown = JSON.parse(savedProjects);
        if (Array.isArray(parsedProjects)) {
          setSearchProjects(parsedProjects as SearchableProject[]);
        }
      }

      const savedCustomers = localStorage.getItem("nexora-customers");
      if (savedCustomers) {
        const parsedCustomers: unknown = JSON.parse(savedCustomers);
        if (Array.isArray(parsedCustomers)) {
          setSearchCustomers(parsedCustomers as SearchableCustomer[]);
        }
      }
    } catch (error) {
      console.error("Nexora header search data loading failed:", error);
    }
  }, [isSearchOpen]);

  // ---------------------------------------------
  // Search Results
  // ---------------------------------------------

  const searchResults = useMemo<SearchResult[]>(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) return [];

    const projectResults: SearchResult[] = searchProjects
      .filter((project) =>
        searchableText(
          project.name,
          project.client,
          project.id,
          project.category,
          project.status
        ).includes(query)
      )
      .map((project) => ({
        id: project.id,
        title: project.name,
        subtitle: `${project.client || "Project"} · ${project.id}`,
        category: "Project",
        href: `/projects/${encodeURIComponent(String(project.id))}`,
      }));

    const customerResults: SearchResult[] = searchCustomers
      .filter((customer) =>
        searchableText(
          customer.name,
          customer.email,
          customer.company,
          customer.id,
          customer.phone,
          customer.location
        ).includes(query)
      )
      .map((customer) => ({
        id: customer.id,
        title: customer.name,
        subtitle: `${customer.company || customer.email || "Customer"} · ${customer.id}`,
        category: "Customer",
        href: `/customers/${encodeURIComponent(String(customer.id))}`,
      }));

    const activityResults: SearchResult[] = activities
      .filter((activity) =>
        searchableText(activity.user, activity.action, activity.target).includes(query)
      )
      .map((activity) => ({
        id: activity.id,
        title: activity.target,
        subtitle: `${activity.user} ${activity.action}`,
        category: "Activity",
        href: resolveActivityHref(
          activity,
          searchProjects,
          searchCustomers
        ),
      }));

    return [
      ...projectResults,
      ...customerResults,
      ...activityResults,
    ];
  }, [searchQuery, searchProjects, searchCustomers]);

  const openSearchResult = (result: SearchResult) => {
    setIsSearchOpen(false);
    setSearchQuery("");
    router.push(result.href);
  };

  // ---------------------------------------------
  // Date Range
  // ---------------------------------------------

  const currentDateRange =
    dateRanges.find(
      (item) => item.value === selectedDateRange
    ) || dateRanges[1];

  const handleDateRangeChange = (range: DateRange) => {
    setSelectedDateRange(range);
    setIsDateMenuOpen(false);

    onDateRangeChange?.(range);
  };

  // ---------------------------------------------
  // Close Date Menu on Outside Click / Escape
  // ---------------------------------------------

  useEffect(() => {
    if (!isDateMenuOpen) return;

    const handleOutsideClick = (event: PointerEvent) => {
      if (
        dateMenuRef.current &&
        !dateMenuRef.current.contains(event.target as Node)
      ) {
        setIsDateMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsDateMenuOpen(false);
      }
    };

    document.addEventListener("pointerdown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isDateMenuOpen]);

  return (
    <>
      {/* Main Header */}

      <header className="relative z-30 flex h-[82px] items-center justify-between border-b border-[#e9ecf2] bg-white px-4 transition-colors dark:border-gray-800 dark:bg-[#111827] sm:px-6 lg:px-8">

        {/* Left Section */}

        <div className="flex min-w-0 items-center gap-3">

          {/* Mobile Menu */}

          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open navigation menu"
            className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 md:hidden"
          >
            <Menu size={21} />
          </button>

          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Overview
            </h2>

            <p className="mt-1 hidden text-xs text-gray-400 dark:text-gray-500 sm:block">
              Welcome back! Here's your business overview.
            </p>
          </div>
        </div>

        {/* Right Section */}

        <div className="flex shrink-0 items-center gap-2 sm:gap-4">

          {/* Search Button */}

          <button
            type="button"
            onClick={() => {
              setIsSearchOpen((current) => !current);
              setSearchQuery("");
            }}
            aria-label="Search"
            aria-expanded={isSearchOpen}
            className={`flex h-10 w-10 items-center justify-center rounded-xl border transition ${
              isSearchOpen
                ? "border-[#ddd8ff] bg-[#eeeaff] text-[#635BFF] dark:border-[#5146c7] dark:bg-[#292453]"
                : "border-gray-100 bg-white text-gray-500 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            {isSearchOpen ? (
              <X size={19} />
            ) : (
              <Search size={19} />
            )}
          </button>

          {/* Notifications */}

          <Notifications />

          {/* Theme Toggle */}

          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={
              theme === "dark"
                ? "Switch to light mode"
                : "Switch to dark mode"
            }
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-100 bg-white text-gray-500 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            {theme === "dark" ? (
              <Sun size={18} />
            ) : (
              <Moon size={18} />
            )}
          </button>

          {/* Divider */}

          <div className="hidden h-9 w-px bg-gray-200 dark:bg-gray-700 sm:block" />

          {/* Date Range Dropdown */}

          <div
            ref={dateMenuRef}
            className="relative hidden sm:block"
          >
            <button
              type="button"
              onClick={() =>
                setIsDateMenuOpen((current) => !current)
              }
              aria-label="Select date range"
              aria-haspopup="menu"
              aria-expanded={isDateMenuOpen}
              className={`flex h-10 items-center gap-2 rounded-xl border px-3 text-sm font-medium transition ${
                isDateMenuOpen
                  ? "border-[#635BFF]/30 bg-[#635BFF]/5 text-[#635BFF] dark:border-[#635BFF]/40 dark:bg-[#635BFF]/10"
                  : "border-gray-100 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              }`}
            >
              <CalendarDays
                size={16}
                className={
                  isDateMenuOpen
                    ? "text-[#635BFF]"
                    : "text-gray-400"
                }
              />

              <span className="whitespace-nowrap">
                {currentDateRange.label}
              </span>

              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${
                  isDateMenuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu */}

            {isDateMenuOpen && (
              <div
                role="menu"
                className="absolute right-0 top-full z-[60] mt-2 w-60 overflow-hidden rounded-2xl border border-gray-100 bg-white p-2 shadow-xl shadow-gray-200/50 dark:border-gray-700 dark:bg-[#111827] dark:shadow-black/30"
              >
                <div className="px-3 pb-2 pt-2">
                  <p className="text-[10px] font-bold uppercase tracking-[1.5px] text-gray-400 dark:text-gray-500">
                    DATE RANGE
                  </p>

                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Select a reporting period
                  </p>
                </div>

                <div className="space-y-1">
                  {dateRanges.map((range) => {
                    const isSelected =
                      selectedDateRange === range.value;

                    return (
                      <button
                        key={range.value}
                        type="button"
                        role="menuitemradio"
                        aria-checked={isSelected}
                        onClick={() =>
                          handleDateRangeChange(range.value)
                        }
                        className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-left transition ${
                          isSelected
                            ? "bg-[#635BFF]/[0.08] text-[#635BFF] dark:bg-[#635BFF]/15"
                            : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                        }`}
                      >
                        <div>
                          <p className="text-xs font-semibold">
                            {range.label}
                          </p>

                          <p className="mt-1 text-[10px] text-gray-400 dark:text-gray-500">
                            {range.description}
                          </p>
                        </div>

                        {isSelected && (
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#635BFF] text-white">
                            <Check size={14} />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-2 border-t border-gray-100 px-3 py-3 dark:border-gray-800">
                  <p className="text-[10px] text-gray-400 dark:text-gray-500">
                    Selected: {currentDateRange.label}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Profile */}

          <ProfileDropdown />

        </div>
      </header>

      {/* =====================================
          SEARCH OVERLAY & PANEL
      ===================================== */}

      {isSearchOpen && (
        <>
          {/* Overlay */}

          <button
            type="button"
            aria-label="Close search"
            onClick={() => setIsSearchOpen(false)}
            className="fixed inset-0 z-40 cursor-default bg-black/10 dark:bg-black/40"
          />

          {/* Search Panel */}

          <div
            role="dialog"
            aria-label="Global search"
            className="fixed left-4 right-4 top-[90px] z-50 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900 sm:left-auto sm:right-8 sm:w-[420px]"
          >

            {/* Search Input */}

            <div className="flex items-center gap-3 border-b border-gray-100 px-4 dark:border-gray-800">
              <Search
                size={19}
                className="shrink-0 text-gray-400"
              />

              <input
                autoFocus
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(event.target.value)
                }
                onKeyDown={(event) => {
                  if (event.key === "Escape") {
                    setIsSearchOpen(false);
                    setSearchQuery("");
                  }

                  if (event.key === "Enter" && searchResults[0]) {
                    openSearchResult(searchResults[0]);
                  }
                }}
                placeholder="Search projects, customers, activities..."
                className="h-14 min-w-0 flex-1 bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400 dark:text-gray-100"
              />

              <kbd className="rounded-md bg-gray-100 px-2 py-1 text-[10px] text-gray-400 dark:bg-gray-800 dark:text-gray-500">
                ESC
              </kbd>
            </div>

            {/* Search Results */}

            <div className="max-h-[360px] overflow-y-auto p-3">

              {!searchQuery.trim() ? (
                <div className="py-8 text-center">
                  <Search
                    size={26}
                    className="mx-auto text-gray-300 dark:text-gray-600"
                  />

                  <p className="mt-3 text-sm font-medium text-gray-600 dark:text-gray-300">
                    Search your workspace
                  </p>

                  <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                    Find projects, customers and recent activities
                  </p>
                </div>

              ) : !areCustomersLoaded && searchResults.length === 0 ? (
                <div className="py-8 text-center text-xs text-gray-400">
                  Loading workspace data...
                </div>

              ) : searchResults.length > 0 ? (
                <div className="space-y-1">
                  <p className="px-2 pb-2 text-[10px] font-semibold tracking-wider text-gray-400 dark:text-gray-500">
                    SEARCH RESULTS ({searchResults.length})
                  </p>

                  {searchResults.map((result, index) => (
                    <button
                      key={`${result.category}-${result.id}-${index}`}
                      type="button"
                      onClick={() => openSearchResult(result)}
                      aria-label={`Open ${result.category}: ${result.title}`}
                      className="group flex w-full items-center gap-3 rounded-xl p-3 text-left transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#635BFF]/50 dark:hover:bg-gray-800"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#eeeaff] text-[#635BFF] dark:bg-[#292453] dark:text-[#a59cff]">
                        {result.category === "Project" ? (
                          <FolderKanban size={17} />
                        ) : result.category === "Customer" ? (
                          <Users size={17} />
                        ) : (
                          <Clock3 size={17} />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-800 dark:text-gray-100">
                          {result.title}
                        </p>

                        <p className="truncate text-xs text-gray-400 dark:text-gray-500">
                          {result.subtitle}
                        </p>
                      </div>

                      <span className="shrink-0 text-[10px] text-gray-400 dark:text-gray-500">
                        {result.category}
                      </span>

                      <span className="text-gray-300 transition group-hover:translate-x-0.5 group-hover:text-[#635BFF] dark:text-gray-600" aria-hidden="true">
                        →
                      </span>
                    </button>
                  ))}
                </div>

              ) : (
                <div className="py-10 text-center">
                  <Search
                    size={25}
                    className="mx-auto text-gray-300 dark:text-gray-600"
                  />

                  <p className="mt-3 text-sm font-medium text-gray-600 dark:text-gray-300">
                    No results found
                  </p>

                  <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                    Try another keyword
                  </p>
                </div>
              )}
            </div>

            {/* Search Footer */}

            <div className="border-t border-gray-100 px-4 py-3 dark:border-gray-800">
              <p className="text-[10px] text-gray-400 dark:text-gray-500">
                Search across your NEXORA workspace
              </p>
            </div>
          </div>
        </>
      )}
    </>
  );
}
