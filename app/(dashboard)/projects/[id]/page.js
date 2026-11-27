"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";

import {
  Activity,
  ArrowLeft,
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  Code2,
  FileText,
  Flag,
  ListTodo,
  Plus,
  Trash2,
  Users,
  X,
} from "lucide-react";

// Constants

const taskTemplates = [
  {
    title: "Project requirements and planning",
    description: "Define the scope and project requirements.",
    priority: "High",
    assignee: "MB",
  },
  {
    title: "Research and initial concepts",
    description: "Prepare research and explore possible approaches.",
    priority: "Medium",
    assignee: "JD",
  },
  {
    title: "Design and development",
    description: "Build the primary project components.",
    priority: "High",
    assignee: "MB",
  },
  {
    title: "Review and quality assurance",
    description: "Review the result and fix potential issues.",
    priority: "Medium",
    assignee: "AK",
  },
  {
    title: "Final delivery",
    description: "Prepare the final deliverables.",
    priority: "Low",
    assignee: "MB",
  },
];

const statusStyles = {
  "In Progress":
    "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
  Completed:
    "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
  Planning:
    "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400",
  "On Hold":
    "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
};

const priorityStyles = {
  High: "text-rose-500",
  Medium: "text-amber-500",
  Low: "text-gray-400",
};

const inputClass =
  "h-10 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#635BFF] focus:bg-white dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-[#635BFF] dark:focus:bg-gray-800";

// Helpers

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount || 0);

const formatDate = (date) => {
  if (!date) return "Not specified";
  const parsedDate = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsedDate.getTime())) return date;
  return parsedDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const getDaysRemaining = (date) => {
  if (!date) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const deadline = new Date(`${date}T00:00:00`);
  if (Number.isNaN(deadline.getTime())) return null;
  return Math.ceil((deadline.getTime() - today.getTime()) / 86400000);
};

const createDefaultTasks = (project) => {
  const completedCount = Math.round(
    ((project.progress || 0) / 100) * taskTemplates.length
  );
  return taskTemplates.map((task, index) => ({
    id: `${project.id}-${index + 1}`,
    ...task,
    completed: index < completedCount,
  }));
};

const formatActivityDate = (date) => {
  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return "Unknown date";
  return parsedDate.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

// Main Component

function ProjectDetailsContent() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [activities, setActivities] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const [newTask, setNewTask] = useState("");
  const [taskFilter, setTaskFilter] = useState("All");
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskPriority, setTaskPriority] = useState("Medium");

  // Load project, tasks, and activity

  useEffect(() => {
    if (!id) return;

    try {
      const storedProjects = localStorage.getItem("nexora-projects");
      const parsedProjects = storedProjects ? JSON.parse(storedProjects) : [];

      const foundProject = Array.isArray(parsedProjects)
        ? parsedProjects.find((item) => String(item.id) === String(id))
        : null;

      if (!foundProject) {
        setProject(null);
        setIsLoaded(true);
        return;
      }

      setProject(foundProject);

      const savedTasks = localStorage.getItem(`nexora-project-tasks-${id}`);

      if (savedTasks) {
        const parsedTasks = JSON.parse(savedTasks);
        setTasks(
          Array.isArray(parsedTasks)
            ? parsedTasks
            : createDefaultTasks(foundProject)
        );
      } else {
        setTasks(createDefaultTasks(foundProject));
      }

      const savedActivities = localStorage.getItem(
        `nexora-project-activity-${id}`
      );

      if (savedActivities) {
        const parsedActivities = JSON.parse(savedActivities);
        setActivities(Array.isArray(parsedActivities) ? parsedActivities : []);
      } else {
        setActivities([]);
      }
    } catch (error) {
      console.error("Could not load project data:", error);
      setProject(null);
      setTasks([]);
      setActivities([]);
    }

    setIsLoaded(true);
  }, [id]);

  // Task statistics

  const completedTasks = tasks.filter((task) => task.completed).length;
  const pendingTasks = tasks.length - completedTasks;
  const taskProgress =
    tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  // Activity logger

  const addActivity = (title, detail) => {
    const newActivity = {
      id: `activity-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      title,
      detail,
      createdAt: new Date().toISOString(),
    };

    const updatedActivities = [newActivity, ...activities].slice(0, 25);

    setActivities(updatedActivities);

    try {
      localStorage.setItem(
        `nexora-project-activity-${id}`,
        JSON.stringify(updatedActivities)
      );
    } catch (error) {
      console.error("Could not save activity:", error);
    }
  };

  // Update tasks and project progress

  const updateTasks = (nextTasks) => {
    const nextProgress =
      nextTasks.length > 0
        ? Math.round(
            (nextTasks.filter((task) => task.completed).length /
              nextTasks.length) *
              100
          )
        : 0;

    let nextStatus = project.status;

    if (nextProgress === 100 && nextTasks.length > 0) {
      nextStatus = "Completed";
    } else if (project.status === "Completed") {
      nextStatus = "In Progress";
    }

    const updatedProject = {
      ...project,
      progress: nextProgress,
      status: nextStatus,
    };

    setTasks(nextTasks);
    setProject(updatedProject);

    try {
      localStorage.setItem(
        `nexora-project-tasks-${id}`,
        JSON.stringify(nextTasks)
      );

      const storedProjects = JSON.parse(
        localStorage.getItem("nexora-projects") || "[]"
      );

      const updatedProjects = storedProjects.map((item) =>
        String(item.id) === String(id) ? updatedProject : item
      );

      localStorage.setItem(
        "nexora-projects",
        JSON.stringify(updatedProjects)
      );
    } catch (error) {
      console.error("Could not update project:", error);
    }
  };

  // Toggle task

  const toggleTask = (taskId) => {
    const selectedTask = tasks.find((task) => task.id === taskId);
    if (!selectedTask) return;

    const nextTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );

    updateTasks(nextTasks);

    addActivity(
      selectedTask.completed ? "Task reopened" : "Task completed",
      selectedTask.title
    );
  };

  // Add task

  const handleAddTask = (event) => {
    event.preventDefault();

    const title = newTask.trim();
    if (!title) return;

    const task = {
      id: `task-${Date.now()}`,
      title,
      description: "New project task",
      priority: taskPriority,
      assignee: "MB",
      completed: false,
    };

    updateTasks([...tasks, task]);

    addActivity("Task created", title);

    setNewTask("");
    setTaskPriority("Medium");
    setShowTaskForm(false);
  };

  // Delete task

  const deleteTask = (taskId) => {
    const selectedTask = tasks.find((task) => task.id === taskId);
    if (!selectedTask) return;

    updateTasks(tasks.filter((task) => task.id !== taskId));

    addActivity("Task deleted", selectedTask.title);
  };

  // Filter tasks

  const filteredTasks = useMemo(() => {
    if (taskFilter === "Completed") {
      return tasks.filter((task) => task.completed);
    }
    if (taskFilter === "Pending") {
      return tasks.filter((task) => !task.completed);
    }
    return tasks;
  }, [tasks, taskFilter]);

  // Loading

  if (!isLoaded) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[450px] items-center justify-center">
          <div className="h-9 w-9 animate-spin rounded-full border-4 border-violet-500 border-t-transparent" />
        </div>
      </DashboardLayout>
    );
  }

  // Not found

  if (!project) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[450px] flex-col items-center justify-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-gray-400 dark:bg-gray-800">
            <FileText size={28} />
          </div>

          <h2 className="mt-4 text-lg font-bold text-gray-900 dark:text-white">
            Project not found
          </h2>

          <p className="mt-2 text-xs text-gray-400">
            This project may have been deleted or does not exist.
          </p>

          <button
            type="button"
            onClick={() => router.push("/projects")}
            className="mt-5 flex items-center gap-2 rounded-xl bg-[#635BFF] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#5148e5]"
          >
            <ArrowLeft size={14} />
            Back to Projects
          </button>
        </div>
      </DashboardLayout>
    );
  }

  // Metrics

  const daysRemaining = getDaysRemaining(project.deadline);

  const budgetUsage =
    project.budget > 0
      ? Math.min(100, Math.round((project.spent / project.budget) * 100))
      : 0;

  const remainingBudget = Math.max(0, project.budget - project.spent);

  const projectStatus =
    project.progress === 100 ? "Completed" : project.status;

  // Render

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Navigation */}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => router.push("/projects")}
            className="flex items-center gap-2 text-xs font-medium text-gray-500 transition hover:text-[#635BFF] dark:text-gray-400"
          >
            <ArrowLeft size={15} />
            Back to Projects
          </button>

          <div className="flex items-center gap-2 text-[10px] text-gray-400">
            <span>Workspace</span>
            <span>/</span>
            <span>Projects</span>
            <span>/</span>
            <span className="font-medium text-[#635BFF]">{project.name}</span>
          </div>
        </div>

        {/* Project Header */}

        <section className="relative overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-5 dark:border-gray-800 dark:bg-[#111827] sm:p-7">
          <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-violet-100/70 blur-3xl dark:bg-violet-500/10" />

          <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400">
                <Code2 size={25} strokeWidth={1.6} />
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-[1.5px] text-violet-600 dark:text-violet-400">
                    PROJECT DETAILS
                  </span>

                  <span className="h-1 w-1 rounded-full bg-gray-300" />

                  <span
                    className={`rounded-full px-2.5 py-1 text-[9px] font-semibold ${
                      statusStyles[projectStatus] || statusStyles.Planning
                    }`}
                  >
                    {projectStatus}
                  </span>
                </div>

                <h1 className="mt-3 break-words text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
                  {project.name}
                </h1>

                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  {project.description || "No project description available."}
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-4">
                  <span className="flex items-center gap-1.5 text-[10px] text-gray-500 dark:text-gray-400">
                    <Building2 size={13} />
                    {project.client}
                  </span>

                  <span className="flex items-center gap-1.5 text-[10px] text-gray-500 dark:text-gray-400">
                    <CalendarDays size={13} />
                    Created {project.createdAt}
                  </span>

                  <span className="flex items-center gap-1.5 text-[10px] text-gray-500 dark:text-gray-400">
                    <Flag size={13} />
                    {project.priority} priority
                  </span>
                </div>
              </div>
            </div>

            {/* Progress ring */}

            <div className="flex shrink-0 items-center gap-4 rounded-2xl bg-gray-50 p-4 dark:bg-gray-800/60">
              <div className="relative flex h-20 w-20 items-center justify-center">
                <svg viewBox="0 0 100 100" className="h-20 w-20 -rotate-90">
                  <circle
                    cx="50"
                    cy="50"
                    r="39"
                    fill="none"
                    stroke="currentColor"
                    className="text-gray-200 dark:text-gray-700"
                    strokeWidth="8"
                  />

                  <circle
                    cx="50"
                    cy="50"
                    r="39"
                    fill="none"
                    stroke="#635BFF"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${
                      (2 * Math.PI * 39 * project.progress) / 100
                    } ${2 * Math.PI * 39}`}
                  />
                </svg>

                <span className="absolute text-lg font-bold text-gray-900 dark:text-white">
                  {project.progress}%
                </span>
              </div>

              <div>
                <p className="text-[10px] text-gray-400">Overall progress</p>

                <p className="mt-1 text-sm font-bold text-gray-900 dark:text-white">
                  {project.progress === 100
                    ? "Project completed"
                    : "Project underway"}
                </p>

                <p className="mt-1 text-[10px] text-gray-400">
                  Based on project tasks
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Quick metrics */}

        <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          <div className="rounded-2xl border border-gray-200/80 bg-white p-4 dark:border-gray-800 dark:bg-[#111827]">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400">
                Total Tasks
              </p>
              <ListTodo size={16} className="text-violet-500" />
            </div>

            <h3 className="mt-3 text-2xl font-bold text-gray-900 dark:text-white">
              {tasks.length}
            </h3>

            <p className="mt-1 text-[10px] text-gray-400">
              Tasks in this project
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200/80 bg-white p-4 dark:border-gray-800 dark:bg-[#111827]">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400">
                Completed Tasks
              </p>
              <CheckCircle2 size={16} className="text-emerald-500" />
            </div>

            <h3 className="mt-3 text-2xl font-bold text-gray-900 dark:text-white">
              {completedTasks}
            </h3>

            <p className="mt-1 text-[10px] text-gray-400">
              Successfully completed
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200/80 bg-white p-4 dark:border-gray-800 dark:bg-[#111827]">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400">
                Remaining Tasks
              </p>
              <Clock3 size={16} className="text-amber-500" />
            </div>

            <h3 className="mt-3 text-2xl font-bold text-gray-900 dark:text-white">
              {pendingTasks}
            </h3>

            <p className="mt-1 text-[10px] text-gray-400">
              Still need attention
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200/80 bg-white p-4 dark:border-gray-800 dark:bg-[#111827]">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400">
                Budget Remaining
              </p>
              <CircleDollarSign size={16} className="text-blue-500" />
            </div>

            <h3 className="mt-3 text-xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(remainingBudget)}
            </h3>

            <p className="mt-1 text-[10px] text-gray-400">
              Of {formatCurrency(project.budget)}
            </p>
          </div>
        </section>

        {/* Main layout */}

        <section className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
          {/* Task management */}

          <div className="space-y-4">
            <div className="rounded-2xl border border-gray-200/80 bg-white p-5 dark:border-gray-800 dark:bg-[#111827]">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-base font-bold text-gray-900 dark:text-white">
                    Task management
                  </h2>

                  <p className="mt-1 text-[10px] text-gray-400">
                    Organize and track your project work.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowTaskForm(!showTaskForm)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#635BFF] px-3.5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#5148e5]"
                >
                  {showTaskForm ? <X size={14} /> : <Plus size={14} />}
                  {showTaskForm ? "Cancel" : "Add Task"}
                </button>
              </div>

              {/* Add task form */}

              {showTaskForm && (
                <form
                  onSubmit={handleAddTask}
                  className="mt-5 rounded-xl border border-violet-100 bg-violet-50/50 p-4 dark:border-violet-500/15 dark:bg-violet-500/5"
                >
                  <label className="mb-2 block text-xs font-semibold text-gray-700 dark:text-gray-200">
                    New task name
                  </label>

                  <input
                    autoFocus
                    value={newTask}
                    onChange={(event) => setNewTask(event.target.value)}
                    placeholder="e.g. Prepare project presentation"
                    className={inputClass}
                  />

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-gray-400">
                        Priority
                      </span>

                      <select
                        value={taskPriority}
                        onChange={(event) => setTaskPriority(event.target.value)}
                        className="h-8 rounded-lg border border-gray-200 bg-white px-2 text-xs text-gray-700 outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                      >
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      disabled={!newTask.trim()}
                      className="rounded-lg bg-[#635BFF] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#5148e5] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Create Task
                    </button>
                  </div>
                </form>
              )}

              {/* Task filters */}

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-3 dark:border-gray-800">
                <div className="flex items-center gap-1">
                  {["All", "Pending", "Completed"].map((filter) => (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => setTaskFilter(filter)}
                      className={`rounded-lg px-3 py-1.5 text-[10px] font-medium transition ${
                        taskFilter === filter
                          ? "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400"
                          : "text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>

                <span className="text-[10px] text-gray-400">
                  {filteredTasks.length} tasks
                </span>
              </div>

              {/* Task list */}

              <div className="mt-2 divide-y divide-gray-100 dark:divide-gray-800">
                {filteredTasks.length > 0 ? (
                  filteredTasks.map((task) => (
                    <div
                      key={task.id}
                      className="group flex items-start gap-3 py-4"
                    >
                      <button
                        type="button"
                        onClick={() => toggleTask(task.id)}
                        aria-label={
                          task.completed
                            ? "Mark as incomplete"
                            : "Mark as completed"
                        }
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${
                          task.completed
                            ? "border-emerald-500 bg-emerald-500 text-white"
                            : "border-gray-300 text-transparent hover:border-violet-500 dark:border-gray-600"
                        }`}
                      >
                        {task.completed && <Check size={12} strokeWidth={3} />}
                      </button>

                      <div className="min-w-0 flex-1">
                        <p
                          className={`text-xs font-semibold ${
                            task.completed
                              ? "text-gray-400 line-through dark:text-gray-500"
                              : "text-gray-800 dark:text-gray-200"
                          }`}
                        >
                          {task.title}
                        </p>

                        <p className="mt-1 text-[10px] text-gray-400">
                          {task.description}
                        </p>

                        <div className="mt-2 flex flex-wrap items-center gap-3">
                          <span
                            className={`flex items-center gap-1 text-[9px] font-semibold ${
                              priorityStyles[task.priority] ||
                              priorityStyles.Medium
                            }`}
                          >
                            <Flag size={10} />
                            {task.priority}
                          </span>

                          <span className="flex items-center gap-1 text-[9px] text-gray-400">
                            <Users size={10} />
                            {task.assignee}
                          </span>

                          <span
                            className={`rounded-full px-2 py-0.5 text-[9px] font-medium ${
                              task.completed
                                ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                                : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                            }`}
                          >
                            {task.completed ? "Completed" : "Pending"}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => deleteTask(task.id)}
                        aria-label="Delete task"
                        className="rounded-lg p-2 text-gray-300 transition hover:bg-rose-50 hover:text-rose-500 group-hover:opacity-100 dark:hover:bg-rose-500/10"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="py-12 text-center">
                    <ListTodo
                      size={24}
                      className="mx-auto text-gray-300 dark:text-gray-600"
                    />

                    <p className="mt-3 text-xs font-semibold text-gray-600 dark:text-gray-300">
                      No tasks in this view
                    </p>

                    <p className="mt-1 text-[10px] text-gray-400">
                      Add a task or change the filter.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Task progress */}

            <div className="rounded-2xl border border-gray-200/80 bg-white p-5 dark:border-gray-800 dark:bg-[#111827]">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                    Task completion
                  </h3>

                  <p className="mt-1 text-[10px] text-gray-400">
                    Completion rate based on your task list
                  </p>
                </div>

                <span className="text-xl font-bold text-violet-600 dark:text-violet-400">
                  {taskProgress}%
                </span>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-500"
                  style={{ width: `${taskProgress}%` }}
                />
              </div>

              <div className="mt-3 flex justify-between text-[10px] text-gray-400">
                <span>{completedTasks} completed</span>
                <span>{pendingTasks} remaining</span>
              </div>
            </div>
          </div>

          {/* Sidebar */}

          <aside className="space-y-4">
            {/* Project information */}

            <div className="rounded-2xl border border-gray-200/80 bg-white p-5 dark:border-gray-800 dark:bg-[#111827]">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                  Project information
                </h3>

                <FileText size={16} className="text-violet-500" />
              </div>

              <div className="mt-5 space-y-4">
                <div>
                  <p className="text-[10px] text-gray-400">Client</p>
                  <p className="mt-1 text-xs font-semibold text-gray-800 dark:text-gray-200">
                    {project.client}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] text-gray-400">Category</p>
                  <p className="mt-1 text-xs font-semibold text-gray-800 dark:text-gray-200">
                    {project.category}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] text-gray-400">Priority</p>
                  <p
                    className={`mt-1 text-xs font-semibold ${
                      priorityStyles[project.priority] || priorityStyles.Medium
                    }`}
                  >
                    {project.priority}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] text-gray-400">Start date</p>
                  <p className="mt-1 text-xs font-semibold text-gray-800 dark:text-gray-200">
                    {project.createdAt}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] text-gray-400">Deadline</p>
                  <p className="mt-1 text-xs font-semibold text-gray-800 dark:text-gray-200">
                    {formatDate(project.deadline)}
                  </p>
                </div>
              </div>

              {daysRemaining !== null && (
                <div
                  className={`mt-5 flex items-center gap-2 rounded-xl p-3 ${
                    daysRemaining < 0
                      ? "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400"
                      : daysRemaining <= 7
                        ? "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
                        : "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
                  }`}
                >
                  <Clock3 size={15} />

                  <p className="text-[10px] font-semibold">
                    {daysRemaining < 0
                      ? `${Math.abs(daysRemaining)} days overdue`
                      : daysRemaining === 0
                        ? "Due today"
                        : `${daysRemaining} days remaining`}
                  </p>
                </div>
              )}
            </div>

            {/* Budget tracking */}

            <div className="rounded-2xl border border-gray-200/80 bg-white p-5 dark:border-gray-800 dark:bg-[#111827]">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                  Budget tracking
                </h3>

                <CircleDollarSign size={17} className="text-amber-500" />
              </div>

              <div className="mt-5">
                <p className="text-[10px] text-gray-400">
                  Total allocated budget
                </p>

                <h2 className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(project.budget)}
                </h2>
              </div>

              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500 dark:text-gray-400">
                    Amount spent
                  </span>

                  <span className="font-bold text-gray-800 dark:text-gray-200">
                    {formatCurrency(project.spent)}
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500"
                    style={{ width: `${budgetUsage}%` }}
                  />
                </div>

                <div className="flex justify-between text-[10px]">
                  <span className="text-gray-400">
                    {budgetUsage}% utilized
                  </span>

                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(remainingBudget)} left
                  </span>
                </div>
              </div>
            </div>

            {/* Team */}

            <div className="rounded-2xl border border-gray-200/80 bg-white p-5 dark:border-gray-800 dark:bg-[#111827]">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                  Project team
                </h3>

                <Users size={16} className="text-violet-500" />
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {(project.team || []).map((member, index) => (
                  <div
                    key={`${member}-${index}`}
                    className="flex items-center gap-2 rounded-xl bg-gray-50 px-2.5 py-2 dark:bg-gray-800"
                  >
                    <div
                      className={`flex h-7 w-7 items-center justify-center rounded-lg text-[9px] font-bold ${
                        [
                          "bg-violet-100 text-violet-600",
                          "bg-blue-100 text-blue-600",
                          "bg-pink-100 text-pink-600",
                          "bg-emerald-100 text-emerald-600",
                        ][index % 4]
                      }`}
                    >
                      {member}
                    </div>

                    <span className="text-[10px] font-medium text-gray-600 dark:text-gray-300">
                      {member}
                    </span>
                  </div>
                ))}
              </div>

              <p className="mt-4 text-[10px] leading-5 text-gray-400">
                Team member assignment is currently demo data.
              </p>
            </div>

            {/* Activity timeline */}

            <div className="rounded-2xl border border-gray-200/80 bg-white p-5 dark:border-gray-800 dark:bg-[#111827]">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                    Activity timeline
                  </h3>

                  <p className="mt-1 text-[10px] text-gray-400">
                    Recent project activity
                  </p>
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400">
                  <Activity size={16} />
                </div>
              </div>

              <div className="mt-5 space-y-5">
                {activities.length > 0 ? (
                  activities.map((item, index) => (
                    <div key={item.id} className="relative flex gap-3">
                      {index !== activities.length - 1 && (
                        <div className="absolute left-[13px] top-7 h-full w-px bg-gray-100 dark:bg-gray-800" />
                      )}

                      <div className="relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400">
                        <Activity size={13} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                          {item.title}
                        </p>

                        <p className="mt-1 break-words text-[10px] leading-5 text-gray-500 dark:text-gray-400">
                          {item.detail}
                        </p>

                        <p className="mt-1 text-[9px] text-gray-400">
                          {formatActivityDate(item.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-7 text-center">
                    <Clock3
                      size={23}
                      className="mx-auto text-gray-300 dark:text-gray-600"
                    />

                    <p className="mt-3 text-xs font-semibold text-gray-600 dark:text-gray-300">
                      No activity yet
                    </p>

                    <p className="mt-1 text-[10px] text-gray-400">
                      Your project updates will appear here.
                    </p>
                  </div>
                )}
              </div>

              {activities.length > 0 && (
                <div className="mt-4 border-t border-gray-100 pt-3 dark:border-gray-800">
                  <p className="text-[9px] text-gray-400">
                    Showing the latest {activities.length} activities
                  </p>
                </div>
              )}
            </div>

            {/* Project insight */}

            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 p-5 text-white">
              <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full border border-white/10" />

              <div className="relative">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
                  <img src="/nexora.webp" className="w-6" alt="Nexora" />
                </div>

                <h3 className="mt-4 text-sm font-bold">Keep your momentum</h3>

                <p className="mt-2 text-[10px] leading-5 text-white/65">
                  {pendingTasks > 0
                    ? `${pendingTasks} tasks are still waiting for completion. Keep moving toward your next milestone.`
                    : "All tasks are completed. Your project has reached its current milestone."}
                </p>

                <div className="mt-4 flex items-center gap-2 text-[10px] font-semibold text-white/90">
                  <CheckCircle2 size={13} />
                  {taskProgress}% task completion
                </div>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </DashboardLayout>
  );
}

export default function ProjectDetailsPage() {
  return (
    <Suspense
      fallback={
        <DashboardLayout>
          <div className="flex min-h-[450px] items-center justify-center">
            <div className="h-9 w-9 animate-spin rounded-full border-4 border-violet-500 border-t-transparent" />
          </div>
        </DashboardLayout>
      }
    >
      <ProjectDetailsContent />
    </Suspense>
  );
}