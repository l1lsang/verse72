import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "memorized_ids";

export async function loadLocalMemorized(): Promise<Set<string>> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return new Set();
  return new Set(JSON.parse(raw));
}

export async function saveLocalMemorized(ids: Set<string>) {
  await AsyncStorage.setItem(
    KEY,
    JSON.stringify([...ids])
  );
}
