import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";
import { useColorScheme } from "react-native";

import { DarkColors, LightColors } from "./colors";
import { ThemeMode } from "./themeMode";

type ThemeContextValue = {
  mode: ThemeMode;
  colors: typeof LightColors;
  setMode: (mode: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(
  null
);

const STORAGE_KEY = "theme-mode";

export function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const systemScheme = useColorScheme();

  const [mode, setModeState] =
    useState<ThemeMode>("system");

  // 🔁 앱 시작 시 저장된 설정 불러오기
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((value) => {
      if (
        value === "light" ||
        value === "dark" ||
        value === "system"
      ) {
        setModeState(value);
      }
    });
  }, []);

  const setMode = async (newMode: ThemeMode) => {
    setModeState(newMode);
    await AsyncStorage.setItem(STORAGE_KEY, newMode);
  };

  const resolvedMode =
    mode === "system"
      ? systemScheme === "dark"
        ? "dark"
        : "light"
      : mode;

  const colors =
    resolvedMode === "dark"
      ? DarkColors
      : LightColors;

  return (
    <ThemeContext.Provider
      value={{ mode, colors, setMode }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("ThemeProvider is missing");
  }
  return ctx;
}
