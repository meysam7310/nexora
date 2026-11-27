
"use client";

import { useState } from "react";
import {
  Bell,
  Check,
  CheckCheck,
  FolderKanban,
  CreditCard,
  Users,
  Info,
  X,
  Clock3,
} from "lucide-react";

import { notifications as initialNotifications } from "@/data/dashboard";
import type { Notification } from "@/types/dashboard";

const notificationIcons = {
  project: FolderKanban,
  payment: CreditCard,
  team: Users,
  system: Info,
};

const notificationColors = {
  project:
    "bg-purple-50 text-purple-600 dark:bg-purple-500/15 dark:text-purple-400",
  payment:
    "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
  team:
    "bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",
  system:
    "bg-orange-50 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400",
};

export default function Notifications() {
  const [isOpen, setIsOpen] = useState(false);

  const [items, setItems] = useState<Notification[]>(
    initialNotifications
  );

  const unreadCount = items.filter((item) => !item.isRead).length;

  const markAsRead = (id: string) => {
    setItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, isRead: true } : item
      )
    );
  };

  const markAllAsRead = () => {
    setItems((current) =>
      current.map((item) => ({ ...item, isRead: true }))
    );
  };

  return (
    <div className="relative">
      {/* Notification Button */}
      <button
        onClick={() => setIsOpen((current) => !current)}
        aria-label="Notifications"
        aria-expanded={isOpen}
        className={`relative flex h-10 w-10 items-center justify-center rounded-xl border transition ${
          isOpen
            ? "border-[#ddd8ff] bg-[#eeeaff] text-[#635BFF] dark:border-[#5146c7] dark:bg-[#292453] dark:text-[#a59cff]"
            : "border-gray-100 bg-white text-gray-500 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        }`}
      >
        <Bell size={19} />

        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          {/* Background Overlay */}
          <button
            aria-label="Close notifications"
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-40 cursor-default bg-black/10 dark:bg-black/30"
          />

          {/* Notifications Panel */}
          <section
            aria-label="Notifications panel"
            className="
              fixed left-1/2 top-1/2 z-50
              w-[calc(100vw-24px)] max-w-none
              -translate-x-1/2 -translate-y-1/2
              overflow-hidden rounded-2xl
              border border-gray-100 bg-white shadow-2xl
              dark:border-gray-700 dark:bg-[#111827]

              sm:absolute sm:left-auto sm:top-14 sm:right-0
              sm:w-[360px] sm:max-w-none
              sm:translate-x-0 sm:translate-y-0
            "
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-gray-800">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Notifications
                </h3>

                <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                  You have {unreadCount} unread notifications
                </p>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close panel"
                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
              >
                <X size={17} />
              </button>
            </div>

            {/* Recent Activity Header */}
            <div className="flex items-center justify-between px-5 py-3">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                RECENT ACTIVITY
              </span>

              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="flex items-center gap-1 text-xs font-medium text-[#635BFF] transition hover:text-[#4941d8] dark:text-violet-400 dark:hover:text-violet-300"
                >
                  <CheckCheck size={14} />
                  Mark all as read
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div className="max-h-[min(420px,60vh)] overflow-y-auto">
              {items.length > 0 ? (
                items.map((item) => {
                  const Icon = notificationIcons[item.type];

                  return (
                    <div
                      key={item.id}
                      className={`flex gap-3 border-t border-gray-50 px-5 py-4 transition dark:border-gray-800 ${
                        item.isRead
                          ? "bg-white dark:bg-[#111827]"
                          : "bg-[#f8f7ff] dark:bg-[#635BFF]/10"
                      }`}
                    >
                      {/* Icon */}
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                          notificationColors[item.type]
                        }`}
                      >
                        <Icon size={18} />
                      </div>

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-semibold text-gray-800 dark:text-gray-100">
                            {item.title}
                          </p>

                          {!item.isRead && (
                            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#635BFF]" />
                          )}
                        </div>

                        <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">
                          {item.message}
                        </p>

                        {/* Time and Mark Read */}
                        <div className="mt-2 flex items-center justify-between">
                          <span className="flex items-center gap-1 text-[10px] text-gray-400 dark:text-gray-500">
                            <Clock3 size={12} />
                            {item.time}
                          </span>

                          {!item.isRead && (
                            <button
                              onClick={() => markAsRead(item.id)}
                              className="flex items-center gap-1 text-[10px] font-medium text-[#635BFF] transition hover:underline dark:text-violet-400"
                            >
                              <Check size={12} />
                              Mark read
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="px-5 py-12 text-center">
                  <Bell
                    size={28}
                    className="mx-auto text-gray-300 dark:text-gray-600"
                  />

                  <p className="mt-3 text-sm font-medium text-gray-600 dark:text-gray-300">
                    No notifications
                  </p>

                  <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                    You're all caught up!
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 px-5 py-3 text-center dark:border-gray-800">
              <p className="text-[10px] text-gray-400 dark:text-gray-500">
                NEXORA Notification Center
              </p>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
