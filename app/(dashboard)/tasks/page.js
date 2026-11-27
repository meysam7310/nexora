"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Plus,
  Search,
  CalendarDays,
  Clock3,
  CheckCircle2,
  Circle,
  RefreshCw,
  X,
  Trash2,
  Pencil,
  ArrowUpRight,
  ListTodo,
  AlertCircle,
  Flag,
  FolderKanban,
  ChevronDown,
  Check,
  SlidersHorizontal,
  CalendarCheck,
  CircleDot,
} from "lucide-react";

const STORAGE_KEY = "nexora-tasks";
const PROJECTS_KEY = "nexora-projects";

const today = () => new Date().toISOString().slice(0, 10);

const initialTasks = [
  {
    id: "task-1",
    title: "Finalize dashboard overview",
    description: "Review the dashboard layout and polish the remaining UI details.",
    status: "In Progress",
    priority: "High",
    dueDate: today(),
    project: "Nexora Dashboard",
    assignee: "ME",
  },
  {
    id: "task-2",
    title: "Prepare client presentation",
    description: "Prepare the final presentation and organize the project materials.",
    status: "Todo",
    priority: "Medium",
    dueDate: "2026-11-20",
    project: "Brand Identity",
    assignee: "ME",
  },
  {
    id: "task-3",
    title: "Review landing page design",
    description: "Check responsive layouts and review typography consistency.",
    status: "In Progress",
    priority: "Medium",
    dueDate: "2026-11-21",
    project: "Website Redesign",
    assignee: "ME",
  },
  {
    id: "task-4",
    title: "Update project documentation",
    description: "Update the documentation with the latest project changes.",
    status: "Todo",
    priority: "Low",
    dueDate: "2026-11-24",
    project: "Nexora Dashboard",
    assignee: "ME",
  },
  {
    id: "task-5",
    title: "Complete authentication UI",
    description: "Finalize login and registration screens.",
    status: "Completed",
    priority: "High",
    dueDate: "2026-11-15",
    project: "Nexora Dashboard",
    assignee: "ME",
  },
];

const emptyForm = {
  title: "",
  description: "",
  status: "Todo",
  priority: "Medium",
  dueDate: today(),
  project: "",
  assignee: "ME",
};

const statusOptions = ["Todo", "In Progress", "Completed"];
const priorityOptions = ["Low", "Medium", "High"];

function formatDate(date) {
  if (!date) return "No due date";

  return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function isToday(date) {
  return date === today();
}

function isOverdue(task) {
  return (
    task.dueDate &&
    task.dueDate < today() &&
    task.status !== "Completed"
  );
}

function PriorityBadge({ priority }) {
  const styles = {
    High: "bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20",
    Medium: "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
    Low: "bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[11px] font-semibold ${
        styles[priority] || styles.Medium
      }`}
    >
      <Flag size={11} />
      {priority}
    </span>
  );
}

function StatusBadge({ status }) {
  const styles = {
    Todo: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
    "In Progress": "bg-[#635BFF]/10 text-[#635BFF] dark:bg-[#635BFF]/10 dark:text-[#635BFF]",
    Completed: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
  };

  return (
    <span
      className={`inline-flex items-center rounded-lg px-2.5 py-1 text-[11px] font-semibold ${
        styles[status] || styles.Todo
      }`}
    >
      {status}
    </span>
  );
}

function TaskModal({ open, onClose, onSave, task, projects }) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (!open) return;

    setForm(task ? { ...emptyForm, ...task } : emptyForm);
  }, [open, task]);

  if (!open) return null;

  const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.title.trim()) return;

    onSave({
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
    });
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-[520px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-[#111827]">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5 dark:border-gray-800">
          <div>
            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
              {task ? "Edit task" : "Create a task"}
            </h2>

            <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
              Organize your work and keep things moving.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X size={17} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-600 dark:text-gray-300">
              Task title
            </label>

            <input
              autoFocus
              required
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              placeholder="What needs to be done?"
              className="h-10 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#635BFF] focus:bg-white dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-[#635BFF] dark:focus:bg-gray-800"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-600 dark:text-gray-300">
              Description
            </label>

            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="Add some details about this task..."
              className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#635BFF] focus:bg-white dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-[#635BFF] dark:focus:bg-gray-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-600 dark:text-gray-300">
                Status
              </label>

              <select
                value={form.status}
                onChange={(e) => update("status", e.target.value)}
                className="h-10 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-xs text-gray-700 outline-none focus:border-[#635BFF] dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              >
                {statusOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-600 dark:text-gray-300">
                Priority
              </label>

              <select
                value={form.priority}
                onChange={(e) => update("priority", e.target.value)}
                className="h-10 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-xs text-gray-700 outline-none focus:border-[#635BFF] dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              >
                {priorityOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-600 dark:text-gray-300">
                Due date
              </label>

              <input
                type="date"
                value={form.dueDate}
                onChange={(e) => update("dueDate", e.target.value)}
                className="h-10 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-xs text-gray-700 outline-none focus:border-[#635BFF] dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-600 dark:text-gray-300">
                Project
              </label>

              <select
                value={form.project}
                onChange={(e) => update("project", e.target.value)}
                className="h-10 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-xs text-gray-700 outline-none focus:border-[#635BFF] dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              >
                <option value="">No project</option>

                {projects.map((project) => (
                  <option key={project} value={project}>
                    {project}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-2 border-t border-gray-100 pt-4 dark:border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-gray-200 py-2.5 text-xs font-semibold text-gray-600 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#635BFF] py-2.5 text-xs font-semibold text-white transition hover:bg-[#5148e5]"
            >
              <Check size={14} />
              {task ? "Save changes" : "Create task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DeleteTaskModal({ task, onClose, onConfirm }) {
  if (!task) return null;

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-[420px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-[#111827]">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
              <Trash2 size={23} />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Delete task?
              </h3>

              <p className="mt-1.5 text-sm leading-6 text-gray-500 dark:text-gray-400">
                Are you sure you want to delete this task? This action cannot be undone.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-white"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          <div className="mt-5 rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Task to be deleted
            </p>

            <p className="mt-1.5 truncate text-sm font-bold text-gray-800 dark:text-gray-200">
              {task.title}
            </p>

            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
              <span>{task.project || "No project"}</span>
              <span className="text-gray-300 dark:text-gray-600">·</span>
              <span>{task.priority} priority</span>
              <span className="text-gray-300 dark:text-gray-600">·</span>
              <span>{task.status}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-gray-100 bg-gray-50/80 px-6 py-4 dark:border-gray-800 dark:bg-gray-800/30">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-semibold text-gray-600 transition hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm shadow-rose-500/20 transition hover:bg-rose-700"
          >
            <Trash2 size={15} />
            Delete task
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, detail, icon: Icon, accent }) {
  return (
    <div className="rounded-2xl border border-gray-200/80 bg-white p-5 transition hover:border-gray-300 hover:shadow-sm dark:border-gray-800 dark:bg-[#111827]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
            {label}
          </p>

          <p className="mt-3 text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            {value}
          </p>
        </div>

        <div className={`rounded-xl p-2.5 ${accent}`}>
          <Icon size={18} />
        </div>
      </div>

      <p className="mt-3 text-[11px] text-gray-400">{detail}</p>
    </div>
  );
}

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [projects, setProjects] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All tasks");
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("All priorities");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [storageError, setStorageError] = useState(false);
  const [deletingTask, setDeletingTask] = useState(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        const parsed = JSON.parse(saved);
        setTasks(Array.isArray(parsed) ? parsed : initialTasks);
      } else {
        setTasks(initialTasks);
      }

      const savedProjects = localStorage.getItem(PROJECTS_KEY);

      if (savedProjects) {
        const parsedProjects = JSON.parse(savedProjects);

        if (Array.isArray(parsedProjects)) {
          setProjects(
            parsedProjects
              .map((project) =>
                typeof project === "string"
                  ? project
                  : project.name || project.title
              )
              .filter(Boolean)
          );
        }
      }
    } catch (error) {
      console.error("Could not load tasks:", error);
      setTasks(initialTasks);
      setStorageError(true);
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!loaded) return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
      setStorageError(false);
    } catch (error) {
      console.error("Could not save tasks:", error);
      setStorageError(true);
    }
  }, [tasks, loaded]);

  const stats = useMemo(() => {
    const total = tasks.length;

    const completed = tasks.filter(
      (task) => task.status === "Completed"
    ).length;

    const inProgress = tasks.filter(
      (task) => task.status === "In Progress"
    ).length;

    const overdue = tasks.filter(isOverdue).length;

    return { total, completed, inProgress, overdue };
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        (task.project || "").toLowerCase().includes(search.toLowerCase());

      const matchesPriority =
        priorityFilter === "All priorities" ||
        task.priority === priorityFilter;

      let matchesTab = true;

      if (activeFilter === "Today") {
        matchesTab =
          task.dueDate === today() && task.status !== "Completed";
      } else if (activeFilter === "Upcoming") {
        matchesTab =
          task.dueDate > today() && task.status !== "Completed";
      } else if (activeFilter === "Completed") {
        matchesTab = task.status === "Completed";
      } else if (activeFilter === "Overdue") {
        matchesTab = isOverdue(task);
      }

      return matchesSearch && matchesPriority && matchesTab;
    });
  }, [tasks, search, priorityFilter, activeFilter]);

  const openCreateModal = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const saveTask = (form) => {
    if (editingTask) {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === editingTask.id ? { ...task, ...form } : task
        )
      );
    } else {
      setTasks((prev) => [
        {
          ...form,
          id: `task-${Date.now()}`,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
    }

    setModalOpen(false);
    setEditingTask(null);
  };

  const deleteTask = (id) => {
    const task = tasks.find((item) => item.id === id);

    if (task) {
      setDeletingTask(task);
    }
  };

  const confirmDeleteTask = () => {
    if (!deletingTask) return;

    setTasks((prev) => prev.filter((task) => task.id !== deletingTask.id));
    setDeletingTask(null);
  };

  const changeStatus = (task) => {
    const nextStatus =
      task.status === "Todo"
        ? "In Progress"
        : task.status === "In Progress"
          ? "Completed"
          : "Todo";

    setTasks((prev) =>
      prev.map((item) =>
        item.id === task.id ? { ...item, status: nextStatus } : item
      )
    );
  };

  const filters = [
    { label: "All tasks", count: stats.total },
    {
      label: "Today",
      count: tasks.filter(
        (task) => isToday(task.dueDate) && task.status !== "Completed"
      ).length,
    },
    {
      label: "Upcoming",
      count: tasks.filter(
        (task) =>
          task.dueDate > today() && task.status !== "Completed"
      ).length,
    },
    { label: "Completed", count: stats.completed },
    { label: "Overdue", count: stats.overdue },
  ];

  if (!loaded) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-[#635BFF] dark:border-gray-700" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="w-full min-w-0 space-y-7 pb-10">
        <section className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-[2px] text-[#635BFF]">
                TASK MANAGEMENT
              </span>

              <span className="h-1 w-1 rounded-full bg-gray-300" />

              <span className="text-[10px] text-gray-400">
                Workspace / Tasks
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-3xl">
              My tasks
            </h1>

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Keep track of your work and stay focused on what matters.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={openCreateModal}
              className="flex items-center gap-2 rounded-xl bg-[#635BFF] px-4 py-2.5 text-xs font-semibold text-white shadow-sm shadow-violet-500/20 transition hover:bg-[#5148e5]"
            >
              <Plus size={16} />
              New task
            </button>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.15fr_1fr]">
          <div className="relative overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-6 dark:border-gray-800 dark:bg-[#111827]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-400">
                  TASK INSIGHTS
                </p>

                <h2 className="mt-1 text-sm font-bold text-gray-800 dark:text-gray-200">
                  Your productivity at a glance
                </h2>
              </div>

              <div className="rounded-xl bg-[#635BFF]/10 p-2.5 text-[#635BFF]">
                <ListTodo size={19} />
              </div>
            </div>

            <div className="mt-7 flex flex-wrap items-end justify-between gap-5">
              <div>
                <p className="text-xs text-gray-400">Total tasks</p>

                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                    {String(stats.total).padStart(2, "0")}
                  </span>

                  <span className="text-xs text-gray-400">
                    across all projects
                  </span>
                </div>
              </div>

              <div className="text-right">
                <p className="text-xs text-gray-400">Completion rate</p>

                <p className="mt-1 text-2xl font-bold text-emerald-600">
                  {stats.total
                    ? Math.round((stats.completed / stats.total) * 100)
                    : 0}%
                </p>
              </div>
            </div>

            <div className="mt-5 h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                style={{
                  width: `${
                    stats.total
                      ? (stats.completed / stats.total) * 100
                      : 0
                  }%`,
                }}
              />
            </div>

            <div className="mt-2 flex justify-between text-[10px] text-gray-400">
              <span>Overall progress</span>
              <span>
                {stats.completed} of {stats.total} completed
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200/80 bg-white p-6 dark:border-gray-800 dark:bg-[#111827]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-400">
                  TASK BREAKDOWN
                </p>

                <h2 className="mt-1 text-sm font-bold text-gray-800 dark:text-gray-200">
                  Current status
                </h2>
              </div>

              <span className="text-[10px] text-gray-400">
                {stats.total} total
              </span>
            </div>

            <div className="mt-5 space-y-4">
              {[
                {
                  label: "In progress",
                  value: stats.inProgress,
                  color: "bg-[#635BFF]",
                  dot: "bg-[#635BFF]",
                },
                {
                  label: "Completed",
                  value: stats.completed,
                  color: "bg-emerald-500",
                  dot: "bg-emerald-500",
                },
                {
                  label: "Overdue",
                  value: stats.overdue,
                  color: "bg-rose-500",
                  dot: "bg-rose-500",
                },
              ].map((item) => (
                <div key={item.label}>
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${item.dot}`} />

                      <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                        {item.label}
                      </span>
                    </div>

                    <span className="text-xs font-bold tabular-nums text-gray-800 dark:text-gray-200">
                      {item.value}
                    </span>
                  </div>

                  <div className="h-1.5 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${item.color}`}
                      style={{
                        width: `${
                          stats.total
                            ? (item.value / stats.total) * 100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm dark:border-gray-800 dark:bg-[#111827]">
          <div className="flex flex-col gap-4 border-b border-gray-100 px-5 py-5 dark:border-gray-800 lg:flex-row lg:items-center lg:justify-between lg:px-6">
            <div>
              <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">
                Task overview
              </h2>

              <p className="mt-1 text-xs text-gray-400">
                Manage and organize all your tasks in one place.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative">
                <Search
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search tasks..."
                  className="h-10 w-full rounded-xl border border-gray-200 bg-gray-50 pl-9 pr-3 text-xs text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-[#635BFF] focus:bg-white dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 sm:w-52"
                />
              </div>

              <div className="relative">
                <SlidersHorizontal
                  size={14}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="h-10 w-full appearance-none rounded-xl border border-gray-200 bg-white pl-9 pr-8 text-xs text-gray-600 outline-none focus:border-[#635BFF] dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 sm:w-40"
                >
                  <option>All priorities</option>
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>

                <ChevronDown
                  size={13}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-1 overflow-x-auto border-b border-gray-100 px-5 pt-2 dark:border-gray-800 lg:px-6">
            {filters.map((filter) => {
              const active = activeFilter === filter.label;

              return (
                <button
                  key={filter.label}
                  onClick={() => setActiveFilter(filter.label)}
                  className={`relative flex shrink-0 items-center gap-2 px-3 py-3 text-xs font-semibold transition ${
                    active
                      ? "text-[#635BFF]"
                      : "text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  }`}
                >
                  {filter.label}

                  <span
                    className={`rounded-md px-1.5 py-0.5 text-[10px] ${
                      active
                        ? "bg-[#635BFF]/10 text-[#635BFF]"
                        : "bg-gray-100 text-gray-400 dark:bg-gray-800"
                    }`}
                  >
                    {filter.count}
                  </span>

                  {active && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-[#635BFF]" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] border-collapse text-left">
              <thead>
                <tr className="bg-gray-50/70 text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:bg-gray-800/40">
                  <th className="w-[36%] px-6 py-4">Task name</th>
                  <th className="px-4 py-4">Project</th>
                  <th className="px-4 py-4">Priority</th>
                  <th className="px-4 py-4">Due date</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="w-36 px-4 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filteredTasks.map((task) => (
                  <tr
                    key={task.id}
                    className="group transition hover:bg-gray-50/70 dark:hover:bg-gray-800/40"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => changeStatus(task)}
                          title="Change task status"
                          className="mt-0.5 shrink-0 text-gray-300 transition hover:text-[#635BFF]"
                        >
                          {task.status === "Completed" ? (
                            <CheckCircle2
                              size={18}
                              className="text-emerald-500"
                            />
                          ) : task.status === "In Progress" ? (
                            <CircleDot
                              size={18}
                              className="text-[#635BFF]"
                            />
                          ) : (
                            <Circle size={18} />
                          )}
                        </button>

                        <div className="min-w-0">
                          <p
                            className={`text-xs font-semibold ${
                              task.status === "Completed"
                                ? "text-gray-400 line-through"
                                : "text-gray-800 dark:text-gray-200"
                            }`}
                          >
                            {task.title}
                          </p>

                          {task.description && (
                            <p className="mt-1 max-w-[330px] truncate text-[11px] text-gray-400">
                              {task.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <FolderKanban
                          size={14}
                          className="shrink-0 text-gray-300"
                        />

                        <span className="max-w-[150px] truncate">
                          {task.project || "—"}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <PriorityBadge priority={task.priority} />
                    </td>

                    <td className="px-4 py-4">
                      <div
                        className={`flex items-center gap-2 text-xs ${
                          isOverdue(task)
                            ? "font-semibold text-rose-500"
                            : "text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        <CalendarDays size={14} className="text-gray-300" />
                        {formatDate(task.dueDate)}
                      </div>

                      {isOverdue(task) && (
                        <p className="ml-5 mt-1 text-[10px] text-rose-400">
                          Overdue
                        </p>
                      )}
                    </td>

                    <td className="px-4 py-4">
                      <StatusBadge status={task.status} />
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => openEditModal(task)}
                          title="Edit task"
                          aria-label={`Edit ${task.title}`}
                          className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-400 transition hover:bg-[#635BFF]/10 hover:text-[#635BFF] focus:outline-none focus:ring-2 focus:ring-[#635BFF]/20"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={() => changeStatus(task)}
                          title="Change status"
                          aria-label={`Change status of ${task.title}`}
                          className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-400 transition hover:bg-emerald-50 hover:text-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-400"
                        >
                          <RefreshCw size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={() => deleteTask(task.id)}
                          title="Delete task"
                          aria-label={`Delete ${task.title}`}
                          className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-400 transition hover:bg-rose-50 hover:text-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20 dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredTasks.length === 0 && (
              <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
                <div className="mb-4 rounded-2xl bg-gray-50 p-4 text-gray-300 dark:bg-gray-800 dark:text-gray-500">
                  <ListTodo size={27} />
                </div>

                <h3 className="text-sm font-bold text-gray-700 dark:text-gray-200">
                  No tasks found
                </h3>

                <p className="mt-1 max-w-xs text-xs leading-5 text-gray-400">
                  There are no tasks matching your current filters. Try
                  changing your search or create a new task.
                </p>

                <button
                  onClick={openCreateModal}
                  className="mt-5 flex items-center gap-2 rounded-xl bg-[#635BFF] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#5148e5]"
                >
                  <Plus size={14} />
                  Create a task
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2 border-t border-gray-100 px-6 py-4 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[11px] text-gray-400">
              Showing{" "}
              <span className="font-semibold text-gray-600 dark:text-gray-300">
                {filteredTasks.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-600 dark:text-gray-300">
                {tasks.length}
              </span>{" "}
              tasks
            </p>

            <div className="flex items-center gap-2 text-[11px] text-gray-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Your tasks are saved automatically
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-2xl border border-[#635BFF]/10 bg-gradient-to-r from-[#635BFF]/[0.06] to-indigo-50/40 p-5 dark:to-indigo-500/5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-white p-2.5 text-[#635BFF] shadow-sm dark:bg-gray-800">
              <CalendarCheck size={19} />
            </div>

            <div>
              <p className="text-xs font-bold text-gray-800 dark:text-gray-200">
                Stay on top of your schedule
              </p>

              <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">
                {stats.completed} tasks completed · {stats.inProgress} currently in progress · {stats.overdue} overdue
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveFilter("Today")}
            className="flex items-center gap-1.5 self-start text-xs font-semibold text-[#635BFF] transition hover:text-[#5148e5] sm:self-center"
          >
            View today's tasks
            <ArrowUpRight size={14} />
          </button>
        </div>

        {storageError && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-600 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400">
            Your browser could not save the tasks. Check that local storage is enabled.
          </div>
        )}
      </div>

      <TaskModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingTask(null);
        }}
        onSave={saveTask}
        task={editingTask}
        projects={projects}
      />

      {deletingTask && (
        <DeleteTaskModal
          task={deletingTask}
          onClose={() => setDeletingTask(null)}
          onConfirm={confirmDeleteTask}
        />
      )}
    </DashboardLayout>
  );
}
