"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";

import {
  Activity,
  ArrowLeft,
  ArrowUpRight,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  Download,
  FolderKanban,
  LayoutGrid,
  List,
  Plus,
  Search,
  SlidersHorizontal,
  Target,
  Trash2,
  TrendingUp,
  Users,
  X,
  Pencil,
  ArrowRight,
} from "lucide-react";

const STORAGE_KEY = "nexora-projects";

const initialProjects = [
  {
    id: "1001",
    name: "Website Redesign",
    client: "Acme Corporation",
    category: "Web Design",
    status: "In Progress",
    progress: 78,
    budget: 12500,
    spent: 8200,
    startDate: "2026-10-01",
    deadline: "2026-11-25",
    team: ["AM", "JD", "SK"],
    description:
      "Redesigning the corporate website with a modern and responsive user experience.",
    color: "violet",
  },
  {
    id: "1002",
    name: "Mobile Banking App",
    client: "Fintech Solutions",
    category: "Development",
    status: "In Progress",
    progress: 55,
    budget: 24000,
    spent: 13500,
    startDate: "2026-09-15",
    deadline: "2026-12-10",
    team: ["MK", "AL", "JD"],
    description:
      "Building a secure mobile banking experience with modern financial features.",
    color: "blue",
  },
  {
    id: "1003",
    name: "Brand Identity",
    client: "Nova Studio",
    category: "Branding",
    status: "Completed",
    progress: 100,
    budget: 8500,
    spent: 7900,
    startDate: "2026-08-10",
    deadline: "2026-10-20",
    team: ["SK", "AM"],
    description:
      "Complete visual identity system including logo, typography and brand guidelines.",
    color: "emerald",
  },
  {
    id: "1004",
    name: "E-commerce Platform",
    client: "Urban Market",
    category: "Development",
    status: "In Progress",
    progress: 32,
    budget: 18000,
    spent: 6200,
    startDate: "2026-10-20",
    deadline: "2026-12-20",
    team: ["JD", "MK", "AL"],
    description:
      "Developing an online shopping platform with product management and checkout.",
    color: "orange",
  },
  {
    id: "1005",
    name: "Marketing Campaign",
    client: "Bright Media",
    category: "Marketing",
    status: "On Hold",
    progress: 20,
    budget: 6500,
    spent: 2100,
    startDate: "2026-09-05",
    deadline: "2026-11-30",
    team: ["AM", "SK"],
    description:
      "A multi-channel marketing campaign focused on brand awareness and lead generation.",
    color: "pink",
  },
  {
    id: "1006",
    name: "Dashboard UI Kit",
    client: "TechFlow",
    category: "UI/UX Design",
    status: "Completed",
    progress: 100,
    budget: 9500,
    spent: 8700,
    startDate: "2026-07-01",
    deadline: "2026-09-15",
    team: ["MK", "AL"],
    description:
      "A reusable dashboard design system and component library.",
    color: "cyan",
  },
];

const statusOptions = [
  "All",
  "In Progress",
  "Completed",
  "On Hold",
  "Planning",
];

const colorMap = {
  violet: "bg-[#635BFF]",
  blue: "bg-blue-500",
  emerald: "bg-emerald-500",
  orange: "bg-orange-500",
  pink: "bg-pink-500",
  cyan: "bg-cyan-500",
};

const softColorMap = {
  violet:
    "bg-[#635BFF]/10 text-[#635BFF] dark:bg-[#635BFF]/10 dark:text-[#635BFF]",
  blue:
    "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
  emerald:
    "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
  orange:
    "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400",
  pink:
    "bg-pink-50 text-pink-600 dark:bg-pink-500/10 dark:text-pink-400",
  cyan:
    "bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400",
};

const statusStyles = {
  "In Progress":
    "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
  Completed:
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
  "On Hold":
    "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  Planning:
    "bg-[#635BFF]/10 text-[#635BFF] dark:bg-[#635BFF]/10 dark:text-[#635BFF]",
};

const currency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getDaysRemaining = (date, todayTimestamp) => {
  if (!date || todayTimestamp === null) return null;

  const today = new Date(todayTimestamp);
  today.setHours(0, 0, 0, 0);

  const deadline = new Date(`${date}T00:00:00`);

  if (Number.isNaN(deadline.getTime())) return null;

  return Math.ceil(
    (deadline.getTime() - today.getTime()) / 86400000
  );
};

function normalizeProject(project, index = 0) {
  return {
    id: String(project.id ?? Date.now() + index),
    name: project.name || "Untitled Project",
    client: project.client || "Unknown Client",
    category: project.category || "General",
    status: project.status || "Planning",
    progress: Math.min(
      100,
      Math.max(0, Number(project.progress) || 0)
    ),
    budget: Number(project.budget) || 0,
    spent: Number(project.spent) || 0,
    startDate: project.startDate || "",
    deadline: project.deadline || "",
    team: Array.isArray(project.team) ? project.team : [],
    description: project.description || "",
    color: project.color || "violet",
  };
}

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
  trend,
}) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {title}
          </p>

          <h3 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {value}
          </h3>
        </div>

        <div className={`rounded-xl p-3 ${color}`}>
          <Icon size={21} />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs">
        {trend && (
          <span className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
            <ArrowUpRight size={14} />
            {trend}
          </span>
        )}

        <span className="text-slate-400">{subtitle}</span>
      </div>
    </div>
  );
}

function ProgressBar({
  value,
  color = "bg-[#635BFF]",
}) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
      <div
        className={`h-full rounded-full transition-all duration-500 ${color}`}
        style={{
          width: `${Math.min(100, Math.max(0, value))}%`,
        }}
      />
    </div>
  );
}

function AnimatedAverageCompletion({ value, completed }) {
  const cardRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    const element = cardRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.35,
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const target = Math.min(
      100,
      Math.max(0, Number(value) || 0)
    );

    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setAnimatedValue(target);
      return;
    }

    let animationFrame;
    let startTime = null;

    const duration = 1400;

    setAnimatedValue(0);

    const animate = (currentTime) => {
      if (startTime === null) {
        startTime = currentTime;
      }

      const progress = Math.min(
        (currentTime - startTime) / duration,
        1
      );

      const easedProgress = 1 - Math.pow(1 - progress, 3);

      setAnimatedValue(
        Math.round(target * easedProgress)
      );

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [isVisible, value]);

  return (
    <div
      ref={cardRef}
      className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-md"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-white/80">
            Average completion
          </p>

          <p className="mt-2 text-4xl font-bold tabular-nums">
            {animatedValue}%
          </p>
        </div>

        <div className="rounded-2xl bg-white/15 p-3">
          <Target size={25} />
        </div>
      </div>

      <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-white/20">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${animatedValue}%`,
            background: "linear-gradient(90deg, #6EE7B7 0%, #34D399 100%)",
          }}
        />
      </div>

      <div className="mt-3 flex justify-between text-xs text-white/80">
        <span>Overall progress</span>
        <span>{completed} completed</span>
      </div>
    </div>
  );
}

function ProjectModal({ project, onClose, onSave }) {
  const [form, setForm] = useState(
    project || {
      name: "",
      client: "",
      category: "Development",
      status: "Planning",
      progress: 0,
      budget: "",
      spent: "",
      startDate: "",
      deadline: "",
      description: "",
      team: [],
      color: "violet",
    }
  );

  const update = (key, value) => {
    setForm((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  const submit = (event) => {
    event.preventDefault();

    if (!form.name.trim() || !form.client.trim()) return;

    onSave({
      ...form,
      id: project?.id || String(Date.now()),
      progress: Number(form.progress) || 0,
      budget: Number(form.budget) || 0,
      spent: Number(form.spent) || 0,
      team: Array.isArray(form.team) ? form.team : [],
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {project ? "Edit Project" : "Create New Project"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Add project information and manage its progress.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={submit} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Project Name *
              </label>

              <input
                required
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="e.g. Website Redesign"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#635BFF] focus:ring-4 focus:ring-[#635BFF]/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Client *
              </label>

              <input
                required
                value={form.client}
                onChange={(e) => update("client", e.target.value)}
                placeholder="Client name"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#635BFF] focus:ring-4 focus:ring-[#635BFF]/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Category
              </label>

              <select
                value={form.category}
                onChange={(e) => update("category", e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#635BFF] dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option>Development</option>
                <option>Web Design</option>
                <option>UI/UX Design</option>
                <option>Branding</option>
                <option>Marketing</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Status
              </label>

              <select
                value={form.status}
                onChange={(e) => update("status", e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#635BFF] dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                {statusOptions.slice(1).map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Budget ($)
              </label>

              <input
                type="number"
                min="0"
                value={form.budget}
                onChange={(e) => update("budget", e.target.value)}
                placeholder="12500"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#635BFF] dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Amount Spent ($)
              </label>

              <input
                type="number"
                min="0"
                value={form.spent}
                onChange={(e) => update("spent", e.target.value)}
                placeholder="8200"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#635BFF] dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Start Date
              </label>

              <input
                type="date"
                value={form.startDate}
                onChange={(e) => update("startDate", e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#635BFF] dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Deadline
              </label>

              <input
                type="date"
                value={form.deadline}
                onChange={(e) => update("deadline", e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#635BFF] dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div className="sm:col-span-2">
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Progress
                </label>

                <span className="text-sm font-bold text-[#635BFF]">
                  {form.progress}%
                </span>
              </div>

              <input
                type="range"
                min="0"
                max="100"
                value={form.progress}
                onChange={(e) =>
                  update("progress", Number(e.target.value))
                }
                className="w-full accent-[#635BFF]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Description
              </label>

              <textarea
                rows={3}
                value={form.description}
                onChange={(e) =>
                  update("description", e.target.value)
                }
                placeholder="Write a short description..."
                className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#635BFF] dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-5 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-[#635BFF] px-4 py-2.5 text-xs font-semibold text-white shadow-sm shadow-violet-500/20 transition hover:bg-[#5148e5]"
            >
              {project ? "Save Changes" : "Create Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DeleteProjectModal({
  project,
  onClose,
  onConfirm,
}) {
  if (!project) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
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
                Delete project?
              </h3>

              <p className="mt-1.5 text-sm leading-6 text-slate-500 dark:text-slate-400">
                Are you sure you want to delete this project? This action cannot be undone.
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
              Project to be deleted
            </p>

            <p className="mt-1.5 truncate text-sm font-bold text-slate-800 dark:text-slate-200">
              {project.name}
            </p>

            <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">
              {project.client}
            </p>
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
            Delete project
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  const router = useRouter();

  const [projects, setProjects] = useState(initialProjects);
  const [search, setSearch] = useState("");
  const [activeStatus, setActiveStatus] = useState("All");
  const [viewMode, setViewMode] = useState("grid");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [deletingProject, setDeletingProject] = useState(null);
  const [loaded, setLoaded] = useState(false);

  const [todayTimestamp, setTodayTimestamp] = useState(null);

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    setTodayTimestamp(today.getTime());
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          setProjects(
            parsed.map((item, index) =>
              normalizeProject(item, index)
            )
          );
        }
      } else {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(initialProjects)
        );
      }
    } catch (error) {
      console.error("Could not load projects:", error);
      setProjects(initialProjects);
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!loaded) return;

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(projects)
      );
    } catch (error) {
      console.error("Could not save projects:", error);
    }
  }, [projects, loaded]);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        project.name.toLowerCase().includes(searchText) ||
        project.client.toLowerCase().includes(searchText) ||
        project.category.toLowerCase().includes(searchText);

      const matchesStatus =
        activeStatus === "All" ||
        project.status === activeStatus;

      return matchesSearch && matchesStatus;
    });
  }, [projects, search, activeStatus]);

  const stats = useMemo(() => {
    const total = projects.length;

    const active = projects.filter(
      (project) => project.status === "In Progress"
    ).length;

    const completed = projects.filter(
      (project) => project.status === "Completed"
    ).length;

    const totalBudget = projects.reduce(
      (sum, project) => sum + project.budget,
      0
    );

    const totalSpent = projects.reduce(
      (sum, project) => sum + project.spent,
      0
    );

    const averageProgress = total
      ? Math.round(
          projects.reduce(
            (sum, project) => sum + project.progress,
            0
          ) / total
        )
      : 0;

    return {
      total,
      active,
      completed,
      totalBudget,
      totalSpent,
      averageProgress,
    };
  }, [projects]);

  const upcomingProjects = useMemo(() => {
    return [...projects]
      .filter(
        (project) =>
          project.deadline &&
          project.status !== "Completed"
      )
      .sort((a, b) =>
        a.deadline.localeCompare(b.deadline)
      )
      .slice(0, 3);
  }, [projects]);

  const openCreateModal = () => {
    setEditingProject(null);
    setModalOpen(true);
  };

  const openEditModal = (project) => {
    setEditingProject(project);
    setModalOpen(true);
  };

  const saveProject = (project) => {
    setProjects((previous) => {
      const exists = previous.some(
        (item) => String(item.id) === String(project.id)
      );

      if (exists) {
        return previous.map((item) =>
          String(item.id) === String(project.id)
            ? project
            : item
        );
      }

      return [project, ...previous];
    });

    setModalOpen(false);
    setEditingProject(null);
  };

  const deleteProject = (id) => {
    const project = projects.find(
      (item) => String(item.id) === String(id)
    );

    if (project) {
      setDeletingProject(project);
    }
  };

  const confirmDeleteProject = () => {
    if (!deletingProject) return;

    setProjects((previous) =>
      previous.filter(
        (project) =>
          String(project.id) !== String(deletingProject.id)
      )
    );

    setDeletingProject(null);
  };

  const exportCSV = () => {
    const headers = [
      "ID",
      "Project",
      "Client",
      "Category",
      "Status",
      "Progress",
      "Budget",
      "Spent",
      "Start Date",
      "Deadline",
    ];

    const rows = filteredProjects.map((project) => [
      project.id,
      project.name,
      project.client,
      project.category,
      project.status,
      `${project.progress}%`,
      project.budget,
      project.spent,
      project.startDate,
      project.deadline,
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((value) =>
            `"${String(value ?? "").replace(/"/g, '""')}"`
          )
          .join(",")
      )
      .join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "nexora-projects.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  const openProject = (id) => {
    router.push(
      `/projects/${encodeURIComponent(String(id))}`
    );
  };

  return (
    <DashboardLayout>

      <div className="w-full min-w-0 space-y-7">

        <section className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-[2px] text-[#635BFF]">
                PROJECT MANAGEMENT
              </span>

              <span className="h-1 w-1 rounded-full bg-gray-300" />

              <span className="text-[10px] text-gray-400">
                Workspace / Projects
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-3xl">
              Projects overview
            </h1>

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Manage your projects, track progress and stay on top of deadlines.
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
              New Project
            </button>
          </div>
        </section>

        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#29245f] via-[#4337a8] to-[#635BFF] p-6 text-white shadow-xl shadow-[#635BFF]/15 sm:p-8">
          <div className="pointer-events-none absolute -right-12 -top-24 h-72 w-72 rounded-full border-[35px] border-white/5" />

          <div className="pointer-events-none absolute -bottom-32 right-1/3 h-64 w-64 rounded-full bg-white/5 blur-2xl" />

          <div className="relative z-10 grid gap-8 lg:grid-cols-[1fr_300px] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 backdrop-blur-md mb-5">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-white/20">
                  <img src="/nexora.webp" className="w-4" alt="Nexora" />
                </div>
                <span className="text-[10px] mt-0.5 font-bold uppercase tracking-[1.5px] text-white">
                  Project overview
                </span>
                <span className="ml-1 h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_8px_rgba(110,231,183,0.9)]" />
              </div>

              <h2 className="max-w-xl text-2xl font-bold leading-tight sm:text-3xl">
                Great things happen when projects move forward.
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-white/80">
                Keep your team aligned, monitor project performance and turn
                every milestone into progress.
              </p>

              <button
                type="button"
                onClick={() => {
                  setActiveStatus("In Progress");
                  window.scrollTo({
                    top: 550,
                    behavior: "smooth",
                  });
                }}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#635BFF] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#635BFF]/90"
              >
                View active projects
                <ArrowRight size={16} />
              </button>
            </div>

            <AnimatedAverageCompletion
              value={stats.averageProgress}
              completed={stats.completed}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Projects"
            value={stats.total}
            subtitle="Across all categories"
            icon={FolderKanban}
            color="bg-[#635BFF]/10 text-[#635BFF] dark:bg-[#635BFF]/10 dark:text-[#635BFF]"
            trend="+12%"
          />

          <StatCard
            title="Active Projects"
            value={stats.active}
            subtitle="Currently in progress"
            icon={Activity}
            color="bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
            trend="+8%"
          />

          <StatCard
            title="Completed"
            value={stats.completed}
            subtitle="Successfully delivered"
            icon={CheckCircle2}
            color="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
            trend="+16%"
          />

          <StatCard
            title="Total Budget"
            value={currency(stats.totalBudget)}
            subtitle={`${currency(stats.totalSpent)} spent so far`}
            icon={CircleDollarSign}
            color="bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
            trend="+5%"
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0 space-y-5">
            {/* Filters */}

            <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
                  <div>
                    <h2 className="font-bold text-slate-900 dark:text-white">
                      All Projects
                    </h2>

                    <p className="mt-1 text-xs text-slate-400">
                      {filteredProjects.length} projects found
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <div className="relative min-w-[200px] flex-1 md:flex-none">
                      <Search
                        size={17}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search projects..."
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-[#635BFF] focus:ring-4 focus:ring-[#635BFF]/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      />
                    </div>

                    <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-1 dark:border-slate-700 dark:bg-slate-800">
                      <button
                        type="button"
                        onClick={() => setViewMode("grid")}
                        className={`rounded-lg p-2 transition ${
                          viewMode === "grid"
                            ? "bg-white text-[#635BFF] shadow-sm dark:bg-slate-700 dark:text-[#635BFF]"
                            : "text-slate-400 hover:text-slate-700 dark:hover:text-white"
                        }`}
                        aria-label="Grid view"
                        title="Grid view"
                      >
                        <LayoutGrid size={17} />
                      </button>

                      <button
                        type="button"
                        onClick={() => setViewMode("list")}
                        className={`rounded-lg p-2 transition ${
                          viewMode === "list"
                            ? "bg-white text-[#635BFF] shadow-sm dark:bg-slate-700 dark:text-[#635BFF]"
                            : "text-slate-400 hover:text-slate-700 dark:hover:text-white"
                        }`}
                        aria-label="List view"
                        title="List view"
                      >
                        <List size={17} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <SlidersHorizontal
                    size={15}
                    className="mr-1 text-slate-400"
                  />

                  {statusOptions.map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setActiveStatus(status)}
                      className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                        activeStatus === status
                          ? "bg-[#635BFF] text-white shadow-md shadow-[#635BFF]/20"
                          : "bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Project Cards */}

            {filteredProjects.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-900">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#635BFF]/10 text-[#635BFF] dark:bg-[#635BFF]/10 dark:text-[#635BFF]">
                  <FolderKanban size={25} />
                </div>

                <h3 className="mt-4 font-bold text-slate-900 dark:text-white">
                  No projects found
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Try changing your search or filters.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setActiveStatus("All");
                  }}
                  className="mt-5 text-sm font-semibold text-[#635BFF] hover:text-[#5148e5]"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid gap-4 md:grid-cols-2"
                    : "space-y-3"
                }
              >
                {filteredProjects.map((project) => {
                  const days = getDaysRemaining(
                    project.deadline,
                    todayTimestamp
                  );

                  const projectColor =
                    colorMap[project.color] || colorMap.violet;

                  return (
                    <div
                      key={project.id}
                      onClick={() => openProject(project.id)}
                      className={`group relative cursor-pointer overflow-visible rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-[#635BFF]/20 hover:shadow-lg hover:shadow-[#635BFF]/5 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-[#635BFF]/40 ${
                        viewMode === "list"
                          ? "flex flex-col gap-5 sm:flex-row sm:items-center"
                          : ""
                      }`}
                    >
                      <div className="flex min-w-0 flex-1 items-start justify-between gap-3">
                        <div className="flex min-w-0 items-start gap-3">
                          <div
                            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                              softColorMap[project.color] ||
                              softColorMap.violet
                            }`}
                          >
                            <BriefcaseBusiness size={21} />
                          </div>

                          <div className="min-w-0">
                            <h3 className="truncate font-bold text-slate-900 transition group-hover:text-[#635BFF] dark:text-white dark:group-hover:text-[#635BFF]">
                              {project.name}
                            </h3>

                            <p className="mt-1 truncate text-xs text-slate-500">
                              {project.client}
                            </p>

                            <span className="mt-2 inline-block rounded-md bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                              {project.category}
                            </span>
                          </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-1.5">
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              openEditModal(project);
                            }}
                            title="Edit project"
                            aria-label={`Edit ${project.name}`}
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-[#635BFF]/20 hover:bg-[#635BFF]/10 hover:text-[#635BFF] dark:border-slate-700 dark:text-slate-400 dark:hover:border-[#635BFF]/30 dark:hover:bg-[#635BFF]/10 dark:hover:text-[#635BFF]"
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              deleteProject(project.id);
                            }}
                            title="Delete project"
                            aria-label={`Delete ${project.name}`}
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 dark:border-slate-700 dark:text-slate-400 dark:hover:border-rose-500/30 dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      <div
                        className={`mt-6 ${
                          viewMode === "list"
                            ? "min-w-[180px] flex-1 sm:mt-0"
                            : ""
                        }`}
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-xs font-medium text-slate-500">
                            Progress
                          </span>

                          <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                            {project.progress}%
                          </span>
                        </div>

                        <ProgressBar
                          value={project.progress}
                          color={projectColor}
                        />
                      </div>

                      <div
                        className={`mt-5 flex flex-wrap items-center justify-between gap-3 ${
                          viewMode === "list"
                            ? "sm:mt-0 sm:min-w-[190px]"
                            : ""
                        }`}
                      >
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                            Budget
                          </span>

                          <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                            {currency(project.budget)}
                          </span>
                        </div>

                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                            Deadline
                          </span>

                          <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300">
                            <CalendarDays size={13} />
                            {formatDate(project.deadline)}
                          </span>
                        </div>

                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                            statusStyles[project.status] ||
                            statusStyles.Planning
                          }`}
                        >
                          {project.status}
                        </span>
                      </div>

                      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
                        <div className="flex -space-x-2">
                          {(project.team || [])
                            .slice(0, 4)
                            .map((member, i) => (
                              <div
                                key={`${member}-${i}`}
                                title={member}
                                className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-slate-200 text-[9px] font-bold text-slate-600 dark:border-slate-900 dark:bg-slate-700 dark:text-slate-200"
                              >
                                {member}
                              </div>
                            ))}

                          {(!project.team ||
                            project.team.length === 0) && (
                            <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-slate-100 text-slate-400 dark:border-slate-900 dark:bg-slate-800">
                              <Users size={13} />
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 transition group-hover:text-[#635BFF] dark:group-hover:text-[#635BFF]">
                          View details
                          <ArrowLeft size={14} />
                        </div>
                      </div>

                      {days !== null &&
                        project.status !== "Completed" && (
                          <div
                            className={`mt-3 flex items-center gap-1.5 text-[11px] font-medium ${
                              days < 0
                                ? "text-rose-500"
                                : days <= 7
                                  ? "text-amber-600 dark:text-amber-400"
                                  : "text-slate-400"
                            }`}
                          >
                            <Clock3 size={13} />

                            {days < 0
                              ? `${Math.abs(days)} days overdue`
                              : days === 0
                                ? "Due today"
                                : `${days} days remaining`}
                          </div>
                        )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Sidebar */}

          <aside className="space-y-5">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">
                    Budget Overview
                  </h3>

                  <p className="mt-1 text-xs text-slate-400">
                    Project financial summary
                  </p>
                </div>

                <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                  <TrendingUp size={19} />
                </div>
              </div>

              <div className="mt-6">
                <p className="text-xs text-slate-400">
                  Total budget
                </p>

                <h3 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                  {currency(stats.totalBudget)}
                </h3>
              </div>

              <div className="mt-5 space-y-4">
                <div>
                  <div className="mb-2 flex justify-between text-xs">
                    <span className="text-slate-500">
                      Spent
                    </span>

                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {currency(stats.totalSpent)}
                    </span>
                  </div>

                  <ProgressBar
                    value={
                      stats.totalBudget
                        ? (stats.totalSpent / stats.totalBudget) * 100
                        : 0
                    }
                    color="bg-[#635BFF]"
                  />
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
                  <span className="text-xs text-slate-500">
                    Remaining budget
                  </span>

                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    {currency(
                      stats.totalBudget - stats.totalSpent
                    )}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">
                    Upcoming Deadlines
                  </h3>

                  <p className="mt-1 text-xs text-slate-400">
                    Keep track of what is next
                  </p>
                </div>

                <div className="rounded-xl bg-amber-50 p-2.5 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
                  <CalendarDays size={19} />
                </div>
              </div>

              <div className="mt-5 space-y-4">
                {upcomingProjects.length === 0 ? (
                  <p className="py-5 text-center text-xs text-slate-400">
                    No upcoming deadlines.
                  </p>
                ) : (
                  upcomingProjects.map((project) => {
                    const days = getDaysRemaining(
                      project.deadline,
                      todayTimestamp
                    );

                    return (
                      <button
                        type="button"
                        key={project.id}
                        onClick={() => openProject(project.id)}
                        className="flex w-full items-center gap-3 text-left"
                      >
                        <div
                          className={`h-10 w-1 shrink-0 rounded-full ${
                            colorMap[project.color] ||
                            colorMap.violet
                          }`}
                        />

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-200">
                            {project.name}
                          </p>

                          <p className="mt-1 text-[11px] text-slate-400">
                            {formatDate(project.deadline)}
                          </p>
                        </div>

                        <span
                          className={`shrink-0 rounded-lg px-2 py-1 text-[10px] font-bold ${
                            days !== null && days < 0
                              ? "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400"
                              : days !== null && days <= 7
                                ? "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
                                : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                          }`}
                        >
                          {days === null
                            ? "—"
                            : days < 0
                              ? `${Math.abs(days)}d late`
                              : days === 0
                                ? "Today"
                                : `${days}d left`}
                        </span>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-[#635BFF]/15 bg-[#635BFF]/5 p-5 dark:border-[#635BFF]/20 dark:bg-[#635BFF]/5">
              <div className="flex items-center gap-2 text-[#635BFF] dark:text-[#635BFF]">
                <Activity size={18} />

                <h3 className="text-sm font-bold">
                  Project Insight
                </h3>
              </div>

              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                You have{" "}
                <strong className="text-[#635BFF] dark:text-[#635BFF]">
                  {stats.active} active projects
                </strong>{" "}
                and{" "}
                <strong className="text-[#635BFF] dark:text-[#635BFF]">
                  {stats.completed} completed projects
                </strong>
                . Keep monitoring deadlines to maintain a healthy workflow.
              </p>

              <button
                type="button"
                onClick={() => {
                  setActiveStatus("In Progress");
                  setSearch("");
                }}
                className="mt-4 flex items-center gap-2 text-xs font-bold text-[#635BFF] transition hover:gap-3 dark:text-[#635BFF]"
              >
                Explore active projects
                <ArrowLeft size={14} />
              </button>
            </div>
          </aside>
        </div>

        {/* Footer */}

        <div className="flex flex-col items-center justify-between gap-2 border-t border-slate-200/70 pt-5 text-xs text-slate-400 sm:flex-row dark:border-slate-800">
          <p>Nexora Workspace · Project Management</p>

          <p>
            Showing {filteredProjects.length} of {projects.length} projects
          </p>
        </div>

        {/* Project Modal */}

        {modalOpen && (
          <ProjectModal
            project={editingProject}
            onClose={() => {
              setModalOpen(false);
              setEditingProject(null);
            }}
            onSave={saveProject}
          />
        )}

        {/* Delete Project Modal */}

        {deletingProject && (
          <DeleteProjectModal
            project={deletingProject}
            onClose={() => setDeletingProject(null)}
            onConfirm={confirmDeleteProject}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
