
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  Wallet,
  UsersRound,
  CheckSquare,
  ChartNoAxesCombined,
  Settings,
  HelpCircle,
  X,
} from "lucide-react";

interface SidebarProps {
  isMobileMenuOpen: boolean;
  onClose: () => void;
}

const navigation = [
  {
    title: "WORKSPACE",
    items: [
      { label: "Overview", icon: LayoutDashboard, href: "/" },
      { label: "Customers", icon: Users, href: "/customers" },
      { label: "Projects", icon: FolderKanban, href: "/projects" },
      { label: "Finance", icon: Wallet, href: "/finance" },
    ],
  },
  {
    title: "MANAGEMENT",
    items: [
      { label: "Team", icon: UsersRound, href: "/team" },
      { label: "Tasks", icon: CheckSquare, href: "/tasks" },
      {
        label: "Reports",
        icon: ChartNoAxesCombined,
        href: "/reports",
      },
    ],
  },
];

export default function Sidebar({
  isMobileMenuOpen,
  onClose,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      style={{
        backgroundColor: "#111827",
        color: "#ffffff",
        borderColor: "rgba(255, 255, 255, 0.05)",
      }}
      className={`fixed left-0 top-0 z-50 flex h-screen w-[260px] flex-col border-r border-white/5 bg-[#111827] px-5 py-7 text-white shadow-xl shadow-black/10 transition-transform duration-300 ${
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0`}
    >
      {/* Brand */}
      <div className="mb-12 flex items-center justify-between px-2">
        <Link
          href="/"
          className="flex items-center gap-3"
          onClick={onClose}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#635BFF] shadow-lg shadow-indigo-500/20">
            <Image
              src="/nexora.webp"
              width={28}
              height={28}
              className="h-7 w-7 object-contain"
              alt="Nexora"
            />
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-[2px]">
              NEXORA
            </h1>

            <p className="text-[10px] tracking-[2px] text-gray-400">
              BUSINESS OS
            </p>
          </div>
        </Link>

        <button
          onClick={onClose}
          aria-label="Close navigation menu"
          className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-white/10 hover:text-white md:hidden"
        >
          <X size={20} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-9">
        {navigation.map((group) => (
          <div key={group.title}>
            <p className="mb-4 px-3 text-[10px] font-semibold tracking-[2px] text-gray-500">
              {group.title}
            </p>

            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={onClose}
                    aria-current={isActive ? "page" : undefined}
                    className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-all duration-200 ${
                      isActive
                        ? "bg-[#635BFF] text-white shadow-lg shadow-indigo-950/30"
                        : "text-gray-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <Icon size={19} strokeWidth={1.8} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom Links */}
      <div className="space-y-2 border-t border-white/10 pt-5">
        <Link
          href="/settings"
          onClick={onClose}
          className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
        >
          <Settings size={19} />
          Settings
        </Link>

        <Link
          href="/help"
          onClick={onClose}
          className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
        >
          <HelpCircle size={19} />
          Help Center
        </Link>

        {/* Upgrade Card */}
        <div className="mt-5 rounded-xl border border-white/5 bg-white/5 p-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/10">
              <Image
                src="/nexora2.webp"
                width={28}
                height={28}
                className="h-5 w-5 object-contain"
                alt="Nexora"
              />
            </div>

            <p className="text-sm font-semibold">
              Upgrade your plan
            </p>
          </div>

          <p className="mt-2 text-xs leading-5 text-gray-400">
            Unlock advanced analytics and more features.
          </p>

          <button
            type="button"
            className="mt-3 w-full rounded-lg !bg-white py-2 text-xs font-semibold !text-gray-900 transition-colors hover:!bg-gray-200"
          >
            Explore Plans
          </button>
        </div>
      </div>
    </aside>
  );
}
