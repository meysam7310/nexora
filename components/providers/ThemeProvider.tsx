
"use client";

import {
  createContext,
  useContext,
  type ReactNode,
} from "react";

import { useSettings } from "@/components/settings/SettingsProvider";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<
  ThemeContextType | undefined
>(undefined);

export default function ThemeProvider({
  children,
}: {
  children: ReactNode;
}) {
  const {
    appliedSettings,
    toggleTheme,
  } = useSettings();

  const theme: Theme =
    appliedSettings.appearance.theme === "Dark"
      ? "dark"
      : "light";

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useTheme must be used inside ThemeProvider"
    );
  }

  return context;
}
