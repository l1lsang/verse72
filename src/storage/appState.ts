// src/storage/appState.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

const LAUNCHED_KEY = "VERSE72_HAS_LAUNCHED";

export async function hasLaunchedBefore(): Promise<boolean> {
  const v = await AsyncStorage.getItem(LAUNCHED_KEY);
  return v === "true";
}

export async function markLaunched() {
  await AsyncStorage.setItem(LAUNCHED_KEY, "true");
}
