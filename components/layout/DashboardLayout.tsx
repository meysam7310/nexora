
"use client";

import { Suspense, useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] =
    useState(false);

  const closeMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const openMenu = () => {
    setIsMobileMenuOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#f7f8fc] transition-colors duration-200 dark:bg-[#0b1120]">

      {/* Sidebar */}
      <Suspense fallback={null}>
        <Sidebar
          isMobileMenuOpen={isMobileMenuOpen}
          onClose={closeMenu}
        />
      </Suspense>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <button
          type="button"
          aria-label="Close navigation overlay"
          onClick={closeMenu}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px] md:hidden"
        />
      )}

      {/* Main Content */}
      <main className="min-h-screen md:ml-[260px]">

        {/* Header */}
        <Header onMenuClick={openMenu} />

        {/* Page Content */}
        <div className="min-w-0 p-4 sm:p-6 lg:p-8">
          {children}
        </div>

      </main>
    </div>
  );
}
