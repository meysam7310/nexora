
"use client";

import { useState } from "react";
import Link from "next/link";

import {
  ArrowUpRight,
  CalendarDays,
  Eye,
  X,
  FolderKanban,
  UserRound,
  Clock3,
} from "lucide-react";

import type { Project, ProjectStatus } from "@/types/dashboard";
import { projects } from "@/data/dashboard";

const statusStyles: Record<ProjectStatus, string> = {
  "In Progress":
    "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
  Completed:
    "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
  "On Hold":
    "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400",
  Review:
    "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400",
};

function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}

function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="flex min-w-[110px] items-center gap-3">
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
        <div
          className="h-full rounded-full bg-[#635BFF] transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
        {progress}%
      </span>
    </div>
  );
}

export default function ProjectsTable() {
  const [selectedProject, setSelectedProject] =
    useState<Project | null>(null);

  const closePreview = () => setSelectedProject(null);

  return (
    <>
      <section className="overflow-hidden rounded-2xl border border-[#e9ecf2] bg-white transition-colors duration-200 dark:border-gray-800 dark:bg-[#111827]">

        {/* Header */}

        <div className="flex items-center justify-between border-b border-[#e9ecf2] px-6 py-5 dark:border-gray-800">
          <div>
            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
              Recent Projects
            </h2>

            <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
              Track your team's latest projects
            </p>
          </div>

          <Link
            href="/projects"
            className="flex items-center gap-1 text-sm font-medium text-[#635BFF] transition-colors hover:text-[#4941d8]"
          >
            View all
            <ArrowUpRight size={16} />
          </Link>
        </div>

        {/* Desktop Table */}

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/70 text-xs text-gray-400 dark:bg-gray-800/60 dark:text-gray-400">
                <th className="px-6 py-4 font-medium">Project</th>
                <th className="px-6 py-4 font-medium">Client</th>
                <th className="px-6 py-4 font-medium">Progress</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Due Date</th>
                <th className="px-6 py-4 text-right font-medium">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {projects.map((project: Project) => (
                <tr
                  key={project.id}
                  className="transition-colors hover:bg-gray-50/70 dark:hover:bg-gray-800/50"
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                        {project.name}
                      </p>

                      <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                        {project.id}
                      </p>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {project.client}
                  </td>

                  <td className="px-6 py-4">
                    <ProgressBar progress={project.progress} />
                  </td>

                  <td className="px-6 py-4">
                    <ProjectStatusBadge status={project.status} />
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <CalendarDays size={15} />
                      {project.dueDate}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedProject(project)}
                      title="Quick view"
                      aria-label={`View ${project.name} details`}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 text-gray-400 transition-all hover:border-[#635BFF]/30 hover:bg-[#635BFF]/10 hover:text-[#635BFF] dark:border-gray-700 dark:hover:border-[#635BFF]/40"
                    >
                      <Eye size={17} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}

        <div className="divide-y divide-gray-100 dark:divide-gray-800 md:hidden">
          {projects.map((project: Project) => (
            <article
              key={project.id}
              className="space-y-4 p-5 transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-800/30"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-semibold text-gray-800 dark:text-gray-200">
                    {project.name}
                  </h3>

                  <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                    {project.id} · {project.client}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedProject(project)}
                  title="Quick view"
                  aria-label={`View ${project.name} details`}
                  className="shrink-0 flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 text-gray-400 transition-all hover:border-[#635BFF]/30 hover:bg-[#635BFF]/10 hover:text-[#635BFF] dark:border-gray-700"
                >
                  <Eye size={17} />
                </button>
              </div>

              <div className="flex items-center justify-between gap-3">
                <ProjectStatusBadge status={project.status} />

                <span className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                  <CalendarDays size={14} />
                  {project.dueDate}
                </span>
              </div>

              <ProgressBar progress={project.progress} />
            </article>
          ))}
        </div>
      </section>

      {/* Project Quick View Modal */}

      {selectedProject && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-[3px]"
          onClick={closePreview}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Project quick view"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-[#111827]"
          >

            {/* Modal Header */}

            <div className="flex items-start justify-between border-b border-gray-100 p-5 dark:border-gray-800 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#635BFF]/10 text-[#635BFF]">
                  <FolderKanban size={21} />
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#635BFF]">
                    Project overview
                  </p>

                  <h3 className="mt-1 text-base font-bold text-gray-900 dark:text-gray-100">
                    Project details
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={closePreview}
                aria-label="Close"
                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800"
              >
                <X size={19} />
              </button>
            </div>

            {/* Modal Content */}

            <div className="space-y-5 p-5 sm:p-6">

              <div>
                <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {selectedProject.name}
                </h4>

                <p className="mt-1 text-xs text-gray-400">
                  {selectedProject.id}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/50">
                <div>
                  <p className="mb-2 text-[10px] font-medium text-gray-400">
                    Current status
                  </p>

                  <ProjectStatusBadge status={selectedProject.status} />
                </div>

                <div className="text-right">
                  <p className="text-[10px] text-gray-400">
                    Completion
                  </p>

                  <p className="mt-1 text-2xl font-bold text-[#635BFF]">
                    {selectedProject.progress}%
                  </p>
                </div>
              </div>

              {/* Progress */}

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                    Project progress
                  </span>

                  <span className="text-xs text-gray-400">
                    {selectedProject.progress}% completed
                  </span>
                </div>

                <ProgressBar progress={selectedProject.progress} />
              </div>

              {/* Details */}

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                <div className="rounded-xl border border-gray-100 p-4 dark:border-gray-800">
                  <div className="flex items-center gap-2 text-gray-400">
                    <UserRound size={15} />

                    <span className="text-[10px] font-medium">
                      Client
                    </span>
                  </div>

                  <p className="mt-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
                    {selectedProject.client}
                  </p>
                </div>

                <div className="rounded-xl border border-gray-100 p-4 dark:border-gray-800">
                  <div className="flex items-center gap-2 text-gray-400">
                    <CalendarDays size={15} />

                    <span className="text-[10px] font-medium">
                      Due date
                    </span>
                  </div>

                  <p className="mt-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
                    {selectedProject.dueDate}
                  </p>
                </div>

              </div>

              {/* Modal Footer */}

              <div className="flex justify-end border-t border-gray-100 pt-4 dark:border-gray-800">
                <button
                  type="button"
                  onClick={closePreview}
                  className="rounded-xl bg-[#635BFF] px-5 py-2.5 text-xs font-semibold text-white shadow-sm shadow-violet-500/20 transition hover:bg-[#5148e5]"
                >
                  Done
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}
