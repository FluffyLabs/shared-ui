import { useEffect, useState } from "react";

export type ThemeMode = "light" | "dark" | "auto";

const THEME_MODE_KEY = "theme-mode";
const themeChangeEvent = new Event("themeChange");

let isInitialized = false;

export const initializeTheme = () => {
  if (isInitialized) return;
  isInitialized = true;

  const mode = getThemeMode();
  applyThemeToDocument(mode);

  // Listen for system theme changes when in auto mode
  if (mode === "auto" && window.matchMedia) {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", () => {
      const currentMode = getThemeMode();
      if (currentMode === "auto") {
        applyThemeToDocument("auto");
        window.dispatchEvent(themeChangeEvent);
      }
    });
  }
};

export const useThemeMode = (): [ThemeMode, (mode: ThemeMode) => void] => {
  const [mode, setMode] = useState<ThemeMode>(getThemeMode);

  useEffect(() => {
    const handleThemeChange = () => {
      setMode(getThemeMode());
    };

    window.addEventListener("themeChange", handleThemeChange);
    return () => window.removeEventListener("themeChange", handleThemeChange);
  }, []);

  return [mode, setThemeMode];
};

const applyThemeToDocument = (mode: ThemeMode) => {
  const isDark = shouldUseDarkMode(mode);
  document.documentElement.classList.toggle("dark", isDark);
};

const shouldUseDarkMode = (mode: ThemeMode): boolean => {
  if (mode === "dark") return true;
  if (mode === "light") return false;
  // Auto mode: use system preference
  return getSystemPreference();
};

const getSystemPreference = (): boolean => {
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
};

const getThemeMode = (): ThemeMode => {
  const stored = localStorage.getItem(THEME_MODE_KEY);
  if (stored === "light" || stored === "dark" || stored === "auto") {
    return stored;
  }
  // Default to auto if nothing is stored
  return "auto";
};

const setThemeMode = (mode: ThemeMode) => {
  localStorage.setItem(THEME_MODE_KEY, mode);
  applyThemeToDocument(mode);
  window.dispatchEvent(themeChangeEvent);
};
