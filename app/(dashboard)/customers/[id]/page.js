"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useCustomers } from "@/hooks/useCustomers";
import { formatCurrency } from "@/data/customers";

import {
  ArrowLeft,
  ArrowUpRight,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  FolderKanban,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Plus,
  Save,
  StickyNote,
  UserRound,
  Activity,
  X,
  BriefcaseBusiness,
  ExternalLink,
} from "lucide-react";

// Helpers

const readStoredArray = (key) => {
  try {
    const value = localStorage.getItem(key);
    if (!value) return [];
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error(`Could not read ${key}:`, error);
    return [];
  }
};

const normalize = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

const getProjectValue = (project) =>
  Number(project.budget ?? project.value ?? project.amount ?? 0) || 0;

const getProjectProgress = (project) => {
  if (project.progress !== undefined) {
    return Math.min(100, Math.max(0, Number(project.progress) || 0));
  }
  return project.status === "Completed" ? 100 : 0;
};

const getStatusStyle = (status) => {
  const styles = {
    Active:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
    "In Progress":
      "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
    Completed:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
    Pending:
      "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
    Todo:
      "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400",
    Inactive:
      "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400",
  };
  return (
    styles[status] ||
    "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
  );
};

const formatDate = (date) => {
  if (!date) return "Not specified";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return String(date);
  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatActivityDate = (date) => {
  if (!date) return "Recently";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "Recently";
  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getActivityDate = (item) =>
  item.createdAt || item.date || item.timestamp || item.updatedAt || "";

// Project Matching

const isRelatedProject = (project, customer) => {
  const customerId = String(customer.id);

  const linkedIds = [
    project.customerId,
    project.clientId,
    project.customer_id,
    project.client_id,
    project.customer?.id,
    project.client?.id,
  ]
    .filter((value) => value !== undefined && value !== null)
    .map(String);

  if (linkedIds.includes(customerId)) return true;

  const customerNames = [customer.name, customer.company]
    .map(normalize)
    .filter(Boolean);

  const projectNames = [
    typeof project.client === "string" ? project.client : "",
    typeof project.customer === "string" ? project.customer : "",
    project.clientName,
    project.customerName,
    project.company,
    project.contactName,
  ]
    .map(normalize)
    .filter(Boolean);

  return projectNames.some((name) => customerNames.includes(name));
};

// Small Components

function SectionHeader({ icon: Icon, title, subtitle, action }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#635BFF]/10 text-[#635BFF] dark:bg-[#635BFF]/15">
          <Icon size={18} />
        </div>

        <div className="min-w-0">
          <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100">
            {title}
          </h2>

          {subtitle && (
            <p className="mt-1 text-[10px] text-gray-400">{subtitle}</p>
          )}
        </div>
      </div>

      {action}
    </div>
  );
}

function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 px-5 py-10 text-center dark:border-gray-700">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500">
        <Icon size={21} />
      </div>

      <h3 className="mt-3 text-xs font-semibold text-gray-700 dark:text-gray-200">
        {title}
      </h3>

      <p className="mt-1 max-w-xs text-[10px] leading-5 text-gray-400">
        {description}
      </p>
    </div>
  );
}

// Customer Profile Content

function CustomerProfileContent() {
  const params = useParams();
  const router = useRouter();

  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const { customers, setCustomers, isLoaded } = useCustomers();

  const [projects, setProjects] = useState([]);
  const [activities, setActivities] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const [notes, setNotes] = useState("");
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  const [customer, setCustomer] = useState(null);

  // Find Customer

  useEffect(() => {
    if (!isLoaded || !id) return;

    const found = customers.find((item) => String(item.id) === String(id));
    setCustomer(found || null);
  }, [customers, id, isLoaded]);

  // Load Projects & Activities

  const loadProfileData = useCallback(() => {
    if (!customer || !id) return;

    try {
      const allProjects = readStoredArray("nexora-projects");

      const relatedProjects = allProjects
        .filter((project) => isRelatedProject(project, customer))
        .sort((a, b) => {
          const dateA = new Date(
            a.updatedAt || a.createdAt || a.startDate || 0
          ).getTime();
          const dateB = new Date(
            b.updatedAt || b.createdAt || b.startDate || 0
          ).getTime();
          return dateB - dateA;
        });

      setProjects(relatedProjects);

      const customerActivities = readStoredArray(
        `nexora-customer-activity-${id}`
      );

      const projectActivities = relatedProjects.flatMap((project) => {
        return readStoredArray(`nexora-project-activity-${project.id}`).map(
          (activity) => ({ ...activity, projectName: project.name })
        );
      });

      const combined = [...customerActivities, ...projectActivities];

      const uniqueActivities = Array.from(
        new Map(
          combined.map((item, index) => [
            item.id || `${item.title}-${getActivityDate(item)}-${index}`,
            item,
          ])
        ).values()
      );

      uniqueActivities.sort((a, b) => {
        const dateA = new Date(getActivityDate(a) || 0).getTime();
        const dateB = new Date(getActivityDate(b) || 0).getTime();
        return dateB - dateA;
      });

      setActivities(uniqueActivities.slice(0, 12));
    } catch (error) {
      console.error("Could not load customer profile:", error);
      setProjects([]);
      setActivities([]);
    } finally {
      setIsDataLoaded(true);
    }
  }, [customer, id]);

  useEffect(() => {
    if (!customer) return;

    setNotes(customer.notes || "");
    setIsEditingNotes(false);
    setIsDataLoaded(false);
    loadProfileData();
  }, [customer?.id, loadProfileData]);

  // Project Statistics

  const projectValue = useMemo(
    () =>
      projects.reduce(
        (total, project) => total + getProjectValue(project),
        0
      ),
    [projects]
  );

  // Save Customer Notes

  const saveNotes = () => {
    if (!customer || isSavingNotes) return;

    setIsSavingNotes(true);

    const updatedCustomer = { ...customer, notes: notes.trim() };

    setCustomers((current) =>
      current.map((item) =>
        String(item.id) === String(customer.id) ? updatedCustomer : item
      )
    );

    setCustomer(updatedCustomer);
    setIsEditingNotes(false);

    try {
      const key = `nexora-customer-activity-${id}`;
      const existingActivities = readStoredArray(key);

      const activity = {
        id: `customer-note-${Date.now()}`,
        title: "Customer notes updated",
        detail: "Customer notes were updated.",
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem(
        key,
        JSON.stringify([activity, ...existingActivities].slice(0, 30))
      );

      setActivities((current) => [activity, ...current].slice(0, 12));
    } catch (error) {
      console.error("Could not save customer activity:", error);
    }

    setIsSavingNotes(false);
  };

  const cancelNotes = () => {
    setNotes(customer?.notes || "");
    setIsEditingNotes(false);
  };

  // Loading

  if (!isLoaded || !isDataLoaded) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-9 w-9 animate-spin rounded-full border-2 border-gray-200 border-t-[#635BFF]" />
            <p className="text-xs text-gray-400">
              Loading customer profile...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Not Found

  if (!customer) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-gray-400 dark:bg-gray-800">
            <UserRound size={28} />
          </div>

          <h2 className="mt-4 text-lg font-bold text-gray-900 dark:text-white">
            Customer not found
          </h2>

          <p className="mt-2 text-xs text-gray-400">
            This customer may have been deleted or does not exist.
          </p>

          <button
            type="button"
            onClick={() => router.push("/customers")}
            className="mt-5 flex items-center gap-2 rounded-xl bg-[#635BFF] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#5148e5]"
          >
            <ArrowLeft size={14} />
            Back to customers
          </button>
        </div>
      </DashboardLayout>
    );
  }

  // Render

  return (
    <DashboardLayout>
      <div className="w-full min-w-0 space-y-6">
        {/* Header */}

        <section>
          <button
            type="button"
            onClick={() => router.push("/customers")}
            className="mb-5 flex items-center gap-2 text-xs font-medium text-gray-400 transition hover:text-[#635BFF]"
          >
            <ArrowLeft size={15} />
            Back to customers
          </button>

          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div className="flex min-w-0 items-center gap-4">
              <div
                className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-lg font-bold ${
                  customer.color ||
                  "bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400"
                }`}
              >
                {customer.initials ||
                  customer.name
                    ?.split(" ")
                    .map((part) => part[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
              </div>

              <div className="min-w-0">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-[1.5px] text-[#635BFF]">
                    CUSTOMER PROFILE
                  </span>

                  <span
                    className={`rounded-full px-2.5 py-1 text-[9px] font-semibold ${getStatusStyle(
                      customer.status
                    )}`}
                  >
                    {customer.status}
                  </span>
                </div>

                <h1 className="truncate text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                  {customer.name}
                </h1>

                <p className="mt-1 flex items-center gap-1.5 text-xs text-gray-400">
                  <Building2 size={13} />
                  {customer.company || "No company specified"}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => router.push("/customers")}
              className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-semibold text-gray-600 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <ExternalLink size={14} />
              Customer directory
            </button>
          </div>
        </section>

        {/* Main Layout */}

        <section className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
          {/* LEFT COLUMN */}

          <div className="min-w-0 space-y-5">
            {/* Recent Projects */}

            <div className="rounded-2xl border border-gray-200/80 bg-white p-5 dark:border-gray-800 dark:bg-[#111827]">
              <SectionHeader
                icon={FolderKanban}
                title="Recent projects"
                subtitle={`${projects.length} associated ${
                  projects.length === 1 ? "project" : "projects"
                }`}
                action={
                  <button
                    type="button"
                    onClick={() => router.push("/projects")}
                    className="flex items-center gap-1 text-[10px] font-semibold text-[#635BFF] transition hover:text-[#5148e5]"
                  >
                    All projects
                    <ArrowUpRight size={13} />
                  </button>
                }
              />

              {projects.length > 0 ? (
                <div className="mt-5 space-y-3">
                  {projects.map((project) => {
                    const progress = getProjectProgress(project);

                    return (
                      <button
                        key={project.id}
                        type="button"
                        onClick={() =>
                          router.push(
                            `/projects/${encodeURIComponent(String(project.id))}`
                          )
                        }
                        className="group w-full rounded-xl border border-gray-100 p-4 text-left transition hover:border-[#635BFF]/30 hover:bg-gray-50/70 dark:border-gray-800 dark:hover:bg-gray-800/50"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex min-w-0 items-start gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#635BFF]/10 text-[#635BFF] dark:bg-[#635BFF]/15">
                              <BriefcaseBusiness size={17} />
                            </div>

                            <div className="min-w-0">
                              <h3 className="truncate text-xs font-bold text-gray-900 transition group-hover:text-[#635BFF] dark:text-gray-100">
                                {project.name || "Untitled project"}
                              </h3>

                              <p className="mt-1 text-[10px] text-gray-400">
                                {project.category || "General project"}
                              </p>
                            </div>
                          </div>

                          <span
                            className={`shrink-0 rounded-full px-2.5 py-1 text-[9px] font-semibold ${getStatusStyle(
                              project.status
                            )}`}
                          >
                            {project.status || "Pending"}
                          </span>
                        </div>

                        <div className="mt-4 flex items-center justify-between gap-3">
                          <div>
                            <p className="text-[9px] text-gray-400">
                              Project value
                            </p>

                            <p className="mt-1 text-xs font-bold text-gray-800 dark:text-gray-200">
                              {formatCurrency(getProjectValue(project))}
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="text-[9px] text-gray-400">
                              Progress
                            </p>

                            <p className="mt-1 text-xs font-bold text-[#635BFF]">
                              {progress}%
                            </p>
                          </div>
                        </div>

                        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                          <div
                            className="h-full rounded-full bg-[#635BFF] transition-all duration-500"
                            style={{ width: `${progress}%` }}
                          />
                        </div>

                        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                          <span className="flex items-center gap-1.5 text-[9px] text-gray-400">
                            <CalendarDays size={11} />
                            {project.deadline
                              ? `Due ${formatDate(project.deadline)}`
                              : `Started ${formatDate(project.startDate)}`}
                          </span>

                          <span className="flex items-center gap-1 text-[9px] font-semibold text-[#635BFF] opacity-0 transition group-hover:opacity-100">
                            View project
                            <ArrowUpRight size={11} />
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="mt-5">
                  <EmptyState
                    icon={FolderKanban}
                    title="No projects linked yet"
                    description="Projects assigned to this customer will automatically appear here."
                  />

                  <button
                    type="button"
                    onClick={() => router.push("/projects")}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 py-2.5 text-xs font-semibold text-gray-600 transition hover:border-[#635BFF]/30 hover:text-[#635BFF] dark:border-gray-700 dark:text-gray-300"
                  >
                    <Plus size={14} />
                    Go to projects
                  </button>
                </div>
              )}

              {projects.length > 0 && (
                <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-800">
                  <span className="text-[10px] text-gray-400">
                    Total project value
                  </span>

                  <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                    {formatCurrency(projectValue)}
                  </span>
                </div>
              )}
            </div>

            {/* Customer Notes */}

            <div className="rounded-2xl border border-gray-200/80 bg-white p-5 dark:border-gray-800 dark:bg-[#111827]">
              <div className="flex items-center justify-between gap-3">
                <SectionHeader
                  icon={StickyNote}
                  title="Customer notes"
                  subtitle="Important information and internal notes"
                />

                {!isEditingNotes && (
                  <button
                    type="button"
                    onClick={() => setIsEditingNotes(true)}
                    aria-label="Edit customer notes"
                    title="Edit notes"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-gray-200 text-gray-500 transition hover:border-[#635BFF]/30 hover:bg-[#635BFF]/5 hover:text-[#635BFF] dark:border-gray-700 dark:text-gray-400"
                  >
                    <Pencil size={15} />
                  </button>
                )}
              </div>

              {isEditingNotes ? (
                <div className="mt-5">
                  <textarea
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    rows={5}
                    autoFocus
                    placeholder="Write important information about this customer..."
                    className="w-full resize-y rounded-xl border border-gray-200 bg-gray-50 p-4 text-xs leading-6 text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-[#635BFF] focus:bg-white dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:bg-gray-800"
                  />

                  <div className="mt-3 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={cancelNotes}
                      className="flex items-center gap-2 rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs font-semibold text-gray-500 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300"
                    >
                      <X size={13} />
                      Cancel
                    </button>

                    <button
                      type="button"
                      onClick={saveNotes}
                      disabled={isSavingNotes}
                      className="flex items-center gap-2 rounded-xl bg-[#635BFF] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#5148e5] disabled:opacity-50"
                    >
                      <Save size={13} />
                      Save notes
                    </button>
                  </div>
                </div>
              ) : notes.trim() ? (
                <div className="mt-5 rounded-xl bg-amber-50/70 p-4 dark:bg-amber-500/5">
                  <div className="flex items-start gap-3">
                    <FileText
                      size={16}
                      className="mt-1 shrink-0 text-amber-600 dark:text-amber-400"
                    />

                    <p className="whitespace-pre-wrap break-words text-xs leading-7 text-gray-700 dark:text-gray-300">
                      {notes}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mt-5">
                  <EmptyState
                    icon={StickyNote}
                    title="No notes added"
                    description="Keep useful details, preferences and important conversations about this customer in one place."
                  />

                  <button
                    type="button"
                    onClick={() => setIsEditingNotes(true)}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#635BFF] py-2.5 text-xs font-semibold text-white transition hover:bg-[#5148e5]"
                  >
                    <Plus size={14} />
                    Add customer note
                  </button>
                </div>
              )}
            </div>

            {/* Recent Activity */}

            <div className="rounded-2xl border border-gray-200/80 bg-white p-5 dark:border-gray-800 dark:bg-[#111827]">
              <SectionHeader
                icon={Activity}
                title="Recent activity"
                subtitle="Latest updates and customer interactions"
              />

              {activities.length > 0 ? (
                <div className="mt-6 space-y-5">
                  {activities.map((item, index) => (
                    <div
                      key={item.id || index}
                      className="relative flex gap-3"
                    >
                      {index !== activities.length - 1 && (
                        <div className="absolute bottom-[-22px] left-[15px] top-9 w-px bg-gray-100 dark:bg-gray-800" />
                      )}

                      <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#635BFF]/10 text-[#635BFF] dark:bg-[#635BFF]/15">
                        <Activity size={14} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h3 className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                            {item.title || "Customer update"}
                          </h3>

                          <span className="text-[9px] text-gray-400">
                            {formatActivityDate(getActivityDate(item))}
                          </span>
                        </div>

                        <p className="mt-1 break-words text-[10px] leading-5 text-gray-500 dark:text-gray-400">
                          {item.detail || item.description || ""}
                        </p>

                        {item.projectName && (
                          <p className="mt-1 flex items-center gap-1 text-[9px] font-medium text-[#635BFF]">
                            <FolderKanban size={11} />
                            {item.projectName}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-5">
                  <EmptyState
                    icon={Clock3}
                    title="No recent activity"
                    description="Updates to customer notes and activity from associated projects will appear here."
                  />
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN */}

          <aside className="space-y-5">
            {/* Contact Information */}

            <div className="rounded-2xl border border-gray-200/80 bg-white p-5 dark:border-gray-800 dark:bg-[#111827]">
              <SectionHeader
                icon={UserRound}
                title="Contact information"
                subtitle="Customer details"
              />

              <div className="mt-5 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                    <Mail size={14} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[9px] text-gray-400">
                      Email address
                    </p>

                    <a
                      href={`mailto:${customer.email}`}
                      className="mt-1 block break-all text-xs font-medium text-gray-800 transition hover:text-[#635BFF] dark:text-gray-200"
                    >
                      {customer.email || "Not provided"}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                    <Phone size={14} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[9px] text-gray-400">
                      Phone number
                    </p>

                    {customer.phone ? (
                      <a
                        href={`tel:${customer.phone}`}
                        className="mt-1 block text-xs font-medium text-gray-800 transition hover:text-[#635BFF] dark:text-gray-200"
                      >
                        {customer.phone}
                      </a>
                    ) : (
                      <p className="mt-1 text-xs text-gray-400">
                        Not provided
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
                    <Building2 size={14} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[9px] text-gray-400">Company</p>

                    <p className="mt-1 text-xs font-medium text-gray-800 dark:text-gray-200">
                      {customer.company || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400">
                    <MapPin size={14} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[9px] text-gray-400">Location</p>

                    <p className="mt-1 text-xs font-medium text-gray-800 dark:text-gray-200">
                      {customer.location || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Information */}

            <div className="rounded-2xl border border-gray-200/80 bg-white p-5 dark:border-gray-800 dark:bg-[#111827]">
              <SectionHeader
                icon={BriefcaseBusiness}
                title="Account information"
                subtitle="Customer account details"
              />

              <div className="mt-5 space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[10px] text-gray-400">
                    Account status
                  </span>

                  <span
                    className={`rounded-full px-2.5 py-1 text-[9px] font-semibold ${getStatusStyle(
                      customer.status
                    )}`}
                  >
                    {customer.status}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-[10px] text-gray-400">
                    Customer since
                  </span>

                  <span className="text-[10px] font-semibold text-gray-700 dark:text-gray-300">
                    {customer.joined || "Not specified"}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-[10px] text-gray-400">
                    Recorded spending
                  </span>

                  <span className="text-xs font-bold text-gray-900 dark:text-gray-100">
                    {formatCurrency(customer.spent || 0)}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-[10px] text-gray-400">
                    Associated projects
                  </span>

                  <span className="text-xs font-bold text-gray-900 dark:text-gray-100">
                    {projects.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Relationship Insight */}

            <div className="relative overflow-hidden rounded-2xl border border-violet-100 bg-gradient-to-br from-[#f6f3ff] to-[#f0efff] p-5 dark:border-violet-500/15 dark:from-[#201c3b] dark:to-[#191c34]">
              <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-violet-200/40 blur-2xl dark:bg-violet-500/10" />

              <div className="relative">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#635BFF] shadow-sm dark:bg-white/10">
                  <img src="/nexora2.webp" className="w-7" alt="Nexora" />
                </div>

                <h3 className="mt-4 text-sm font-bold text-gray-900 dark:text-white">
                  Relationship insights
                </h3>

                <p className="mt-2 text-[10px] leading-6 text-gray-500 dark:text-gray-400">
                  {projects.length > 0
                    ? `${customer.name} has ${projects.length} associated ${
                        projects.length === 1 ? "project" : "projects"
                      }. Keep project updates and customer notes organized to maintain a strong relationship.`
                    : "Start by connecting a project to this customer. You can keep track of project progress, important notes and customer activity here."}
                </p>

                <div className="mt-4 flex items-center gap-2 text-[10px] font-semibold text-[#635BFF] dark:text-violet-300">
                  <CheckCircle2 size={13} />
                  Customer profile is up to date
                </div>
              </div>
            </div>
          </aside>
        </section>

        {/* Footer */}

        <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 pt-4 dark:border-gray-800">
          <p className="text-[10px] text-gray-400">
            Nexora Workspace · Customer Management
          </p>

          <button
            type="button"
            onClick={() => router.push("/customers")}
            className="flex items-center gap-1 text-[10px] font-semibold text-[#635BFF] hover:text-[#5148e5]"
          >
            Back to directory
            <ArrowUpRight size={12} />
          </button>
        </footer>
      </div>
    </DashboardLayout>
  );
}

// Page Wrapper

export default function CustomerProfilePage() {
  return (
    <Suspense
      fallback={
        <DashboardLayout>
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="h-9 w-9 animate-spin rounded-full border-2 border-gray-200 border-t-[#635BFF]" />
          </div>
        </DashboardLayout>
      }
    >
      <CustomerProfileContent />
    </Suspense>
  );
}