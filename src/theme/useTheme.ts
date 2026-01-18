import { useColorScheme } from "react-native";
import { DarkColors, LightColors } from "./colors";

export function useTheme() {
  const scheme = useColorScheme();
  return scheme === "dark" ? DarkColors : LightColors;
}
