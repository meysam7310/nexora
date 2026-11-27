"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Users,
  UserPlus,
  Search,
  LayoutGrid,
  List,
  Mail,
  MapPin,
  BriefcaseBusiness,
  Pencil,
  Trash2,
  X,
  Plus,
  ChevronDown,
  Building2,
  ShieldCheck,
  Activity,
  Filter,
  ArrowUpRight,
  UsersRound,
  CalendarDays,
  CheckCircle2,
  Coffee,
  Clock3,
} from "lucide-react";

const STORAGE_KEY = "nexora-team";

const initialMembers = [
  {
    id: 1,
    name: "Olivia Rhye",
    email: "olivia@nexora.com",
    role: "Product Designer",
    department: "Design",
    status: "Active",
    location: "New York, USA",
    skills: ["Figma", "UI Design", "Prototyping"],
    color: "bg-violet-100 text-violet-700",
    workload: 85,
  },
  {
    id: 2,
    name: "Phoenix Baker",
    email: "phoenix@nexora.com",
    role: "Frontend Developer",
    department: "Engineering",
    status: "Active",
    location: "London, UK",
    skills: ["React", "Next.js", "TypeScript"],
    color: "bg-blue-100 text-blue-700",
    workload: 72,
  },
  {
    id: 3,
    name: "Lana Steiner",
    email: "lana@nexora.com",
    role: "Project Manager",
    department: "Management",
    status: "Active",
    location: "Berlin, Germany",
    skills: ["Planning", "Agile", "Leadership"],
    color: "bg-emerald-100 text-emerald-700",
    workload: 90,
  },
  {
    id: 4,
    name: "Demi Wilkinson",
    email: "demi@nexora.com",
    role: "UX Researcher",
    department: "Design",
    status: "Away",
    location: "Toronto, Canada",
    skills: ["Research", "Testing", "UX"],
    color: "bg-amber-100 text-amber-700",
    workload: 48,
  },
  {
    id: 5,
    name: "Candice Wu",
    email: "candice@nexora.com",
    role: "Backend Developer",
    department: "Engineering",
    status: "Active",
    location: "Amsterdam, Netherlands",
    skills: ["Node.js", "API", "Database"],
    color: "bg-pink-100 text-pink-700",
    workload: 68,
  },
  {
    id: 6,
    name: "Natali Craig",
    email: "natali@nexora.com",
    role: "Marketing Specialist",
    department: "Marketing",
    status: "Offline",
    location: "Paris, France",
    skills: ["Marketing", "SEO", "Content"],
    color: "bg-orange-100 text-orange-700",
    workload: 35,
  },
  {
    id: 7,
    name: "Drew Cano",
    email: "drew@nexora.com",
    role: "UI Designer",
    department: "Design",
    status: "Active",
    location: "Madrid, Spain",
    skills: ["Figma", "Illustrator", "Design"],
    color: "bg-cyan-100 text-cyan-700",
    workload: 78,
  },
  {
    id: 8,
    name: "Orlando Diggs",
    email: "orlando@nexora.com",
    role: "QA Engineer",
    department: "Engineering",
    status: "Away",
    location: "Stockholm, Sweden",
    skills: ["Testing", "Automation", "QA"],
    color: "bg-indigo-100 text-indigo-700",
    workload: 55,
  },
];

const departments = [
  "Design",
  "Engineering",
  "Management",
  "Marketing",
  "Sales",
  "Operations",
];

const avatarColors = [
  "bg-violet-100 text-violet-700",
  "bg-blue-100 text-blue-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-pink-100 text-pink-700",
  "bg-orange-100 text-orange-700",
  "bg-cyan-100 text-cyan-700",
];

const emptyForm = {
  name: "",
  email: "",
  role: "",
  department: "Engineering",
  status: "Active",
  location: "",
  skills: "",
};

function getInitials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function Avatar({ member, size = "md" }) {
  const sizeClasses =
    size === "lg"
      ? "h-12 w-12 text-sm"
      : size === "sm"
        ? "h-9 w-9 text-xs"
        : "h-11 w-11 text-sm";

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-2xl font-semibold ${
        sizeClasses
      } ${member.color || "bg-violet-100 text-violet-700"}`}
    >
      {getInitials(member.name)}
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    Active:
      "bg-emerald-50 text-emerald-700 ring-emerald-600/10 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-400/20",
    Away:
      "bg-amber-50 text-amber-700 ring-amber-600/10 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-400/20",
    Offline:
      "bg-slate-100 text-slate-600 ring-slate-500/10 dark:bg-slate-800 dark:text-slate-400 dark:ring-slate-700",
  };

  const dotStyles = {
    Active: "bg-emerald-500",
    Away: "bg-amber-500",
    Offline: "bg-slate-400",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
        styles[status] || styles.Offline
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          dotStyles[status] || dotStyles.Offline
        }`}
      />
      {status}
    </span>
  );
}

function StatCard({ icon: Icon, label, value, detail, iconClass }) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {label}
          </p>
          <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {value}
          </p>
        </div>

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}
        >
          <Icon size={19} />
        </div>
      </div>

      <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
        {detail}
      </p>
    </div>
  );
}

function MemberModal({ member, onClose, onSave }) {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  useEffect(() => {
    if (member) {
      setForm({
        name: member.name || "",
        email: member.email || "",
        role: member.role || "",
        department: member.department || "Engineering",
        status: member.status || "Active",
        location: member.location || "",
        skills: (member.skills || []).join(", "),
      });
    } else {
      setForm(emptyForm);
    }

    setError("");
  }, [member]);

  function updateField(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.role.trim()) {
      setError("Please complete the name, email and role fields.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(form.email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    onSave({
      ...form,
      name: form.name.trim(),
      email: form.email.trim(),
      role: form.role.trim(),
      location: form.location.trim(),
      skills: form.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),
    });
  }

  const inputClass =
    "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#635BFF] focus:ring-4 focus:ring-[#635BFF]/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="my-auto w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {member ? "Edit team member" : "Add team member"}
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {member
                ? "Update this member's information."
                : "Add a new person to your workspace."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            <X size={19} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Full name *
              </span>
              <input
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="e.g. Alex Morgan"
                className={inputClass}
                autoFocus
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Email address *
              </span>
              <input
                type="email"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder="name@company.com"
                className={inputClass}
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Job title *
              </span>
              <input
                value={form.role}
                onChange={(e) => updateField("role", e.target.value)}
                placeholder="e.g. Product Designer"
                className={inputClass}
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Department
              </span>
              <select
                value={form.department}
                onChange={(e) => updateField("department", e.target.value)}
                className={inputClass}
              >
                {departments.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Status
              </span>
              <select
                value={form.status}
                onChange={(e) => updateField("status", e.target.value)}
                className={inputClass}
              >
                <option value="Active">Active</option>
                <option value="Away">Away</option>
                <option value="Offline">Offline</option>
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Location
              </span>
              <input
                value={form.location}
                onChange={(e) => updateField("location", e.target.value)}
                placeholder="e.g. London, UK"
                className={inputClass}
              />
            </label>
          </div>

          <label className="block">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Skills
            </span>
            <input
              value={form.skills}
              onChange={(e) => updateField("skills", e.target.value)}
              placeholder="React, UI Design, Figma"
              className={inputClass}
            />
            <span className="mt-1.5 block text-xs text-slate-400">
              Separate skills with commas.
            </span>
          </label>

          {error && (
            <p className="rounded-xl bg-rose-50 px-3.5 py-2.5 text-sm text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-5 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-[#635BFF] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#5148e5]"
            >
              <CheckCircle2 size={16} />
              {member ? "Save changes" : "Add member"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DeleteMemberModal({ member, onClose, onConfirm }) {
  if (!member) return null;

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-[420px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
              <Trash2 size={23} />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Delete team member?
              </h3>

              <p className="mt-1.5 text-sm leading-6 text-slate-500 dark:text-slate-400">
                Are you sure you want to remove this member from your team? This action cannot be undone.
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
              Member to be deleted
            </p>

            <p className="mt-1.5 truncate text-sm font-bold text-slate-800 dark:text-slate-200">
              {member.name}
            </p>

            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
              <span>{member.role}</span>
              <span className="text-slate-300 dark:text-slate-600">·</span>
              <span>{member.department}</span>
              <span className="text-slate-300 dark:text-slate-600">·</span>
              <span>{member.status}</span>
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
            Delete member
          </button>
        </div>
      </div>
    </div>
  );
}

function MemberCard({ member, onEdit, onDelete }) {
  return (
    <div className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-violet-500/30">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar member={member} size="lg" />
          <div className="min-w-0">
            <h3 className="truncate font-semibold text-slate-900 dark:text-white">
              {member.name}
            </h3>
            <p className="mt-0.5 truncate text-sm text-slate-500 dark:text-slate-400">
              {member.role}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <button
            onClick={() => onEdit(member)}
            title="Edit member"
            aria-label={`Edit ${member.name}`}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-[#635BFF]/20 hover:bg-[#635BFF]/10 hover:text-[#635BFF] dark:border-slate-700 dark:text-slate-400 dark:hover:border-[#635BFF]/30 dark:hover:bg-[#635BFF]/10 dark:hover:text-[#635BFF]"
          >
            <Pencil size={16} />
          </button>

          <button
            onClick={() => onDelete(member)}
            title="Delete member"
            aria-label={`Delete ${member.name}`}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 dark:border-slate-700 dark:text-slate-400 dark:hover:border-rose-500/30 dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="mt-4">
        <StatusBadge status={member.status} />
      </div>

      <div className="mt-4 space-y-2.5 border-t border-slate-100 pt-4 dark:border-slate-800">
        <div className="flex items-center gap-2.5 text-sm text-slate-500 dark:text-slate-400">
          <Mail size={15} className="shrink-0 text-slate-400" />
          <span className="truncate">{member.email}</span>
        </div>

        <div className="flex items-center gap-2.5 text-sm text-slate-500 dark:text-slate-400">
          <MapPin size={15} className="shrink-0 text-slate-400" />
          <span className="truncate">
            {member.location || "Location not set"}
          </span>
        </div>

        <div className="flex items-center gap-2.5 text-sm text-slate-500 dark:text-slate-400">
          <BriefcaseBusiness size={15} className="shrink-0 text-slate-400" />
          <span className="truncate">{member.department}</span>
        </div>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Workload
          </span>
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            {member.workload ?? 50}%
          </span>
        </div>

        <div className="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            className="h-full rounded-full bg-[#635BFF] transition-all"
            style={{ width: `${member.workload ?? 50}%` }}
          />
        </div>
      </div>

      {member.skills?.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {member.skills.slice(0, 3).map((skill) => (
            <span
              key={skill}
              className="rounded-lg bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400"
            >
              {skill}
            </span>
          ))}

          {member.skills.length > 3 && (
            <span className="rounded-lg bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              +{member.skills.length - 3}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function TeamRow({ member, onEdit, onDelete }) {
  return (
    <tr className="transition hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <Avatar member={member} size="sm" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
              {member.name}
            </p>
            <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
              {member.email}
            </p>
          </div>
        </div>
      </td>

      <td className="px-5 py-4">
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {member.role}
        </p>
        <p className="mt-0.5 text-xs text-slate-400">
          {member.department}
        </p>
      </td>

      <td className="px-5 py-4">
        <StatusBadge status={member.status} />
      </td>

      <td className="px-5 py-4">
        <span className="text-sm text-slate-500 dark:text-slate-400">
          {member.location || "—"}
        </span>
      </td>

      <td className="px-5 py-4">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className="h-full rounded-full bg-[#635BFF]"
              style={{ width: `${member.workload ?? 50}%` }}
            />
          </div>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {member.workload ?? 50}%
          </span>
        </div>
      </td>

      <td className="px-5 py-4 text-right">
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => onEdit(member)}
            aria-label={`Edit ${member.name}`}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-[#635BFF]/10 hover:text-[#635BFF] dark:hover:bg-[#635BFF]/10 dark:hover:text-[#635BFF]"
          >
            <Pencil size={16} />
          </button>

          <button
            onClick={() => onDelete(member)}
            aria-label={`Delete ${member.name}`}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function TeamPage() {
  const [members, setMembers] = useState(initialMembers);
  const [isLoaded, setIsLoaded] = useState(false);

  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All departments");
  const [statusFilter, setStatusFilter] = useState("All");
  const [view, setView] = useState("grid");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [deletingMember, setDeletingMember] = useState(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          setMembers(parsed);
        }
      }
    } catch (error) {
      console.error("Could not load team data:", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
    } catch (error) {
      console.error("Could not save team data:", error);
    }
  }, [members, isLoaded]);

  const activeCount = members.filter(
    (member) => member.status === "Active"
  ).length;

  const awayCount = members.filter(
    (member) => member.status === "Away"
  ).length;

  const offlineCount = members.filter(
    (member) => member.status === "Offline"
  ).length;

  const departmentCount = new Set(
    members.map((member) => member.department)
  ).size;

  const filteredMembers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return members.filter((member) => {
      const searchableText = [
        member.name,
        member.email,
        member.role,
        member.department,
        member.location,
        ...(member.skills || []),
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !normalizedSearch || searchableText.includes(normalizedSearch);

      const matchesDepartment =
        department === "All departments" || member.department === department;

      const matchesStatus =
        statusFilter === "All" || member.status === statusFilter;

      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }, [members, search, department, statusFilter]);

  function openAddModal() {
    setEditingMember(null);
    setModalOpen(true);
  }

  function openEditModal(member) {
    setEditingMember(member);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingMember(null);
  }

  function handleSaveMember(formData) {
    if (editingMember) {
      setMembers((current) =>
        current.map((member) =>
          member.id === editingMember.id
            ? { ...member, ...formData }
            : member
        )
      );
    } else {
      const newMember = {
        id: Date.now(),
        ...formData,
        color: avatarColors[members.length % avatarColors.length],
        workload: 50,
      };

      setMembers((current) => [newMember, ...current]);
    }

    closeModal();
  }

  function handleDeleteMember(member) {
    setDeletingMember(member);
  }

  function confirmDeleteMember() {
    if (!deletingMember) return;

    setMembers((current) =>
      current.filter((item) => item.id !== deletingMember.id)
    );

    setDeletingMember(null);
  }

  function resetFilters() {
    setSearch("");
    setDepartment("All departments");
    setStatusFilter("All");
  }

  return (
    <DashboardLayout>
      <div className="w-full min-w-0 space-y-7">
        <section className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-[2px] text-[#635BFF]">
                TEAM MANAGEMENT
              </span>

              <span className="h-1 w-1 rounded-full bg-gray-300" />

              <span className="text-[10px] text-gray-400">
                Workspace / Team
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-3xl">
              Team overview
            </h1>

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Manage your people, roles and team availability.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={openAddModal}
              className="flex items-center gap-2 rounded-xl bg-[#635BFF] px-4 py-2.5 text-xs font-semibold text-white shadow-sm shadow-violet-500/20 transition hover:bg-[#5148e5]"
            >
              <UserPlus size={16} />
              Add team member
            </button>
          </div>
        </section>

        <section className="relative isolate overflow-hidden rounded-3xl border border-violet-500/20 bg-gradient-to-br from-[#29245f] via-[#4337a8] to-[#635BFF] p-6 text-white shadow-lg shadow-violet-900/10 sm:p-8 lg:p-9">
          <div className="pointer-events-none absolute -right-24 -top-32 h-96 w-96 rounded-full border border-white/[0.08]" />
          <div className="pointer-events-none absolute -right-12 -top-20 h-72 w-72 rounded-full border border-white/[0.08]" />
          <div className="pointer-events-none absolute -bottom-40 left-1/4 h-80 w-80 rounded-full bg-indigo-400/20 blur-3xl" />

          <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div className="flex flex-col items-start">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 backdrop-blur-md">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-white/20">
                  <img src="/nexora.webp" className="w-4" alt="Nexora" />
                </div>
                <span className="mt-0.5 text-[10px] font-bold uppercase tracking-[1.5px] text-white">
                  Nexora workspace
                </span>
                <span className="ml-1 h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_8px_rgba(110,231,183,0.9)]" />
              </div>

              <h2 className="mt-6 max-w-xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
                Great people.
                <br />
                <span className="text-white/80">Extraordinary results.</span>
              </h2>

              <p className="mt-4 max-w-lg text-sm leading-7 text-white/80 sm:text-base">
                Bring your team together, manage responsibilities and keep
                everyone connected in one collaborative workspace.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <button
                  onClick={openAddModal}
                  className="group inline-flex items-center gap-2.5 rounded-xl bg-[#635BFF] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-950/10 hover:bg-[#635BFF]/90"
                >
                  <UserPlus size={17} />
                  Invite team member
                  <ArrowUpRight size={16} />
                </button>

                <div className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.06] px-4 py-3 text-sm text-white/90">
                  <Activity size={16} />
                  Team overview
                </div>
              </div>
            </div>

            <div className="relative rounded-2xl border border-white/20 bg-white/[0.10] p-5 shadow-xl shadow-indigo-950/10 backdrop-blur-xl sm:p-6">
              <div className="flex items-center justify-between gap-3 border-b border-white/15 pb-5">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/80">
                    Workspace overview
                  </p>
                  <p className="mt-1.5 text-sm text-white/90">
                    Your team at a glance
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/10">
                  <UsersRound size={19} className="text-white" />
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-white/80">
                    Total members
                  </p>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-4xl font-bold tracking-tight text-white">
                      {members.length.toString().padStart(2, "0")}
                    </span>
                    <span className="text-xs text-white/80">people</span>
                  </div>
                </div>

                <div className="border-l border-white/15 pl-5">
                  <p className="text-xs font-medium text-white/80">
                    Active members
                  </p>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-4xl font-bold tracking-tight text-white">
                      {activeCount.toString().padStart(2, "0")}
                    </span>
                    <span className="text-xs text-emerald-200">active</span>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <div className="mb-2.5 flex items-center justify-between">
                  <span className="text-xs font-medium text-white/90">
                    Team availability
                  </span>
                  <span className="text-xs font-semibold text-white">
                    {members.length
                      ? Math.round((activeCount / members.length) * 100)
                      : 0}
                    %
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-white/15">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-300 to-teal-200 transition-all duration-500"
                    style={{
                      width: `${
                        members.length
                          ? (activeCount / members.length) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-white/15 pt-5">
                <div>
                  <p className="text-xs font-medium text-white/90">
                    Meet your people
                  </p>
                  <div className="mt-3 flex -space-x-2.5">
                    {members.slice(0, 6).map((member) => (
                      <div
                        key={member.id}
                        title={member.name}
                        className={`flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#635BFF] text-[10px] font-bold ${member.color}`}
                      >
                        {getInitials(member.name)}
                      </div>
                    ))}

                    {members.length > 6 && (
                      <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#635BFF] bg-white/15 text-[10px] font-semibold text-white">
                        +{members.length - 6}
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-bold text-white">
                    {departmentCount}
                  </p>
                  <p className="mt-1 text-[11px] text-white/80">
                    Departments
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={Users}
            label="Total members"
            value={members.length}
            detail="People in your workspace"
            iconClass="bg-[#635BFF]/10 text-[#635BFF] dark:bg-[#635BFF]/10 dark:text-[#635BFF]"
          />

          <StatCard
            icon={CheckCircle2}
            label="Active members"
            value={activeCount}
            detail="Currently available"
            iconClass="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
          />

          <StatCard
            icon={Coffee}
            label="Away"
            value={awayCount}
            detail="Temporarily unavailable"
            iconClass="bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
          />

          <StatCard
            icon={Building2}
            label="Departments"
            value={departmentCount}
            detail="Across your organization"
            iconClass="bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
          />
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-4 border-b border-slate-100 p-5 dark:border-slate-800 sm:p-6">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    People directory
                  </h2>

                  <span className="rounded-lg bg-[#635BFF]/10 px-2 py-0.5 text-xs font-semibold text-[#635BFF] dark:bg-[#635BFF]/10 dark:text-[#635BFF]">
                    {filteredMembers.length}
                  </span>
                </div>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Everyone in your team, all in one place.
                </p>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-1 dark:border-slate-700 dark:bg-slate-800">
                  <button
                    onClick={() => setView("grid")}
                    aria-label="Grid view"
                    className={`rounded-lg p-2 transition ${
                      view === "grid"
                        ? "bg-white text-[#635BFF] shadow-sm dark:bg-slate-700 dark:text-[#635BFF]"
                        : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                    }`}
                  >
                    <LayoutGrid size={17} />
                  </button>

                  <button
                    onClick={() => setView("list")}
                    aria-label="List view"
                    className={`rounded-lg p-2 transition ${
                      view === "list"
                        ? "bg-white text-[#635BFF] shadow-sm dark:bg-slate-700 dark:text-[#635BFF]"
                        : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                    }`}
                  >
                    <List size={17} />
                  </button>
                </div>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-[minmax(220px,1fr)_210px_160px]">
              <div className="relative">
                <Search
                  size={17}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search name, role, email..."
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#635BFF] focus:ring-4 focus:ring-[#635BFF]/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
              </div>

              <div className="relative">
                <Filter
                  size={15}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-9 text-sm text-slate-700 outline-none transition focus:border-[#635BFF] focus:ring-4 focus:ring-[#635BFF]/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300"
                >
                  <option value="All departments">All departments</option>
                  {departments.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>

                <ChevronDown
                  size={15}
                  className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>

              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 pr-9 text-sm text-slate-700 outline-none transition focus:border-[#635BFF] focus:ring-4 focus:ring-[#635BFF]/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300"
                >
                  <option value="All">All statuses</option>
                  <option value="Active">Active</option>
                  <option value="Away">Away</option>
                  <option value="Offline">Offline</option>
                </select>

                <ChevronDown
                  size={15}
                  className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-6">
            {!isLoaded ? (
              <div className="flex min-h-52 items-center justify-center">
                <div className="h-7 w-7 animate-spin rounded-full border-2 border-[#635BFF]/20 border-t-[#635BFF]" />
              </div>
            ) : filteredMembers.length === 0 ? (
              <div className="flex min-h-64 flex-col items-center justify-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#635BFF]/10 text-[#635BFF] dark:bg-[#635BFF]/10 dark:text-[#635BFF]">
                  <UsersRound size={25} />
                </div>

                <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">
                  No team members found
                </h3>

                <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
                  Try changing your search or filters to find the person
                  you&apos;re looking for.
                </p>

                <button
                  onClick={resetFilters}
                  className="mt-4 text-sm font-semibold text-[#635BFF] hover:text-[#5148e5]"
                >
                  Clear filters
                </button>
              </div>
            ) : view === "grid" ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filteredMembers.map((member) => (
                  <MemberCard
                    key={member.id}
                    member={member}
                    onEdit={openEditModal}
                    onDelete={handleDeleteMember}
                  />
                ))}
              </div>
            ) : (
              <div className="-mx-5 overflow-x-auto sm:-mx-6">
                <table className="w-full min-w-[850px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-800/40">
                      <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Member
                      </th>
                      <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Role / Department
                      </th>
                      <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Status
                      </th>
                      <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Location
                      </th>
                      <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Workload
                      </th>
                      <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredMembers.map((member) => (
                      <TeamRow
                        key={member.id}
                        member={member}
                        onEdit={openEditModal}
                        onDelete={handleDeleteMember}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {filteredMembers.length > 0 && (
            <div className="flex flex-col justify-between gap-2 border-t border-slate-100 px-5 py-4 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400 sm:flex-row sm:items-center sm:px-6">
              <span>
                Showing{" "}
                <strong className="font-semibold text-slate-700 dark:text-slate-200">
                  {filteredMembers.length}
                </strong>{" "}
                of{" "}
                <strong className="font-semibold text-slate-700 dark:text-slate-200">
                  {members.length}
                </strong>{" "}
                team members
              </span>

              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-emerald-500" />
                Workspace directory
              </span>
            </div>
          )}
        </section>

        <section className="grid gap-5 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold text-slate-900 dark:text-white">
                  Department overview
                </h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  How your team is distributed.
                </p>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#635BFF]/10 text-[#635BFF] dark:bg-[#635BFF]/10 dark:text-[#635BFF]">
                <Building2 size={18} />
              </div>
            </div>

            <div className="mt-6 space-y-5">
              {departments.map((name, index) => {
                const count = members.filter(
                  (member) => member.department === name
                ).length;

                const percentage =
                  members.length > 0 ? (count / members.length) * 100 : 0;

                const barColors = [
                  "bg-[#635BFF]",
                  "bg-blue-500",
                  "bg-emerald-500",
                  "bg-amber-500",
                  "bg-pink-500",
                  "bg-cyan-500",
                ];

                return (
                  <div key={name}>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {name}
                      </span>

                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        {count} {count === 1 ? "member" : "members"}
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${barColors[index]}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
            <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-violet-100/70 blur-2xl dark:bg-violet-500/10" />

            <div className="relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#635BFF]/10 text-[#635BFF] dark:bg-[#635BFF]/10 dark:text-[#635BFF]">
                <CalendarDays size={19} />
              </div>

              <h2 className="mt-5 text-lg font-bold text-slate-900 dark:text-white">
                Team availability
              </h2>

              <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                Get a quick view of who&apos;s available and who&apos;s
                currently away.
              </p>

              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between rounded-xl bg-emerald-50/80 px-4 py-3 dark:bg-emerald-500/10">
                  <div className="flex items-center gap-2.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="text-sm font-medium text-emerald-800 dark:text-emerald-400">
                      Active now
                    </span>
                  </div>
                  <span className="text-sm font-bold text-emerald-800 dark:text-emerald-400">
                    {activeCount}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-amber-50/80 px-4 py-3 dark:bg-amber-500/10">
                  <div className="flex items-center gap-2.5">
                    <span className="h-2 w-2 rounded-full bg-amber-500" />
                    <span className="text-sm font-medium text-amber-800 dark:text-amber-400">
                      Away
                    </span>
                  </div>
                  <span className="text-sm font-bold text-amber-800 dark:text-amber-400">
                    {awayCount}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-slate-100 px-4 py-3 dark:bg-slate-800">
                  <div className="flex items-center gap-2.5">
                    <span className="h-2 w-2 rounded-full bg-slate-400" />
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                      Offline
                    </span>
                  </div>
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                    {offlineCount}
                  </span>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-4 text-xs text-slate-400 dark:border-slate-800">
                <Clock3 size={14} />
                Based on member status
              </div>
            </div>
          </div>
        </section>
      </div>

      {modalOpen && (
        <MemberModal
          member={editingMember}
          onClose={closeModal}
          onSave={handleSaveMember}
        />
      )}

      {deletingMember && (
        <DeleteMemberModal
          member={deletingMember}
          onClose={() => setDeletingMember(null)}
          onConfirm={confirmDeleteMember}
        />
      )}
    </DashboardLayout>
  );
}
