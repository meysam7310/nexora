
"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useSettings } from "@/components/settings/SettingsProvider";

import {
  UserRound,
  Building2,
  Bell,
  Palette,
  ShieldCheck,
  ChevronRight,
  Save,
  Check,
  Camera,
  Globe,
  Mail,
  Phone,
  MapPin,
  LockKeyhole,
  Laptop,
  Info,
  CheckCircle2,
  Monitor,
} from "lucide-react";

function SettingsCard({ title, description, children }) {
  return (
    <div className="rounded-2xl border border-gray-200/80 bg-white shadow-sm transition-colors dark:border-gray-800 dark:bg-[#111827]">
      <div className="border-b border-gray-100 px-5 py-4 dark:border-gray-800 sm:px-6">
        <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">
          {title}
        </h3>

        {description && (
          <p className="mt-1 text-xs leading-5 text-gray-400">
            {description}
          </p>
        )}
      </div>

      <div className="p-5 sm:p-6">
        {children}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  icon: Icon,
  maxLength,
}) {
  return (
    <div className="min-w-0">
      <label className="mb-2 block text-xs font-semibold text-gray-700 dark:text-gray-300">
        {label}
      </label>

      <div className="relative">
        {Icon && (
          <Icon
            size={15}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
        )}

        <input
          type={type}
          value={value ?? ""}
          onChange={onChange}
          placeholder={placeholder}
          maxLength={maxLength}
          className={`h-11 w-full rounded-xl border border-gray-200 bg-white text-xs text-gray-700 outline-none transition placeholder:text-gray-400 hover:border-gray-300 focus:border-[#635BFF] focus:ring-2 focus:ring-[#635BFF]/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 ${Icon ? "pl-9 pr-3" : "px-3"
            }`}
        />
      </div>
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}) {
  return (
    <div className="min-w-0">
      <label className="mb-2 block text-xs font-semibold text-gray-700 dark:text-gray-300">
        {label}
      </label>

      <div className="relative">
        <select
          value={value ?? ""}
          onChange={onChange}
          className="h-11 w-full cursor-pointer appearance-none rounded-xl border border-gray-200 bg-white px-3 pr-9 text-xs text-gray-700 outline-none transition hover:border-gray-300 focus:border-[#635BFF] focus:ring-2 focus:ring-[#635BFF]/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
        >
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>

        <ChevronRight
          size={14}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-gray-400"
        />
      </div>
    </div>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative h-[22px] w-10 shrink-0 rounded-full transition-colors duration-200 ${checked ? "bg-[#635BFF]" : "bg-gray-200 dark:bg-gray-700"
        }`}
    >
      <span
        className={`absolute top-[3px] h-4 w-4 rounded-full bg-white shadow-sm transition-all duration-200 ${checked ? "left-[21px]" : "left-[3px]"
          }`}
      />
    </button>
  );
}

function ToggleRow({
  title,
  description,
  checked,
  onChange,
  last = false,
}) {
  return (
    <div
      className={`flex items-center justify-between gap-4 py-4 ${!last ? "border-b border-gray-100 dark:border-gray-800" : ""
        }`}
    >
      <div className="min-w-0">
        <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">
          {title}
        </p>

        <p className="mt-1 text-[11px] leading-5 text-gray-400">
          {description}
        </p>
      </div>

      <Toggle
        checked={checked}
        onChange={onChange}
      />
    </div>
  );
}

function SidebarItem({
  icon: Icon,
  label,
  description,
  active,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex w-full items-center gap-3 rounded-xl p-3 text-left transition ${active
          ? "bg-[#635BFF]/[0.08] text-[#635BFF]"
          : "text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-100"
        }`}
    >
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition ${active
            ? "bg-[#635BFF]/10"
            : "bg-gray-100 text-gray-500 group-hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:group-hover:bg-gray-700"
          }`}
      >
        <Icon size={17} />
      </div>

      <div className="min-w-0 flex-1">
        <p
          className={`text-xs font-semibold ${active ? "text-[#635BFF]" : "text-gray-700 dark:text-gray-200"
            }`}
        >
          {label}
        </p>

        <p className="mt-0.5 truncate text-[10px] text-gray-400">
          {description}
        </p>
      </div>

      {active && (
        <ChevronRight
          size={15}
          className="shrink-0 text-[#635BFF]"
        />
      )}
    </button>
  );
}

function SectionHeading({ title, description }) {
  return (
    <div className="mb-5">
      <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">
        {title}
      </h2>

      {description && (
        <p className="mt-1 text-xs leading-5 text-gray-400">
          {description}
        </p>
      )}
    </div>
  );
}

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <SettingsContent />
    </DashboardLayout>
  );
}

function SettingsContent() {
  const {
    settings,
    updateSetting,
    saveSettings,
    isReady,
  } = useSettings();

  const [activeTab, setActiveTab] = useState("profile");
  const [saveState, setSaveState] = useState("idle");
  const changeSetting = (section, key, value) => {
    updateSetting(section, key, value);
    setSaveState("idle");
  };
  const handleSave = () => {
    const success = saveSettings();
    setSaveState(success ? "saved" : "error");
  };
  const tabs = [
    {
      id: "profile",
      label: "My Profile",
      description: "Personal information",
      icon: UserRound,
    },
    {
      id: "workspace",
      label: "Workspace",
      description: "Workspace Information",
      icon: Building2,
    },
    {
      id: "notifications",
      label: "Notifications",
      description: "Email Notifications",
      icon: Bell,
    },
    {
      id: "appearance",
      label: "Appearance",
      description: "Display Preferences",
      icon: Palette,
    },
    {
      id: "security",
      label: "Security",
      description: "Account Security",
      icon: ShieldCheck,
    },
  ];
  const initials = (settings.profile.fullName || "Alex Morgan")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const industryOptions = [
    "Creative Agency",
    "Technology",
    "Marketing",
    "Consulting",
    "Freelance",
    "Other",
  ];
  const teamOptions = [
    "Just me",
    "2-10 members",
    "11-25 members",
    "26-50 members",
    "50+ members",
  ];
  const currencyOptions = ["USD", "EUR", "GBP", "CAD", "AED"];
  if (!isReady) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-[#635BFF] dark:border-gray-700" />

          <p className="text-xs text-gray-400">
            Loading settings...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 space-y-7 pb-8">

      <section className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-[2px] text-[#635BFF]">
              ACCOUNT SETTINGS
            </span>

            <span className="h-1 w-1 rounded-full bg-gray-300" />

            <span className="text-[10px] text-gray-400">
              Workspace / Settings
            </span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-3xl">
            Settings
          </h1>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Manage your account and workspace preferences.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {saveState === "saved" && (
            <span className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-600">
              <CheckCircle2 size={14} />
              Changes saved
            </span>
          )}

          {saveState === "error" && (
            <span className="text-[11px] font-medium text-red-500">
              Could not save changes
            </span>
          )}

          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-2 rounded-xl bg-[#635BFF] px-4 py-2.5 text-xs font-semibold text-white shadow-sm shadow-violet-500/20 transition hover:bg-[#5148e5]"
          >
            <Save size={15} />
            Save Changes
          </button>
        </div>
      </section>

      <div className="grid min-w-0 grid-cols-1 items-start gap-5 lg:grid-cols-[245px_minmax(0,1fr)]">

        <aside className="min-w-0 rounded-2xl border border-gray-200/80 bg-white p-3 shadow-sm dark:border-gray-800 dark:bg-[#111827]">

          <div className="px-3 pb-3 pt-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Preferences
            </p>
          </div>

          <div className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                className="min-w-0 shrink-0 lg:w-full"
              >
                <SidebarItem
                  icon={tab.icon}
                  label={tab.label}
                  description={tab.description}
                  active={activeTab === tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSaveState("idle");
                  }}
                />
              </div>
            ))}
          </div>

          <div className="mt-4 hidden rounded-xl bg-gradient-to-br from-[#635BFF]/10 to-indigo-50 p-4 dark:from-[#635BFF]/10 dark:to-indigo-500/10 lg:block">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#635BFF] shadow-sm dark:bg-gray-800">
              <img src="/nexora2.webp" className="w-6" alt="Nexora" />
            </div>

            <p className="mt-3 text-xs font-bold text-gray-800 dark:text-gray-200">
              Make Nexora yours
            </p>

            <p className="mt-1 text-[10px] leading-5 text-gray-500 dark:text-gray-400">
              Customize your workspace to fit the way you work.
            </p>
          </div>
        </aside>

        <main className="min-w-0 space-y-5">

          {activeTab === "profile" && (
            <>
              <SectionHeading
                title="My Profile"
                description="Personal information"
              />

              <SettingsCard
                title="Profile Information"
                description="Your personal information and how people see you across Nexora."
              >

                <div className="mb-7 flex flex-wrap items-center gap-4">
                  <div className="relative">
                    <div className="flex h-[76px] w-[76px] items-center justify-center rounded-2xl bg-gradient-to-br from-[#635BFF] to-[#8D85FF] text-2xl font-bold text-white shadow-sm">
                      {initials}
                    </div>

                    <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-lg border-2 border-white bg-white text-gray-500 shadow-sm dark:border-gray-800 dark:bg-gray-800 dark:text-gray-300">
                      <Camera size={13} />
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                      {settings.profile.fullName || "Full Name"}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      {settings.profile.role}
                    </p>

                    <p className="mt-2 text-[10px] text-gray-400">
                      Profile photo upload will be available later.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                  <Field
                    label="Full Name"
                    value={settings.profile.fullName}
                    placeholder="Enter your full name"
                    icon={UserRound}
                    onChange={(e) =>
                      changeSetting("profile", "fullName", e.target.value)
                    }
                  />

                  <Field
                    label="Email Address"
                    value={settings.profile.email}
                    placeholder="name@example.com"
                    type="email"
                    icon={Mail}
                    onChange={(e) =>
                      changeSetting("profile", "email", e.target.value)
                    }
                  />

                  <Field
                    label="Job Title"
                    value={settings.profile.role}
                    placeholder="Your job title"
                    onChange={(e) =>
                      changeSetting("profile", "role", e.target.value)
                    }
                  />

                  <Field
                    label="Phone Number"
                    value={settings.profile.phone}
                    placeholder="+33 6 00 00 00 00"
                    type="tel"
                    icon={Phone}
                    onChange={(e) =>
                      changeSetting("profile", "phone", e.target.value)
                    }
                  />

                  <Field
                    label="Location"
                    value={settings.profile.location}
                    placeholder="City, Country"
                    icon={MapPin}
                    onChange={(e) =>
                      changeSetting("profile", "location", e.target.value)
                    }
                  />

                </div>

                <div className="mt-5">
                  <label className="mb-2 block text-xs font-semibold text-gray-700 dark:text-gray-300">
                    About Me
                  </label>

                  <textarea
                    rows={4}
                    maxLength={300}
                    value={settings.profile.bio}
                    onChange={(e) =>
                      changeSetting("profile", "bio", e.target.value)
                    }
                    placeholder="Write a short introduction about yourself..."
                    className="w-full resize-none rounded-xl border border-gray-200 bg-white p-3 text-xs leading-6 text-gray-700 outline-none transition placeholder:text-gray-400 hover:border-gray-300 focus:border-[#635BFF] focus:ring-2 focus:ring-[#635BFF]/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                  />

                  <p className="mt-1.5 text-right text-[10px] text-gray-400">
                    {settings.profile.bio.length}/300
                  </p>
                </div>
              </SettingsCard>

              <SettingsCard
                title="Account Information"
                description="Basic information about your Nexora account."
              >
                <div className="divide-y divide-gray-100 dark:divide-gray-800">

                  <div className="flex items-center justify-between gap-3 py-3 first:pt-0">
                    <div>
                      <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                        Account Type
                      </p>

                      <p className="mt-1 text-[11px] text-gray-400">
                        Your current account role
                      </p>
                    </div>

                    <span className="rounded-lg bg-[#635BFF]/10 px-3 py-1.5 text-[10px] font-semibold text-[#635BFF]">
                      Owner
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3 py-3">
                    <div>
                      <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                        Account Status
                      </p>
                    </div>

                    <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Active
                    </span>
                  </div>

                </div>
              </SettingsCard>
            </>
          )}

          {activeTab === "workspace" && (
            <>
              <SectionHeading
                title="Workspace Settings"
                description="Manage your business identity and workspace configuration."
              />

              <SettingsCard
                title="Workspace Information"
                description="Customize the information associated with your workspace."
              >

                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#635BFF] text-xl font-bold text-white shadow-sm shadow-violet-500/20">
                    {(settings.workspace.name || "N").trim().charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                      {settings.workspace.name}
                    </p>

                    <p className="mt-1 text-[11px] text-gray-400">
                      Workspace
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                  <Field
                    label="Workspace Name"
                    value={settings.workspace.name}
                    placeholder="Your workspace name"
                    icon={Building2}
                    onChange={(e) =>
                      changeSetting("workspace", "name", e.target.value)
                    }
                  />

                  <Field
                    label="Website"
                    value={settings.workspace.website}
                    placeholder="https://example.com"
                    icon={Globe}
                    onChange={(e) =>
                      changeSetting("workspace", "website", e.target.value)
                    }
                  />

                  <SelectField
                    label="Industry"
                    value={settings.workspace.industry}
                    onChange={(e) =>
                      changeSetting("workspace", "industry", e.target.value)
                    }
                    options={industryOptions.map((value) => ({
                      value,
                      label: value,
                    }))}
                  />

                  <SelectField
                    label="Team Size"
                    value={settings.workspace.teamSize}
                    onChange={(e) =>
                      changeSetting("workspace", "teamSize", e.target.value)
                    }
                    options={teamOptions.map((value) => ({
                      value,
                      label: value,
                    }))}
                  />

                </div>
              </SettingsCard>

              <SettingsCard
                title="Regional Preferences"
                description="Set the default time zone and currency for your workspace."
              >
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                  <SelectField
                    label="Time Zone"
                    value={settings.workspace.timezone}
                    onChange={(e) =>
                      changeSetting("workspace", "timezone", e.target.value)
                    }
                    options={[
                      "UTC",
                      "Europe/London",
                      "Europe/Berlin",
                      "Europe/Paris",
                      "Asia/Tehran",
                      "Asia/Dubai",
                      "America/New_York",
                      "America/Los_Angeles",
                    ].map((value) => ({
                      value,
                      label: value,
                    }))}
                  />

                  <SelectField
                    label="Default Currency"
                    value={settings.workspace.currency}
                    onChange={(e) =>
                      changeSetting("workspace", "currency", e.target.value)
                    }
                    options={currencyOptions.map((value) => ({
                      value,
                      label: {
                        USD: "USD - US Dollar",
                        EUR: "EUR - Euro",
                        GBP: "GBP - British Pound",
                        CAD: "CAD - Canadian Dollar",
                        AED: "AED - UAE Dirham",
                      }[value],
                    }))}
                  />

                </div>

                <div className="mt-5 flex items-start gap-2 rounded-xl bg-blue-50 p-3 dark:bg-blue-500/10">
                  <Info
                    size={15}
                    className="mt-0.5 shrink-0 text-blue-500"
                  />

                  <p className="text-[11px] leading-5 text-blue-700 dark:text-blue-300">
                    Regional settings are saved as workspace preferences. Existing financial records are not automatically converted.
                  </p>
                </div>
              </SettingsCard>
            </>
          )}

          {activeTab === "notifications" && (
            <>
              <SectionHeading
                title="Notifications"
                description="Choose what updates you want to receive and how you stay informed."
              />

              <SettingsCard
                title="Email Notifications"
                description="Manage your email notification preferences."
              >

                <ToggleRow
                  title="Email Updates"
                  description="Receive important account updates and announcements."
                  checked={settings.notifications.emailUpdates}
                  onChange={(value) =>
                    changeSetting("notifications", "emailUpdates", value)
                  }
                />

                <ToggleRow
                  title="Weekly Reports"
                  description="Get a weekly summary of your projects and business performance."
                  checked={settings.notifications.weeklyReport}
                  onChange={(value) =>
                    changeSetting("notifications", "weeklyReport", value)
                  }
                />

                <ToggleRow
                  title="Product News"
                  description="Receive news about new Nexora features and improvements."
                  checked={settings.notifications.productNews}
                  onChange={(value) =>
                    changeSetting("notifications", "productNews", value)
                  }
                  last
                />

              </SettingsCard>

              <SettingsCard
                title="Workspace Activity"
                description="Choose which workspace activities you want to be notified about."
              >

                <ToggleRow
                  title="Project Activity"
                  description="Get notified when projects are created, updated or completed."
                  checked={settings.notifications.projectActivity}
                  onChange={(value) =>
                    changeSetting("notifications", "projectActivity", value)
                  }
                />

                <ToggleRow
                  title="Task Reminders"
                  description="Receive reminders for upcoming and overdue tasks."
                  checked={settings.notifications.taskReminders}
                  onChange={(value) =>
                    changeSetting("notifications", "taskReminders", value)
                  }
                />

                <ToggleRow
                  title="Team Updates"
                  description="Stay informed about changes and updates from your team."
                  checked={settings.notifications.teamUpdates}
                  onChange={(value) =>
                    changeSetting("notifications", "teamUpdates", value)
                  }
                  last
                />

              </SettingsCard>

              <div className="flex items-start gap-3 rounded-xl border border-amber-100 bg-amber-50/70 p-4 dark:border-amber-500/20 dark:bg-amber-500/10">
                <Info
                  size={16}
                  className="mt-0.5 shrink-0 text-amber-600"
                />

                <p className="text-[11px] leading-5 text-amber-800 dark:text-amber-300">
                  Your notification preferences are saved. Actual email delivery and activity alerts require notification service integration.
                </p>
              </div>
            </>
          )}

          {activeTab === "appearance" && (
            <>
              <SectionHeading
                title="Appearance"
                description="Personalize how Nexora looks and feels."
              />

              <SettingsCard
                title="Display Preferences"
                description="Adjust your theme and display options."
              >

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                  <SelectField
                    label="Date Format"
                    value={settings.appearance.dateFormat}
                    onChange={(e) =>
                      changeSetting("appearance", "dateFormat", e.target.value)
                    }
                    options={[
                      {
                        value: "MM/DD/YYYY",
                        label: "MM/DD/YYYY",
                      },
                      {
                        value: "DD/MM/YYYY",
                        label: "DD/MM/YYYY",
                      },
                      {
                        value: "YYYY-MM-DD",
                        label: "YYYY-MM-DD",
                      },
                    ]}
                  />

                </div>

                <div className="mt-7">

                  <p className="mb-1 text-xs font-semibold text-gray-700 dark:text-gray-300">
                    Interface Theme
                  </p>

                  <p className="mb-3 text-[10px] text-gray-400">
                    Choose your preferred appearance across Nexora.
                  </p>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                    <button
                      type="button"
                      onClick={() =>
                        changeSetting("appearance", "theme", "Light")
                      }
                      className={`rounded-xl border-2 p-3 text-left transition ${settings.appearance.theme === "Light"
                          ? "border-[#635BFF] bg-[#635BFF]/[0.03]"
                          : "border-gray-200 hover:border-gray-300 dark:border-gray-700"
                        }`}
                    >
                      <div className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50 p-2">
                        <div className="flex gap-2">
                          <div className="h-16 w-1/4 rounded bg-gray-200" />
                          <div className="flex-1 space-y-2">
                            <div className="h-3 w-2/3 rounded bg-white" />
                            <div className="h-7 rounded bg-white" />
                            <div className="h-5 rounded bg-white" />
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                            Light
                          </p>
                          <p className="mt-0.5 text-[10px] text-gray-400">
                            Clean and bright
                          </p>
                        </div>

                        <span
                          className={`flex h-5 w-5 items-center justify-center rounded-full border ${settings.appearance.theme === "Light"
                              ? "border-[#635BFF] bg-[#635BFF] text-white"
                              : "border-gray-300 dark:border-gray-600"
                            }`}
                        >
                          {settings.appearance.theme === "Light" && (
                            <Check size={12} />
                          )}
                        </span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        changeSetting("appearance", "theme", "Dark")
                      }
                      className={`rounded-xl border-2 p-3 text-left transition ${settings.appearance.theme === "Dark"
                          ? "border-[#635BFF] bg-[#635BFF]/[0.03]"
                          : "border-gray-200 hover:border-gray-300 dark:border-gray-700"
                        }`}
                    >
                      <div className="overflow-hidden rounded-lg border border-gray-700 bg-gray-900 p-2">
                        <div className="flex gap-2">
                          <div className="h-16 w-1/4 rounded bg-gray-700" />
                          <div className="flex-1 space-y-2">
                            <div className="h-3 w-2/3 rounded bg-gray-700" />
                            <div className="h-7 rounded bg-gray-800" />
                            <div className="h-5 rounded bg-gray-800" />
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                            Dark
                          </p>
                          <p className="mt-0.5 text-[10px] text-gray-400">
                            Easy on the eyes
                          </p>
                        </div>

                        <span
                          className={`flex h-5 w-5 items-center justify-center rounded-full border ${settings.appearance.theme === "Dark"
                              ? "border-[#635BFF] bg-[#635BFF] text-white"
                              : "border-gray-300 dark:border-gray-600"
                            }`}
                        >
                          {settings.appearance.theme === "Dark" && (
                            <Check size={12} />
                          )}
                        </span>
                      </div>
                    </button>

                  </div>

                  <div className="mt-3 flex items-start gap-2 rounded-xl bg-[#635BFF]/5 p-3">
                    <Monitor
                      size={14}
                      className="mt-0.5 shrink-0 text-[#635BFF]"
                    />

                    <p className="text-[10px] leading-5 text-gray-500 dark:text-gray-400">
                      Your theme is applied across the application after saving.
                    </p>
                  </div>
                </div>
              </SettingsCard>

              <SettingsCard
                title="Compact Mode"
                description="Control the density of information displayed in your workspace."
              >
                <ToggleRow
                  title="Compact Mode"
                  description="Reduce spacing and padding between interface elements."
                  checked={settings.appearance.compactMode}
                  onChange={(value) =>
                    changeSetting("appearance", "compactMode", value)
                  }
                  last
                />
              </SettingsCard>
            </>
          )}

          {activeTab === "security" && (
            <>
              <SectionHeading
                title="Security"
                description="Review your account protection and security information."
              />

              <SettingsCard
                title="Account Security"
                description="Security integration status"
              >

                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-500/10">
                      <ShieldCheck size={21} className="text-emerald-600" />
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                        Account Security
                      </h3>

                      <p className="mt-1 text-xs text-gray-400">
                        Account protection
                      </p>
                    </div>
                  </div>

                  <span className="rounded-lg bg-amber-50 px-3 py-1.5 text-[10px] font-semibold text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
                    Integration pending
                  </span>
                </div>

                <div className="mt-5 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/60">
                  <div className="flex items-start gap-3">
                    <Info
                      size={16}
                      className="mt-0.5 shrink-0 text-gray-400"
                    />

                    <div>
                      <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                        Authentication not connected
                      </p>

                      <p className="mt-1 text-[11px] leading-5 text-gray-500 dark:text-gray-400">
                        Password management, two-factor authentication and session controls need to be connected to the application's authentication system.
                      </p>
                    </div>
                  </div>
                </div>
              </SettingsCard>

              <SettingsCard
                title="Login Information"
                description="Information about your current account."
              >
                <div className="space-y-5">

                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-500/10">
                      <Mail size={16} className="text-blue-600" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                        Email Address
                      </p>

                      <p className="mt-1 truncate text-[11px] text-gray-400">
                        {settings.profile.email}
                      </p>
                    </div>

                    <span className="text-[10px] text-gray-400">
                      Account email
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 dark:bg-violet-500/10">
                      <LockKeyhole size={16} className="text-violet-600" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                        Password
                      </p>

                      <p className="mt-1 text-[11px] text-gray-400">
                        Managed by authentication provider
                      </p>
                    </div>

                    <span className="text-[10px] text-gray-400">
                      Protected
                    </span>
                  </div>

                </div>
              </SettingsCard>

              <SettingsCard
                title="Active Sessions"
                description="The device currently being used to access this workspace."
              >
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                    <Laptop size={18} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                      Current Device
                    </p>

                    <p className="mt-1 text-[11px] text-gray-400">
                      Browser session · Current device
                    </p>
                  </div>

                  <span className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Active
                  </span>
                </div>
              </SettingsCard>

              <SettingsCard
                title="Privacy"
                description="Information about account and personal data."
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-500/10">
                    <Info size={16} className="text-blue-600" />
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                      Your data and privacy
                    </p>

                    <p className="mt-1 text-[11px] leading-5 text-gray-500 dark:text-gray-400">
                      Account and workspace information is currently stored in this browser. Server-side account protection and data management can be connected when authentication and database services are ready.
                    </p>
                  </div>
                </div>
              </SettingsCard>
            </>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200/80 bg-gray-50/80 px-4 py-3 dark:border-gray-800 dark:bg-gray-800/60">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={15} className="text-gray-400" />

              <p className="text-[10px] text-gray-500 dark:text-gray-400">
                Remember to save your changes before leaving.
              </p>
            </div>

            <button
              type="button"
              onClick={handleSave}
              className="text-xs font-semibold text-[#635BFF] transition hover:text-[#5148e5]"
            >
              Save settings
            </button>
          </div>

        </main>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-gray-200/70 pt-4 dark:border-gray-800">
        <p className="text-[10px] text-gray-400">
          Nexora Workspace Settings
        </p>

        <p className="text-[10px] text-gray-400">
          Your workspace, your preferences.
        </p>
      </div>

    </div>
  );
}
