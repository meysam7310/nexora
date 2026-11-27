"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export interface AppSettings {
  profile: {
    fullName: string;
    email: string;
    role: string;
    phone: string;
    location: string;
    bio: string;
  };
  workspace: {
    name: string;
    website: string;
    industry: string;
    teamSize: string;
    timezone: string;
    currency: string;
  };
  notifications: {
    emailUpdates: boolean;
    projectActivity: boolean;
    taskReminders: boolean;
    teamUpdates: boolean;
    weeklyReport: boolean;
    productNews: boolean;
  };
  appearance: {
    language: string;
    theme: string;
    dateFormat: string;
    compactMode: boolean;
  };
}

export const defaultSettings: AppSettings = {
  profile: {
    fullName: "Alex Morgan",
    email: "alex.morgan@example.com",
    role: "Workspace Owner",
    phone: "",
    location: "",
    bio: "",
  },
  workspace: {
    name: "Nexora Studio",
    website: "https://nexora.com",
    industry: "Creative Agency",
    teamSize: "2-10 members",
    timezone: "UTC",
    currency: "USD",
  },
  notifications: {
    emailUpdates: true,
    projectActivity: true,
    taskReminders: true,
    teamUpdates: true,
    weeklyReport: false,
    productNews: false,
  },
  appearance: {
    language: "English",
    theme: "Light",
    dateFormat: "MM/DD/YYYY",
    compactMode: false,
  },
};

interface SettingsContextType {
  settings: AppSettings;
  appliedSettings: AppSettings;
  isReady: boolean;
  updateSetting: (
    section: keyof AppSettings,
    key: string,
    value: string | boolean
  ) => void;
  saveSettings: () => boolean;
  resetSettings: () => void;
  toggleTheme: () => void;
}

const SettingsContext = createContext<
  SettingsContextType | undefined
>(undefined);

const STORAGE_KEY = "nexora-settings";
const LEGACY_THEME_KEY = "nexora-theme";

function mergeSettings(parsed: Partial<AppSettings>): AppSettings {
  const merged: AppSettings = {
    ...defaultSettings,
    ...parsed,
    profile: {
      ...defaultSettings.profile,
      ...parsed.profile,
    },
    workspace: {
      ...defaultSettings.workspace,
      ...parsed.workspace,
    },
    notifications: {
      ...defaultSettings.notifications,
      ...parsed.notifications,
    },
    appearance: {
      ...defaultSettings.appearance,
      ...parsed.appearance,
    },
  };

  merged.appearance.language = "English";

  return merged;
}

export function SettingsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [appliedSettings, setAppliedSettings] =
    useState<AppSettings>(defaultSettings);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        const parsed: unknown = JSON.parse(saved);

        if (
          parsed &&
          typeof parsed === "object" &&
          !Array.isArray(parsed)
        ) {
          const loadedSettings = mergeSettings(
            parsed as Partial<AppSettings>
          );

          setSettings(loadedSettings);
          setAppliedSettings(loadedSettings);

          // Sync the legacy theme key.
          localStorage.setItem(
            LEGACY_THEME_KEY,
            loadedSettings.appearance.theme === "Dark" ? "dark" : "light"
          );
        }
      } else {
        // Migrate the previous theme preference.
        const legacyTheme = localStorage.getItem(LEGACY_THEME_KEY);

        if (legacyTheme === "dark" || legacyTheme === "light") {
          const migratedSettings = mergeSettings({
            appearance: {
              ...defaultSettings.appearance,
              theme: legacyTheme === "dark" ? "Dark" : "Light",
            },
          });

          setSettings(migratedSettings);
          setAppliedSettings(migratedSettings);

          localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(migratedSettings)
          );
        }
      }
    } catch (error) {
      console.error("Nexora settings loading failed:", error);
    } finally {
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    if (!isReady) return;

    const isDark = appliedSettings.appearance.theme === "Dark";
    const isCompact = appliedSettings.appearance.compactMode;

    document.documentElement.classList.toggle("dark", isDark);
    document.documentElement.classList.toggle("compact-mode", isCompact);
    document.documentElement.lang = "en";
    document.documentElement.dir = "ltr";
    document.documentElement.style.colorScheme = isDark ? "dark" : "light";
  }, [
    appliedSettings.appearance.theme,
    appliedSettings.appearance.compactMode,
    isReady,
  ]);

  const updateSetting = (
    section: keyof AppSettings,
    key: string,
    value: string | boolean
  ) => {
    setSettings((previous) => {
      if (section === "appearance" && key === "language") {
        return previous;
      }

      return {
        ...previous,
        [section]: {
          ...previous[section],
          [key]: value,
        },
      } as AppSettings;
    });
  };

  const toggleTheme = () => {
    const nextTheme =
      appliedSettings.appearance.theme === "Dark" ? "Light" : "Dark";

    const updatedAppliedSettings: AppSettings = {
      ...appliedSettings,
      appearance: {
        ...appliedSettings.appearance,
        theme: nextTheme,
      },
    };

    const updatedDraftSettings: AppSettings = {
      ...settings,
      appearance: {
        ...settings.appearance,
        theme: nextTheme,
      },
    };

    setAppliedSettings(updatedAppliedSettings);
    setSettings(updatedDraftSettings);

    // Save the theme immediately.
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedAppliedSettings)
      );

      localStorage.setItem(
        LEGACY_THEME_KEY,
        nextTheme === "Dark" ? "dark" : "light"
      );
    } catch (error) {
      console.error("Nexora theme saving failed:", error);
    }
  };

  const saveSettings = (): boolean => {
    try {
      const settingsToSave = mergeSettings(settings);

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(settingsToSave)
      );

      localStorage.setItem(
        LEGACY_THEME_KEY,
        settingsToSave.appearance.theme === "Dark" ? "dark" : "light"
      );

      setSettings(settingsToSave);
      setAppliedSettings(settingsToSave);

      return true;
    } catch (error) {
      console.error("Nexora settings saving failed:", error);
      return false;
    }
  };

  const resetSettings = () => {
    setSettings(appliedSettings);
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        appliedSettings,
        isReady,
        updateSetting,
        saveSettings,
        resetSettings,
        toggleTheme,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);

  if (!context) {
    throw new Error("useSettings must be used inside SettingsProvider");
  }

  return context;
}
