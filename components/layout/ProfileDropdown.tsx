"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  UserRound,
  Building2,
  SlidersHorizontal,
  LifeBuoy,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  ArrowUpRight,
  Sparkles,
  X,
} from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";

type MenuView = "main" | "profile" | "workspace";

export default function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<MenuView>("main");

  const dropdownRef = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme } = useTheme();

  const account = {
    fullName: "Jordan Mitchell",
    initials: "JM",
    role: "Workspace Owner",
    workspace: "Nexora Studio",
  };

  const closeMenu = () => {
    setIsOpen(false);
    setView("main");
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (event: PointerEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        closeMenu();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    };

    document.addEventListener("pointerdown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const menuItemClass =
    "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-medium text-gray-600 transition hover:bg-gray-50 hover:text-[#635BFF] dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-[#a59cff]";

  const backButtonClass =
    "mb-5 flex items-center gap-2 text-xs font-medium text-gray-400 transition hover:text-[#635BFF]";

  const Avatar = ({ size = "normal" }: { size?: "normal" | "large" }) => (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#8178ff] to-[#635BFF] font-semibold text-white shadow-sm ${
        size === "large" ? "h-12 w-12 text-sm" : "h-9 w-9 text-xs"
      }`}
    >
      {account.initials}
    </div>
  );

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={() => {
          setIsOpen((current) => !current);
          setView("main");
        }}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className="flex items-center gap-2 rounded-xl p-1.5 transition hover:bg-gray-50 dark:hover:bg-gray-800 sm:gap-3"
      >
        <Avatar />

        <div className="hidden text-left sm:block">
          <p className="text-[13px] font-semibold text-gray-800 dark:text-gray-100">
            {account.fullName}
          </p>
          <p className="mt-0.5 text-[11px] text-gray-400 dark:text-gray-500">
            {account.role}
          </p>
        </div>

        {isOpen ? (
          <ChevronUp
            size={14}
            className="hidden text-gray-400 dark:text-gray-500 sm:block"
          />
        ) : (
          <ChevronDown
            size={14}
            className="hidden text-gray-400 dark:text-gray-500 sm:block"
          />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-[70] mt-3 w-[290px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.14)] dark:border-gray-700 dark:bg-[#111827] dark:shadow-black/30">
          <div className="border-b border-gray-100 p-4 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <Avatar size="large" />

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-gray-900 dark:text-gray-100">
                  {account.fullName}
                </p>
                <p className="mt-1 text-[11px] text-gray-400 dark:text-gray-500">
                  {account.role}
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2.5 dark:bg-gray-800/70">
              <Building2 size={15} className="shrink-0 text-[#635BFF]" />
              <span className="truncate text-xs font-medium text-gray-700 dark:text-gray-200">
                {account.workspace}
              </span>
              <span className="ml-auto h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
            </div>
          </div>

          {view === "main" && (
            <div className="space-y-1 p-2">
              <button
                type="button"
                onClick={() => setView("profile")}
                className={menuItemClass}
              >
                <UserRound size={17} className="text-gray-400" />
                <span className="flex-1">My Profile</span>
                <ArrowUpRight size={14} className="text-gray-300" />
              </button>

              <button
                type="button"
                onClick={() => setView("workspace")}
                className={menuItemClass}
              >
                <Building2 size={17} className="text-gray-400" />
                <span className="flex-1">Workspace Settings</span>
                <ArrowUpRight size={14} className="text-gray-300" />
              </button>

              <Link
                href="/settings"
                onClick={closeMenu}
                className={menuItemClass}
              >
                <SlidersHorizontal size={17} className="text-gray-400" />
                <span className="flex-1">Preferences</span>
                <ArrowUpRight size={14} className="text-gray-300" />
              </Link>

              <div className="my-2 border-t border-gray-100 dark:border-gray-800" />

              <Link href="/help" onClick={closeMenu} className={menuItemClass}>
                <LifeBuoy size={17} className="text-gray-400" />
                <span className="flex-1">Help & Support</span>
                <ArrowUpRight size={14} className="text-gray-300" />
              </Link>
            </div>
          )}

          {view === "profile" && (
            <div className="p-4">
              <button
                type="button"
                onClick={() => setView("main")}
                className={backButtonClass}
              >
                <ArrowLeft size={14} />
                Back to menu
              </button>

              <div className="flex items-center gap-3">
                <Avatar size="large" />
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-bold text-gray-900 dark:text-gray-100">
                    {account.fullName}
                  </h3>
                  <p className="mt-1 text-[11px] text-gray-400">
                    {account.role}
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-4 border-t border-gray-100 pt-4 dark:border-gray-800">
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400">
                    Full Name
                  </p>
                  <p className="mt-1.5 text-xs font-semibold text-gray-800 dark:text-gray-200">
                    {account.fullName}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400">
                    Position
                  </p>
                  <p className="mt-1.5 text-xs font-semibold text-gray-800 dark:text-gray-200">
                    {account.role}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400">
                    Workspace
                  </p>
                  <p className="mt-1.5 text-xs font-semibold text-gray-800 dark:text-gray-200">
                    {account.workspace}
                  </p>
                </div>
              </div>

              <Link
                href="/settings"
                onClick={closeMenu}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#635BFF] px-4 py-2.5 text-xs font-semibold text-white shadow-sm shadow-violet-500/20 transition hover:bg-[#5148e5]"
              >
                Manage Profile
                <ArrowUpRight size={14} />
              </Link>
            </div>
          )}

          {view === "workspace" && (
            <div className="p-4">
              <button
                type="button"
                onClick={() => setView("main")}
                className={backButtonClass}
              >
                <ArrowLeft size={14} />
                Back to menu
              </button>

              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#635BFF]/10 text-[#635BFF]">
                  <Building2 size={20} />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                    {account.workspace}
                  </h3>
                  <p className="mt-1 text-[10px] text-gray-400">
                    Workspace overview
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-4 border-t border-gray-100 pt-4 dark:border-gray-800">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-gray-400">
                    Workspace name
                  </span>
                  <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                    Nexora Studio
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-gray-400">Your role</span>
                  <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                    Owner
                  </span>
                </div>
              </div>

              <Link
                href="/settings"
                onClick={closeMenu}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#635BFF] px-4 py-2.5 text-xs font-semibold text-white shadow-sm shadow-violet-500/20 transition hover:bg-[#5148e5]"
              >
                Open Settings
                <ArrowUpRight size={14} />
              </Link>
            </div>
          )}

          <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/70 px-4 py-3 dark:border-gray-800 dark:bg-gray-900/60">
            <div className="flex items-center gap-2">
              <img src="/nexora2.webp" className="w-4" alt="Nexora" />
              <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400">
                NEXORA
              </span>
            </div>

            <span className="text-[10px] text-gray-400 dark:text-gray-500">
              Workspace
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
